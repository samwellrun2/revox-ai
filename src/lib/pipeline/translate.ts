import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
