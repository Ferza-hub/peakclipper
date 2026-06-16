import { spawn } from "child_process";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

const PIPED_FRONTEND_HOSTS = [
  "piped.video",
  "piped.adminforge.de",
  "piped.smnz.de",
  "piped.yt",
];

const PIPED_API_INSTANCES = [
  "https://pipedapi.kavin.rocks",
  "https://api.piped.projectsegfault.net",
  "https://piped-api.garudalinux.org",
];

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:v=|\/v\/|youtu\.be\/|\/embed\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
  return m?.[1] ?? null;
}

function isBotError(msg: string): boolean {
  return msg.includes("Sign in") || msg.includes("bot") || msg.includes("cookies") || msg.includes("Login");
}

function ytdlpArgs(youtubeSpecific: boolean, extraUrl?: string): string[] {
  const cookiesFile = process.env.YTDLP_COOKIES_FILE;
  const base = youtubeSpecific
    ? ["--no-check-certificate", "--extractor-args", "youtube:player_client=android,web", "--js-runtimes", "node", "--no-playlist"]
    : ["--no-check-certificate", "--no-playlist"];
  if (cookiesFile) base.push("--cookies", cookiesFile);
  if (extraUrl) base.push("--dump-json", extraUrl);
  return base;
}

function runYtdlp(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    let stdout = "";
    let stderr = "";
    const proc = spawn("yt-dlp", args);
    proc.stdout.on("data", (d: Buffer) => (stdout += d.toString()));
    proc.stderr.on("data", (d: Buffer) => (stderr += d.toString()));
    proc.on("close", (code) => { code === 0 ? resolve(stdout) : reject(new Error(stderr.slice(-400))); });
    proc.on("error", reject);
  });
}

function parseInfo(raw: string, url: string) {
  const data = JSON.parse(raw);
  return {
    title: data.title as string,
    duration: data.duration as number,
    thumbnail: (data.thumbnail || data.thumbnails?.[0]?.url || "") as string,
    channel: (data.channel || data.uploader || "Unknown") as string,
    url,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  if (!url) return Response.json({ error: "Missing url parameter" }, { status: 400 });

  // Step 1: direct YouTube
  try {
    return Response.json(parseInfo(await runYtdlp(ytdlpArgs(true, url)), url));
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (!isBotError(msg) || !extractYouTubeId(url)) {
      return Response.json({ error: msg || "Failed to fetch video info" }, { status: 422 });
    }
  }

  const videoId = extractYouTubeId(url)!;

  // Step 2: yt-dlp via piped.video frontend (built-in Piped extractor)
  for (const host of PIPED_FRONTEND_HOSTS) {
    try {
      const pipedUrl = `https://${host}/watch?v=${videoId}`;
      return Response.json(parseInfo(await runYtdlp(ytdlpArgs(false, pipedUrl)), url));
    } catch { /* try next */ }
  }

  // Step 3: Piped API JSON fallback
  for (const instance of PIPED_API_INSTANCES) {
    try {
      const resp = await fetch(`${instance}/streams/${videoId}`, {
        headers: { "User-Agent": "PeakClipper/1.0" },
        signal: AbortSignal.timeout(10_000),
      });
      if (!resp.ok) continue;
      const d = await resp.json() as { title: string; duration: number; thumbnailUrl: string; uploader: string };
      return Response.json({ title: d.title, duration: d.duration, thumbnail: d.thumbnailUrl ?? "", channel: d.uploader ?? "Unknown", url });
    } catch { /* try next */ }
  }

  return Response.json({ error: "YouTube is blocking this server. Try uploading the video file directly." }, { status: 422 });
}
