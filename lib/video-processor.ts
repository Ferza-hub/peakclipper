import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import { type Clip, type Job, updateJob } from "./job-store";
import { clipVideo, ffprobe, formatDuration } from "./ffmpeg";
import { detectByInterval, detectHighlights } from "./highlight-detector";
import { mergeShortSegments, parseVTT, parseSRT } from "./subtitle-parser";

const TMP_DIR = "/tmp/peakclipper";

async function ensureDirs() {
  await fs.mkdir(`${TMP_DIR}/downloads`, { recursive: true });
  await fs.mkdir(`${TMP_DIR}/clips`, { recursive: true });
  await fs.mkdir(`${TMP_DIR}/uploads`, { recursive: true });
}

function runCommand(
  cmd: string,
  args: string[],
  onStderr?: (line: string) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    let stdout = "";
    let stderr = "";
    const proc = spawn(cmd, args);
    proc.stdout.on("data", (d: Buffer) => (stdout += d.toString()));
    proc.stderr.on("data", (d: Buffer) => {
      const text = d.toString();
      stderr += text;
      onStderr?.(text);
    });
    proc.on("close", (code) => {
      if (code === 0) resolve(stdout);
      else reject(new Error(stderr.slice(-800)));
    });
    proc.on("error", reject);
  });
}

async function getVideoInfo(url: string) {
  const json = await runCommand("yt-dlp", [
    "--no-check-certificate",
    "--dump-json",
    "--no-playlist",
    url,
  ]);
  const data = JSON.parse(json);
  return {
    title: data.title as string,
    duration: data.duration as number,
    thumbnail: (data.thumbnail || data.thumbnails?.[0]?.url || "") as string,
    channel: (data.channel || data.uploader || "Unknown") as string,
    url,
  };
}

async function downloadVideo(
  url: string,
  destDir: string,
  jobId: string,
  onProgress: (p: number) => void
): Promise<string> {
  const outputTemplate = path.join(destDir, `${jobId}.%(ext)s`);

  await runCommand(
    "yt-dlp",
    [
      "--no-check-certificate",
      "--no-playlist",
      "-f", "bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]/best[height<=720]",
      "--merge-output-format", "mp4",
      "-o", outputTemplate,
      url,
    ],
    (line) => {
      const match = line.match(/(\d+\.\d+)%/);
      if (match) onProgress(parseFloat(match[1]));
    }
  );

  // Find the downloaded file
  const files = await fs.readdir(destDir);
  const found = files.find((f) => f.startsWith(jobId) && f.endsWith(".mp4"));
  if (!found) throw new Error("Downloaded file not found");
  return path.join(destDir, found);
}

async function extractSubtitles(
  url: string,
  destDir: string,
  language: string
): Promise<string | null> {
  const langs = [language, "en", "id"].filter(Boolean).join(",");
  const outputTemplate = path.join(destDir, "subs");

  try {
    await runCommand("yt-dlp", [
      "--no-check-certificate",
      "--write-auto-sub",
      "--sub-lang", langs,
      "--sub-format", "vtt",
      "--skip-download",
      "--no-playlist",
      "-o", outputTemplate,
      url,
    ]);
  } catch {
    return null;
  }

  const files = await fs.readdir(destDir);
  const sub = files.find((f) => f.startsWith("subs") && (f.endsWith(".vtt") || f.endsWith(".srt")));
  if (!sub) return null;
  return path.join(destDir, sub);
}

async function readSubtitleFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, "utf-8");
}

export async function processVideo(job: Job): Promise<void> {
  const { id, url, settings, localFilePath } = job;

  await ensureDirs();
  const jobDir = path.join(TMP_DIR, "downloads", id);
  await fs.mkdir(jobDir, { recursive: true });

  try {
    let videoPath: string;
    let videoDuration = 0;

    if (localFilePath) {
      // --- File upload path ---
      videoPath = localFilePath;
      updateJob(id, {
        status: "fetching_info",
        progress: 10,
        currentStep: "Analyzing uploaded video…",
      });

      const probe = await ffprobe(videoPath);
      videoDuration = probe.duration;

      updateJob(id, {
        videoInfo: {
          title: path.basename(url || localFilePath, path.extname(url || localFilePath)),
          duration: probe.duration,
          thumbnail: "",
          channel: "Uploaded file",
          url: localFilePath,
        },
        progress: 20,
      });
    } else {
      // --- URL download path ---
      updateJob(id, {
        status: "fetching_info",
        progress: 5,
        currentStep: "Fetching video info…",
      });

      const info = await getVideoInfo(url);
      videoDuration = info.duration;

      updateJob(id, {
        videoInfo: info,
        status: "downloading",
        progress: 10,
        currentStep: "Downloading video…",
      });

      videoPath = await downloadVideo(url, jobDir, id, (pct) => {
        updateJob(id, { progress: 10 + pct * 0.45 });
      });
    }

    // --- Extract / generate transcript ---
    updateJob(id, {
      status: "extracting_transcript",
      progress: 57,
      currentStep: "Extracting transcript…",
    });

    let segments = null;

    if (!localFilePath) {
      // Try YouTube auto-captions
      const subFile = await extractSubtitles(url, jobDir, settings.language);
      if (subFile) {
        const content = await readSubtitleFile(subFile);
        const raw = subFile.endsWith(".srt") ? parseSRT(content) : parseVTT(content);
        segments = mergeShortSegments(raw);
      }
    }

    // --- Highlight detection ---
    updateJob(id, {
      status: "analyzing",
      progress: 65,
      currentStep: "Finding best moments…",
    });

    const candidates =
      segments && segments.length > 5
        ? detectHighlights(segments, settings.clipLength)
        : detectByInterval(videoDuration, settings.clipLength);

    // --- Clip the video ---
    updateJob(id, {
      status: "clipping",
      progress: 70,
      currentStep: `Generating ${candidates.length} clips…`,
    });

    const clips: Clip[] = [];
    const clipsDir = path.join(TMP_DIR, "clips");

    for (let i = 0; i < candidates.length; i++) {
      const c = candidates[i];
      const clipId = `${id}_clip${i}`;
      const outputPath = path.join(clipsDir, `${clipId}.mp4`);

      await clipVideo(
        videoPath,
        outputPath,
        c.startTime,
        c.endTime,
        settings.aspectRatio,
        settings.captions,
        c.transcript.slice(0, 120),
        (pct) => {
          const base = 70 + (i / candidates.length) * 28;
          updateJob(id, { progress: base + (pct / candidates.length) * 0.28 });
        }
      );

      clips.push({
        id: clipId,
        jobId: id,
        title: c.title,
        startTime: c.startTime,
        endTime: c.endTime,
        duration: c.endTime - c.startTime,
        score: c.score,
        filePath: outputPath,
        transcript: c.transcript,
      });

      updateJob(id, {
        progress: 70 + ((i + 1) / candidates.length) * 28,
        currentStep: `Clipped ${i + 1}/${candidates.length}…`,
      });
    }

    updateJob(id, {
      status: "done",
      progress: 100,
      currentStep: "Done!",
      clips,
    });

    // Cleanup download directory (keep clips)
    fs.rm(jobDir, { recursive: true, force: true }).catch(() => {});
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    updateJob(id, {
      status: "error",
      error: message,
      currentStep: "Failed",
    });
  }
}
