"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store/useAppStore";
import { buildPrompt, variation, diffPrompts } from "@/lib/promptBuilder";
import type { Photo, Preset } from "@/lib/types";

interface PresetPanelProps {
  selectedPhotos: Photo[];
  onGenerate: (jobs: any[]) => void;
}

export function PresetPanel({ selectedPhotos, onGenerate }: PresetPanelProps) {
  const { presets, upsertPreset } = useAppStore();
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [promptVariations, setPromptVariations] = useState<string[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<number>(-1);
  
  const samplePresets = [
    {
      id: "preset-1",
      name: "Kitchen Slow Dolly",
      angle: "Eye" as const,
      shot: "Dolly" as const,
      speed: "Slow" as const,
      durationSec: 10 as const,
    },
    {
      id: "preset-2",
      name: "Living Room High Pan",
      angle: "High" as const,
      shot: "Pan" as const,
      speed: "Very Slow" as const,
      durationSec: 12 as const,
    },
    {
      id: "preset-3",
      name: "Bedroom Eye Zoom",
      angle: "Eye" as const,
      shot: "Zoom" as const,
      speed: "Slow" as const,
      durationSec: 8 as const,
    },
  ];
  
  const handlePresetSelect = (preset: Preset) => {
    setSelectedPreset(preset);
    if (selectedPhotos.length > 0) {
      const prompt = buildPrompt(selectedPhotos[0], preset);
      setCustomPrompt(prompt);
      setPromptVariations([]);
      setSelectedVariation(-1);
    }
  };
  
  const handleGenerateVariations = () => {
    if (customPrompt) {
      const variations = variation(customPrompt, 3);
      setPromptVariations(variations);
    }
  };
  
  const handleVariationSelect = (index: number) => {
    setSelectedVariation(index);
    if (index >= 0 && promptVariations[index]) {
      setCustomPrompt(promptVariations[index]);
    }
  };
  
  const handleSavePreset = () => {
    if (selectedPreset && customPrompt) {
      const newPreset: Preset = {
        ...selectedPreset,
        id: `custom-${Date.now()}`,
        name: `Custom ${selectedPreset.name}`,
      };
      upsertPreset(newPreset);
    }
  };
  
  const handleGenerate = () => {
    if (!selectedPreset || selectedPhotos.length === 0) return;
    
    // Create jobs for each selected photo
    const jobs = selectedPhotos.map(photo => ({
      id: `job-${Date.now()}-${photo.id}`,
      photoId: photo.id,
      presetId: selectedPreset.id,
      prompt: customPrompt || buildPrompt(photo, selectedPreset),
      status: "Queued" as const,
    }));
    
    onGenerate(jobs);
  };
  
  const currentPrompt = customPrompt || (selectedPreset && selectedPhotos[0] 
    ? buildPrompt(selectedPhotos[0], selectedPreset) 
    : "");
  
  return (
    <div className="space-y-6">
      {/* Preset Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Choose a Preset</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {samplePresets.map((preset) => (
            <Card
              key={preset.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedPreset?.id === preset.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handlePresetSelect(preset)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{preset.name}</CardTitle>
                <CardDescription>
                  {preset.angle} angle • {preset.shot} • {preset.speed} • {preset.durationSec}s
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{preset.angle}</Badge>
                  <Badge variant="secondary">{preset.shot}</Badge>
                  <Badge variant="secondary">{preset.speed}</Badge>
                  <Badge variant="outline">{preset.durationSec}s</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Prompt Builder */}
      {selectedPreset && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Prompt Builder</h3>
          
          <div className="space-y-3">
            <label className="text-sm font-medium">Suggested Prompt</label>
            <Textarea
              value={currentPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Customize the prompt..."
              className="min-h-[100px]"
            />
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateVariations}
                disabled={!customPrompt}
              >
                Generate Variations (1-3)
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleSavePreset}
                disabled={!selectedPreset || !customPrompt}
              >
                Save as Preset
              </Button>
            </div>
          </div>
          
          {/* Variations */}
          {promptVariations.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Variations</label>
              <div className="space-y-2">
                {promptVariations.map((variation, index) => {
                  const diff = diffPrompts(currentPrompt, variation);
                  return (
                    <Card
                      key={index}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedVariation === index ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => handleVariationSelect(index)}
                    >
                      <CardContent className="pt-4">
                        <div className="text-sm">
                          {diff.map((part, i) => (
                            <span
                              key={i}
                              className={
                                part.added
                                  ? "bg-green-100 text-green-800 px-1 rounded"
                                  : part.removed
                                  ? "bg-red-100 text-red-800 px-1 rounded line-through"
                                  : ""
                              }
                            >
                              {part.same || part.added || part.removed}{" "}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Generate Button */}
      {selectedPreset && selectedPhotos.length > 0 && (
        <div className="pt-6 border-t">
          <Button
            onClick={handleGenerate}
            className="w-full"
            size="lg"
          >
            Generate {selectedPhotos.length} Clip{selectedPhotos.length !== 1 ? "s" : ""}
          </Button>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Using preset: {selectedPreset.name}
          </p>
        </div>
      )}
    </div>
  );
}
