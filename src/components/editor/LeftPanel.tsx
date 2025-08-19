"use client";

import { useEffect, useMemo, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import WaveSurfer from "wavesurfer.js";

export function LeftPanel() {
  const { clips, timeline, music, setMusic } = useAppStore((s) => ({
    clips: s.clips,
    timeline: s.timeline,
    music: s.music,
    setMusic: s.setMusic,
  }));

  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!waveformRef.current) return;
    if (wavesurfer.current) {
      wavesurfer.current.destroy();
      wavesurfer.current = null;
    }
    if (!music?.src) return;
    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#8b5cf6",
      progressColor: "#a78bfa",
      height: 64,
      interact: false,
      barWidth: 2,
      cursorWidth: 0,
    });
    ws.load(music.src);
    wavesurfer.current = ws;
    return () => { ws.destroy(); };
  }, [music?.src]);

  const totalClips = useMemo(() => clips.length, [clips]);

  return (
    <div className="w-72 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="bg-gray-800 border-b border-gray-700 py-3 px-3">
        <div className="text-white text-base font-semibold">Timeline</div>
      </div>

      <div className="flex-1 p-3 space-y-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Video</span>
            <Badge variant="secondary" className="bg-green-600 text-white text-xs">
              {totalClips} clips
            </Badge>
          </div>
          <div className="space-y-2">
            {timeline.map((t) => {
              const clip = clips.find((c) => c.id === t.id);
              if (!clip) return null;
              const name = clip.src.split("/").pop() || clip.id;
              const dur = Math.max(0, clip.out - clip.in).toFixed(1);
              return (
                <div key={t.id} className="p-2 rounded-lg border-2 border-gray-600 bg-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-7 bg-gray-600 rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge variant="outline" className="text-xs border-gray-500 text-gray-300 px-1 py-0">
                          clip
                        </Badge>
                        <span className="text-xs text-gray-400">{dur}s</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-700 h-px" />

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Audio</span>
            <Badge variant="secondary" className="bg-purple-600 text-white text-xs">Music</Badge>
          </div>
          <div className="p-2 rounded-lg border-2 border-gray-600 bg-gray-700">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-purple-400" />
              <div className="flex-1">
                <p className="text-xs font-medium text-white">Background Music</p>
                <p className="text-xs text-gray-400 break-all">{music?.src?.split("/").pop()}</p>
              </div>
            </div>
            <div className="mt-2">
              <label className="text-[11px] text-gray-300">Choose audio</label>
              <input
                type="file"
                accept="audio/*"
                className="mt-1 block w-full text-[11px] text-gray-200"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const url = URL.createObjectURL(f);
                  setMusic({ src: url, offset: 0, gain: 1, file: f });
                }}
              />
            </div>
            <div className="mt-2">
              <label className="text-[11px] text-gray-300">Choose audio</label>
              <input
                type="file"
                accept="audio/*"
                className="mt-1 block w-full text-[11px] text-gray-200"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const url = URL.createObjectURL(f);
                  setMusic({ src: url, offset: 0, gain: 1, file: f });
                }}
              />
            </div>
            <div ref={waveformRef} className="mt-2 rounded overflow-hidden" />
            <div className="mt-2 flex items-center gap-2">
              <label className="text-xs text-gray-300">Offset</label>
              <input
                type="range"
                min={-10}
                max={10}
                step={0.1}
                value={music?.offset ?? 0}
                onChange={(e) => setMusic({ ...(music || { src: "", offset: 0, gain: 1 }), offset: parseFloat(e.target.value) })}
                className="flex-1"
              />
              <label className="text-xs text-gray-300 ml-2">Gain</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={music?.gain ?? 1}
                onChange={(e) => setMusic({ ...(music || { src: "", offset: 0, gain: 1 }), gain: parseFloat(e.target.value) })}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftPanel;