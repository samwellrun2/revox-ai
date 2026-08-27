import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function transcribe(filePath: string): Promise<{ text: string; language: string }> {
  const file = fs.createReadStream(filePath);

  const response = await openai.audio.transcriptions.create({
    model: "whisper-1",
    file,
    response_format: "verbose_json",
  });

  return {
    text: response.text,
    language: response.language ?? "en",
  };
}
