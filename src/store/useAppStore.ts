import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Template, Project, Shot, FilterState, ExportSettings } from "@/lib/types";
import type { Clip, TimelineClip, MusicTrack, EditorExportSettings, TimelineLayoutItem } from "@/lib/types";
import { computeTimelineLayout, findClipAtTime, snapTimeMs } from "@/lib/editor/timeline";

type AppState = {
  templates: Template[];
  currentProject?: Project;
  selectedTemplate?: Template;
  filterState: FilterState;
  isTemplateDetailOpen: boolean;
  // Editor state
  clips: Clip[];
  timeline: TimelineClip[];
  music?: MusicTrack;
  playhead: number; // seconds
  isPlaying: boolean;
  pxPerSec: number; // zoom level
  editorExport: EditorExportSettings;
  // Undo/Redo
  _history: Omit<AppState, "_history" | "_future" | keyof Actions> [];
  _future: Omit<AppState, "_history" | "_future" | keyof Actions> [];
  
  // Actions
  setTemplates: (templates: Template[]) => void;
  setCurrentProject: (project: Project) => void;
  setSelectedTemplate: (template: Template) => void;
  openTemplateDetail: () => void;
  closeTemplateDetail: () => void;
  updateFilterState: (filters: Partial<FilterState>) => void;
  createProject: (templateId: string, projectName: string) => void;
  updateShot: (shotId: string, updates: Partial<Shot>) => void;
  selectClip: (shotId: string, clipId: string) => void;
  updateExportSettings: (settings: Partial<ExportSettings>) => void;
  resetProject: () => void;
  // Editor actions
  addClip: (clip: Clip) => void;
  removeClip: (clipId: string) => void;
  reorderClips: (orderedIds: string[]) => void;
  trimIn: (clipId: string, newIn: number) => void;
  trimOut: (clipId: string, newOut: number) => void;
  splitAt: (timeSec: number) => void;
  setMusic: (music: MusicTrack) => void;
  seek: (timeSec: number) => void;
  play: () => void;
  pause: () => void;
  setZoom: (pxPerSec: number) => void;
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  // Selectors/derived
  getLayout: () => TimelineLayoutItem[];
  getDuration: () => number;
};

type Actions = Pick<AppState,
  | "setTemplates" | "setCurrentProject" | "setSelectedTemplate" | "openTemplateDetail" | "closeTemplateDetail"
  | "updateFilterState" | "createProject" | "updateShot" | "selectClip" | "updateExportSettings" | "resetProject"
  | "addClip" | "removeClip" | "reorderClips" | "trimIn" | "trimOut" | "splitAt" | "setMusic"
  | "seek" | "play" | "pause" | "setZoom" | "undo" | "redo" | "getLayout" | "getDuration"
>;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      templates: [],
      currentProject: undefined,
      selectedTemplate: undefined,
      filterState: {
        formats: [],
        styles: [],
        searchQuery: "",
        sortBy: "new"
      },
      isTemplateDetailOpen: false,
      // Editor defaults
      clips: [
        // initial demo clips (placeholder, referencing public sample assets)
        { id: "clip-1", src: "/sample-assets/clips/Start_with_the_202508091432.mp4", duration: 8, in: 0, out: 8 },
        { id: "clip-2", src: "/sample-assets/clips/Start_with_the_202508091454.mp4", duration: 12, in: 0, out: 12 },
        { id: "clip-3", src: "/sample-assets/clips/Start_with_the_202508091527.mp4", duration: 10, in: 0, out: 10 },
      ],
      timeline: [
        { id: "clip-1", start: 0 },
        { id: "clip-2", start: 8 },
        { id: "clip-3", start: 20 },
      ],
      // Use a placeholder path if no music file present; UI remains functional, export will skip music if not found
      music: undefined,
      playhead: 0,
      isPlaying: false,
      pxPerSec: 100, // 100 px per sec default
      editorExport: { width: 1920, height: 1080, fps: 30, bitrateKbps: 8000, format: "mp4" },
      _history: [],
      _future: [],
      
      setTemplates: (templates) => set({ templates }),
      setCurrentProject: (project) => set({ currentProject: project }),
      setSelectedTemplate: (template) => set({ selectedTemplate: template }),
      openTemplateDetail: () => set({ isTemplateDetailOpen: true }),
      closeTemplateDetail: () => set({ isTemplateDetailOpen: false }),
      updateFilterState: (filters) => set({ 
        filterState: { ...get().filterState, ...filters } 
      }),
      createProject: (templateId, projectName) => {
        const template = get().templates.find(t => t.id === templateId);
        if (!template) return;
        
        const project: Project = {
          id: `project-${Date.now()}`,
          name: projectName,
          templateId,
          shots: Array.from({ length: template.shots }, (_, i) => ({
            id: `shot-${i}`,
            templateId,
            order: i,
            cameraMovement: "pan",
            generatedClips: []
          })),
          exportSettings: {
            resolution: "1080p",
            bitrate: "10Mbps",
            codec: "H.264",
            format: "MP4",
            frameRate: "30fps",
            duration: template.duration
          },
          createdAt: Date.now()
        };
        
        set({ currentProject: project });
      },
      updateShot: (shotId, updates) => {
        const project = get().currentProject;
        if (!project) return;
        
        const updatedShots = project.shots.map(shot => 
          shot.id === shotId ? { ...shot, ...updates } : shot
        );
        
        set({ 
          currentProject: { ...project, shots: updatedShots } 
        });
      },
      selectClip: (shotId, clipId) => {
        const project = get().currentProject;
        if (!project) return;
        
        const updatedShots = project.shots.map(shot => {
          if (shot.id === shotId) {
            return {
              ...shot,
              selectedClipId: clipId,
              generatedClips: shot.generatedClips.map(clip => ({
                ...clip,
                isSelected: clip.id === clipId
              }))
            };
          }
          return shot;
        });
        
        set({ 
          currentProject: { ...project, shots: updatedShots } 
        });
      },
      updateExportSettings: (settings) => {
        const project = get().currentProject;
        if (!project) return;
        
        set({ 
          currentProject: { 
            ...project, 
            exportSettings: { ...project.exportSettings, ...settings } 
          } 
        });
      },
      resetProject: () => set({ 
        currentProject: undefined, 
        selectedTemplate: undefined,
        isTemplateDetailOpen: false 
      }),

      // --- Editor actions ---
      addClip: (clip) => {
        const { clips, timeline } = get();
        const lastEnd = timeline.reduce((acc, t) => {
          const c = clips.find(c => c.id === t.id);
          if (!c) return acc;
          const dur = Math.max(0, c.out - c.in);
          return Math.max(acc, t.start + dur);
        }, 0);
        set({
          clips: [...clips, clip],
          timeline: [...timeline, { id: clip.id, start: lastEnd }],
        });
      },
      removeClip: (clipId) => {
        const { clips, timeline } = get();
        const newClips = clips.filter(c => c.id !== clipId);
        const removedStart = timeline.find(t => t.id === clipId)?.start ?? 0;
        const newTimeline = timeline
          .filter(t => t.id !== clipId)
          .map(t => t.start > removedStart ? { ...t, start: Math.max(0, t.start - (clips.find(c => c.id === clipId)?.out! - clips.find(c => c.id === clipId)?.in!)) } : t);
        set({ clips: newClips, timeline: newTimeline });
      },
      reorderClips: (orderedIds) => {
        const { clips } = get();
        let currentStart = 0;
        const newTimeline: TimelineClip[] = orderedIds.map(id => {
          const c = clips.find(c => c.id === id)!;
          const start = currentStart;
          currentStart += Math.max(0, c.out - c.in);
          return { id, start };
        });
        set({ timeline: newTimeline });
      },
      trimIn: (clipId, newIn) => {
        const { clips } = get();
        const snapped = snapTimeMs(newIn, 50) / 1000;
        const newClips = clips.map(c => c.id === clipId ? { ...c, in: Math.min(Math.max(0, snapped), c.out - 0.05) } : c);
        set({ clips: newClips });
      },
      trimOut: (clipId, newOut) => {
        const { clips } = get();
        const snapped = snapTimeMs(newOut, 50) / 1000;
        const newClips = clips.map(c => c.id === clipId ? { ...c, out: Math.max(Math.min(c.duration, snapped), c.in + 0.05) } : c);
        set({ clips: newClips });
      },
      splitAt: (timeSec) => {
        const { clips, timeline } = get();
        const found = findClipAtTime(clips, timeline, timeSec);
        if (!found) return;
        const { clip, localTime, timelineIndex } = found;
        const leftId = `${clip.id}-L-${Date.now()}`;
        const rightId = `${clip.id}-R-${Date.now()}`;
        const leftClip: Clip = { id: leftId, src: clip.src, duration: clip.duration, in: clip.in, out: clip.in + localTime };
        const rightClip: Clip = { id: rightId, src: clip.src, duration: clip.duration, in: clip.in + localTime, out: clip.out };
        const newClips = clips.filter(c => c.id !== clip.id).concat([leftClip, rightClip]);
        // rebuild timeline with left at original start and right after left
        const baseStart = timeline[timelineIndex].start;
        const leftDur = Math.max(0, leftClip.out - leftClip.in);
        const rightStart = baseStart + leftDur;
        const newTimeline: TimelineClip[] = [
          ...timeline.slice(0, timelineIndex).map(t => ({ ...t })),
          { id: leftId, start: baseStart },
          { id: rightId, start: rightStart },
          ...timeline.slice(timelineIndex + 1).map(t => ({ ...t }))
        ];
        set({ clips: newClips, timeline: newTimeline });
      },
      setMusic: (music) => set({ music }),
      seek: (timeSec) => set({ playhead: Math.max(0, timeSec) }),
      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      setZoom: (pxPerSec) => set({ pxPerSec: Math.max(50, Math.min(400, pxPerSec)) }),

      // Undo/Redo - simple snapshot of editor state
      undo: () => {
        const { _history } = get();
        if (_history.length === 0) return;
        const prev = _history[_history.length - 1];
        const rest = _history.slice(0, -1);
        const current: any = get();
        set({ ...current, ...prev, _history: rest, _future: [stripState(current), ...get()._future] });
      },
      redo: () => {
        const { _future } = get();
        if (_future.length === 0) return;
        const next = _future[0];
        const rest = _future.slice(1);
        const current: any = get();
        set({ ...current, ...next, _future: rest, _history: [...get()._history, stripState(current)] });
      },

      // Derived selectors
      getLayout: () => {
        const { clips, timeline, pxPerSec } = get();
        return computeTimelineLayout(clips, timeline, pxPerSec);
      },
      getDuration: () => {
        const { clips, timeline } = get();
        return timeline.reduce((acc, t) => {
          const c = clips.find(c => c.id === t.id);
          if (!c) return acc;
          const dur = Math.max(0, c.out - c.in);
          return Math.max(acc, t.start + dur);
        }, 0);
      },
    }),
    { name: "44frames-app" }
  )
);
<<<<<<< Current (Your changes)
=======

function stripState(state: AppState) {
  // keep only editor state for history
  const keep: Partial<AppState> = {
    clips: state.clips,
    timeline: state.timeline,
    music: state.music,
    playhead: state.playhead,
    isPlaying: state.isPlaying,
    pxPerSec: state.pxPerSec,
    editorExport: state.editorExport,
  };
  return keep as any;
}
>>>>>>> Incoming (Background Agent changes)
