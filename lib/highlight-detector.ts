import { type SubtitleSegment } from "./subtitle-parser";

export interface ClipCandidate {
  startTime: number;
  endTime: number;
  score: number;
  title: string;
  transcript: string;
  segments: SubtitleSegment[];
}

const HOOK_WORDS = [
  "why", "how", "what", "secret", "truth", "never", "always",
  "best", "worst", "most", "least", "first", "last", "only",
  "top", "biggest", "key", "real", "actual", "actually",
  "kenapa", "bagaimana", "mengapa", "terbaik", "terburuk",
  "pertama", "terakhir", "rahasia", "fakta", "nyata",
];

const EMOTIONAL_WORDS = [
  "incredible", "amazing", "shocking", "surprising", "important",
  "critical", "essential", "powerful", "changed", "transform",
  "mistake", "wrong", "right", "success", "fail", "win", "lose",
  "luar biasa", "penting", "kritis", "berhasil", "gagal", "sukses",
  "kesalahan", "benar", "salah",
];

function scoreText(text: string, isOpening: boolean): number {
  let score = 0;
  const lower = text.toLowerCase();

  // Hook words in opening
  if (isOpening) {
    if (HOOK_WORDS.some((w) => lower.includes(w))) score += 25;
    if (lower.endsWith("?") || lower.includes("?")) score += 20;
  }

  // Emotional keywords
  EMOTIONAL_WORDS.forEach((w) => {
    if (lower.includes(w)) score += 8;
  });

  // Questions are engaging
  const questions = (text.match(/\?/g) || []).length;
  score += questions * 6;

  // Exclamations signal energy
  const exclamations = (text.match(/!/g) || []).length;
  score += exclamations * 3;

  // Complete sentences (end with . ? !)
  const sentences = text.split(/[.!?]/).filter((s) => s.trim().length > 10);
  score += Math.min(sentences.length * 4, 20);

  return score;
}

function generateTitle(transcript: string): string {
  // Take the first complete sentence as the title
  const sentences = transcript.split(/[.!?]/).map((s) => s.trim()).filter(Boolean);
  if (!sentences.length) return transcript.slice(0, 60);
  const first = sentences[0];
  if (first.length <= 70) return first;
  return first.slice(0, 67) + "…";
}

function removeOverlapping(candidates: ClipCandidate[]): ClipCandidate[] {
  const results: ClipCandidate[] = [];
  for (const c of candidates) {
    const overlaps = results.some(
      (r) => c.startTime < r.endTime && c.endTime > r.startTime
    );
    if (!overlaps) results.push(c);
  }
  return results;
}

function targetDurationSec(clipLength: string): [number, number] {
  switch (clipLength) {
    case "30s": return [20, 40];
    case "60s": return [45, 75];
    case "90s": return [75, 110];
    default: return [25, 75]; // auto
  }
}

export function detectHighlights(
  segments: SubtitleSegment[],
  clipLength: string,
  maxClips = 10
): ClipCandidate[] {
  if (!segments.length) return [];

  const [minDur, maxDur] = targetDurationSec(clipLength);
  const candidates: ClipCandidate[] = [];

  for (let i = 0; i < segments.length; i++) {
    const windowSegs: SubtitleSegment[] = [segments[i]];
    let j = i + 1;

    while (j < segments.length) {
      const dur = segments[j].endTime - segments[i].startTime;
      if (dur > maxDur + 10) break;
      windowSegs.push(segments[j]);
      j++;

      const duration = segments[j - 1].endTime - segments[i].startTime;
      if (duration >= minDur && duration <= maxDur) {
        const transcript = windowSegs.map((s) => s.text).join(" ");
        let score = scoreText(transcript, true);
        score += scoreText(segments[i].text, true); // opening bonus

        // Ideal pacing: 2-4 words/sec
        const words = transcript.split(/\s+/).length;
        const wps = words / duration;
        if (wps >= 2 && wps <= 4) score += 15;
        else if (wps < 1.5 || wps > 5) score -= 10;

        // Prefer clips near start or mid (tend to have best content)
        if (i === 0 || i < segments.length * 0.2) score += 5;

        candidates.push({
          startTime: Math.max(0, segments[i].startTime - 0.5),
          endTime: segments[j - 1].endTime + 0.5,
          score: Math.max(0, Math.min(100, score)),
          title: generateTitle(transcript),
          transcript,
          segments: [...windowSegs],
        });
      }
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  const nonOverlapping = removeOverlapping(candidates);
  return nonOverlapping.slice(0, maxClips);
}

// Fallback: scene-based detection using equal intervals when no transcript
export function detectByInterval(
  durationSec: number,
  clipLength: string,
  maxClips = 8
): ClipCandidate[] {
  const [minDur, maxDur] = targetDurationSec(clipLength);
  const clipDur = Math.min((minDur + maxDur) / 2, 60);
  const clips: ClipCandidate[] = [];

  // Skip first and last 5% of video (usually intro/outro)
  const start = durationSec * 0.05;
  const end = durationSec * 0.95;
  const usable = end - start;

  if (usable <= 0 || clipDur <= 0) return clips;

  const count = Math.min(maxClips, Math.max(1, Math.floor(usable / clipDur)));
  const step = usable / count;

  for (let i = 0; i < count; i++) {
    const clipStart = start + i * step;
    const actualDur = Math.min(clipDur, end - clipStart);
    if (actualDur < 5) continue;
    clips.push({
      startTime: clipStart,
      endTime: clipStart + actualDur,
      score: Math.round(50 + Math.random() * 30),
      title: `Moment ${i + 1}`,
      transcript: "",
      segments: [],
    });
  }

  return clips;
}
