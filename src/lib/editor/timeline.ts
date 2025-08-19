import type { Clip, TimelineClip, TimelineLayoutItem } from "@/lib/types";

export function computeTimelineLayout(clips: Clip[], timeline: TimelineClip[], pxPerSec: number): TimelineLayoutItem[] {
  return timeline.map((item) => {
    const clip = clips.find((c) => c.id === item.id);
    if (!clip) return { clipId: item.id, startPx: 0, widthPx: 0 };
    const visibleDuration = Math.max(0, clip.out - clip.in);
    return {
      clipId: item.id,
      startPx: item.start * pxPerSec,
      widthPx: visibleDuration * pxPerSec,
    };
  });
}

export function findClipAtTime(
  clips: Clip[],
  timeline: TimelineClip[],
  timeSec: number
): { clip: Clip; localTime: number; timelineIndex: number } | null {
  for (let i = 0; i < timeline.length; i++) {
    const t = timeline[i];
    const clip = clips.find((c) => c.id === t.id);
    if (!clip) continue;
    const dur = Math.max(0, clip.out - clip.in);
    if (timeSec >= t.start && timeSec < t.start + dur) {
      const localTime = timeSec - t.start;
      return { clip, localTime, timelineIndex: i };
    }
  }
  return null;
}

export function snapTimeMs(timeSec: number, stepMs: number): number {
  const ms = timeSec * 1000;
  const snapped = Math.round(ms / stepMs) * stepMs;
  return snapped;
}

export function totalDurationSec(clips: Clip[], timeline: TimelineClip[]): number {
  return timeline.reduce((acc, t) => {
    const c = clips.find((c) => c.id === t.id);
    if (!c) return acc;
    const dur = Math.max(0, c.out - c.in);
    return Math.max(acc, t.start + dur);
  }, 0);
}

