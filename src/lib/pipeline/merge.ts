import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

export async function mergeAudioVideo(
  videoPath: string,
  audioBuffer: Buffer
): Promise<string> {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "revox-"));
  const audioPath = path.join(tmpDir, "dubbed.mp3");
  const outputPath = path.join(tmpDir, "output.mp4");

  await fs.writeFile(audioPath, audioBuffer);

  await execAsync(
    `ffmpeg -i "${videoPath}" -i "${audioPath}" -c:v copy -map 0:v:0 -map 1:a:0 -shortest "${outputPath}"`
  );

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
