"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, Camera, Play, ArrowRight, Loader2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cameraMovementOptions } from "@/lib/mockData";

export default function ShotSetup() {
  const router = useRouter();
  const { currentProject, updateShot } = useAppStore();
  const [projectName, setProjectName] = useState("");
  const [generatingShots, setGeneratingShots] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (currentProject) {
      setProjectName(currentProject.name);
    }
  }, [currentProject]);

  if (!currentProject) {
    router.push("/");
    return null;
  }

  const handleImageUpload = (shotId: string, type: "firstFrame" | "lastFrame") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        updateShot(shotId, { [type]: file });
      }
    };
    input.click();
  };

  const handleGenerateShot = async (shotId: string) => {
    setGeneratingShots(prev => new Set(prev).add(shotId));
    
    // Simulate AI generation
    setTimeout(() => {
      const mockClips = Array.from({ length: 4 }, (_, i) => ({
        id: `clip-${shotId}-${i}`,
        shotId,
        previewUrl: `/sample-assets/clips/sample-clip-0${i + 1}.mp4`,
        isSelected: false
      }));
      
      updateShot(shotId, { generatedClips: mockClips });
      setGeneratingShots(prev => {
        const newSet = new Set(prev);
        newSet.delete(shotId);
        return newSet;
      });
    }, 2000);
  };

  const handleGenerateAll = async () => {
    const shotIds = currentProject.shots.map(shot => shot.id);
    setGeneratingShots(new Set(shotIds));
    
    // Simulate generating all shots
    setTimeout(() => {
      currentProject.shots.forEach(shot => {
        const mockClips = Array.from({ length: 4 }, (_, i) => ({
          id: `clip-${shot.id}-${i}`,
          shotId: shot.id,
          previewUrl: `/sample-assets/clips/sample-clip-0${i + 1}.mp4`,
          isSelected: false
        }));
        
        updateShot(shot.id, { generatedClips: mockClips });
      });
      
      setGeneratingShots(new Set());
    }, 3000);
  };

  const handleContinue = () => {
    router.push("/review");
  };

  const canContinue = currentProject.shots.every(shot => 
    shot.firstFrame && shot.generatedClips.length > 0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">44 Frames</h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-600 hover:text-gray-900">Templates</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Resources</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Name */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Shot Setup</h2>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Project Name:</label>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name..."
              className="max-w-xs"
            />
          </div>
        </div>

        {/* Generate All Button */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={handleGenerateAll}
            disabled={generatingShots.size > 0}
            className="flex items-center gap-2"
          >
            {generatingShots.size > 0 ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating All...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Generate All
              </>
            )}
          </Button>
        </div>

        {/* Shots */}
        <div className="space-y-6">
          {currentProject.shots.map((shot, index) => (
            <Card key={shot.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Shot {index + 1}</span>
                  <Badge variant="outline">
                    {shot.cameraMovement.charAt(0).toUpperCase() + shot.cameraMovement.slice(1)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* First Frame Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">First Frame</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {shot.firstFrame ? (
                        <div className="space-y-2">
                          <img
                            src={URL.createObjectURL(shot.firstFrame)}
                            alt="First frame"
                            className="w-full h-32 object-cover rounded"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleImageUpload(shot.id, "firstFrame")}
                          >
                            Change
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="cursor-pointer"
                          onClick={() => handleImageUpload(shot.id, "firstFrame")}
                        >
                          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Upload First Frame</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Last Frame Upload (Optional) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Last Frame <span className="text-gray-500">(Optional)</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {shot.lastFrame ? (
                        <div className="space-y-2">
                          <img
                            src={URL.createObjectURL(shot.lastFrame)}
                            alt="Last frame"
                            className="w-full h-32 object-cover rounded"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleImageUpload(shot.id, "lastFrame")}
                          >
                            Change
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="cursor-pointer"
                          onClick={() => handleImageUpload(shot.id, "lastFrame")}
                        >
                          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Upload Last Frame</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Camera Movement Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Camera Movement</label>
                    <Select
                      value={shot.cameraMovement}
                      onValueChange={(value) => updateShot(shot.id, { cameraMovement: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cameraMovementOptions.map((movement) => (
                          <SelectItem key={movement} value={movement}>
                            {movement.charAt(0).toUpperCase() + movement.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="flex justify-between items-center">
                  <Button
                    onClick={() => handleGenerateShot(shot.id)}
                    disabled={!shot.firstFrame || generatingShots.has(shot.id)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {generatingShots.has(shot.id) ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4" />
                        Generate
                      </>
                    )}
                  </Button>

                  {/* Generated Clips Preview */}
                  {shot.generatedClips.length > 0 && (
                    <div className="flex gap-2">
                      {shot.generatedClips.slice(0, 2).map((clip) => (
                        <div
                          key={clip.id}
                          className="w-16 h-16 bg-gray-200 rounded border-2 border-gray-300 flex items-center justify-center"
                        >
                          <Play className="w-6 h-6 text-gray-600" />
                        </div>
                      ))}
                      {shot.generatedClips.length > 2 && (
                        <div className="w-16 h-16 bg-gray-200 rounded border-2 border-gray-300 flex items-center justify-center">
                          <span className="text-sm text-gray-600">+{shot.generatedClips.length - 2}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <div className="flex justify-end mt-8">
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            size="lg"
            className="flex items-center gap-2"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
