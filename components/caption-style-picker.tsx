"use client";

import { cn } from "@/lib/utils";

export interface CaptionStyle {
  id: string;
  name: string;
  preview: React.ReactNode;
}

const CAPTION_STYLES: CaptionStyle[] = [
  {
    id: "bold-yellow",
    name: "Bold Yellow",
    preview: (
      <div className="flex h-full w-full items-center justify-center bg-[#111] rounded-md overflow-hidden p-1">
        <span className="text-[10px] font-black uppercase leading-tight text-center" style={{ color: "#fff", textShadow: "0 0 0 2px #000" }}>
          <span className="bg-yellow-400 text-black px-0.5">THE</span>{" "}
          <span className="bg-yellow-400 text-black px-0.5">QUICK</span>
          <br />
          <span className="text-yellow-400">BROWN FOX</span>
        </span>
      </div>
    ),
  },
  {
    id: "minimal",
    name: "Minimal",
    preview: (
      <div className="flex h-full w-full items-center justify-center bg-white rounded-md overflow-hidden border border-gray-100">
        <span className="text-[10px] text-gray-800 font-medium text-center leading-tight">
          The quick<br />brown fox
        </span>
      </div>
    ),
  },
  {
    id: "red-highlight",
    name: "Red Highlight",
    preview: (
      <div className="flex h-full w-full items-center justify-center bg-white rounded-md overflow-hidden border border-gray-100">
        <span className="text-[9px] font-black uppercase text-center leading-tight">
          <span className="text-gray-900">THE </span>
          <span className="bg-red-500 text-white px-0.5">QUICK</span>
          <br />
          <span className="bg-red-500 text-white px-0.5">BROWN</span>
          <span className="text-gray-900"> FOX</span>
        </span>
      </div>
    ),
  },
  {
    id: "dark-glass",
    name: "Dark Glass",
    preview: (
      <div className="flex h-full w-full items-center justify-center bg-[#111] rounded-md overflow-hidden">
        <span className="text-[10px] font-semibold text-center leading-tight bg-black/60 px-1.5 py-0.5 rounded">
          <span className="text-white">The quick</span>
          <br />
          <span className="text-white/70 text-[9px]">brown fox</span>
        </span>
      </div>
    ),
  },
  {
    id: "white-box",
    name: "White Box",
    preview: (
      <div className="flex h-full w-full items-center justify-center bg-[#1a1a2e] rounded-md overflow-hidden">
        <div className="bg-white rounded px-2 py-1">
          <span className="text-[9px] font-semibold text-gray-900 text-center block leading-tight">
            The quick<br /><span className="text-violet-600">brown fox</span>
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "neon",
    name: "Neon",
    preview: (
      <div className="flex h-full w-full items-center justify-center bg-[#0a0a0a] rounded-md overflow-hidden">
        <span className="text-[10px] font-black text-center uppercase leading-tight">
          <span className="text-[#a78bfa]">THE </span>
          <span className="text-[#34d399]">QUICK</span>
          <br />
          <span className="text-white">BROWN</span>
          <span className="text-[#f59e0b]"> FOX</span>
        </span>
      </div>
    ),
  },
  {
    id: "outline",
    name: "Outline",
    preview: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-400 to-indigo-500 rounded-md overflow-hidden">
        <span
          className="text-[10px] font-black uppercase text-center leading-tight text-white"
          style={{ WebkitTextStroke: "0.5px #000" }}
        >
          The quick<br />brown fox
        </span>
      </div>
    ),
  },
  {
    id: "fire",
    name: "Fire",
    preview: (
      <div className="flex h-full w-full items-center justify-center bg-[#111] rounded-md overflow-hidden p-1">
        <div className="text-center">
          <span className="text-[8px] mr-0.5">⚡</span>
          <span className="text-[9px] font-black uppercase">
            <span className="text-white">THE </span>
            <span className="text-red-400">QUICK</span>
            <br />
            <span className="text-orange-400">BROWN</span>
            <span className="text-yellow-400"> FOX</span>
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "gradient-text",
    name: "Gradient",
    preview: (
      <div className="flex h-full w-full items-center justify-center bg-white rounded-md overflow-hidden border border-gray-100">
        <span
          className="text-[10px] font-black text-center uppercase leading-tight"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          The quick<br />brown fox
        </span>
      </div>
    ),
  },
];

interface CaptionStylePickerProps {
  selected: string;
  onChange: (id: string) => void;
}

export function CaptionStylePicker({ selected, onChange }: CaptionStylePickerProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {CAPTION_STYLES.map((style) => (
        <button
          key={style.id}
          onClick={() => onChange(style.id)}
          className={cn(
            "relative h-16 rounded-xl overflow-hidden transition-all cursor-pointer",
            "ring-2 ring-offset-1",
            selected === style.id
              ? "ring-[#7c3aed] shadow-md shadow-violet-100"
              : "ring-transparent hover:ring-gray-200"
          )}
        >
          {style.preview}
          {selected === style.id && (
            <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-[#7c3aed] flex items-center justify-center">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

export { CAPTION_STYLES };
