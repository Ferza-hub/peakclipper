"use client";

import { setUserPrefs } from "@/lib/user-prefs";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Check,
  Scissors,
  Sparkles,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

type Role = "creator" | "agency";
type Step =
  | "role"
  | "creator-profile"
  | "agency-info"
  | "agency-plan";

const PLATFORMS = [
  { value: "youtube", label: "YouTube", emoji: "▶️" },
  { value: "tiktok", label: "TikTok", emoji: "🎵" },
  { value: "instagram", label: "Instagram", emoji: "📸" },
  { value: "linkedin", label: "LinkedIn", emoji: "💼" },
  { value: "other", label: "Other", emoji: "🌐" },
];

const TEAM_SIZES = ["1–3", "4–10", "11–30", "30+"];

interface Plan {
  id: "starter" | "pro" | "scale";
  name: string;
  price: string;
  period: string;
  description: string;
  highlight: boolean;
  features: string[];
  cta: string;
}

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for small agencies just getting started",
    highlight: false,
    features: [
      "50 clips / month",
      "Up to 3 creators",
      "All caption styles",
      "MP4 & 9:16 export",
      "Email support",
    ],
    cta: "Start free trial",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$79",
    period: "/month",
    description: "For growing agencies managing multiple clients",
    highlight: true,
    features: [
      "200 clips / month",
      "Up to 10 creators",
      "White-label exports",
      "Priority processing",
      "Bulk download",
      "Priority support",
    ],
    cta: "Start free trial",
  },
  {
    id: "scale",
    name: "Scale",
    price: "Custom",
    period: "",
    description: "Enterprise-grade for large agencies",
    highlight: false,
    features: [
      "Unlimited clips",
      "Unlimited creators",
      "API access",
      "CRM integrations",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    cta: "Contact sales",
  },
];

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
            sub: "Free forever",
          },
          {
            role: "agency" as Role,
            icon: "🏢",
            title: "Agency",
            desc: "I create clips for multiple clients",
            sub: "Plans from $29/mo",
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
            <span className={cn(
              "mt-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              item.role === "creator"
                ? "bg-green-100 text-green-700"
                : "bg-violet-100 text-violet-700"
            )}>
              {item.sub}
            </span>
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
      <StepDots current={2} total={2} />
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
      <StepDots current={2} total={3} />
      <h2 className="text-xl font-bold text-[#0f172a] mb-1">Tell us about your agency</h2>
      <p className="text-sm text-[#64748b] mb-8">We'll tailor the right plan for your team.</p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
            Agency name
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
        View plans
        <ArrowRight size={15} />
      </button>
    </div>
  );
}

function AgencyPlanStep({
  agencyName,
  onSelect,
}: {
  agencyName: string;
  onSelect: (plan: "starter" | "pro" | "scale") => void;
}) {
  return (
    <div className="flex flex-col items-center w-full max-w-3xl">
      <StepDots current={3} total={3} />
      <h2 className="text-xl font-bold text-[#0f172a] mb-1 self-start">
        Choose a plan for{" "}
        <span className="text-[#7c3aed]">{agencyName || "your agency"}</span>
      </h2>
      <p className="text-sm text-[#64748b] mb-8 self-start">
        All plans include a 14-day free trial. No credit card required.
      </p>

      <div className="grid grid-cols-3 gap-4 w-full">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative flex flex-col rounded-2xl border-2 p-5 transition-all",
              plan.highlight
                ? "border-[#7c3aed] bg-white shadow-xl shadow-violet-100"
                : "border-[#e2e8f0] bg-white"
            )}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#7c3aed] px-3 py-1 text-xs font-semibold text-white shadow">
                  <Sparkles size={10} />
                  Most popular
                </span>
              </div>
            )}

            <div className="mb-4">
              <p className="font-semibold text-[#0f172a]">{plan.name}</p>
              <div className="mt-2 flex items-baseline gap-0.5">
                <span className="text-2xl font-bold text-[#0f172a]">{plan.price}</span>
                {plan.period && (
                  <span className="text-sm text-[#94a3b8]">{plan.period}</span>
                )}
              </div>
              <p className="mt-1.5 text-xs text-[#64748b] leading-relaxed">{plan.description}</p>
            </div>

            <ul className="flex-1 space-y-2 mb-5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-[#475569]">
                  <Check size={13} className="mt-0.5 flex-shrink-0 text-[#7c3aed]" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => onSelect(plan.id)}
              className={cn(
                "w-full rounded-xl py-2.5 text-sm font-semibold transition-all cursor-pointer",
                plan.highlight
                  ? "bg-[#7c3aed] text-white hover:bg-[#6d28d9]"
                  : "border border-[#e2e8f0] text-[#0f172a] hover:bg-[#f8fafc]"
              )}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs text-[#94a3b8]">
        You can change or cancel your plan anytime from settings.
      </p>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>("role");
  const [role, setRole] = React.useState<Role | null>(null);
  const [agencyName, setAgencyName] = React.useState("");

  const handleRoleSelect = (r: Role) => {
    setRole(r);
    setStep(r === "creator" ? "creator-profile" : "agency-info");
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
    setAgencyName(name);
    setUserPrefs({ role: "agency", agencyName: name, teamSize });
    setStep("agency-plan");
  };

  const handlePlanSelect = (plan: "starter" | "pro" | "scale") => {
    setUserPrefs({ onboardingComplete: true, plan });
    router.push("/");
  };

  const maxWidth =
    step === "agency-plan" ? "max-w-3xl" : "max-w-md";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8ff] via-white to-[#f0fdf4] flex flex-col">
      {/* Top bar */}
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

      {/* Main content */}
      <main className={cn("flex flex-1 items-center justify-center px-6 py-10", step === "agency-plan" ? "items-start pt-16" : "")}>
        <div className={cn("w-full", maxWidth)}>
          {step === "role" && <RoleStep onSelect={handleRoleSelect} />}
          {step === "creator-profile" && (
            <CreatorProfileStep onDone={handleCreatorDone} />
          )}
          {step === "agency-info" && (
            <AgencyInfoStep onDone={handleAgencyInfo} />
          )}
          {step === "agency-plan" && (
            <AgencyPlanStep
              agencyName={agencyName}
              onSelect={handlePlanSelect}
            />
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
