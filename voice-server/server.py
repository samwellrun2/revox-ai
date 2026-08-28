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
import io
import tempfile
import subprocess
import torch
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import StreamingResponse

# Auto-accept XTTS license (non-commercial CPML)
os.environ["COQUI_TOS_AGREED"] = "1"

from TTS.api import TTS

app = FastAPI(title="Revox Voice Server")

# Load XTTS v2 on startup — first run downloads the model (~2GB)
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Loading XTTS v2 on {device}...")
tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(device)
print("Model loaded!")

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

    # Save speaker audio and convert to WAV
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
    sample_rate = 22050
    all_audio = np.array([], dtype=np.float32)
    current_time = 0.0

    try:
        for seg in segment_list:
            seg_start = float(seg["start"])
            seg_text = seg["text"].strip()

            if not seg_text:
                continue

            # Add silence for the gap between current position and segment start
            gap = seg_start - current_time
            if gap > 0.05:  # Only add silence if gap > 50ms
                silence_samples = int(gap * sample_rate)
                silence = np.zeros(silence_samples, dtype=np.float32)
                all_audio = np.concatenate([all_audio, silence])

            # Generate speech for this segment
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_out:
                seg_output = tmp_out.name

            tts.tts_to_file(
                text=seg_text,
                speaker_wav=speaker_path,
                language=tts_lang,
                file_path=seg_output,
            )

            # Read generated audio
            seg_audio, sr = sf.read(seg_output)
            if sr != sample_rate:
                # Resample if needed
                import torchaudio
                seg_tensor = torch.from_numpy(seg_audio).float().unsqueeze(0)
                resampled = torchaudio.functional.resample(seg_tensor, sr, sample_rate)
                seg_audio = resampled.squeeze().numpy()

            all_audio = np.concatenate([all_audio, seg_audio])
            current_time = seg_start + len(seg_audio) / sample_rate
            os.unlink(seg_output)

        # Write final combined audio
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_final:
            final_path = tmp_final.name

        sf.write(final_path, all_audio, sample_rate)

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
