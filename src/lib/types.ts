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
