"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppStore } from "@/store/useAppStore";
import type { Photo } from "@/lib/types";
import { ImageDrawer } from "./ImageDrawer";

type FilterType = "all" | "interior" | "exterior";
type OrientationType = "all" | "H" | "V";

export function GalleryGrid() {
  const { listing, uploads, selectedPhotoIds, setSelected } = useAppStore();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [orientation, setOrientation] = useState<OrientationType>("all");
  
  const allPhotos = [...(listing?.photos || []), ...uploads];
  
  const filteredPhotos = allPhotos.filter(photo => {
    if (filter !== "all" && photo.tag.toLowerCase() !== filter) return false;
    if (orientation !== "all" && photo.orientation !== orientation) return false;
    return true;
  });
  
  const handleSelectAll = () => {
    if (selectedPhotoIds.length === filteredPhotos.length) {
      setSelected([]);
    } else {
      setSelected(filteredPhotos.map(p => p.id));
    }
  };
  
  const handlePhotoSelect = (photoId: string, checked: boolean) => {
    if (checked) {
      setSelected([...selectedPhotoIds, photoId]);
    } else {
      setSelected(selectedPhotoIds.filter(id => id !== photoId));
    }
  };
  
  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };
  
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Type:</span>
          <Badge
            variant={filter === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter("all")}
          >
            All
          </Badge>
          <Badge
            variant={filter === "interior" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter("interior")}
          >
            Interior
          </Badge>
          <Badge
            variant={filter === "exterior" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter("exterior")}
          >
            Exterior
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Orientation:</span>
          <Badge
            variant={orientation === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setOrientation("all")}
          >
            All
          </Badge>
          <Badge
            variant={orientation === "H" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setOrientation("H")}
          >
            Horizontal
          </Badge>
          <Badge
            variant={orientation === "V" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setOrientation("V")}
          >
            Vertical
          </Badge>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
          className="ml-auto"
        >
          {selectedPhotoIds.length === filteredPhotos.length ? "Deselect All" : "Select All"}
        </Button>
      </div>
      
      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredPhotos.map((photo) => (
          <Card
            key={photo.id}
            className={`relative cursor-pointer transition-all hover:shadow-lg ${
              selectedPhotoIds.includes(photo.id) ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handlePhotoClick(photo)}
          >
            <div className="aspect-square relative overflow-hidden rounded-t-lg">
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-gray-500 text-sm">
                  {photo.room || photo.tag}
                </span>
              </div>
              
              {/* Selection overlay */}
              {selectedPhotoIds.includes(photo.id) && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <Checkbox
                  checked={selectedPhotoIds.includes(photo.id)}
                  onCheckedChange={(checked) => 
                    handlePhotoSelect(photo.id, checked as boolean)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
                <Badge variant="secondary" className="text-xs">
                  {photo.orientation}
                </Badge>
              </div>
              
              <div className="text-xs text-muted-foreground">
                {photo.room && (
                  <div className="capitalize">{photo.room.replace("_", " ")}</div>
                )}
                <div className="capitalize">{photo.tag}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Selection Summary */}
      {selectedPhotoIds.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-background border rounded-lg shadow-lg px-6 py-3">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">
              {selectedPhotoIds.length} photo{selectedPhotoIds.length !== 1 ? "s" : ""} selected
            </span>
            <Button size="sm">Apply Preset</Button>
            <Button size="sm" variant="outline">Open Prompt Composer</Button>
          </div>
        </div>
      )}
      
      {/* Image Drawer */}
      {selectedPhoto && (
        <ImageDrawer
          photo={selectedPhoto}
          open={!!selectedPhoto}
          onOpenChange={(open) => !open && setSelectedPhoto(null)}
        />
      )}
    </div>
  );
}
