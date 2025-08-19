"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import LeftPanel from "@/components/editor/LeftPanel";
import Preview from "@/components/editor/Preview";
import Timeline from "@/components/editor/Timeline";
import RightPanel from "@/components/editor/RightPanel";
import Assistant from "@/components/editor/Assistant";
import hotkeys from "hotkeys-js";

export default function VideoEditor() {
  const { currentProject, play, pause, isPlaying, seek, playhead, splitAt, undo, redo } = useAppStore((s) => ({
    currentProject: s.currentProject,
    play: s.play,
    pause: s.pause,
    isPlaying: s.isPlaying,
    seek: s.seek,
    playhead: s.playhead,
    splitAt: s.splitAt,
    undo: s.undo,
    redo: s.redo,
  }));

  useEffect(() => {
    // Ignore hotkeys when typing in inputs/textareas or contenteditable
    hotkeys.filter = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return true;
      const tag = target.tagName;
      const editable = (target as HTMLElement).isContentEditable;
      return !(tag === 'INPUT' || tag === 'TEXTAREA' || editable);
    };
    hotkeys("space", (e) => { e.preventDefault(); isPlaying ? pause() : play(); });
    hotkeys("left", (e) => { e.preventDefault(); seek(Math.max(0, playhead - 1/30)); });
    hotkeys("right", (e) => { e.preventDefault(); seek(playhead + 1/30); });
    hotkeys("s", (e) => { e.preventDefault(); splitAt(playhead); });
    hotkeys("ctrl+z,command+z", (e) => { e.preventDefault(); undo(); });
    hotkeys("shift+ctrl+z,shift+command+z", (e) => { e.preventDefault(); redo(); });
    return () => hotkeys.unbind();
  }, [isPlaying, playhead]);

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Project Found</h1>
          <p className="text-gray-600">Please start by selecting a template and creating a project.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      <div className="bg-gray-800 border-b border-gray-700 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-white font-semibold text-base">{currentProject.name}</h1>
        </div>
        <div className="text-xs text-gray-400">Space: Play/Pause • ←/→: Step • S: Split</div>
      </div>
      <div className="flex-1 flex">
        <LeftPanel />
        <div className="flex-1 bg-black flex flex-col">
          <Preview />
          <Timeline />
        </div>
        <RightPanel />
      </div>
      <Assistant />
    </div>
  );
}
