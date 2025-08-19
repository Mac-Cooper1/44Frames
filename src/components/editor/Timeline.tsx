"use client";

import { useMemo, useRef, useState, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { pxToSec, secToPx, snap } from "@/lib/editor/timeline";

function SortableClip({ id, widthPx }: { id: string; widthPx: number }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: `${Math.max(8, Math.round(widthPx))}px`,
  } as React.CSSProperties;
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="h-5 rounded bg-blue-600 hover:bg-blue-500 cursor-move px-1 text-[10px] text-white flex items-center">
      {id}
    </div>
  );
}

export function Timeline() {
  const { clips, timeline, pxPerSec, seek, playhead, reorderClips, setZoom, getLayout, getDuration } = useAppStore((s) => ({
    clips: s.clips,
    timeline: s.timeline,
    pxPerSec: s.pxPerSec,
    seek: s.seek,
    playhead: s.playhead,
    reorderClips: s.reorderClips,
    setZoom: s.setZoom,
    getLayout: s.getLayout,
    getDuration: s.getDuration,
  }));

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const layout = useMemo(() => getLayout(), [clips, timeline, pxPerSec]);
  const duration = useMemo(() => getDuration(), [clips, timeline]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);

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
    const seconds = pxToSec(x, pxPerSec);
    seek(snap(seconds, 0.05));
  };

  const rulerMarks = Math.ceil(duration);

  const onPlayheadMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingPlayhead(true);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingPlayhead) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const seconds = pxToSec(x, pxPerSec);
    seek(snap(seconds, 0.05));
  }, [isDraggingPlayhead, pxPerSec, seek]);

  const onMouseUp = useCallback(() => {
    if (isDraggingPlayhead) setIsDraggingPlayhead(false);
  }, [isDraggingPlayhead]);

  return (
    <div className="h-32 bg-gray-800 border-t border-gray-700 p-3" onWheel={onWheel}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-300">Timeline</span>
        <div className="text-xs text-gray-400">Zoom: {Math.round(pxPerSec)} px/s</div>
      </div>
      <div className="h-5 bg-gray-700 rounded mb-2 relative select-none">
        <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px] text-gray-400">
          {Array.from({ length: rulerMarks + 1 }, (_, i) => (
            <span key={i}>{i}s</span>
          ))}
        </div>
      </div>
      <div ref={containerRef} className="space-y-1" onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
        <div className="h-6 bg-gray-700 rounded relative cursor-pointer overflow-hidden" onClick={onSeekClick}>
          <div className="absolute top-0 left-0 right-0 h-full flex items-center gap-[2px] px-1">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={timeline.map(t => t.id)} strategy={horizontalListSortingStrategy}>
                {timeline.map((t) => {
                  const item = layout.find(l => l.clipId === t.id);
                  if (!item) return null;
                  return <SortableClip key={t.id} id={t.id} widthPx={item.widthPx} />;
                })}
              </SortableContext>
            </DndContext>
          </div>
          <div
            className="absolute top-0 w-0.5 h-full bg-red-500 cursor-ew-resize"
            style={{ left: `${secToPx(playhead, pxPerSec)}px` }}
            onMouseDown={onPlayheadMouseDown}
          />
        </div>
        <div className="h-6 bg-gray-700 rounded relative">
          <div className="absolute inset-0.5 bg-purple-600 rounded opacity-60" />
        </div>
      </div>
    </div>
  );
}

export default Timeline;

