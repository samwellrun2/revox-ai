import type { TranslatedSegment } from "./translate";

const VOICE_SERVER_URL = process.env.VOICE_SERVER_URL ?? "http://localhost:8100";

export async function dubSegmentsWithFile(
  segments: TranslatedSegment[],
  targetLang: string,
  audioFileBuffer: Buffer
): Promise<Buffer> {
  const audioBlob = new Blob([new Uint8Array(audioFileBuffer)], { type: "audio/mp3" });

  const formData = new FormData();
  formData.append("segments", JSON.stringify(segments));
  formData.append("language", targetLang);
  formData.append("speaker_audio", audioBlob, "source.mp3");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 600000); // 10 min timeout

  const res = await fetch(`${VOICE_SERVER_URL}/clone-segments`, {
    method: "POST",
    body: formData,
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Voice server error: ${error}`);
  }

  return Buffer.from(await res.arrayBuffer());
}
