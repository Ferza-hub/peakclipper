"use client";

import { GenerateModal } from "@/components/generate-modal";
import { VideoCard, type VideoProject } from "@/components/video-card";
import { Scissors, Sparkles, Upload } from "lucide-react";
import * as React from "react";

const MOCK_PROJECTS: VideoProject[] = [
  {
    id: "1",
    title: "Podcast: Cara Membangun Bisnis dari Nol",
    url: "https://youtu.be/abc123",
    clipCount: 8,
    duration: "45:12",
    createdAt: "Today, 10:30 AM",
    thumbnailColor: "#312e81",
    status: "done",
  },
  {
    id: "2",
    title: "Interview with Startup Founder — Full Session",
    url: "https://youtu.be/def456",
    clipCount: 6,
    duration: "28:47",
    createdAt: "Yesterday",
    thumbnailColor: "#1e3a5f",
    status: "done",
  },
  {
    id: "3",
    title: "Webinar: Growth Hacking 2024",
    url: "https://youtu.be/ghi789",
    clipCount: 0,
    duration: "1:02:15",
    createdAt: "Jun 9",
    thumbnailColor: "#1a4731",
    status: "processing",
  },
];

function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#e2e8f0] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#7c3aed]">
            <Scissors size={15} className="text-white" />
          </div>
          <span className="text-base font-bold tracking-tight text-[#0f172a]">PeakClipper</span>
        </div>

        <nav className="hidden items-center gap-6 sm:flex">
          <a href="#" className="text-sm font-medium text-[#0f172a]">Clips</a>
          <a href="#" className="text-sm text-[#94a3b8] hover:text-[#0f172a] transition-colors">Templates</a>
          <a href="#" className="text-sm text-[#94a3b8] hover:text-[#0f172a] transition-colors">Analytics</a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-xs font-bold text-white">
            F
          </div>
        </div>
      </div>
    </header>
  );
}

function VideoInputBar({ onGenerate }: { onGenerate: (url: string) => void }) {
  const [url, setUrl] = React.useState("");
  const [dragging, setDragging] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) onGenerate(url.trim());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const text = e.dataTransfer.getData("text");
    if (text) { setUrl(text); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex items-center gap-3 rounded-2xl border-2 bg-white px-4 py-3 transition-all shadow-sm ${
          dragging
            ? "border-[#7c3aed] bg-violet-50 shadow-md shadow-violet-100"
            : "border-[#e2e8f0] hover:border-[#c7d2fe]"
        }`}
      >
        <Upload size={18} className="flex-shrink-0 text-[#94a3b8]" />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube, TikTok, or Instagram link — or drop a file"
          className="flex-1 bg-transparent text-sm text-[#0f172a] placeholder:text-[#94a3b8] outline-none"
        />
        {url && (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="text-[#94a3b8] hover:text-[#0f172a] transition-colors text-lg leading-none cursor-pointer"
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

function EmptyState({ onGenerate }: { onGenerate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#e2e8f0] bg-white py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1f5f9]">
        <Scissors size={24} className="text-[#94a3b8]" />
      </div>
      <h3 className="text-base font-semibold text-[#0f172a]">Create your first clip</h3>
      <p className="mt-1 text-sm text-[#94a3b8] max-w-xs">
        Paste a video link above and let AI find the most engaging moments for you.
      </p>
      <button
        onClick={onGenerate}
        className="mt-5 flex items-center gap-2 rounded-xl border border-[#e2e8f0] px-4 py-2 text-sm font-medium text-[#64748b] hover:bg-[#f8fafc] hover:border-[#c7d2fe] transition-all cursor-pointer"
      >
        <Sparkles size={14} className="text-[#7c3aed]" />
        Try with a sample video
      </button>
    </div>
  );
}

const SAMPLE_URL = "https://youtu.be/dQw4w9WgXcQ";

export default function HomePage() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [activeUrl, setActiveUrl] = React.useState("");
  const [projects] = React.useState<VideoProject[]>(MOCK_PROJECTS);

  const handleGenerate = (url: string) => {
    setActiveUrl(url);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 py-10">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0f172a]">Your clips</h1>
          <p className="mt-1 text-sm text-[#94a3b8]">
            {projects.length > 0
              ? `${projects.filter(p => p.status === "done").reduce((s, p) => s + p.clipCount, 0)} clips generated from ${projects.length} videos`
              : "Paste a video link to get started"}
          </p>
        </div>

        {/* URL Input */}
        <div className="mb-8">
          <VideoInputBar onGenerate={handleGenerate} />
        </div>

        {/* Video list */}
        {projects.length > 0 ? (
          <div className="space-y-3">
            {projects.map((project) => (
              <VideoCard
                key={project.id}
                project={project}
                onOpen={(id) => {
                  const p = projects.find(x => x.id === id);
                  if (p) handleGenerate(p.url);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState onGenerate={() => handleGenerate(SAMPLE_URL)} />
        )}
      </main>

      <GenerateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        videoUrl={activeUrl}
      />
    </div>
  );
}
