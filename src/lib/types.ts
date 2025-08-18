export type Photo = {
  id: string;
  src: string;           // /sample-assets/images/...
  orientation: "H" | "V";
  tag: "Interior" | "Exterior";
  room?: string;         // "kitchen", "living_room", etc.
};

export type Listing = {
  id: string;
  source: "zillow" | "redfin" | "agent";
  url?: string;
  address: string;
  city: string;
  state: string;
  photos: Photo[];
};

export type Preset = {
  id: string;
  name: string; // e.g., "Kitchen Slow Dolly"
  angle: "High" | "Eye" | "Low";
  shot: "Dolly" | "Pan" | "Tilt" | "Zoom" | "Parallax" | "Static";
  speed: "Very Slow" | "Slow";
  durationSec: 8 | 10 | 12 | 15;
};

export type ClipStatus = "Queued" | "Running" | "Succeeded" | "NeedsWork" | "Failed";

export type ClipJob = {
  id: string;
  photoId: string;
  presetId: string;
  prompt: string;
  status: ClipStatus;
  startedAt?: number;
  finishedAt?: number;
  outputClipSrc?: string; // /sample-assets/clips/...
  replacesJobId?: string; // for revisions
};

export type ReviewDecision = "Pending" | "Approved" | "Revise" | "Deleted";

export type ClipReview = {
  jobId: string;
  decision: ReviewDecision;
  revisedJobId?: string; // A/B pair
  decidedAt?: number;
};
