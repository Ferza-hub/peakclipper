"use client";

import { OnboardingGuard } from "@/components/onboarding-guard";
import { cn } from "@/lib/utils";
import { ArrowLeft, Lock, Scissors, Sparkles } from "lucide-react";
import * as React from "react";

interface Template {
  id: string;
  name: string;
  description: string;
  platform: string;
  duration: string;
  color: string;
  tags: string[];
  available: boolean;
}

const TEMPLATES: Template[] = [
  {
    id: "hook-value-cta",
    name: "Hook → Value → CTA",
    description: "Opens with a scroll-stopping hook, delivers a punchy insight, ends with a clear call to action.",
    platform: "TikTok · Reels · Shorts",
    duration: "30–60s",
    color: "from-[#7c3aed] to-[#a78bfa]",
    tags: ["Viral", "High retention"],
    available: true,
  },
  {
    id: "story-arc",
    name: "Story Arc",
    description: "Problem → struggle → breakthrough structure that keeps viewers watching until the end.",
    platform: "YouTube · Reels",
    duration: "60–90s",
    color: "from-[#0ea5e9] to-[#38bdf8]",
    tags: ["Storytelling", "Emotional"],
    available: true,
  },
  {
    id: "tutorial-step",
    name: "Tutorial Steps",
    description: "Clear numbered steps with on-screen captions. Best for how-to and educational content.",
    platform: "All platforms",
    duration: "45–90s",
    color: "from-[#10b981] to-[#34d399]",
    tags: ["Educational", "High saves"],
    available: true,
  },
  {
    id: "interview-highlight",
    name: "Interview Highlight",
    description: "Automatically detects the most quotable, high-energy moments from podcast and interview recordings.",
    platform: "YouTube · LinkedIn",
    duration: "30–60s",
    color: "from-[#f59e0b] to-[#fbbf24]",
    tags: ["Podcast", "Thought leadership"],
    available: true,
  },
  {
    id: "before-after",
    name: "Before & After",
    description: "Contrast-driven format that shows transformation. Great for results-oriented content.",
    platform: "TikTok · Reels",
    duration: "30–45s",
    color: "from-[#ec4899] to-[#f472b6]",
    tags: ["Transformation", "Results"],
    available: false,
  },
  {
    id: "talking-head-pro",
    name: "Talking Head Pro",
    description: "Auto-reframes vertical video with dynamic zoom and AI caption sync for maximum engagement.",
    platform: "All platforms",
    duration: "Any",
    color: "from-[#6366f1] to-[#818cf8]",
    tags: ["Auto-reframe", "Captions"],
    available: false,
  },
  {
    id: "listicle",
    name: "Listicle",
    description: "\"5 ways to…\" and \"Top 10…\" formats with animated number overlays and chapter markers.",
    platform: "YouTube · TikTok",
    duration: "60–120s",
    color: "from-[#ef4444] to-[#f87171]",
    tags: ["List format", "Structured"],
    available: false,
  },
  {
    id: "whiteboard",
    name: "Whiteboard Explainer",
    description: "Designed for screen recordings, slides, and whiteboard-style educational videos.",
    platform: "YouTube · LinkedIn",
    duration: "60–120s",
    color: "from-[#64748b] to-[#94a3b8]",
    tags: ["B2B", "Explainer"],
    available: false,
  },
];

function TemplateCard({ template }: { template: Template }) {
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border-2 border-[#e2e8f0] bg-white overflow-hidden transition-all",
        template.available
          ? "hover:border-[#c7d2fe] hover:shadow-lg hover:shadow-violet-50 cursor-pointer"
          : "opacity-70"
      )}
    >
      {/* Gradient preview */}
      <div className={cn("h-28 bg-gradient-to-br", template.color, "relative flex items-center justify-center")}>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
          <Scissors size={20} className="text-white" />
        </div>
        {!template.available && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5">
              <Lock size={12} className="text-white/80" />
              <span className="text-xs font-semibold text-white/80">Coming soon</span>
            </div>
          </div>
        )}
        <div className="absolute top-2.5 right-2.5 flex gap-1">
          {template.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="font-semibold text-[#0f172a]">{template.name}</p>
        <p className="mt-1 text-xs text-[#64748b] leading-relaxed flex-1">{template.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-[#94a3b8]">{template.platform}</p>
            <p className="text-[10px] text-[#94a3b8]">{template.duration}</p>
          </div>
          {template.available && (
            <button className="flex items-center gap-1 rounded-xl bg-[#f1f5f9] px-3 py-1.5 text-xs font-semibold text-[#0f172a] opacity-0 group-hover:opacity-100 transition-all hover:bg-[#e2e8f0] cursor-pointer">
              <Sparkles size={11} />
              Use
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TemplatesContent() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-30 border-b border-[#e2e8f0] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-3">
          <a href="/" className="flex items-center gap-1.5 text-[#94a3b8] hover:text-[#0f172a] transition-colors">
            <ArrowLeft size={16} />
            <span className="text-sm">Back</span>
          </a>
          <div className="h-4 w-px bg-[#e2e8f0]" />
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#7c3aed]">
              <Scissors size={13} className="text-white" />
            </div>
            <span className="text-sm font-bold text-[#0f172a]">PeakClipper</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0f172a]">Templates</h1>
          <p className="mt-1 text-sm text-[#94a3b8]">
            Pre-configured clip formats optimized for each platform and goal.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {TEMPLATES.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-dashed border-[#c7d2fe] bg-violet-50/50 p-6 text-center">
          <Sparkles size={20} className="mx-auto mb-2 text-[#7c3aed]" />
          <p className="text-sm font-semibold text-[#4c1d95]">Custom templates coming soon</p>
          <p className="mt-1 text-xs text-[#6d28d9]/70">
            Build your own template once, apply it to every video automatically.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <OnboardingGuard>
      <TemplatesContent />
    </OnboardingGuard>
  );
}
