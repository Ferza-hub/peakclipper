import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";

export interface FfprobeResult {
  duration: number;
  width: number;
  height: number;
  hasAudio: boolean;
}

export async function ffprobe(filePath: string): Promise<FfprobeResult> {
  return new Promise((resolve, reject) => {
    const args = [
      "-v", "quiet",
      "-print_format", "json",
      "-show_streams",
      "-show_format",
      filePath,
    ];
    let stdout = "";
    const proc = spawn("ffprobe", args);
    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.on("close", (code) => {
      if (code !== 0) return reject(new Error("ffprobe failed"));
      try {
        const data = JSON.parse(stdout);
        const videoStream = data.streams?.find(
          (s: { codec_type: string }) => s.codec_type === "video"
        );
        const audioStream = data.streams?.find(
          (s: { codec_type: string }) => s.codec_type === "audio"
        );
        resolve({
          duration: parseFloat(data.format?.duration || "0"),
          width: videoStream?.width || 0,
          height: videoStream?.height || 0,
          hasAudio: !!audioStream,
        });
      } catch {
        reject(new Error("Failed to parse ffprobe output"));
      }
    });
  });
}

export async function clipVideo(
  inputPath: string,
  outputPath: string,
  startTime: number,
  endTime: number,
  aspectRatio: string,
  addCaptions: boolean,
  captionText: string,
  onProgress?: (pct: number) => void
): Promise<void> {
  const duration = endTime - startTime;
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  const vfFilters: string[] = [];

  // Aspect ratio crop
  if (aspectRatio === "9:16") {
    vfFilters.push("crop=ih*9/16:ih:(iw-ih*9/16)/2:0,scale=720:1280");
  } else if (aspectRatio === "1:1") {
    vfFilters.push("crop=min(iw\\,ih):min(iw\\,ih):(iw-min(iw\\,ih))/2:(ih-min(iw\\,ih))/2,scale=720:720");
  }

  // Caption overlay (simple drawtext)
  if (addCaptions && captionText) {
    const safeText = captionText
      .replace(/\\/g, "\\\\")   // backslashes first
      .replace(/'/g, "\\'")
      .replace(/:/g, "\\:")
      .replace(/[\n\r]+/g, " ") // newlines → space
      .slice(0, 80);
    const fontSize = aspectRatio === "9:16" ? 36 : 28;
    vfFilters.push(
      `drawtext=text='${safeText}':fontsize=${fontSize}:fontcolor=white:` +
        `box=1:boxcolor=black@0.6:boxborderw=8:` +
        `x=(w-text_w)/2:y=h-th-40:line_spacing=8`
    );
  }

  const args: string[] = [
    "-y",
    "-ss", startTime.toFixed(3),
    "-i", inputPath,
    "-t", duration.toFixed(3),
  ];

  if (vfFilters.length > 0) {
    args.push("-vf", vfFilters.join(","));
    args.push("-c:v", "libx264", "-crf", "23", "-preset", "ultrafast", "-threads", "0");
  } else {
    args.push("-c:v", "copy");
  }

  args.push("-c:a", "aac", "-b:a", "128k");
  args.push("-movflags", "+faststart");
  args.push("-avoid_negative_ts", "make_zero");
  args.push(outputPath);

  return new Promise((resolve, reject) => {
    const proc = spawn("ffmpeg", args);
    let stderr = "";

    proc.stderr.on("data", (data: Buffer) => {
      const text = data.toString();
      stderr += text;

      // Parse ffmpeg progress: time=HH:MM:SS.ss
      const match = text.match(/time=(\d+):(\d+):([\d.]+)/);
      if (match && onProgress) {
        const elapsed =
          parseInt(match[1]) * 3600 +
          parseInt(match[2]) * 60 +
          parseFloat(match[3]);
        onProgress(Math.min((elapsed / duration) * 100, 99));
      }
    });

    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited ${code}: ${stderr.slice(-500)}`));
    });
  });
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
