const VOICE_SERVER_URL = process.env.VOICE_SERVER_URL ?? "http://localhost:8100";

export async function dubAudio(
  text: string,
  targetLang: string,
  sourceAudioUrl: string
): Promise<Buffer> {
  // Download source audio for voice cloning
  const audioResponse = await fetch(sourceAudioUrl);
  const audioBlob = await audioResponse.blob();

  // Send to local XTTS v2 voice server — free, no API key needed
  const formData = new FormData();
  formData.append("text", text);
  formData.append("language", targetLang);
  formData.append("speaker_audio", audioBlob, "source.wav");

  const res = await fetch(`${VOICE_SERVER_URL}/clone-and-speak`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Voice server error: ${error}`);
  }

  return Buffer.from(await res.arrayBuffer());
}
