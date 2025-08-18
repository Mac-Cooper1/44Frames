"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { PresetPanel } from "@/components/PresetPanel";
import { TopNav } from "@/components/TopNav";
import { jobEngine } from "@/lib/jobEngine";
import { toast } from "sonner";

export default function PromptPage() {
  const router = useRouter();
  const { listing, uploads, selectedPhotoIds, enqueueJobs } = useAppStore();
  
  const allPhotos = [...(listing?.photos || []), ...uploads];
  const selectedPhotos = allPhotos.filter(photo => 
    selectedPhotoIds.includes(photo.id)
  );
  
  useEffect(() => {
    if (selectedPhotoIds.length === 0) {
      router.push("/gallery");
    }
  }, [selectedPhotoIds.length, router]);
  
  const handleGenerate = (jobs: any[]) => {
    if (jobs.length === 0) return;
    
    // Add jobs to store
    enqueueJobs(jobs);
    
    // Start the job engine
    jobEngine.startEngine((updatedJob) => {
      // This callback will be called when job status changes
      // In a real app, you'd update the store here
      console.log("Job updated:", updatedJob);
    });
    
    // Enqueue jobs
    jobEngine.enqueue(jobs);
    
    toast.success(`Queued ${jobs.length} clip${jobs.length !== 1 ? "s" : ""} for generation`);
    router.push("/generate");
  };
  
  if (selectedPhotoIds.length === 0) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/gallery")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Gallery
            </Button>
            
            <div>
              <h1 className="text-3xl font-bold">Prompt Composer</h1>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary">
                  {selectedPhotoIds.length} photo{selectedPhotoIds.length !== 1 ? "s" : ""} selected
                </Badge>
                <span className="text-muted-foreground">
                  Choose presets and customize prompts
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-muted-foreground">AI-Powered</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <PresetPanel
              selectedPhotos={selectedPhotos}
              onGenerate={handleGenerate}
            />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Photos Summary */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Selected Photos</h3>
              <div className="space-y-2">
                {selectedPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="flex items-center space-x-3 p-2 bg-background rounded"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">
                        {photo.room?.slice(0, 1) || photo.tag.slice(0, 1)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {photo.room ? photo.room.replace("_", " ") : photo.tag}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {photo.orientation} • {photo.tag}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Choose presets based on room type</li>
                <li>• Interior shots work best with slow movements</li>
                <li>• Exterior shots benefit from wide pans</li>
                <li>• Customize prompts for specific details</li>
              </ul>
            </div>
            
            {/* Preset Info */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">About Presets</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  Our presets are optimized for real estate photography, 
                  combining cinematic movement with professional aesthetics.
                </p>
                <p>
                  Each preset includes angle, shot type, motion speed, 
                  and duration settings for consistent results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
