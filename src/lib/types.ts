export type Template = {
  id: string;
  name: string;
  thumbnail: string;
  duration: number; // in seconds
  shots: number;
  format: "16:9" | "9:16" | "1:1" | "4:3";
  style: "Cinematic" | "Documentary" | "Commercial" | "Artistic" | "Corporate";
  credits: number;
  isNew?: boolean;
  isFavorite?: boolean;
  rating?: number;
  usageCount?: number;
};

export type Shot = {
  id: string;
  templateId: string;
  order: number;
  firstFrame?: File;
  lastFrame?: File;
  cameraMovement: "pan" | "dolly" | "orbit" | "truck" | "zoom" | "static";
  generatedClips: GeneratedClip[];
  selectedClipId?: string;
};

export type GeneratedClip = {
  id: string;
  shotId: string;
  previewUrl: string;
  isSelected: boolean;
};

export type Project = {
  id: string;
  name: string;
  templateId: string;
  shots: Shot[];
  exportSettings: ExportSettings;
  createdAt: number;
};

export type ExportSettings = {
  resolution: "1080p" | "4K" | "720p";
  bitrate: "5Mbps" | "10Mbps" | "20Mbps";
  codec: "H.264" | "H.265" | "ProRes";
  format: "MP4" | "MOV" | "AVI";
  frameRate: "24fps" | "30fps" | "60fps";
  duration: number; // in seconds
};

export type FilterState = {
  formats: string[];
  styles: string[];
  searchQuery: string;
  sortBy: "new" | "mostUsed" | "favorites" | "highestRated";
};

// =======================
// Editor-specific types
// =======================

// Avoid name collision with existing ExportSettings used by templates/projects
export type EditorExportSettings = {
  width: number;
  height: number;
  fps: number; // frames per second
  bitrateKbps: number;
  format: "mp4"; // keep demo to mp4
};

export type Clip = {
  id: string;
  src: string; // public path to media
  duration: number; // seconds, source media duration
  in: number; // seconds from start of src
  out: number; // seconds from start of src (out > in)
};

export type TimelineClip = {
  id: string; // references Clip.id
  start: number; // start time in timeline seconds
};

export type MusicTrack = {
  src: string;
  offset: number; // seconds offset into timeline where music starts
  gain: number; // 0..1 linear gain
  duration?: number; // optional detected duration
};

export type TimelineLayoutItem = {
  clipId: string;
  startPx: number;
  widthPx: number;
};
