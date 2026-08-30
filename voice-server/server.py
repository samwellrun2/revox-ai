"""
Revox AI Voice Cloning Server
Runs XTTS v2 locally for free voice cloning in 50+ languages.
No API keys needed. You own the model.

Usage:
  python server.py

The server starts on http://localhost:8100
The Next.js app calls this automatically.
"""

import os

# MUST be set before importing torch
os.environ["COQUI_TOS_AGREED"] = "1"
os.environ["PYTORCH_ENABLE_MPS_FALLBACK"] = "1"

import io
import tempfile
import subprocess
import torch
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from TTS.api import TTS

app = FastAPI(title="Revox Voice Server")

# Load XTTS v2 — CUDA GPU or CPU (Metal/MPS has compatibility issues)
if torch.cuda.is_available():
    device = "cuda"
else:
    device = "cpu"
print(f"Loading XTTS v2 on {device}...")
tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(device)
print(f"Model loaded on {device}!")

# XTTS v2 supported languages
SUPPORTED_LANGUAGES = [
    "en", "es", "fr", "de", "it", "pt", "pl", "tr", "ru", "nl",
    "cs", "ar", "zh", "ja", "ko", "hu", "hi"
]


@app.get("/health")
async def health():
    return {"status": "ok", "model": "xtts_v2", "device": device}


@app.post("/clone-and-speak")
async def clone_and_speak(
    text: str = Form(...),
    language: str = Form(...),
    speaker_audio: UploadFile = File(...),
):
    """
    Clone a voice from the uploaded audio and generate speech in the target language.

    - text: The translated text to speak
    - language: Target language code (e.g., "es", "fr", "de")
    - speaker_audio: Audio file of the original speaker (for voice cloning)
    """
    # Fall back to English if language not directly supported by XTTS
    tts_lang = language if language in SUPPORTED_LANGUAGES else "en"

    # Save uploaded speaker audio and convert to WAV with ffmpeg
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp_raw:
        content = await speaker_audio.read()
        tmp_raw.write(content)
        raw_path = tmp_raw.name

    speaker_path = raw_path.replace(".mp3", ".wav")
    subprocess.run(
        ["ffmpeg", "-y", "-i", raw_path, "-ar", "22050", "-ac", "1", speaker_path],
        capture_output=True,
    )
    os.unlink(raw_path)

    # Generate speech with cloned voice
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_output:
        output_path = tmp_output.name

    try:
        tts.tts_to_file(
            text=text,
            speaker_wav=speaker_path,
            language=tts_lang,
            file_path=output_path,
        )

        # Read the output and return as streaming response
        with open(output_path, "rb") as f:
            audio_bytes = f.read()

        return StreamingResponse(
            io.BytesIO(audio_bytes),
            media_type="audio/wav",
            headers={"Content-Disposition": "attachment; filename=dubbed.wav"},
        )
    finally:
        # Cleanup temp files
        os.unlink(speaker_path)
        if os.path.exists(output_path):
            os.unlink(output_path)


@app.post("/clone-segments")
async def clone_segments(
    segments: str = Form(...),
    language: str = Form(...),
    speaker_audio: UploadFile = File(...),
):
    """
    Clone voice and generate speech for multiple segments with pauses between them.
    Segments include start/end times so we insert silence to match original timing.
    """
    import json
    import numpy as np
    import soundfile as sf

    tts_lang = language if language in SUPPORTED_LANGUAGES else "en"

    # Save speaker audio and convert to WAV at 22050Hz mono (what XTTS expects)
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp_raw:
        content = await speaker_audio.read()
        tmp_raw.write(content)
        raw_path = tmp_raw.name

    speaker_path = raw_path.replace(".mp3", ".wav")
    subprocess.run(
        ["ffmpeg", "-y", "-i", raw_path, "-ar", "22050", "-ac", "1", speaker_path],
        capture_output=True,
    )
    os.unlink(raw_path)

    segment_list = json.loads(segments)
    # XTTS outputs at 24000 Hz — work in that sample rate throughout
    output_sr = 24000

    # Calculate total duration from last segment end time
    total_duration = max(float(seg["end"]) for seg in segment_list) if segment_list else 0
    total_samples = int(total_duration * output_sr)
    all_audio = np.zeros(total_samples, dtype=np.float32)

    try:
        xtts_model = tts.synthesizer.tts_model

        # Step 1: Get voice embedding from speaker audio
        print(f"[clone-segments] Computing voice embedding from {speaker_path}")
        gpt_cond_latent, speaker_embedding = xtts_model.get_conditioning_latents(
            audio_path=[speaker_path],
            gpt_cond_len=30,
            gpt_cond_chunk_len=4,
            max_ref_length=60,
        )

        # Step 2: Build valid segments list
        valid_segs = []
        for seg in segment_list:
            text = seg["text"].strip()
            start = float(seg["start"])
            end = float(seg["end"])
            if text and end - start > 0:
                valid_segs.append({"text": text, "start": start, "end": end})

        if not valid_segs:
            raise ValueError("No valid segments")

        # Step 3: Find gaps (pauses) between segments
        # We'll generate continuous speech, then insert silence at gap positions
        gaps = []
        for i in range(1, len(valid_segs)):
            gap_start = valid_segs[i - 1]["end"]
            gap_end = valid_segs[i]["start"]
            gap_duration = gap_end - gap_start
            if gap_duration > 0.1:  # Only count gaps > 100ms
                # Calculate position in the combined text (by character proportion)
                chars_before = sum(len(valid_segs[j]["text"]) for j in range(i))
                gaps.append({"after_chars": chars_before, "duration": gap_duration})

        # Step 4: Generate ALL text in one shot — ONE voice
        combined_text = " ".join(seg["text"] for seg in valid_segs)
        print(f"[clone-segments] Generating single audio: {len(combined_text)} chars, {len(valid_segs)} segments, {len(gaps)} gaps")

        result = xtts_model.inference(
            text=combined_text,
            language=tts_lang,
            gpt_cond_latent=gpt_cond_latent,
            speaker_embedding=speaker_embedding,
            temperature=0.65,
            length_penalty=1.0,
            repetition_penalty=10.0,
            top_k=50,
            top_p=0.85,
            do_sample=True,
            speed=1.0,
            enable_text_splitting=True,
        )

        raw_audio = np.array(result["wav"], dtype=np.float32)
        if len(raw_audio.shape) > 1:
            raw_audio = raw_audio[:, 0]
        raw_duration = len(raw_audio) / output_sr
        print(f"[clone-segments] Raw audio: {raw_duration:.1f}s")

        # Step 5: Insert silences at gap positions to restore pauses
        # Split raw audio proportionally based on character count
        total_chars = len(combined_text)
        pieces = []
        prev_char_pos = 0
        for gap in gaps:
            char_pos = gap["after_chars"]
            # Calculate audio sample range for this piece
            start_frac = prev_char_pos / total_chars
            end_frac = char_pos / total_chars
            start_sample = int(start_frac * len(raw_audio))
            end_sample = int(end_frac * len(raw_audio))
            pieces.append(raw_audio[start_sample:end_sample])
            # Add silence for the gap
            silence_samples = int(gap["duration"] * output_sr)
            pieces.append(np.zeros(silence_samples, dtype=np.float32))
            prev_char_pos = char_pos

        # Add the last piece
        start_frac = prev_char_pos / total_chars
        start_sample = int(start_frac * len(raw_audio))
        pieces.append(raw_audio[start_sample:])

        # Combine all pieces
        audio_with_gaps = np.concatenate(pieces) if pieces else raw_audio
        gen_duration = len(audio_with_gaps) / output_sr

        # Step 6: Time-stretch to match original video timing
        first_start = valid_segs[0]["start"]
        last_end = valid_segs[-1]["end"]
        target_total = last_end - first_start
        total_with_gaps = target_total

        print(f"[clone-segments] Audio with gaps: {gen_duration:.1f}s, target: {total_with_gaps:.1f}s")

        if total_with_gaps > 0 and gen_duration > 0:
            target_samples = int(total_with_gaps * output_sr)
            original_indices = np.arange(len(audio_with_gaps))
            target_indices = np.linspace(0, len(audio_with_gaps) - 1, target_samples)
            audio_with_gaps = np.interp(target_indices, original_indices, audio_with_gaps).astype(np.float32)

        # Step 7: Place in output buffer at correct position
        start_sample = int(first_start * output_sr)
        end_sample = start_sample + len(audio_with_gaps)
        if end_sample > len(all_audio):
            all_audio = np.concatenate([all_audio, np.zeros(end_sample - len(all_audio), dtype=np.float32)])
        all_audio[start_sample:start_sample + len(audio_with_gaps)] = audio_with_gaps

        print(f"[clone-segments] Done. Total audio: {len(all_audio)/output_sr:.1f}s")

        # Write final combined audio
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_final:
            final_path = tmp_final.name

        sf.write(final_path, all_audio, output_sr)

        with open(final_path, "rb") as f:
            audio_bytes = f.read()

        os.unlink(final_path)

        return StreamingResponse(
            io.BytesIO(audio_bytes),
            media_type="audio/wav",
            headers={"Content-Disposition": "attachment; filename=dubbed.wav"},
        )
    finally:
        if os.path.exists(speaker_path):
            os.unlink(speaker_path)


@app.post("/fine-tune")
async def fine_tune(
    dataset: UploadFile = File(...),
    voice_name: str = Form(...),
):
    """
    Fine-tune the model on a custom voice dataset.
    Upload a zip of .wav files + metadata.csv for training.
    This is how you make your model BETTER than ElevenLabs.
    """
    # TODO: Implement fine-tuning pipeline
    # This would:
    # 1. Extract the dataset zip
    # 2. Validate audio files + metadata
    # 3. Run XTTS fine-tuning
    # 4. Save the fine-tuned model
    return {"status": "fine-tuning not yet implemented", "voice_name": voice_name}


if __name__ == "__main__":
    import uvicorn
    print("\n🎙️  Revox Voice Server starting...")
    print("   Model: XTTS v2 (open-source, free forever)")
    print("   First run will download the model (~2GB)\n")
    uvicorn.run(app, host="0.0.0.0", port=8100)
