import { NextResponse } from "next/server";
import { execSync } from "child_process";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  let ytdlp = false;
  let ffmpeg = false;

  try { execSync("yt-dlp --version", { stdio: "pipe" }); ytdlp = true; } catch {}
  try { execSync("ffmpeg -version", { stdio: "pipe" }); ffmpeg = true; } catch {}

  return NextResponse.json({
    status: "ok",
    mode: ytdlp && ffmpeg ? "full" : "demo",
    binaries: { ytdlp, ffmpeg },
  });
}
