"use client";

import { useRouter } from "next/navigation";
import { Check, ArrowRight, Play } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ClipSelection() {
  const router = useRouter();
  const { currentProject, selectClip } = useAppStore();

  if (!currentProject) {
    router.push("/");
    return null;
  }

  const handleClipSelect = (shotId: string, clipId: string) => {
    selectClip(shotId, clipId);
  };

  const handleContinue = () => {
    router.push("/export");
  };

  const canContinue = currentProject.shots.every(shot => shot.selectedClipId);

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Select the best clips</h2>
          <p className="text-gray-600">Choose your favorite clip for each shot to create the final video</p>
        </div>

        {/* Shots */}
        <div className="space-y-8">
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {shot.generatedClips.map((clip) => (
                    <div
                      key={clip.id}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        clip.isSelected
                          ? "border-green-500 ring-2 ring-green-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleClipSelect(shot.id, clip.id)}
                    >
                      {/* Video Preview Placeholder */}
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        <Play className="w-8 h-8 text-gray-400" />
                      </div>
                      
                      {/* Selection Indicator */}
                      {clip.isSelected && (
                        <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      {/* Clip Info */}
                      <div className="p-2 bg-white">
                        <p className="text-xs text-gray-600 text-center">
                          Clip {clip.id.split('-').pop()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Selection Status */}
                {shot.selectedClipId && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center text-green-800">
                      <Check className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">
                        Clip selected for Shot {index + 1}
                      </span>
                    </div>
                  </div>
                )}
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
            Continue to Editor
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
