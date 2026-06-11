"use client";

import * as React from "react";

export interface JobUpdate {
  status: string;
  progress: number;
  currentStep: string;
  error?: string;
  videoInfo?: {
    title: string;
    duration: number;
    thumbnail: string;
    channel: string;
  };
  clips?: Array<{
    id: string;
    title: string;
    duration: number;
    score: number;
    transcript: string;
  }>;
}

export function useJobStream(jobId: string | null) {
  const [state, setState] = React.useState<JobUpdate | null>(null);

  React.useEffect(() => {
    if (!jobId) return;

    const es = new EventSource(`/api/jobs/${jobId}/stream`);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as JobUpdate;
        setState(data);
        if (data.status === "done" || data.status === "error") {
          es.close();
        }
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      es.close();
    };

    return () => es.close();
  }, [jobId]);

  return state;
}
