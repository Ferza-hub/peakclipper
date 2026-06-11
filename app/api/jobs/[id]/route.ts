import { deleteJob, getJob, updateJob } from "@/lib/job-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const job = getJob(id);

  if (!job) {
    return Response.json({ error: "Job not found" }, { status: 404 });
  }

  return Response.json({
    id: job.id,
    displayTitle: job.displayTitle,
    status: job.status,
    progress: job.progress,
    currentStep: job.currentStep,
    error: job.error,
    videoInfo: job.videoInfo,
    clips: job.clips?.map((c) => ({
      id: c.id,
      title: c.title,
      duration: c.duration,
      score: c.score,
      transcript: c.transcript,
      startTime: c.startTime,
      endTime: c.endTime,
    })),
    createdAt: job.createdAt,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!getJob(id)) return Response.json({ error: "Job not found" }, { status: 404 });

  const body = await request.json();
  const displayTitle = typeof body.displayTitle === "string" ? body.displayTitle.trim() : undefined;
  if (!displayTitle) return Response.json({ error: "Missing displayTitle" }, { status: 400 });

  updateJob(id, { displayTitle });
  return Response.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = deleteJob(id);
  if (!deleted) return Response.json({ error: "Job not found" }, { status: 404 });
  return Response.json({ ok: true });
}
