export async function dubAudio(
  text: string,
  targetLang: string,
  sourceAudioUrl: string
): Promise<Buffer> {
  // Clone voice from source audio, then generate in target language
  const addVoiceForm = new FormData();
  addVoiceForm.append("name", `clone-${Date.now()}`);
  const audioResponse = await fetch(sourceAudioUrl);
  const audioBlob = await audioResponse.blob();
  addVoiceForm.append("files", audioBlob, "source.mp3");

  const voiceRes = await fetch("https://api.elevenlabs.io/v1/voices/add", {
    method: "POST",
    headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY! },
    body: addVoiceForm,
  });
  const { voice_id } = await voiceRes.json();

  // Generate speech in target language with cloned voice
  const ttsRes = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.8 },
      }),
    }
  );

  const audioBuffer = Buffer.from(await ttsRes.arrayBuffer());

  // Clean up cloned voice
  await fetch(`https://api.elevenlabs.io/v1/voices/${voice_id}`, {
    method: "DELETE",
    headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY! },
  });

  return audioBuffer;
}
