import { spawn } from "child_process";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

function getVideoInfo(url: string): Promise<{
  title: string;
  duration: number;
  thumbnail: string;
  channel: string;
}> {
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
      if (code !== 0) return reject(new Error(stderr.slice(-300)));
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
    const info = await getVideoInfo(url);
    return Response.json(info);
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Failed to fetch video info" },
      { status: 422 }
    );
  }
}
