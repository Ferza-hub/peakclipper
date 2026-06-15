import { spawn } from "child_process";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

const PIPED_INSTANCES = [
  "https://pipedapi.kavin.rocks",
  "https://api.piped.projectsegfault.net",
  "https://piped-api.garudalinux.org",
];

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:v=|\/v\/|youtu\.be\/|\/embed\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
  return m?.[1] ?? null;
}

async function fetchPipedInfo(videoId: string) {
  for (const instance of PIPED_INSTANCES) {
    try {
      const resp = await fetch(`${instance}/streams/${videoId}`, {
        headers: { "User-Agent": "PeakClipper/1.0" },
        signal: AbortSignal.timeout(10_000),
      });
      if (!resp.ok) continue;
      const d = await resp.json() as { title: string; duration: number; thumbnailUrl: string; uploader: string };
      return { title: d.title, duration: d.duration, thumbnail: d.thumbnailUrl ?? "", channel: d.uploader ?? "Unknown" };
    } catch { /* try next */ }
  }
  return null;
}

function getVideoInfoViaYtdlp(url: string): Promise<{ title: string; duration: number; thumbnail: string; channel: string }> {
  return new Promise((resolve, reject) => {
    let stdout = "";
    let stderr = "";
    const cookiesFile = process.env.YTDLP_COOKIES_FILE;
    const proc = spawn("yt-dlp", [
      "--no-check-certificate",
      "--extractor-args", "youtube:player_client=android,web",
      "--js-runtimes", "node",
      "--no-playlist",
      "--dump-json",
      ...(cookiesFile ? ["--cookies", cookiesFile] : []),
      url,
    ]);
    proc.stdout.on("data", (d: Buffer) => (stdout += d.toString()));
    proc.stderr.on("data", (d: Buffer) => (stderr += d.toString()));
    proc.on("close", (code) => {
      if (code !== 0) return reject(new Error(stderr.slice(-400)));
      try {
        const data = JSON.parse(stdout);
        resolve({
          title: data.title,
          duration: data.duration,
          thumbnail: data.thumbnail || data.thumbnails?.[0]?.url || "",
          channel: data.channel || data.uploader || "Unknown",
        });
      } catch {
        reject(new Error("Failed to parse video info"));
      }
    });
    proc.on("error", reject);
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return Response.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const info = await getVideoInfoViaYtdlp(url);
    return Response.json(info);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    const videoId = extractYouTubeId(url);
    if (videoId && (msg.includes("Sign in") || msg.includes("bot") || msg.includes("cookies"))) {
      const piped = await fetchPipedInfo(videoId);
      if (piped) return Response.json(piped);
    }
    return Response.json(
      { error: err instanceof Error ? err.message : "Failed to fetch video info" },
      { status: 422 }
    );
  }
}
