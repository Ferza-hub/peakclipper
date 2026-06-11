export interface VideoInfo {
  title: string;
  duration: number;
  thumbnail: string;
  channel: string;
  url: string;
}

export interface Clip {
  id: string;
  jobId: string;
  title: string;
  startTime: number;
  endTime: number;
  duration: number;
  score: number;
  filePath?: string;
  transcript: string;
}

export type JobStatus =
  | "pending"
  | "fetching_info"
  | "downloading"
  | "extracting_transcript"
  | "analyzing"
  | "clipping"
  | "done"
  | "error";

export interface GenerateSettings {
  mode: "shorts" | "captions" | "reframe";
  clipLength: string;
  captionStyle: string;
  language: string;
  introTitle: boolean;
  captions: boolean;
  aspectRatio: string;
}

export interface Job {
  id: string;
  url: string;
  status: JobStatus;
  progress: number;
  currentStep: string;
  error?: string;
  videoInfo?: VideoInfo;
  clips?: Clip[];
  createdAt: number;
  settings: GenerateSettings;
  localFilePath?: string;
}

// Survive hot reloads in development
declare global {
  // eslint-disable-next-line no-var
  var __peakClipperJobs: Map<string, Job> | undefined;
}

const jobs: Map<string, Job> =
  global.__peakClipperJobs ?? (global.__peakClipperJobs = new Map());

export function createJob(
  url: string,
  settings: GenerateSettings,
  localFilePath?: string
): Job {
  const id = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const job: Job = {
    id,
    url,
    status: "pending",
    progress: 0,
    currentStep: "Queued",
    createdAt: Date.now(),
    settings,
    localFilePath,
  };
  jobs.set(id, job);
  return job;
}

export function getJob(id: string): Job | undefined {
  return jobs.get(id);
}

export function getAllJobs(): Job[] {
  return Array.from(jobs.values()).sort((a, b) => b.createdAt - a.createdAt);
}

export function updateJob(id: string, updates: Partial<Job>): void {
  const job = jobs.get(id);
  if (job) jobs.set(id, { ...job, ...updates });
}
