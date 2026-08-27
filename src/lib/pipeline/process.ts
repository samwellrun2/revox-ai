import { createClient } from "@supabase/supabase-js";
import { transcribe } from "./transcribe";
import { translateText } from "./translate";
import { dubAudio } from "./dub";
import { mergeAudioVideo, getVideoDuration, extractAudio } from "./merge";
import fs from "fs/promises";
import path from "path";
import os from "os";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function updateStatus(id: string, status: string, extra?: Record<string, unknown>) {
  await supabase
    .from("translations")
    .update({ status, ...extra })
    .eq("id", id);
}

export async function processTranslation(translationId: string) {
  const { data: translation } = await supabase
    .from("translations")
    .select("*")
    .eq("id", translationId)
    .single();

  if (!translation) throw new Error("Translation not found");

  let videoPath: string;

  try {
    // Download video from storage or URL
    if (translation.source_file_path) {
      const { data } = await supabase.storage
        .from("videos")
        .download(translation.source_file_path);
      if (!data) throw new Error("Failed to download source video");
      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "revox-src-"));
      videoPath = path.join(tmpDir, "source.mp4");
      await fs.writeFile(videoPath, Buffer.from(await data.arrayBuffer()));
    } else if (translation.source_url) {
      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "revox-src-"));
      videoPath = path.join(tmpDir, "source.mp4");
      const res = await fetch(translation.source_url);
      const buffer = Buffer.from(await res.arrayBuffer());
      await fs.writeFile(videoPath, buffer);
    } else {
      throw new Error("No source video");
    }

    // Get duration
    const duration = await getVideoDuration(videoPath);
    await updateStatus(translationId, "transcribing", { duration_seconds: Math.ceil(duration) });

    // Extract audio for voice cloning
    const audioPath = await extractAudio(videoPath);

    // Transcribe
    const { text, language } = await transcribe(audioPath);
    await updateStatus(translationId, "translating", { source_language: language });

    // Translate
    const translatedText = await translateText(text, language, translation.target_language);
    await updateStatus(translationId, "dubbing");

    // Dub with voice cloning
    const { data: audioUrlData } = supabase.storage
      .from("videos")
      .getPublicUrl(translation.source_file_path ?? "");
    const sourceAudioUrl = audioUrlData?.publicUrl ?? translation.source_url;

    const dubbedAudio = await dubAudio(translatedText, translation.target_language, sourceAudioUrl!);
    await updateStatus(translationId, "merging");

    // Merge
    const outputPath = await mergeAudioVideo(videoPath, dubbedAudio);

    // Upload result
    const outputBuffer = await fs.readFile(outputPath);
    const outputKey = `outputs/${translationId}/translated.mp4`;
    await supabase.storage.from("videos").upload(outputKey, outputBuffer, {
      contentType: "video/mp4",
    });

    // Update usage
    const currentMonth = new Date().toISOString().slice(0, 7);
    const durationMinutes = duration / 60;

    const { data: existingUsage } = await supabase
      .from("usage")
      .select("id, minutes_used, translations_count")
      .eq("user_id", translation.user_id)
      .eq("month", currentMonth)
      .single();

    if (existingUsage) {
      await supabase
        .from("usage")
        .update({
          minutes_used: existingUsage.minutes_used + durationMinutes,
          translations_count: existingUsage.translations_count + 1,
        })
        .eq("id", existingUsage.id);
    } else {
      await supabase.from("usage").insert({
        user_id: translation.user_id,
        month: currentMonth,
        minutes_used: durationMinutes,
        translations_count: 1,
      });
    }

    await updateStatus(translationId, "completed", {
      output_file_path: outputKey,
      completed_at: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await updateStatus(translationId, "failed", { error_message: message });
  }
}
