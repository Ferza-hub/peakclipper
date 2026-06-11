export interface SubtitleSegment {
  startTime: number; // seconds
  endTime: number;
  text: string;
}

function parseTimestamp(ts: string): number {
  // Handles HH:MM:SS.mmm and MM:SS.mmm and HH:MM:SS,mmm (SRT)
  const clean = ts.replace(",", ".");
  const parts = clean.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return parts[0] * 60 + parts[1];
}

export function parseVTT(content: string): SubtitleSegment[] {
  const segments: SubtitleSegment[] = [];
  const blocks = content.split(/\n\n+/);

  for (const block of blocks) {
    const lines = block.trim().split("\n");
    if (lines.length < 2) continue;

    // Find the timestamp line
    const tsLine = lines.find((l) => l.includes("-->"));
    if (!tsLine) continue;

    const match = tsLine.match(
      /([\d:.,]+)\s*-->\s*([\d:.,]+)/
    );
    if (!match) continue;

    const startTime = parseTimestamp(match[1]);
    const endTime = parseTimestamp(match[2]);
    const tsIndex = lines.indexOf(tsLine);
    const textLines = lines.slice(tsIndex + 1).filter((l) => l.trim());
    const text = textLines
      .join(" ")
      .replace(/<[^>]+>/g, "") // strip HTML tags
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim();

    if (text && endTime > startTime) {
      segments.push({ startTime, endTime, text });
    }
  }

  return segments;
}

export function parseSRT(content: string): SubtitleSegment[] {
  // SRT format is similar to VTT - reuse the same parser after cleanup
  const vttLike = content
    .replace(/^\d+\s*$/gm, "") // remove sequence numbers
    .replace(/,/g, "."); // SRT uses commas in timestamps
  return parseVTT(vttLike);
}

export function mergeShortSegments(
  segments: SubtitleSegment[],
  minDuration = 1.5
): SubtitleSegment[] {
  const merged: SubtitleSegment[] = [];
  let current: SubtitleSegment | null = null;

  for (const seg of segments) {
    if (!current) {
      current = { ...seg };
      continue;
    }

    const duration = current.endTime - current.startTime;
    const gap = seg.startTime - current.endTime;

    if (duration < minDuration && gap < 0.5) {
      current.text += " " + seg.text;
      current.endTime = seg.endTime;
    } else {
      merged.push(current);
      current = { ...seg };
    }
  }

  if (current) merged.push(current);
  return merged;
}
