"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportTimeline } from "@/lib/editor/exporter";

export function RightPanel() {
  const { clips, timeline, music, editorExport } = useAppStore((s) => ({
    clips: s.clips,
    timeline: s.timeline,
    music: s.music,
    editorExport: s.editorExport,
  }));
  const [progress, setProgress] = useState<string>("");
  const [downUrl, setDownUrl] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);

  const onExport = async () => {
    setIsExporting(true);
    setDownUrl("");
    try {
      const data = await exportTimeline(clips, timeline, music, editorExport, (p) => {
        setProgress(`${p.phase} ${p.percent}%`);
      });
      const u8 = data as Uint8Array;
      const buffer = new ArrayBuffer(u8.length);
      new Uint8Array(buffer).set(u8);
      const blob = new Blob([buffer], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      setDownUrl(url);
    } catch (e: any) {
      setProgress(`Error: ${e?.message || e}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-72 bg-gray-800 border-l border-gray-700 flex flex-col">
      <div className="bg-gray-800 border-b border-gray-700 py-3 px-3 text-white font-semibold text-base">Export Settings</div>
      <div className="p-3 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-200">
          <label>Resolution</label>
          <div>{editorExport.width}x{editorExport.height}</div>
          <label>FPS</label>
          <div>{editorExport.fps}</div>
          <label>Bitrate</label>
          <div>{editorExport.bitrateKbps} kbps</div>
          <label>Format</label>
          <div>{editorExport.format}</div>
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2 h-9 text-sm" disabled={isExporting} onClick={onExport}>
          <Download className="w-4 h-4" />
          {isExporting ? "Exporting..." : "Export MP4"}
        </Button>
        {progress && <div className="text-xs text-gray-300">{progress}</div>}
        {downUrl && (
          <a href={downUrl} download="44frames-export.mp4" className="text-blue-400 text-xs underline">Download file</a>
        )}
      </div>
    </div>
  );
}

export default RightPanel;

