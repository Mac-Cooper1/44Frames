"use client";

import { useMemo, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableClip({ id, widthPx, pxPerSec }: { id: string; widthPx: number; pxPerSec: number }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const { trimIn, trimOut, clips } = useAppStore((s) => ({ trimIn: s.trimIn, trimOut: s.trimOut, clips: s.clips }));
  const clip = clips.find(c => c.id === id);
  const startDragX = useRef<number | null>(null);
  const originalIn = useRef<number>(clip?.in ?? 0);
  const originalOut = useRef<number>(clip?.out ?? 0);
  const draggingEdge = useRef<"in" | "out" | null>(null);

  const onMouseDownEdge = (edge: "in" | "out") => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!clip) return;
    startDragX.current = e.clientX;
    originalIn.current = clip.in;
    originalOut.current = clip.out;
    draggingEdge.current = edge;
    const onMove = (ev: MouseEvent) => {
      if (startDragX.current == null || !draggingEdge.current) return;
      const deltaPx = ev.clientX - startDragX.current;
      const deltaSec = deltaPx / pxPerSec;
      if (draggingEdge.current === "in") {
        trimIn(id, originalIn.current + deltaSec);
      } else {
        trimOut(id, originalOut.current + deltaSec);
      }
    };
    const onUp = () => {
      startDragX.current = null;
      draggingEdge.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: `${Math.max(8, Math.round(widthPx))}px`,
  } as React.CSSProperties;
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="h-5 rounded bg-blue-600 hover:bg-blue-500 cursor-move text-[10px] text-white flex items-center relative">
      <div className="absolute left-0 top-0 h-full w-1.5 bg-blue-400 cursor-ew-resize" onMouseDown={onMouseDownEdge("in")} />
      <div className="mx-2 truncate">{id}</div>
      <div className="absolute right-0 top-0 h-full w-1.5 bg-blue-400 cursor-ew-resize" onMouseDown={onMouseDownEdge("out")} />
    </div>
  );
}

export function Timeline() {
  const { clips, timeline, pxPerSec, seek, playhead, reorderClips, setZoom, getLayout, getDuration, music, setMusic } = useAppStore((s) => ({
    clips: s.clips,
    timeline: s.timeline,
    pxPerSec: s.pxPerSec,
    seek: s.seek,
    playhead: s.playhead,
    reorderClips: s.reorderClips,
    setZoom: s.setZoom,
    getLayout: s.getLayout,
    getDuration: s.getDuration,
    music: s.music,
    setMusic: s.setMusic,
  }));

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const layout = useMemo(() => getLayout(), [clips, timeline, pxPerSec]);
  const duration = useMemo(() => getDuration(), [clips, timeline]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = timeline.map(t => t.id);
    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);
    const newIds = arrayMove(ids, oldIndex, newIndex);
    reorderClips(newIds);
  };

  const onWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      setZoom(Math.max(50, Math.min(400, pxPerSec * factor)));
    }
  };

  const onSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const seconds = x / pxPerSec;
    seek(seconds);
  };

  // Playhead drag support
  const onPlayheadMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const track = e.currentTarget.parentElement as HTMLElement;
    const rect = track.getBoundingClientRect();
    const move = (ev: MouseEvent) => {
      const x = Math.min(Math.max(ev.clientX - rect.left, 0), rect.width);
      seek(x / pxPerSec);
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const rulerMarks = Math.ceil(duration);

  return (
    <div className="h-32 bg-gray-800 border-t border-gray-700 p-3" onWheel={onWheel}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-300">Timeline</span>
        <div className="text-xs text-gray-400">Zoom: {Math.round(pxPerSec)} px/s</div>
      </div>
      <div className="h-5 bg-gray-700 rounded mb-2 relative">
        <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px] text-gray-400">
          {Array.from({ length: rulerMarks + 1 }, (_, i) => (
            <span key={i}>{i}s</span>
          ))}
        </div>
      </div>
      <div ref={containerRef} className="space-y-1">
        <div className="h-6 bg-gray-700 rounded relative cursor-pointer overflow-hidden" onClick={onSeekClick}>
          <div className="absolute top-0 left-0 right-0 h-full flex items-center gap-[2px] px-1">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={timeline.map(t => t.id)} strategy={horizontalListSortingStrategy}>
                {timeline.map((t) => {
                  const item = layout.find(l => l.clipId === t.id);
                  if (!item) return null;
                  return <SortableClip key={t.id} id={t.id} widthPx={item.widthPx} pxPerSec={pxPerSec} />;
                })}
              </SortableContext>
            </DndContext>
          </div>
          <div className="absolute top-0 w-0.5 h-full bg-red-500 cursor-ew-resize" style={{ left: `${playhead * pxPerSec}px` }} onMouseDown={onPlayheadMouseDown} />
        </div>
        <div className="h-6 bg-gray-700 rounded relative">
          <div
            className="absolute inset-0.5 bg-purple-600 rounded opacity-60 cursor-move"
            onMouseDown={(e) => {
              if (!music) return;
              const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
              const startX = e.clientX;
              const startOffset = music.offset || 0;
              const move = (ev: MouseEvent) => {
                const deltaSec = (ev.clientX - startX) / pxPerSec;
                setMusic({ ...music, offset: Math.max(0, startOffset + deltaSec) });
              };
              const up = () => {
                window.removeEventListener("mousemove", move);
                window.removeEventListener("mouseup", up);
              };
              window.addEventListener("mousemove", move);
              window.addEventListener("mouseup", up);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Timeline;

