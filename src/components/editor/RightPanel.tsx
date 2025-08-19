"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportTimeline } from "@/lib/editor/exporter";

export function RightPanel() {
  const { clips, timeline, music, editorExport, getDuration } = useAppStore((s) => ({
    clips: s.clips,
    timeline: s.timeline,
    music: s.music,
    editorExport: s.editorExport,
    getDuration: s.getDuration,
  }));
  const setEditorExport = useAppStore((s) => (updates: Partial<typeof s.editorExport>) => s.editorExport = { ...s.editorExport, ...updates } as any);
  const [progress, setProgress] = useState<{ phase: string; percent: number } | null>(null);
  const [downUrl, setDownUrl] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);
  const totalDuration = getDuration();
  const overCap = totalDuration > 60;

  const onExport = async () => {
    setIsExporting(true);
    setDownUrl("");
    try {
      const data = await exportTimeline(clips, timeline, music, editorExport, (p) => {
        setProgress({ phase: p.phase, percent: p.percent });
      });
      const u8 = data as Uint8Array;
      const buffer = new ArrayBuffer(u8.length);
      new Uint8Array(buffer).set(u8);
      const blob = new Blob([buffer], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      setDownUrl(url);
    } catch (e: any) {
      setProgress({ phase: `Error: ${e?.message || e}`, percent: 0 });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-72 bg-gray-800 border-l border-gray-700 flex flex-col">
      <div className="bg-gray-800 border-b border-gray-700 py-3 px-3 text-white font-semibold text-base">Export Settings</div>
      <div className="p-3 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-200 items-center">
          <label>Width</label>
          <input className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs" type="number" value={editorExport.width} onChange={(e) => setEditorExport({ width: parseInt(e.target.value || "0") })} />
          <label>Height</label>
          <input className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs" type="number" value={editorExport.height} onChange={(e) => setEditorExport({ height: parseInt(e.target.value || "0") })} />
          <label>FPS</label>
          <input className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs" type="number" min={1} max={120} value={editorExport.fps} onChange={(e) => setEditorExport({ fps: parseInt(e.target.value || "0") })} />
          <label>Bitrate (kbps)</label>
          <input className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs" type="number" min={100} step={100} value={editorExport.bitrateKbps} onChange={(e) => setEditorExport({ bitrateKbps: parseInt(e.target.value || "0") })} />
          <label>Format</label>
          <select className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs" value={editorExport.format} onChange={(e) => setEditorExport({ format: e.target.value as any })}>
            <option value="mp4">mp4</option>
          </select>
        </div>
        {overCap && (
          <div className="text-xs text-yellow-400">Demo export limited to 60s. Current timeline is {totalDuration.toFixed(1)}s. Trim or split to reduce length.</div>
        )}
        <Button className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2 h-9 text-sm" disabled={isExporting || overCap} onClick={onExport}>
          <Download className="w-4 h-4" />
          {isExporting ? "Exporting..." : "Export MP4"}
        </Button>
        {progress && (
          <div className="space-y-1">
            <div className="text-xs text-gray-300">{progress.phase}</div>
            <div className="w-full h-2 bg-gray-700 rounded overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${progress.percent}%` }} />
            </div>
          </div>
        )}
        {downUrl && (
          <a href={downUrl} download="44frames-export.mp4" className="text-blue-400 text-xs underline">Download file</a>
        )}
      </div>
    </div>
  );
}

export default RightPanel;

