import { getJob } from "@/lib/job-store";

export const dynamic = "force-dynamic";

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
