"use client";

import { useEffect, useMemo, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { findClipAtTime } from "@/lib/editor/timeline";

export function Preview() {
  const { clips, timeline, music, playhead, isPlaying, seek, play, pause } = useAppStore((s) => ({
    clips: s.clips,
    timeline: s.timeline,
    music: s.music,
    playhead: s.playhead,
    isPlaying: s.isPlaying,
    seek: s.seek,
    play: s.play,
    pause: s.pause,
  }));

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const active = useMemo(() => findClipAtTime(clips, timeline, playhead), [clips, timeline, playhead]);
  const lastClipIdRef = useRef<string | null>(null);

  // Update video src only when clip changes; seek only when needed
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !active) return;
    const currentClipId = active.clip.id;
    if (lastClipIdRef.current !== currentClipId) {
      lastClipIdRef.current = currentClipId;
      v.src = active.clip.src;
    }
    const desired = active.localTime + active.clip.in;
    if (Math.abs(v.currentTime - desired) > 0.03) {
      v.currentTime = Math.max(0, desired);
    }
  }, [active?.clip.id, active?.clip.src, active?.localTime, active?.clip.in]);

  // Sync audio element more loosely to avoid stutters
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !music) return;
    if (!a.src.endsWith(music.src)) {
      a.src = music.src;
    }
    const t = Math.max(0, playhead - (music.offset || 0));
    if (Math.abs(a.currentTime - t) > 0.05) {
      a.currentTime = t;
    }
  }, [music?.src, music?.offset, playhead]);

  // Play/pause synchronization
  useEffect(() => {
    const v = videoRef.current;
    const a = audioRef.current;
    if (!v) return;
    if (isPlaying) {
      v.play().catch(() => {});
      if (a) a.play().catch(() => {});
    } else {
      v.pause();
      if (a) a.pause();
    }
  }, [isPlaying]);

  // Reflect time updates back to store
  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !active) return;
    const total = timeline[active.timelineIndex].start + (v.currentTime - active.clip.in);
    seek(total);
  };

  return (
    <div className="flex-1 bg-black flex flex-col">
      <div className="flex-1 flex items-center justify-center relative p-4">
        <div className="w-full max-w-5xl aspect-video bg-gray-800 rounded-lg overflow-hidden relative">
          <video ref={videoRef} className="w-full h-full object-cover rounded-lg" muted={false} onTimeUpdate={onTimeUpdate} />
          <audio ref={audioRef} hidden />
          {/* Simple overlay */}
          {active && (
            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {active.clip.src.split("/").pop()} • t={playhead.toFixed(2)}s
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Preview;

