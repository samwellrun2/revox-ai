import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

export async function mergeAudioVideo(
  videoPath: string,
  audioBuffer: Buffer,
  srtContent?: string
): Promise<string> {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "revox-"));
  const audioPath = path.join(tmpDir, "dubbed.mp3");
  const outputPath = path.join(tmpDir, "output.mp4");

  await fs.writeFile(audioPath, audioBuffer);

  // If captions provided, burn them into the video
  let subtitleFilter = "";
  if (srtContent) {
    const srtPath = path.join(tmpDir, "captions.srt");
    await fs.writeFile(srtPath, srtContent);
    // Escape path for ffmpeg filter
    const escaped = srtPath.replace(/'/g, "'\\''").replace(/:/g, "\\:");
    subtitleFilter = `-vf "subtitles='${escaped}':force_style='FontSize=18,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,Outline=2,Shadow=1'"`;
  }

  try {
    await execAsync(
      `ffmpeg -y -i "${videoPath}" -i "${audioPath}" ${subtitleFilter ? subtitleFilter : "-c:v libx264 -preset fast -crf 23"} ${subtitleFilter ? "-c:v libx264 -preset fast -crf 23" : ""} -c:a aac -b:a 128k -map 0:v:0 -map 1:a:0 -shortest -movflags +faststart "${outputPath}"`,
      { timeout: 600000, maxBuffer: 1024 * 1024 * 50 }
    );
  } catch {
    // Fallback without captions
    await execAsync(
      `ffmpeg -y -i "${videoPath}" -i "${audioPath}" -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k -map 0:v:0 -map 1:a:0 -shortest -movflags +faststart "${outputPath}"`,
      { timeout: 600000, maxBuffer: 1024 * 1024 * 50 }
    );
  }

  return outputPath;
}

export async function getVideoDuration(filePath: string): Promise<number> {
  const { stdout } = await execAsync(
    `ffprobe -v error -show_entries format=duration -of csv=p=0 "${filePath}"`
  );
  return parseFloat(stdout.trim());
}

export async function extractAudio(videoPath: string): Promise<string> {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "revox-audio-"));
  const audioPath = path.join(tmpDir, "audio.mp3");

  await execAsync(
    `ffmpeg -i "${videoPath}" -vn -acodec libmp3lame -q:a 2 "${audioPath}"`
  );

  return audioPath;
}
