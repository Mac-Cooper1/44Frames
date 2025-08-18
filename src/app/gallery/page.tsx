"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Settings, Play } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { GalleryGrid } from "@/components/GalleryGrid";
import { TopNav } from "@/components/TopNav";

export default function GalleryPage() {
  const router = useRouter();
  const { listing, uploads, selectedPhotoIds } = useAppStore();
  
  const allPhotos = [...(listing?.photos || []), ...uploads];
  
  useEffect(() => {
    if (allPhotos.length === 0) {
      router.push("/");
    }
  }, [allPhotos.length, router]);
  
  const handleApplyPreset = () => {
    if (selectedPhotoIds.length > 0) {
      router.push("/prompt");
    }
  };
  
  const handleOpenPromptComposer = () => {
    if (selectedPhotoIds.length > 0) {
      router.push("/prompt");
    }
  };
  
  if (allPhotos.length === 0) {
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
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div>
              <h1 className="text-3xl font-bold">Photo Gallery</h1>
              {listing && (
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline">{listing.source}</Badge>
                  <span className="text-muted-foreground">
                    {listing.address}, {listing.city}, {listing.state}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="secondary">
              {allPhotos.length} photo{allPhotos.length !== 1 ? "s" : ""}
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
        
        {/* Gallery Grid */}
        <GalleryGrid />
        
        {/* Floating Action Bar */}
        {selectedPhotoIds.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-background border rounded-lg shadow-lg px-6 py-4 z-50">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Play className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  {selectedPhotoIds.length} photo{selectedPhotoIds.length !== 1 ? "s" : ""} selected
                </span>
              </div>
              
              <Button
                size="sm"
                onClick={handleApplyPreset}
                className="bg-primary hover:bg-primary/90"
              >
                Apply Preset
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleOpenPromptComposer}
              >
                Open Prompt Composer
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
