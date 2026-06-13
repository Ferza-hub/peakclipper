import { createJob, getAllJobs, type GenerateSettings } from "@/lib/job-store";
import { processVideo } from "@/lib/video-processor";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

const UPLOAD_DIR = "/tmp/peakclipper/uploads";
const MAX_UPLOAD_BYTES = 500 * 1024 * 1024; // 500 MB

const VALID_MODES = ["shorts", "captions", "reframe"];
const VALID_LENGTHS = ["auto", "30s", "60s", "90s"];
const VALID_RATIOS = ["9:16", "1:1", "16:9"];

function sanitizeSettings(raw: Partial<GenerateSettings>): GenerateSettings {
  return {
    mode: VALID_MODES.includes(raw?.mode ?? "") ? raw.mode! : "shorts",
    clipLength: VALID_LENGTHS.includes(raw?.clipLength ?? "") ? raw.clipLength! : "auto",
    language: typeof raw?.language === "string" ? raw.language.slice(0, 10) : "en",
    captionStyle: typeof raw?.captionStyle === "string" ? raw.captionStyle.slice(0, 40) : "bold-yellow",
    introTitle: raw?.introTitle !== false,
    captions: raw?.captions !== false,
    aspectRatio: VALID_RATIOS.includes(raw?.aspectRatio ?? "") ? raw.aspectRatio! : "9:16",
  };
}

export async function GET() {
  const jobs = getAllJobs().map((j) => ({
    id: j.id,
    url: j.url,
    displayTitle: j.displayTitle,
    status: j.status,
    progress: j.progress,
    currentStep: j.currentStep,
    error: j.error,
    videoInfo: j.videoInfo,
    clipCount: j.clips?.length ?? 0,
    createdAt: j.createdAt,
  }));
  return Response.json(jobs);
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  let url = "";
  let settings: GenerateSettings | undefined;
  let localFilePath: string | undefined;

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    url = (form.get("url") as string) || "";
    const rawSettings = JSON.parse((form.get("settings") as string) || "{}");
    settings = sanitizeSettings(rawSettings);

    const file = form.get("file") as File | null;
    if (file && file.size > 0) {
      if (file.size > MAX_UPLOAD_BYTES) {
        return Response.json({ error: "File too large (max 500 MB)" }, { status: 413 });
      }
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      const ext = path.extname(file.name) || ".mp4";
      const filename = `upload_${Date.now()}${ext}`;
      localFilePath = path.join(UPLOAD_DIR, filename);
      const buffer = await file.arrayBuffer();
      await fs.writeFile(localFilePath, new Uint8Array(buffer));
      url = file.name; // use filename as display URL
    }
  } else {
    const body = await request.json();
    url = body.url;
    settings = sanitizeSettings(body.settings ?? {});
  }

  if (!settings) {
    return Response.json({ error: "Missing settings" }, { status: 400 });
  }

  if (!url && !localFilePath) {
    return Response.json({ error: "Missing url or file" }, { status: 400 });
  }

  const job = createJob(url, settings, localFilePath);

  // Start processing in background (non-blocking)
  setImmediate(() => {
    processVideo(job).catch(console.error);
  });

  return Response.json({ jobId: job.id }, { status: 202 });
}
