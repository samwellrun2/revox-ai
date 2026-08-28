import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface Segment {
  text: string;
  start: number;
  end: number;
}

export interface TranscriptionResult {
  text: string;
  language: string;
  segments: Segment[];
}

export async function transcribe(filePath: string): Promise<TranscriptionResult> {
  const file = fs.createReadStream(filePath);

  const response = await openai.audio.transcriptions.create({
    model: "whisper-1",
    file,
    response_format: "verbose_json",
    timestamp_granularities: ["segment"],
  });

  const segments: Segment[] = (response as unknown as { segments?: Array<{ text: string; start: number; end: number }> }).segments?.map((s) => ({
    text: s.text.trim(),
    start: s.start,
    end: s.end,
  })) ?? [{ text: response.text, start: 0, end: 0 }];

  return {
    text: response.text,
    language: response.language ?? "en",
    segments,
  };
}
