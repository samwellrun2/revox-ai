import type { TranslatedSegment } from "./translate";

const VOICE_SERVER_URL = process.env.VOICE_SERVER_URL ?? "http://localhost:8100";

export async function dubAudio(
  text: string,
  targetLang: string,
  sourceAudioUrl: string
): Promise<Buffer> {
  const audioResponse = await fetch(sourceAudioUrl);
  const audioBlob = await audioResponse.blob();

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

export async function dubSegments(
  segments: TranslatedSegment[],
  targetLang: string,
  sourceAudioUrl: string
): Promise<Buffer> {
  const audioResponse = await fetch(sourceAudioUrl);
  const audioBlob = await audioResponse.blob();

  const formData = new FormData();
  formData.append("segments", JSON.stringify(segments));
  formData.append("language", targetLang);
  formData.append("speaker_audio", audioBlob, "source.wav");

  const res = await fetch(`${VOICE_SERVER_URL}/clone-segments`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Voice server error: ${error}`);
  }

  return Buffer.from(await res.arrayBuffer());
}
