import OpenAI from "openai";
import type { Segment } from "./transcribe";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface TranslatedSegment {
  text: string;
  start: number;
  end: number;
}

export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a professional translator. Translate the following text from ${sourceLang} to ${targetLang}. Maintain the original tone, style, and meaning. Output only the translated text, nothing else.`,
      },
      { role: "user", content: text },
    ],
    temperature: 0.3,
  });

  return response.choices[0].message.content ?? text;
}

export async function translateSegments(
  segments: Segment[],
  sourceLang: string,
  targetLang: string
): Promise<TranslatedSegment[]> {
  // Batch all segments into one translation request for consistency
  const numberedText = segments
    .map((s, i) => `[${i}] ${s.text}`)
    .join("\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a professional translator. Translate each numbered line from ${sourceLang} to ${targetLang}. Keep the [number] prefix on each line. Maintain the original tone and meaning. Output only the translated numbered lines, nothing else.`,
      },
      { role: "user", content: numberedText },
    ],
    temperature: 0.3,
  });

  const translated = response.choices[0].message.content ?? "";
  const lines = translated.split("\n").filter((l) => l.trim());

  // Parse translated lines back into segments with original timing
  const result: TranslatedSegment[] = segments.map((seg, i) => {
    // Find the matching translated line
    const line = lines.find((l) => l.startsWith(`[${i}]`));
    const text = line ? line.replace(/^\[\d+\]\s*/, "").trim() : seg.text;
    return { text, start: seg.start, end: seg.end };
  });

  return result;
}
