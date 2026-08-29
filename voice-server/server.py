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
        # Compute voice embedding ONCE from the FULL speaker audio
        print(f"[clone-segments] Computing voice embedding from {speaker_path}")
        xtts_model = tts.synthesizer.tts_model
        gpt_cond_latent, speaker_embedding = xtts_model.get_conditioning_latents(
            audio_path=[speaker_path],
            gpt_cond_len=30,
            gpt_cond_chunk_len=4,
            max_ref_length=60,
        )
        print(f"[clone-segments] Voice embedding computed. Processing {len(segment_list)} segments")

        # Generate each segment with pre-computed voice embedding
        for i, seg in enumerate(segment_list):
            seg_start = float(seg["start"])
            seg_end = float(seg["end"])
            seg_text = seg["text"].strip()
            target_duration = seg_end - seg_start

            if not seg_text or target_duration <= 0:
                continue

            print(f"[clone-segments] Segment {i+1}/{len(segment_list)}: '{seg_text[:50]}' ({target_duration:.1f}s)")

            # Natural voice parameters (like the original tts.tts_to_file used)
            # but with pre-computed embedding for consistency
            result = xtts_model.inference(
                text=seg_text,
                language=tts_lang,
                gpt_cond_latent=gpt_cond_latent,
                speaker_embedding=speaker_embedding,
                temperature=0.3,           # Low temp = consistent voice, still natural
                length_penalty=1.0,
                repetition_penalty=10.0,
                top_k=20,                  # Tight — less voice variation
                top_p=0.7,                 # Tight — keeps voice consistent
                do_sample=True,            # Still sampling so it sounds natural
                speed=1.0,
            )

            seg_audio = np.array(result["wav"], dtype=np.float32)
            if len(seg_audio.shape) > 1:
                seg_audio = seg_audio[:, 0]

            # Time-stretch to match original segment duration
            generated_duration = len(seg_audio) / output_sr
            target_samples = int(target_duration * output_sr)

            if generated_duration > 0 and target_samples > 0:
                ratio = generated_duration / target_duration
                if ratio < 0.85 or ratio > 1.15:
                    original_indices = np.arange(len(seg_audio))
                    target_indices = np.linspace(0, len(seg_audio) - 1, target_samples)
                    seg_audio = np.interp(target_indices, original_indices, seg_audio).astype(np.float32)

            # Place segment at exact start position
            start_sample = int(seg_start * output_sr)
            end_sample = start_sample + len(seg_audio)

            if end_sample > len(all_audio):
                extra = np.zeros(end_sample - len(all_audio), dtype=np.float32)
                all_audio = np.concatenate([all_audio, extra])

            all_audio[start_sample:start_sample + len(seg_audio)] = seg_audio

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
