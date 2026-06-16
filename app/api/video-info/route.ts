import { spawn } from "child_process";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

const PIPED_API_INSTANCES = [
  "https://pipedapi.kavin.rocks",
  "https://api.piped.projectsegfault.net",
  "https://piped-api.garudalinux.org",
];

const YTDLP_CLIENTS = [
  "android,web",
  "tv_embedded,web",
  "ios",
  "mweb",
];

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:v=|\/v\/|youtu\.be\/|\/embed\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
  return m?.[1] ?? null;
}

function isBotError(msg: string): boolean {
  return (
    msg.includes("Sign in") || msg.includes("bot") || msg.includes("cookies") ||
    msg.includes("Login") || msg.includes("403") || msg.includes("Forbidden") ||
    msg.includes("429") || msg.includes("unavailable") || msg.includes("Private video") ||
    msg.includes("This video")
  );
}

function ytdlpArgs(clientIndex: number, extraUrl: string): string[] {
  const client = YTDLP_CLIENTS[clientIndex % YTDLP_CLIENTS.length];
  const base = [
    "--no-check-certificate",
    "--extractor-args", `youtube:player_client=${client}`,
    "--no-playlist",
  ];
  if (client.includes("android") || client.includes("web")) {
    base.push("--js-runtimes", "node");
  }
  const cookiesFile = process.env.YTDLP_COOKIES_FILE;
  if (cookiesFile) base.push("--cookies", cookiesFile);
  base.push("--dump-json", extraUrl);
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

  const videoId = extractYouTubeId(url);

  // For YouTube: oEmbed first — always works for public videos, no auth
  if (videoId) {
    try {
      const oe = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
        { signal: AbortSignal.timeout(8_000) }
      );
      if (oe.ok) {
        const d = await oe.json() as { title: string; author_name: string; thumbnail_url: string };
        // Try each yt-dlp client for duration; first success wins
        let duration = 0;
        for (let ci = 0; ci < YTDLP_CLIENTS.length; ci++) {
          try {
            const j = await runYtdlp(ytdlpArgs(ci, url));
            duration = (JSON.parse(j).duration as number) || 0;
            if (duration > 0) break;
          } catch { /* try next client */ }
        }
        return Response.json({ title: d.title, duration, thumbnail: d.thumbnail_url, channel: d.author_name, url });
      }
    } catch { /* fall through */ }
  }

  // Non-YouTube or oEmbed failed: try yt-dlp with each client
  for (let ci = 0; ci < YTDLP_CLIENTS.length; ci++) {
    try {
      return Response.json(parseInfo(await runYtdlp(ytdlpArgs(ci, url)), url));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (!isBotError(msg)) {
        return Response.json({ error: msg || "Failed to fetch video info" }, { status: 422 });
      }
      // bot error: try next client
    }
  }

  // Last resort: Piped API
  if (videoId) {
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
  }

  return Response.json({ error: "Unable to fetch video info. Try uploading the video file directly." }, { status: 422 });
}
