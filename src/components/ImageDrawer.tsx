"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Photo } from "@/lib/types";

interface ImageDrawerProps {
  photo: Photo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageDrawer({ photo, open, onOpenChange }: ImageDrawerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[400px] sm:w-[540px]">
        <DialogHeader>
          <DialogTitle>Photo Details</DialogTitle>
        </DialogHeader>
        
        <div className="mt-6 space-y-6">
          {/* Image Preview */}
          <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-lg">
              {photo.room || photo.tag} Preview
            </span>
          </div>
          
          {/* Photo Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <div className="mt-1">
                  <Badge variant="secondary">{photo.tag}</Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Orientation</label>
                <div className="mt-1">
                  <Badge variant="outline">{photo.orientation}</Badge>
                </div>
              </div>
            </div>
            
            {photo.room && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Room</label>
                <div className="mt-1 text-sm capitalize">
                  {photo.room.replace("_", " ")}
                </div>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Photo ID</label>
              <div className="mt-1 text-sm font-mono text-muted-foreground">
                {photo.id}
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Actions */}
          <div className="space-y-3">
            <Button className="w-full" size="sm">
              Apply Preset
            </Button>
            <Button variant="outline" className="w-full" size="sm">
              Custom Prompt
            </Button>
            <Button variant="ghost" className="w-full" size="sm">
              View in Gallery
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
