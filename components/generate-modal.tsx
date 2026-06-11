"use client";

import { CaptionStylePicker } from "@/components/caption-style-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useJobStream } from "@/hooks/use-job-stream";
import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Check,
  ChevronDown,
  Download,
  Globe,
  Loader2,
  Play,
  Scissors,
  Sparkles,
  X,
} from "lucide-react";
import * as React from "react";

type UIStep = "configure" | "processing" | "results";
type Mode = "shorts" | "captions" | "reframe";

export interface GenerateModalProps {
  open: boolean;
  onClose: () => void;
  videoUrl: string;
  uploadedFile?: File | null;
  prefetchedInfo?: { title: string; duration: number; thumbnail: string; channel: string } | null;
}

const STEP_ORDER: UIStep[] = ["configure", "processing", "results"];
const STEP_LABELS: Record<UIStep, string> = {
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

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function StepIndicator({ current }: { current: UIStep }) {
  const currentIdx = STEP_ORDER.indexOf(current);
  return (
    <div className="flex items-center px-6 pt-5 pb-4">
      {STEP_ORDER.map((step, i) => {
        const isDone = i < currentIdx;
        const isActive = i === currentIdx;
        return (
          <React.Fragment key={step}>
            <div className="flex items-center gap-1.5 flex-shrink-0">
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
                  "mx-2 h-px flex-1 min-w-6 transition-colors",
                  i < currentIdx ? "bg-[#7c3aed]" : "bg-[#e2e8f0]"
                )}
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

interface ConfigureStepProps {
  mode: Mode; setMode: (m: Mode) => void;
  clipLength: string; setClipLength: (v: string) => void;
  language: string; setLanguage: (v: string) => void;
  captionStyle: string; setCaptionStyle: (v: string) => void;
  introTitle: boolean; setIntroTitle: (v: boolean) => void;
  captions: boolean; setCaptions: (v: boolean) => void;
  aspectRatio: string; setAspectRatio: (v: string) => void;
  videoInfo: { title: string; duration: number; thumbnail: string } | null;
  isLoadingInfo: boolean;
  onGenerate: () => void;
}

function ConfigureStep({
  mode, setMode,
  clipLength, setClipLength,
  language, setLanguage,
  captionStyle, setCaptionStyle,
  introTitle, setIntroTitle,
  captions, setCaptions,
  aspectRatio, setAspectRatio,
  videoInfo, isLoadingInfo,
  onGenerate,
}: ConfigureStepProps) {
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
            {videoInfo?.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={videoInfo.thumbnail} alt="" className="h-full w-full object-cover" />
            ) : (
              <Scissors size={16} className="text-white/40" />
            )}
            {videoInfo?.duration && (
              <div className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-[10px] text-white font-medium">
                {formatDuration(videoInfo.duration)}
              </div>
            )}
            {isLoadingInfo && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 size={14} className="animate-spin text-white" />
              </div>
            )}
          </div>
          <div>
            {videoInfo ? (
              <>
                <p className="text-sm font-medium text-[#0f172a] line-clamp-2 leading-snug">{videoInfo.title}</p>
                <p className="text-xs text-[#94a3b8] mt-0.5">~10 clips will be generated</p>
              </>
            ) : (
              <p className="text-sm font-medium text-[#0f172a]">
                {isLoadingInfo ? "Fetching video info…" : "Generating ~10 clips"}
              </p>
            )}
            <div className="relative mt-1">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-xs text-[#64748b] hover:text-[#0f172a] transition-colors cursor-pointer"
              >
                <Globe size={12} />
                Source: {LANGUAGE_OPTIONS.find((l) => l.value === language)?.label}
                <ChevronDown size={12} />
              </button>
              {langOpen && (
                <div className="absolute top-full left-0 z-50 mt-1 min-w-36 rounded-xl border border-[#e2e8f0] bg-white shadow-lg py-1">
                  {LANGUAGE_OPTIONS.map((l) => (
                    <button
                      key={l.value}
                      onClick={() => { setLanguage(l.value); setLangOpen(false); }}
                      className={cn(
                        "flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-[#f8fafc] cursor-pointer",
                        language === l.value ? "font-semibold text-[#0f172a]" : "text-[#64748b]"
                      )}
                    >
                      {language === l.value ? <Check size={10} /> : <span className="w-2.5" />}
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Clip length */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#0f172a]">Clip length</span>
          <div className="relative">
            <button
              onClick={() => setLengthOpen(!lengthOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-sm hover:bg-[#f8fafc] transition-colors cursor-pointer"
            >
              {CLIP_LENGTH_OPTIONS.find((o) => o.value === clipLength)?.label}
              <ChevronDown size={14} />
            </button>
            {lengthOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 min-w-28 rounded-xl border border-[#e2e8f0] bg-white shadow-lg py-1">
                {CLIP_LENGTH_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => { setClipLength(o.value); setLengthOpen(false); }}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-[#f8fafc] cursor-pointer",
                      clipLength === o.value ? "font-semibold text-[#0f172a]" : "text-[#64748b]"
                    )}
                  >
                    {clipLength === o.value ? <Check size={12} /> : <span className="w-3" />}
                    {o.label}
                  </button>
                ))}
              </div>
            )}
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
            <ChevronDown size={16} className={cn("transition-transform text-[#94a3b8]", advancedOpen && "rotate-180")} />
          </button>
          {advancedOpen && (
            <div className="border-t border-[#e2e8f0] px-4 py-3 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#0f172a]">Intro title</p>
                  <p className="text-xs text-[#94a3b8]">Generate a TikTok-style intro</p>
                </div>
                <Switch checked={introTitle} onCheckedChange={setIntroTitle} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#0f172a]">Captions</p>
                  <p className="text-xs text-[#94a3b8]">Burn captions into video</p>
                </div>
                <Switch checked={captions} onCheckedChange={setCaptions} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#0f172a]">Aspect ratio</p>
                </div>
                <div className="flex gap-1.5">
                  {["9:16", "1:1", "16:9"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setAspectRatio(r)}
                      className={cn(
                        "rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
                        aspectRatio === r ? "bg-[#0f172a] text-white" : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
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

const PROCESSING_STEP_LABELS = [
  "Fetching video info",
  "Downloading video",
  "Extracting transcript",
  "Finding highlights",
  "Creating clips",
];

function ProcessingStep({ jobId }: { jobId: string | null }) {
  const update = useJobStream(jobId);

  const progress = update?.progress ?? 0;
  const currentStep = update?.currentStep ?? "Starting…";
  const stepIdx = Math.floor((progress / 100) * PROCESSING_STEP_LABELS.length);

  if (update?.status === "error") {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-12 gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
          <X size={24} className="text-red-500" />
        </div>
        <p className="text-base font-semibold text-[#0f172a]">Processing failed</p>
        <p className="text-sm text-[#94a3b8] text-center max-w-xs">{update.error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 gap-7">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="#f1f5f9" strokeWidth="6" />
          <circle
            cx="40" cy="40" r="36"
            fill="none"
            stroke="#7c3aed"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 36}`}
            strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <span className="text-sm font-bold text-[#0f172a]">{Math.round(progress)}%</span>
      </div>

      <div className="w-full max-w-xs space-y-2.5">
        {PROCESSING_STEP_LABELS.map((label, i) => {
          const isDone = i < stepIdx;
          const isActive = i === stepIdx;
          return (
            <div key={label} className="flex items-center gap-3">
              <div className={cn(
                "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full transition-all",
                isDone && "bg-[#7c3aed] text-white",
                isActive && "bg-[#f1f5f9]",
                !isDone && !isActive && "bg-[#f1f5f9]"
              )}>
                {isDone ? <Check size={10} /> : isActive
                  ? <Loader2 size={10} className="animate-spin text-[#7c3aed]" />
                  : <span className="h-1.5 w-1.5 rounded-full bg-[#cbd5e1]" />}
              </div>
              <span className={cn(
                "text-sm",
                isDone && "text-[#7c3aed] font-medium",
                isActive && "text-[#0f172a] font-medium",
                !isDone && !isActive && "text-[#94a3b8]"
              )}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[#94a3b8] text-center">{currentStep}</p>
    </div>
  );
}

interface ResultsStepProps {
  clips: Array<{ id: string; title: string; duration: number; score: number; transcript: string }>;
  onClose: () => void;
  onNewVideo: () => void;
}

function ResultsStep({ clips, onClose, onNewVideo }: ResultsStepProps) {
  const [playing, setPlaying] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col overflow-hidden" style={{ maxHeight: "calc(90vh - 140px)" }}>
      <div className="flex-shrink-0 px-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0f172a]">{clips.length} clips ready</p>
            <p className="text-xs text-[#94a3b8]">Sorted by engagement score</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="#" onClick={(e) => e.preventDefault()}>
              <Download size={14} />
              Download all
            </a>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 space-y-3 pb-4">
        {clips.map((clip) => (
          <div key={clip.id} className="rounded-xl border border-[#e2e8f0] overflow-hidden hover:border-[#c7d2fe] transition-colors">
            {playing === clip.id && (
              <video
                src={`/api/clips/${clip.id}/video`}
                controls
                autoPlay
                className="w-full aspect-video bg-black"
                onEnded={() => setPlaying(null)}
              />
            )}
            <div className="flex gap-3 p-3">
              {playing !== clip.id && (
                <button
                  onClick={() => setPlaying(clip.id)}
                  className="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-[#1e293b] flex items-center justify-center hover:bg-[#334155] transition-colors cursor-pointer group"
                >
                  <Play size={18} className="text-white/60 group-hover:text-white transition-colors" fill="currentColor" />
                  <div className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-[10px] text-white font-medium">
                    {formatDuration(clip.duration)}
                  </div>
                </button>
              )}
              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div>
                  <Badge variant={clip.score >= 70 ? "violet" : clip.score >= 55 ? "success" : "warning"} className="mb-1">
                    {clip.score}% match
                  </Badge>
                  <p className="text-sm font-medium text-[#0f172a] leading-snug line-clamp-2">
                    {clip.title}
                  </p>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setPlaying(playing === clip.id ? null : clip.id)}>
                    {playing === clip.id ? "Stop" : "Preview"}
                  </Button>
                  <Button size="sm" className="h-7 text-xs gap-1" asChild>
                    <a href={`/api/clips/${clip.id}/video`} download={`clip-${clip.id}.mp4`}>
                      <Download size={11} />
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-shrink-0 border-t border-[#e2e8f0] px-6 py-4 flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onNewVideo}>New video</Button>
        <Button className="flex-1" onClick={onClose}>Done</Button>
      </div>
    </div>
  );
}

export function GenerateModal({ open, onClose, videoUrl, uploadedFile, prefetchedInfo }: GenerateModalProps) {
  const [uiStep, setUiStep] = React.useState<UIStep>("configure");
  const [jobId, setJobId] = React.useState<string | null>(null);
  const [mode, setMode] = React.useState<Mode>("shorts");
  const [clipLength, setClipLength] = React.useState("auto");
  const [language, setLanguage] = React.useState("id");
  const [captionStyle, setCaptionStyle] = React.useState("bold-yellow");
  const [introTitle, setIntroTitle] = React.useState(true);
  const [captions, setCaptions] = React.useState(true);
  const [aspectRatio, setAspectRatio] = React.useState("9:16");
  const [videoInfo, setVideoInfo] = React.useState<{ title: string; duration: number; thumbnail: string; channel: string } | null>(null);
  const [isLoadingInfo, setIsLoadingInfo] = React.useState(false);

  const jobUpdate = useJobStream(uiStep === "processing" ? jobId : null);

  // Use prefetched info or fetch when modal opens with a URL
  React.useEffect(() => {
    if (!open) return;
    if (prefetchedInfo) {
      setVideoInfo(prefetchedInfo);
      return;
    }
    if (uploadedFile) {
      setVideoInfo({ title: uploadedFile.name, duration: 0, thumbnail: "", channel: "Uploaded" });
      return;
    }
    if (!videoUrl || videoUrl.startsWith("/") || !videoUrl.startsWith("http")) return;

    setIsLoadingInfo(true);
    fetch(`/api/video-info?url=${encodeURIComponent(videoUrl)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setVideoInfo(data);
      })
      .catch(() => {})
      .finally(() => setIsLoadingInfo(false));
  }, [open, videoUrl, prefetchedInfo, uploadedFile]);

  // Auto-advance to results when processing is done
  React.useEffect(() => {
    if (jobUpdate?.status === "done") {
      setUiStep("results");
    }
  }, [jobUpdate?.status]);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setUiStep("configure");
      setJobId(null);
      setVideoInfo(null);
    }, 300);
  };

  const handleGenerate = async () => {
    const settings = { mode, clipLength, language, captionStyle, introTitle, captions, aspectRatio };
    setUiStep("processing");

    try {
      let resp: Response;
      if (uploadedFile) {
        const form = new FormData();
        form.append("file", uploadedFile);
        form.append("settings", JSON.stringify(settings));
        resp = await fetch("/api/jobs", { method: "POST", body: form });
      } else {
        resp = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: videoUrl, settings }),
        });
      }

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json() as { jobId: string };
      setJobId(data.jobId);
    } catch (err) {
      console.error("Failed to create job:", err);
    }
  };

  const clips = jobUpdate?.clips ?? [];
  const displayVideoInfo = videoInfo ?? (jobUpdate?.videoInfo ?? null);

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          style={{ maxHeight: "90vh" }}
        >
          <div className="flex items-center justify-between px-6 pt-5">
            <Dialog.Title className="text-base font-semibold text-[#0f172a]">
              {uiStep === "configure" && "Create clips"}
              {uiStep === "processing" && "Generating your clips…"}
              {uiStep === "results" && `${clips.length} clips ready`}
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

          <StepIndicator current={uiStep} />

          {uiStep === "configure" && (
            <ConfigureStep
              mode={mode} setMode={setMode}
              clipLength={clipLength} setClipLength={setClipLength}
              language={language} setLanguage={setLanguage}
              captionStyle={captionStyle} setCaptionStyle={setCaptionStyle}
              introTitle={introTitle} setIntroTitle={setIntroTitle}
              captions={captions} setCaptions={setCaptions}
              aspectRatio={aspectRatio} setAspectRatio={setAspectRatio}
              videoInfo={displayVideoInfo}
              isLoadingInfo={isLoadingInfo}
              onGenerate={handleGenerate}
            />
          )}
          {uiStep === "processing" && <ProcessingStep jobId={jobId} />}
          {uiStep === "results" && (
            <ResultsStep clips={clips} onClose={handleClose} onNewVideo={handleClose} />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
