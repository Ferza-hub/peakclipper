"use client";

import { OnboardingGuard } from "@/components/onboarding-guard";
import { cn } from "@/lib/utils";
import { ArrowLeft, BarChart2, Clock, Scissors, TrendingUp, Zap } from "lucide-react";
import * as React from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const BAR_HEIGHTS = [30, 55, 40, 80, 65, 90, 70];

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ label, value, sub, icon, color }: StatCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-[#e2e8f0] bg-white p-5">
      <div className={cn("mb-4 flex h-10 w-10 items-center justify-center rounded-xl", color)}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-[#0f172a]">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-[#0f172a]">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-[#94a3b8]">{sub}</p>}
    </div>
  );
}

function AnalyticsContent() {
  const [stats, setStats] = React.useState({
    totalClips: 0,
    totalVideos: 0,
    avgScore: 0,
    timeSaved: 0,
  });

  React.useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((jobs: Array<{ status: string; clipCount: number; videoInfo?: { duration: number } }>) => {
        const done = jobs.filter((j) => j.status === "done");
        const totalClips = done.reduce((s, j) => s + j.clipCount, 0);
        const timeSaved = Math.round(done.reduce((s, j) => s + (j.videoInfo?.duration ?? 0), 0) / 60);
        setStats({ totalClips, totalVideos: done.length, avgScore: totalClips > 0 ? 78 : 0, timeSaved });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-30 border-b border-[#e2e8f0] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-3">
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

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0f172a]">Analytics</h1>
          <p className="mt-1 text-sm text-[#94a3b8]">Your clipping performance at a glance.</p>
        </div>

        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Clips generated"
            value={stats.totalClips > 0 ? String(stats.totalClips) : "—"}
            sub={stats.totalVideos > 0 ? `from ${stats.totalVideos} video${stats.totalVideos !== 1 ? "s" : ""}` : "No videos yet"}
            icon={<Scissors size={18} className="text-[#7c3aed]" />}
            color="bg-violet-50"
          />
          <StatCard
            label="Avg score"
            value={stats.avgScore > 0 ? `${stats.avgScore}%` : "—"}
            sub="Engagement match"
            icon={<TrendingUp size={18} className="text-[#0ea5e9]" />}
            color="bg-sky-50"
          />
          <StatCard
            label="Time saved"
            value={stats.timeSaved > 0 ? `${stats.timeSaved}m` : "—"}
            sub="vs. manual editing"
            icon={<Clock size={18} className="text-[#10b981]" />}
            color="bg-emerald-50"
          />
          <StatCard
            label="Processing speed"
            value="~3 min"
            sub="avg per video"
            icon={<Zap size={18} className="text-[#f59e0b]" />}
            color="bg-amber-50"
          />
        </div>

        {/* Chart */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-semibold text-[#0f172a]">Clips this week</p>
              <p className="text-xs text-[#94a3b8] mt-0.5">Activity over the last 7 days</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-[#e2e8f0] px-3 py-1.5">
              <BarChart2 size={12} className="text-[#7c3aed]" />
              <span className="text-xs font-medium text-[#64748b]">This week</span>
            </div>
          </div>
          <div className="flex items-end gap-3 h-32">
            {DAYS.map((day, i) => (
              <div key={day} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="w-full flex items-end" style={{ height: "100px" }}>
                  <div
                    className={cn(
                      "w-full rounded-t-lg transition-all",
                      i === 5 ? "bg-[#7c3aed]" : "bg-[#e2e8f0]"
                    )}
                    style={{ height: `${BAR_HEIGHTS[i]}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#94a3b8]">{day}</span>
              </div>
            ))}
          </div>
          {stats.totalClips === 0 && (
            <p className="mt-4 text-center text-xs text-[#94a3b8]">
              Generate your first clips to see real activity data here.
            </p>
          )}
        </div>

        {/* Top clips placeholder */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
          <p className="font-semibold text-[#0f172a] mb-4">Top performing clips</p>
          {stats.totalClips > 0 ? (
            <p className="text-sm text-[#94a3b8]">
              Engagement tracking coming soon — connect your social accounts to see real performance data.
            </p>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <BarChart2 size={28} className="mb-3 text-[#e2e8f0]" />
              <p className="text-sm font-medium text-[#94a3b8]">No clips yet</p>
              <p className="mt-1 text-xs text-[#cbd5e1]">
                Go to{" "}
                <a href="/" className="text-[#7c3aed] hover:underline">Clips</a>{" "}
                and generate your first video to see analytics here.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <OnboardingGuard>
      <AnalyticsContent />
    </OnboardingGuard>
  );
}
