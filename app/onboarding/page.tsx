"use client";

import { setUserPrefs } from "@/lib/user-prefs";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Check,
  Scissors,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

type Role = "creator" | "agency";
type Step = "role" | "auth" | "creator-profile" | "agency-info";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

function AuthStep({ role, onDone }: { role: Role; onDone: (email: string) => void }) {
  const [emailMode, setEmailMode] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const proceed = (resolvedEmail: string) => onDone(resolvedEmail);

  return (
    <div className="flex flex-col w-full max-w-sm">
      <StepDots current={2} total={3} />
      <div className="mb-1 flex items-center gap-2">
        <span className="text-2xl">{role === "creator" ? "🎬" : "🏢"}</span>
        <h2 className="text-xl font-bold text-[#0f172a]">Create your account</h2>
      </div>
      <p className="text-sm text-[#64748b] mb-8">
        Sign in to save your clips and settings.
      </p>

      <div className="space-y-3">
        <button
          onClick={() => proceed("google-user@gmail.com")}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm font-medium text-[#0f172a] shadow-sm hover:bg-[#f8fafc] hover:border-[#c7d2fe] transition-all cursor-pointer"
        >
          <GoogleIcon />
          Continue with Google
        </button>
        <button
          onClick={() => proceed("apple-user@icloud.com")}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#0f172a] px-4 py-3 text-sm font-medium text-white hover:bg-[#1e293b] transition-all cursor-pointer"
        >
          <AppleIcon />
          Continue with Apple
        </button>
      </div>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#e2e8f0]" />
        <span className="text-xs text-[#94a3b8]">or</span>
        <div className="h-px flex-1 bg-[#e2e8f0]" />
      </div>

      {!emailMode ? (
        <button
          onClick={() => setEmailMode(true)}
          className="w-full rounded-xl border border-[#e2e8f0] px-4 py-3 text-sm font-medium text-[#64748b] hover:bg-[#f8fafc] hover:border-[#c7d2fe] transition-all cursor-pointer"
        >
          Continue with email
        </button>
      ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); if (email.trim()) proceed(email.trim()); }}
          className="space-y-3"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoFocus
            className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-violet-100 transition-all"
          />
          <button
            type="submit"
            disabled={!email.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f172a] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1e293b] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Continue
            <ArrowRight size={15} />
          </button>
        </form>
      )}

      <p className="mt-5 text-center text-xs text-[#94a3b8]">
        By continuing you agree to our Terms of Service.
      </p>
    </div>
  );
}

const PLATFORMS = [
  { value: "youtube", label: "YouTube", emoji: "▶️" },
  { value: "tiktok", label: "TikTok", emoji: "🎵" },
  { value: "instagram", label: "Instagram", emoji: "📸" },
  { value: "linkedin", label: "LinkedIn", emoji: "💼" },
  { value: "other", label: "Other", emoji: "🌐" },
];

const TEAM_SIZES = ["1–3", "4–10", "11–30", "30+"];

function StepDots({ current }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5 mb-8">
      {Array.from({ length: current }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all",
            i === current - 1
              ? "w-6 bg-[#7c3aed]"
              : "w-1.5 bg-[#c4b5fd]"
          )}
        />
      ))}
    </div>
  );
}

function RoleStep({ onSelect }: { onSelect: (r: Role) => void }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7c3aed] mb-6">
        <Scissors size={22} className="text-white" />
      </div>
      <h1 className="text-2xl font-bold text-[#0f172a] mb-2">
        Welcome to PeakClipper
      </h1>
      <p className="text-[#64748b] mb-10 max-w-sm">
        AI-powered clips from any long-form video. How will you use it?
      </p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {[
          {
            role: "creator" as Role,
            icon: "🎬",
            title: "Creator",
            desc: "I manage my own content and channels",
            sub: null,
          },
          {
            role: "agency" as Role,
            icon: "🏢",
            title: "Business",
            desc: "I manage content for clients or a team",
            sub: "Multi-client workflow",
          },
        ].map((item) => (
          <button
            key={item.role}
            onClick={() => onSelect(item.role)}
            className="group flex flex-col items-start rounded-2xl border-2 border-[#e2e8f0] bg-white p-5 text-left hover:border-[#7c3aed] hover:shadow-lg hover:shadow-violet-100 transition-all cursor-pointer"
          >
            <span className="text-3xl mb-3">{item.icon}</span>
            <p className="font-semibold text-[#0f172a] text-base">{item.title}</p>
            <p className="text-xs text-[#64748b] mt-1 leading-relaxed">{item.desc}</p>
            {item.sub && (
              <span className="mt-3 inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">
                {item.sub}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function CreatorProfileStep({
  onDone,
}: {
  onDone: (name: string, platform: string, niche: string) => void;
}) {
  const [name, setName] = React.useState("");
  const [platform, setPlatform] = React.useState("");
  const [niche, setNiche] = React.useState("");

  return (
    <div className="flex flex-col w-full max-w-sm">
      <StepDots current={3} total={3} />
      <h2 className="text-xl font-bold text-[#0f172a] mb-1">Almost there 🎉</h2>
      <p className="text-sm text-[#64748b] mb-8">Quick setup so we can personalize your experience.</p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
            Your name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex"
            className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-violet-100 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0f172a] mb-2">
            Main platform
          </label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPlatform(p.value)}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-all cursor-pointer",
                  platform === p.value
                    ? "border-[#7c3aed] bg-violet-50 text-[#7c3aed]"
                    : "border-[#e2e8f0] text-[#64748b] hover:border-[#c4b5fd]"
                )}
              >
                <span>{p.emoji}</span>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
            Content niche{" "}
            <span className="font-normal text-[#94a3b8]">(optional)</span>
          </label>
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="e.g. Business, Tech, Lifestyle…"
            className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-violet-100 transition-all"
          />
        </div>
      </div>

      <button
        onClick={() => onDone(name, platform, niche)}
        disabled={!name.trim()}
        className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-[#0f172a] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1e293b] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        Start clipping
        <ArrowRight size={15} />
      </button>
    </div>
  );
}

function AgencyInfoStep({
  onDone,
}: {
  onDone: (agencyName: string, teamSize: string) => void;
}) {
  const [agencyName, setAgencyName] = React.useState("");
  const [teamSize, setTeamSize] = React.useState("");

  return (
    <div className="flex flex-col w-full max-w-sm">
      <StepDots current={3} total={3} />
      <h2 className="text-xl font-bold text-[#0f172a] mb-1">Tell us about your business</h2>
      <p className="text-sm text-[#64748b] mb-8">Help us personalize your workspace for your team.</p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
            Business / agency name
          </label>
          <input
            type="text"
            value={agencyName}
            onChange={(e) => setAgencyName(e.target.value)}
            placeholder="e.g. Nexus Creative"
            className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-violet-100 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0f172a] mb-2">
            Creators / clients you manage
          </label>
          <div className="grid grid-cols-4 gap-2">
            {TEAM_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setTeamSize(size)}
                className={cn(
                  "rounded-xl border py-2.5 text-sm font-medium transition-all cursor-pointer",
                  teamSize === size
                    ? "border-[#7c3aed] bg-violet-50 text-[#7c3aed]"
                    : "border-[#e2e8f0] text-[#64748b] hover:border-[#c4b5fd]"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => onDone(agencyName, teamSize)}
        disabled={!agencyName.trim() || !teamSize}
        className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-[#0f172a] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1e293b] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        Get started
        <ArrowRight size={15} />
      </button>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>("role");
  const [role, setRole] = React.useState<Role>("creator");

  const handleRoleSelect = (r: Role) => {
    setRole(r);
    setUserPrefs({ role: r });
    setStep("auth");
  };

  const handleAuthDone = (email: string) => {
    setUserPrefs({ email });
    setStep(role === "creator" ? "creator-profile" : "agency-info");
  };

  const handleCreatorDone = (name: string, platform: string, niche: string) => {
    setUserPrefs({
      onboardingComplete: true,
      role: "creator",
      name,
      mainPlatform: platform,
      contentNiche: niche,
      plan: null,
    });
    router.push("/");
  };

  const handleAgencyInfo = (name: string, teamSize: string) => {
    setUserPrefs({ onboardingComplete: true, role: "agency", agencyName: name, teamSize, plan: null });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8ff] via-white to-[#f0fdf4] flex flex-col">
      <header className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#7c3aed]">
            <Scissors size={13} className="text-white" />
          </div>
          <span className="text-sm font-bold text-[#0f172a]">PeakClipper</span>
        </div>
        {step !== "role" && (
          <button
            onClick={() => router.push("/")}
            className="text-xs text-[#94a3b8] hover:text-[#64748b] transition-colors cursor-pointer"
          >
            Skip for now →
          </button>
        )}
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          {step === "role" && <RoleStep onSelect={handleRoleSelect} />}
          {step === "auth" && <AuthStep role={role} onDone={handleAuthDone} />}
          {step === "creator-profile" && (
            <CreatorProfileStep onDone={handleCreatorDone} />
          )}
          {step === "agency-info" && (
            <AgencyInfoStep onDone={handleAgencyInfo} />
          )}
        </div>
      </main>

      {/* Social proof footer */}
      {step === "role" && (
        <footer className="pb-8 text-center">
          <p className="text-xs text-[#94a3b8]">
            Trusted by <span className="font-semibold text-[#64748b]">500+</span> creators & agencies
          </p>
          <div className="mt-3 flex items-center justify-center gap-4">
            {[
              { icon: Users, text: "12,000+ clips generated" },
              { icon: Zap, text: "Avg. 3 min processing" },
              { icon: Sparkles, text: "9 caption styles" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
                  <Icon size={11} />
                  {item.text}
                </div>
              );
            })}
          </div>
        </footer>
      )}
    </div>
  );
}
