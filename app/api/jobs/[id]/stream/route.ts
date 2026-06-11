import { getJob } from "@/lib/job-store";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let closed = false;

      const send = (data: object) => {
        if (!closed) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        }
      };

      const tick = () => {
        const job = getJob(id);
        if (!job) {
          send({ error: "Job not found" });
          controller.close();
          closed = true;
          return;
        }

        send({
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
          })),
        });

        if (job.status === "done" || job.status === "error") {
          setTimeout(() => {
            if (!closed) {
              controller.close();
              closed = true;
            }
          }, 200);
          return;
        }

        setTimeout(tick, 600);
      };

      tick();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
