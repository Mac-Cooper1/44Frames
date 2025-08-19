"use client";

import { useEffect, useMemo, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { findClipAtTime } from "@/lib/editor/timeline";

function Preview() {
  const { clips, timeline, music, playhead, isPlaying, seek } = useAppStore((s) => ({
    clips: s.clips,
    timeline: s.timeline,
    music: s.music,
    playhead: s.playhead,
    isPlaying: s.isPlaying,
    seek: s.seek,
  }));

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const active = useMemo(() => findClipAtTime(clips, timeline, playhead), [clips, timeline, playhead]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !active) return;
    const src = active.clip.src;
    if (!v.src.endsWith(src)) {
      v.src = src;
    }
    const local = active.localTime + active.clip.in;
    v.currentTime = Math.max(0, local);
  }, [active?.clip.src, active?.localTime, active?.clip.in]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a || !music) return;
    if (!a.src.endsWith(music.src)) {
      a.src = music.src;
    }
    const t = Math.max(0, playhead - (music.offset || 0));
    a.currentTime = t;
  }, [music?.src, music?.offset, playhead]);

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

