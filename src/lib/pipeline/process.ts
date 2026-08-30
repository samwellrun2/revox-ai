import { createClient } from "@supabase/supabase-js";
import { transcribe } from "./transcribe";
import { translateSegments } from "./translate";
import { dubSegmentsWithFile } from "./dub";
import { mergeAudioVideo, getVideoDuration, extractAudio } from "./merge";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

function isVideoUrl(url: string): boolean {
  return /youtube\.com|youtu\.be|vimeo\.com|tiktok\.com|twitter\.com|x\.com|instagram\.com/i.test(url);
}

async function downloadWithYtDlp(url: string, outputPath: string): Promise<void> {
  try {
    await execAsync(
      `yt-dlp -f "bv*+ba/b" --no-warnings --no-playlist --merge-output-format mp4 -o "${outputPath}" "${url}"`,
      { timeout: 300000, maxBuffer: 1024 * 1024 * 50 }
    );
  } catch (err) {
    const error = err as Error & { stderr?: string };
    throw new Error(`yt-dlp failed: ${error.stderr || error.message}`);
  }
}

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

      if (isVideoUrl(translation.source_url)) {
        // Use yt-dlp for YouTube, Vimeo, TikTok, etc.
        await downloadWithYtDlp(translation.source_url, videoPath);
        // yt-dlp might save with different extension, check if file exists
        const exists = await fs.access(videoPath).then(() => true).catch(() => false);
        if (!exists) {
          // Try common alternatives
          const mp4Alt = videoPath.replace(".mp4", ".mp4.mp4");
          const webmAlt = videoPath.replace(".mp4", ".webm");
          for (const alt of [mp4Alt, webmAlt]) {
            const altExists = await fs.access(alt).then(() => true).catch(() => false);
            if (altExists) {
              await fs.rename(alt, videoPath);
              break;
            }
          }
        }
      } else {
        // Direct video URL — download with fetch
        const res = await fetch(translation.source_url);
        const buffer = Buffer.from(await res.arrayBuffer());
        await fs.writeFile(videoPath, buffer);
      }
    } else {
      throw new Error("No source video");
    }

    // Get duration and generate thumbnail
    const duration = await getVideoDuration(videoPath);

    // Generate thumbnail from video
    const thumbPath = videoPath.replace(".mp4", "-thumb.jpg");
    try {
      await execAsync(
        `ffmpeg -y -i "${videoPath}" -ss 1 -vframes 1 -q:v 5 -vf scale=480:-1 "${thumbPath}"`,
        { timeout: 10000 }
      );
      const thumbBuffer = await fs.readFile(thumbPath);
      const thumbKey = `thumbnails/${translationId}.jpg`;
      await supabase.storage.from("videos").upload(thumbKey, thumbBuffer, { contentType: "image/jpeg" });
    } catch {
      // Thumbnail generation is optional — don't fail the whole pipeline
    }

    await updateStatus(translationId, "transcribing", { duration_seconds: Math.ceil(duration) });

    // Extract audio for voice cloning
    const audioPath = await extractAudio(videoPath);

    // Transcribe with timestamps
    const { language, segments } = await transcribe(audioPath);
    await updateStatus(translationId, "translating", { source_language: language });

    // Translate segment by segment (preserves timing)
    const translatedSegments = await translateSegments(segments, language, translation.target_language);
    await updateStatus(translationId, "dubbing");

    // Dub with voice cloning — send extracted audio file directly
    const audioBuffer = await fs.readFile(audioPath);
    const dubbedAudio = await dubSegmentsWithFile(translatedSegments, translation.target_language, audioBuffer);
    await updateStatus(translationId, "merging");

    // Generate SRT captions from translated segments
    const srtContent = translatedSegments
      .filter(seg => seg.text.trim())
      .map((seg, i) => {
        const formatTime = (seconds: number) => {
          const h = Math.floor(seconds / 3600);
          const m = Math.floor((seconds % 3600) / 60);
          const s = Math.floor(seconds % 60);
          const ms = Math.floor((seconds % 1) * 1000);
          return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
        };
        return `${i + 1}\n${formatTime(seg.start)} --> ${formatTime(seg.end)}\n${seg.text.trim()}\n`;
      })
      .join("\n");

    // Upload captions
    const captionsKey = `outputs/${translationId}/captions.srt`;
    await supabase.storage.from("videos").upload(captionsKey, Buffer.from(srtContent), {
      contentType: "text/plain",
      upsert: true,
    });

    // Merge
    const outputPath = await mergeAudioVideo(videoPath, dubbedAudio);

    // Upload result
    const outputBuffer = await fs.readFile(outputPath);
    const outputKey = `outputs/${translationId}/translated.mp4`;
    const { error: uploadError } = await supabase.storage.from("videos").upload(outputKey, outputBuffer, {
      contentType: "video/mp4",
      upsert: true,
    });
    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

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
