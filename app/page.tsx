"use client";

import { GenerateModal } from "@/components/generate-modal";
import { OnboardingGuard } from "@/components/onboarding-guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUserPrefs, type UserPrefs } from "@/lib/user-prefs";
import { cn } from "@/lib/utils";
import {
  Building2,
  Download,
  Loader2,
  Play,
  Scissors,
  Sparkles,
  Upload,
} from "lucide-react";
import * as React from "react";

interface JobSummary {
  id: string;
  url: string;
  status: string;
  progress: number;
  currentStep: string;
  error?: string;
  videoInfo?: { title: string; duration: number; thumbnail: string; channel: string };
  clipCount: number;
  createdAt: number;
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ts).toLocaleDateString();
}

function JobCard({ job, onOpen }: { job: JobSummary; onOpen: (id: string) => void }) {
  const isProcessing = !["done", "error"].includes(job.status);
  const colors = ["#312e81", "#1e3a5f", "#1a4731", "#4a2110", "#1e293b", "#3b1f6b"];
  const color = colors[parseInt(job.id.slice(-2), 16) % colors.length];

  return (
    <div
      className="group flex gap-4 rounded-xl border border-[#e2e8f0] bg-white p-4 hover:border-[#c7d2fe] hover:shadow-sm transition-all cursor-pointer"
      onClick={() => job.status === "done" && onOpen(job.id)}
    >
      <div
        className="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-lg flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
        {job.videoInfo?.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={job.videoInfo.thumbnail} alt="" className="h-full w-full object-cover" />
        ) : (
          <Play size={18} className="text-white/40" />
        )}
        {job.videoInfo?.duration && (
          <div className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-[10px] text-white font-medium">
            {formatDuration(job.videoInfo.duration)}
          </div>
        )}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Loader2 size={16} className="animate-spin text-white" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <p className="text-sm font-semibold text-[#0f172a] leading-snug line-clamp-2">
            {job.videoInfo?.title || job.url}
          </p>
          <p className="mt-0.5 text-xs text-[#94a3b8]">{timeAgo(job.createdAt)}</p>
        </div>

        <div className="flex items-center gap-2 mt-2">
          {isProcessing && (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f1f5f9]">
                <div
                  className="h-full rounded-full bg-[#7c3aed] transition-all duration-500"
                  style={{ width: `${job.progress}%` }}
                />
              </div>
              <span className="text-xs text-[#94a3b8] flex-shrink-0">{Math.round(job.progress)}%</span>
            </div>
          )}
          {job.status === "done" && (
            <Badge variant="success">
              <Scissors size={9} className="mr-1" />
              {job.clipCount} clips
            </Badge>
          )}
          {job.status === "error" && (
            <Badge variant="default" className="bg-red-100 text-red-600">Failed</Badge>
          )}
        </div>
      </div>

      {job.status === "done" && (
        <div className="flex flex-col items-end justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
            <Download size={11} />
            Export
          </Button>
        </div>
      )}
    </div>
  );
}


function Navbar({ prefs }: { prefs: UserPrefs }) {
  const isAgency = prefs.role === "agency";
  const initials = (prefs.name || prefs.agencyName || "U").slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-[#e2e8f0] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#7c3aed]">
            <Scissors size={15} className="text-white" />
          </div>
          <span className="text-base font-bold tracking-tight text-[#0f172a]">PeakClipper</span>
        </div>

        <nav className="hidden items-center gap-6 sm:flex">
          <a href="/" className="text-sm font-medium text-[#0f172a]">Clips</a>
          {isAgency && (
            <a href="/clients" className="text-sm text-[#94a3b8] hover:text-[#0f172a] transition-colors">Clients</a>
          )}
          <a href="/analytics" className="text-sm text-[#94a3b8] hover:text-[#0f172a] transition-colors">Analytics</a>
        </nav>

        <div className="flex items-center gap-2">
          {isAgency && (
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-[#e2e8f0] px-2.5 py-1 text-xs text-[#64748b]">
              <Building2 size={11} />
              {prefs.agencyName || "Business"}
            </div>
          )}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-xs font-bold text-white">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}

function VideoInputBar({
  onGenerate,
  onFileSelect,
}: {
  onGenerate: (url: string) => void;
  onFileSelect: (file: File) => void;
}) {
  const [url, setUrl] = React.useState("");
  const [dragging, setDragging] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) onGenerate(url.trim());
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      onFileSelect(file);
      return;
    }
    const text = e.dataTransfer.getData("text");
    if (text) setUrl(text);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    e.target.value = "";
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex items-center gap-3 rounded-2xl border-2 bg-white px-4 py-3 shadow-sm transition-all",
          dragging
            ? "border-[#7c3aed] bg-violet-50 shadow-md shadow-violet-100"
            : "border-[#e2e8f0] hover:border-[#c7d2fe]"
        )}
      >
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex-shrink-0 text-[#94a3b8] hover:text-[#7c3aed] transition-colors cursor-pointer"
          title="Upload a video file"
        >
          <Upload size={18} />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube, TikTok, or Instagram link — or drop / upload a video"
          className="flex-1 bg-transparent text-sm text-[#0f172a] placeholder:text-[#94a3b8] outline-none"
        />
        {url && (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="text-[#94a3b8] hover:text-[#0f172a] transition-colors text-lg leading-none cursor-pointer flex-shrink-0"
          >
            ×
          </button>
        )}
        <button
          type="submit"
          disabled={!url.trim()}
          className="flex items-center gap-2 rounded-xl bg-[#0f172a] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#1e293b] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
        >
          <Sparkles size={14} />
          Generate
        </button>
      </div>
    </form>
  );
}

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#e2e8f0] bg-white py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1f5f9]">
        <Scissors size={24} className="text-[#94a3b8]" />
      </div>
      <h3 className="text-base font-semibold text-[#0f172a]">Create your first clip</h3>
      <p className="mt-1 text-sm text-[#94a3b8] max-w-xs">
        Paste a video URL above, or upload a video file directly.
      </p>
      <button
        onClick={onUpload}
        className="mt-5 flex items-center gap-2 rounded-xl border border-[#e2e8f0] px-4 py-2 text-sm font-medium text-[#64748b] hover:bg-[#f8fafc] hover:border-[#c7d2fe] transition-all cursor-pointer"
      >
        <Upload size={14} className="text-[#7c3aed]" />
        Upload a video file
      </button>
    </div>
  );
}

function DashboardContent() {
  const [prefs, setPrefs] = React.useState<UserPrefs | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [activeUrl, setActiveUrl] = React.useState("");
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [jobs, setJobs] = React.useState<JobSummary[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setPrefs(getUserPrefs());
  }, []);

  // Poll jobs list every 2 seconds — must be before any early return (Rules of Hooks)
  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        const r = await fetch("/api/jobs");
        if (r.ok) setJobs(await r.json());
      } catch { /* ignore */ }
    };
    fetchJobs();
    const interval = setInterval(fetchJobs, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!prefs) return null;

  const handleGenerate = (url: string) => {
    setActiveUrl(url);
    setUploadedFile(null);
    setModalOpen(true);
  };

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    setActiveUrl(file.name);
    setModalOpen(true);
  };

  const handleOpenJob = (_id: string) => {
    setModalOpen(true);
  };

  const processingJobs = jobs.filter((j) => !["done", "error"].includes(j.status));
  const doneJobs = jobs.filter((j) => j.status === "done" || j.status === "error");

  const isAgency = prefs.role === "agency";
  const greeting = prefs.name || prefs.agencyName || "";

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar prefs={prefs} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0f172a]">
            {isAgency ? "Client clips" : "Your clips"}
          </h1>
          <p className="mt-1 text-sm text-[#94a3b8]">
            {greeting && `Hi ${greeting} · `}
            {jobs.length > 0
              ? `${doneJobs.reduce((s, j) => s + j.clipCount, 0)} clips from ${jobs.length} video${jobs.length !== 1 ? "s" : ""}`
              : isAgency
              ? "Upload a client's video or paste a link to get started"
              : "Paste a URL or upload a video to get started"}
          </p>
        </div>

        <div className="mb-8">
          <VideoInputBar onGenerate={handleGenerate} onFileSelect={handleFileSelect} />
        </div>

        {processingJobs.length > 0 && (
          <div className="mb-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#94a3b8]">Processing</p>
            <div className="space-y-3">
              {processingJobs.map((job) => (
                <JobCard key={job.id} job={job} onOpen={handleOpenJob} />
              ))}
            </div>
          </div>
        )}

        {doneJobs.length > 0 && (
          <div className="mb-6">
            {processingJobs.length > 0 && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#94a3b8]">Completed</p>
            )}
            <div className="space-y-3">
              {doneJobs.map((job) => (
                <JobCard key={job.id} job={job} onOpen={handleOpenJob} />
              ))}
            </div>
          </div>
        )}

        {jobs.length === 0 && (
          <EmptyState onUpload={() => fileInputRef.current?.click()} />
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFileSelect(f);
            e.target.value = "";
          }}
        />
      </main>

      <GenerateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        videoUrl={activeUrl}
        uploadedFile={uploadedFile}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <OnboardingGuard>
      <DashboardContent />
    </OnboardingGuard>
  );
}
