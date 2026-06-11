"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CaptionStylePicker } from "@/components/caption-style-picker";
import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Check,
  ChevronDown,
  Download,
  Globe,
  Loader2,
  Scissors,
  Sparkles,
  X,
} from "lucide-react";
import * as React from "react";

type Step = "configure" | "processing" | "results";
type Mode = "shorts" | "captions" | "reframe";

interface GenerateModalProps {
  open: boolean;
  onClose: () => void;
  videoUrl: string;
}

const STEP_ORDER: Step[] = ["configure", "processing", "results"];

const STEP_LABELS: Record<Step, string> = {
  configure: "Configure",
  processing: "Processing",
  results: "Results",
};

const CLIP_LENGTH_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "30s", label: "30 sec" },
  { value: "60s", label: "1 min" },
  { value: "90s", label: "90 sec" },
];

const LANGUAGE_OPTIONS = [
  { value: "id", label: "Indonesian" },
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "pt", label: "Portuguese" },
];

const MOCK_CLIPS = [
  { id: "1", title: "The moment everything changed", duration: "0:47", score: 94, thumbnail: "#1e293b" },
  { id: "2", title: "This is why you should start now", duration: "0:33", score: 88, thumbnail: "#312e81" },
  { id: "3", title: "Nobody talks about this trick", duration: "0:58", score: 82, thumbnail: "#1e3a5f" },
  { id: "4", title: "Real talk: the hard truth", duration: "0:41", score: 79, thumbnail: "#3b1f6b" },
  { id: "5", title: "How I went from zero to scale", duration: "0:52", score: 76, thumbnail: "#1a4731" },
  { id: "6", title: "One habit that changes everything", duration: "0:38", score: 71, thumbnail: "#4a2110" },
];

const PROCESSING_STEPS = [
  { label: "Downloading video", duration: 1200 },
  { label: "Transcribing audio", duration: 2000 },
  { label: "Identifying highlights", duration: 2500 },
  { label: "Generating clips", duration: 2000 },
  { label: "Applying captions", duration: 1500 },
];

function StepIndicator({ current }: { current: Step }) {
  const currentIdx = STEP_ORDER.indexOf(current);
  return (
    <div className="flex items-center gap-0 px-6 pt-5 pb-4">
      {STEP_ORDER.map((step, i) => {
        const isDone = i < currentIdx;
        const isActive = i === currentIdx;
        return (
          <React.Fragment key={step}>
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-all",
                  isDone && "bg-[#7c3aed] text-white",
                  isActive && "bg-[#0f172a] text-white",
                  !isDone && !isActive && "bg-[#f1f5f9] text-[#94a3b8]"
                )}
              >
                {isDone ? <Check size={12} /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-sm font-medium",
                  isActive && "text-[#0f172a]",
                  isDone && "text-[#7c3aed]",
                  !isDone && !isActive && "text-[#94a3b8]"
                )}
              >
                {STEP_LABELS[step]}
              </span>
            </div>
            {i < STEP_ORDER.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-px flex-1 transition-colors",
                  i < currentIdx ? "bg-[#7c3aed]" : "bg-[#e2e8f0]"
                )}
                style={{ minWidth: 24 }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function ModeSelector({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const modes: { value: Mode; label: string; icon: string }[] = [
    { value: "shorts", label: "Shorts", icon: "✂️" },
    { value: "captions", label: "Captions", icon: "💬" },
    { value: "reframe", label: "Reframe", icon: "⬜" },
  ];
  return (
    <div className="flex gap-1.5">
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => onChange(m.value)}
          className={cn(
            "flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all cursor-pointer",
            mode === m.value
              ? "bg-[#0f172a] text-white"
              : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
          )}
        >
          <span>{m.icon}</span>
          {m.label}
        </button>
      ))}
    </div>
  );
}

function ConfigureStep({
  mode, setMode, clipLength, setClipLength,
  language, setLanguage, captionStyle, setCaptionStyle,
  introTitle, setIntroTitle, captions, setCaptions,
  aspectRatio, setAspectRatio,
  onGenerate,
}: {
  mode: Mode; setMode: (m: Mode) => void;
  clipLength: string; setClipLength: (v: string) => void;
  language: string; setLanguage: (v: string) => void;
  captionStyle: string; setCaptionStyle: (v: string) => void;
  introTitle: boolean; setIntroTitle: (v: boolean) => void;
  captions: boolean; setCaptions: (v: boolean) => void;
  aspectRatio: string; setAspectRatio: (v: string) => void;
  onGenerate: () => void;
}) {
  const [advancedOpen, setAdvancedOpen] = React.useState(false);
  const [langOpen, setLangOpen] = React.useState(false);
  const [lengthOpen, setLengthOpen] = React.useState(false);

  return (
    <div className="flex flex-col overflow-hidden" style={{ maxHeight: "calc(90vh - 140px)" }}>
      <div className="px-6 pb-4 flex-shrink-0">
        <ModeSelector mode={mode} onChange={setMode} />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 space-y-5 pb-4">
        {/* Video preview */}
        <div className="flex items-center gap-3 rounded-xl bg-[#f8fafc] p-3">
          <div className="relative h-14 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-[#1e293b] flex items-center justify-center">
            <Scissors size={16} className="text-white/40" />
            <div className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-[10px] text-white font-medium">
              13:32
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-[#0f172a]">Generating ~10 clips</p>
            <div className="relative mt-1">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-xs text-[#64748b] hover:text-[#0f172a] transition-colors cursor-pointer"
              >
                <Globe size={12} />
                Source language: {LANGUAGE_OPTIONS.find(l => l.value === language)?.label}
                <ChevronDown size={12} />
              </button>
              {langOpen && (
                <div className="absolute top-full left-0 z-50 mt-1 min-w-36 rounded-xl border border-[#e2e8f0] bg-white shadow-lg py-1">
                  {LANGUAGE_OPTIONS.map(l => (
                    <button
                      key={l.value}
                      onClick={() => { setLanguage(l.value); setLangOpen(false); }}
                      className={cn(
                        "flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-[#f8fafc] cursor-pointer",
                        language === l.value ? "font-semibold text-[#0f172a]" : "text-[#64748b]"
                      )}
                    >
                      {language === l.value && <Check size={10} />}
                      {language !== l.value && <span className="w-2.5" />}
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Clip length */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#0f172a]">Clip length</span>
            <div className="relative">
              <button
                onClick={() => setLengthOpen(!lengthOpen)}
                className="flex items-center gap-1.5 rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-sm hover:bg-[#f8fafc] transition-colors cursor-pointer"
              >
                {CLIP_LENGTH_OPTIONS.find(o => o.value === clipLength)?.label}
                <ChevronDown size={14} />
              </button>
              {lengthOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 min-w-28 rounded-xl border border-[#e2e8f0] bg-white shadow-lg py-1">
                  {CLIP_LENGTH_OPTIONS.map(o => (
                    <button
                      key={o.value}
                      onClick={() => { setClipLength(o.value); setLengthOpen(false); }}
                      className={cn(
                        "flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-[#f8fafc] cursor-pointer",
                        clipLength === o.value ? "font-semibold text-[#0f172a]" : "text-[#64748b]"
                      )}
                    >
                      {clipLength === o.value && <Check size={12} />}
                      {clipLength !== o.value && <span className="w-3" />}
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Caption style */}
        <div>
          <p className="mb-3 text-sm font-medium text-[#0f172a]">Caption style</p>
          <CaptionStylePicker selected={captionStyle} onChange={setCaptionStyle} />
        </div>

        {/* Advanced */}
        <div className="rounded-xl border border-[#e2e8f0]">
          <button
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-[#0f172a] cursor-pointer"
          >
            Advanced settings
            <ChevronDown
              size={16}
              className={cn("transition-transform text-[#94a3b8]", advancedOpen && "rotate-180")}
            />
          </button>
          {advancedOpen && (
            <div className="border-t border-[#e2e8f0] px-4 py-3 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#0f172a]">Intro title</p>
                  <p className="text-xs text-[#94a3b8]">Generate a TikTok-style intro title</p>
                </div>
                <Switch checked={introTitle} onCheckedChange={setIntroTitle} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#0f172a]">Captions</p>
                  <p className="text-xs text-[#94a3b8]">Generate engaging captions</p>
                </div>
                <Switch checked={captions} onCheckedChange={setCaptions} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#0f172a]">Aspect ratio</p>
                  <p className="text-xs text-[#94a3b8]">Reframe for vertical video</p>
                </div>
                <div className="flex gap-1.5">
                  {["9:16", "1:1", "16:9"].map(r => (
                    <button
                      key={r}
                      onClick={() => setAspectRatio(r)}
                      className={cn(
                        "rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
                        aspectRatio === r
                          ? "bg-[#0f172a] text-white"
                          : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-[#e2e8f0] px-6 py-4">
        <Button size="lg" className="w-full gap-2" onClick={onGenerate}>
          <Sparkles size={16} />
          Generate clips
        </Button>
      </div>
    </div>
  );
}

function ProcessingStep({ onComplete }: { onComplete: () => void }) {
  const [currentStepIdx, setCurrentStepIdx] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    let stepIdx = 0;
    let totalTime = 0;
    const total = PROCESSING_STEPS.reduce((s, x) => s + x.duration, 0);

    const advance = () => {
      if (stepIdx >= PROCESSING_STEPS.length) {
        setProgress(100);
        setTimeout(onComplete, 400);
        return;
      }
      setCurrentStepIdx(stepIdx);
      const duration = PROCESSING_STEPS[stepIdx].duration;
      const tickMs = 50;
      let elapsed = 0;
      const timer = setInterval(() => {
        elapsed += tickMs;
        const stepProg = elapsed / duration;
        const overallProg = ((totalTime + elapsed) / total) * 100;
        setProgress(Math.min(overallProg, 100));
        if (elapsed >= duration) {
          clearInterval(timer);
          totalTime += duration;
          stepIdx++;
          advance();
        }
      }, tickMs);
    };
    advance();
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 gap-8">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-[#f1f5f9]" />
        <div
          className="absolute inset-0 rounded-full border-4 border-[#7c3aed] border-r-transparent transition-transform"
          style={{
            transform: `rotate(${(progress / 100) * 360}deg)`,
            transition: "transform 0.1s linear",
          }}
        />
        <Loader2 size={28} className="animate-spin text-[#7c3aed]" />
      </div>

      <div className="w-full max-w-xs space-y-3">
        {PROCESSING_STEPS.map((step, i) => {
          const isDone = i < currentStepIdx;
          const isActive = i === currentStepIdx;
          return (
            <div key={step.label} className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs transition-all",
                  isDone && "bg-[#7c3aed] text-white",
                  isActive && "bg-[#f1f5f9]",
                  !isDone && !isActive && "bg-[#f1f5f9]"
                )}
              >
                {isDone ? (
                  <Check size={10} />
                ) : isActive ? (
                  <Loader2 size={10} className="animate-spin text-[#7c3aed]" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#cbd5e1]" />
                )}
              </div>
              <span
                className={cn(
                  "text-sm transition-colors",
                  isDone && "text-[#7c3aed] font-medium",
                  isActive && "text-[#0f172a] font-medium",
                  !isDone && !isActive && "text-[#94a3b8]"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-xs">
        <div className="mb-2 flex justify-between text-xs text-[#94a3b8]">
          <span>Generating your clips…</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p className="text-center text-xs text-[#94a3b8]">
        Usually takes 2–5 minutes for longer videos
      </p>
    </div>
  );
}

function ResultsStep({ onClose, onNewVideo }: { onClose: () => void; onNewVideo: () => void }) {
  return (
    <div className="flex flex-col overflow-hidden" style={{ maxHeight: "calc(90vh - 140px)" }}>
      <div className="flex-shrink-0 px-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#0f172a]">6 clips ready</p>
            <p className="text-xs text-[#94a3b8]">Sorted by viral potential</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download size={14} />
              Download all
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 space-y-3 pb-4">
        {MOCK_CLIPS.map((clip) => (
          <div
            key={clip.id}
            className="flex gap-3 rounded-xl border border-[#e2e8f0] p-3 hover:border-[#c7d2fe] hover:bg-[#fafafe] transition-all"
          >
            <div
              className="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-lg flex items-center justify-center"
              style={{ backgroundColor: clip.thumbnail }}
            >
              <Scissors size={14} className="text-white/30" />
              <div className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-[10px] text-white font-medium">
                {clip.duration}
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-between min-w-0">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <Badge variant={clip.score >= 90 ? "violet" : clip.score >= 80 ? "success" : "warning"}>
                    {clip.score}% viral
                  </Badge>
                </div>
                <p className="text-sm font-medium text-[#0f172a] leading-snug truncate">
                  {clip.title}
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Edit
                </Button>
                <Button size="sm" className="h-7 text-xs gap-1">
                  <Download size={11} />
                  Download
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-shrink-0 border-t border-[#e2e8f0] px-6 py-4 flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onNewVideo}>
          New video
        </Button>
        <Button className="flex-1" onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );
}

export function GenerateModal({ open, onClose, videoUrl }: GenerateModalProps) {
  const [step, setStep] = React.useState<Step>("configure");
  const [mode, setMode] = React.useState<Mode>("shorts");
  const [clipLength, setClipLength] = React.useState("auto");
  const [language, setLanguage] = React.useState("id");
  const [captionStyle, setCaptionStyle] = React.useState("bold-yellow");
  const [introTitle, setIntroTitle] = React.useState(true);
  const [captions, setCaptions] = React.useState(true);
  const [aspectRatio, setAspectRatio] = React.useState("9:16");

  const handleClose = () => {
    onClose();
    setTimeout(() => setStep("configure"), 300);
  };

  const handleGenerate = () => setStep("processing");
  const handleProcessingComplete = () => setStep("results");
  const handleNewVideo = () => { handleClose(); };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          style={{ maxHeight: "90vh" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-0">
            <Dialog.Title className="text-base font-semibold text-[#0f172a]">
              {step === "configure" && "Create clips"}
              {step === "processing" && "Generating your clips…"}
              {step === "results" && "Your clips are ready"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          <StepIndicator current={step} />

          {/* Step content */}
          {step === "configure" && (
            <ConfigureStep
              mode={mode} setMode={setMode}
              clipLength={clipLength} setClipLength={setClipLength}
              language={language} setLanguage={setLanguage}
              captionStyle={captionStyle} setCaptionStyle={setCaptionStyle}
              introTitle={introTitle} setIntroTitle={setIntroTitle}
              captions={captions} setCaptions={setCaptions}
              aspectRatio={aspectRatio} setAspectRatio={setAspectRatio}
              onGenerate={handleGenerate}
            />
          )}
          {step === "processing" && (
            <ProcessingStep onComplete={handleProcessingComplete} />
          )}
          {step === "results" && (
            <ResultsStep onClose={handleClose} onNewVideo={handleNewVideo} />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
