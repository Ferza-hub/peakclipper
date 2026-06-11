"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, MoreHorizontal, Play, Scissors } from "lucide-react";

export interface VideoProject {
  id: string;
  title: string;
  url: string;
  clipCount: number;
  duration: string;
  createdAt: string;
  thumbnailColor: string;
  status: "done" | "processing" | "failed";
}

interface VideoCardProps {
  project: VideoProject;
  onOpen: (id: string) => void;
}

export function VideoCard({ project, onOpen }: VideoCardProps) {
  return (
    <div
      className="group relative flex gap-4 rounded-xl border border-[#e2e8f0] bg-white p-4 hover:border-[#c7d2fe] hover:shadow-sm transition-all cursor-pointer"
      onClick={() => onOpen(project.id)}
    >
      <div
        className="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-lg flex items-center justify-center"
        style={{ backgroundColor: project.thumbnailColor }}
      >
        <Play size={18} className="text-white/50" fill="rgba(255,255,255,0.5)" />
        <div className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-[10px] text-white font-medium">
          {project.duration}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <p className="text-sm font-semibold text-[#0f172a] leading-snug line-clamp-2">
            {project.title}
          </p>
          <p className="mt-0.5 text-xs text-[#94a3b8]">{project.createdAt}</p>
        </div>
        <div className="flex items-center gap-2 mt-2">
          {project.status === "done" && (
            <Badge variant="success">
              <Scissors size={9} className="mr-1" />
              {project.clipCount} clips
            </Badge>
          )}
          {project.status === "processing" && (
            <Badge variant="warning">Processing…</Badge>
          )}
          {project.status === "failed" && (
            <Badge variant="default">Failed</Badge>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end justify-between flex-shrink-0">
        <button
          className="opacity-0 group-hover:opacity-100 flex h-7 w-7 items-center justify-center rounded-full hover:bg-[#f1f5f9] text-[#94a3b8] hover:text-[#0f172a] transition-all cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal size={14} />
        </button>
        {project.status === "done" && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.stopPropagation(); }}
          >
            <Download size={11} />
            Export
          </Button>
        )}
      </div>
    </div>
  );
}
