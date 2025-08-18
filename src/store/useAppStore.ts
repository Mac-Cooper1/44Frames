import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Listing, Preset, ClipJob, ClipReview, Photo } from "@/lib/types";

type AppState = {
  listing?: Listing;
  uploads: Photo[];                    // photos added via upload
  selectedPhotoIds: string[];
  presets: Preset[];
  jobs: ClipJob[];                     // all jobs ever created
  reviews: Record<string, ClipReview>; // keyed by jobId
  setListing: (l: Listing) => void;
  addUploads: (p: Photo[]) => void;
  setSelected: (ids: string[]) => void;
  upsertPreset: (p: Preset) => void;
  enqueueJobs: (jobs: ClipJob[]) => void;
  updateJob: (job: ClipJob) => void;
  setReview: (r: ClipReview) => void;
  resetDemo: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      listing: undefined,
      uploads: [],
      selectedPhotoIds: [],
      presets: [],
      jobs: [],
      reviews: {},
      setListing: (l) => set({ listing: l }),
      addUploads: (p) => set({ uploads: [...get().uploads, ...p] }),
      setSelected: (ids) => set({ selectedPhotoIds: ids }),
      upsertPreset: (p) =>
        set({ presets: [...get().presets.filter(x => x.id !== p.id), p] }),
      enqueueJobs: (newJobs) => set({ jobs: [...get().jobs, ...newJobs] }),
      updateJob: (job) =>
        set({ jobs: get().jobs.map(j => (j.id === job.id ? job : j)) }),
      setReview: (r) => set({ reviews: { ...get().reviews, [r.jobId]: r } }),
      resetDemo: () =>
        set({
          listing: undefined,
          uploads: [],
          selectedPhotoIds: [],
          jobs: [],
          reviews: {},
        }),
    }),
    { name: "demo-app" }
  )
);
