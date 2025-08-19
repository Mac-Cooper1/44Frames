import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Template, Project, Shot, FilterState, ExportSettings } from "@/lib/types";

type AppState = {
  templates: Template[];
  currentProject?: Project;
  selectedTemplate?: Template;
  filterState: FilterState;
  isTemplateDetailOpen: boolean;
  
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
};

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
      })
    }),
    { name: "44frames-app" }
  )
);
