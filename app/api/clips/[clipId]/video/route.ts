import { getAllJobs } from "@/lib/job-store";
import fs from "fs";
import { stat } from "fs/promises";
import path from "path";
import { Readable } from "stream";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function findClipPath(clipId: string): string | null {
  for (const job of getAllJobs()) {
    const clip = job.clips?.find((c) => c.id === clipId);
    if (clip) return clip.filePath;
  }
  return null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ clipId: string }> }
) {
  const { clipId } = await params;
  const filePath = findClipPath(clipId);

  if (!filePath) {
    return new Response("Clip not found", { status: 404 });
  }

  try {
    const fileStat = await stat(filePath);
    const fileSize = fileStat.size;
    const rangeHeader = request.headers.get("range");
    const ext = path.extname(filePath).toLowerCase();
    const contentType = ext === ".webm" ? "video/webm" : "video/mp4";

    if (rangeHeader) {
      const [startStr, endStr] = rangeHeader.replace(/bytes=/, "").split("-");
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      const webStream = Readable.toWeb(
        fs.createReadStream(filePath, { start, end })
      ) as ReadableStream;
      return new Response(webStream, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize.toString(),
          "Content-Type": contentType,
        },
      });
    }

    const webStream = Readable.toWeb(
      fs.createReadStream(filePath)
    ) as ReadableStream;
    return new Response(webStream, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileSize.toString(),
        "Accept-Ranges": "bytes",
        "Content-Disposition": `inline; filename="${clipId}.mp4"`,
      },
    });
  } catch {
    return new Response("Error reading clip file", { status: 500 });
  }
}
