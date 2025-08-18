"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { ClipJob } from "@/lib/types";

interface ABCompareModalProps {
  originalJob: ClipJob;
  revisedJob: ClipJob;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (jobId: string) => void;
  onRevise: (jobId: string) => void;
  onDelete: (jobId: string) => void;
}

export function ABCompareModal({
  originalJob,
  revisedJob,
  open,
  onOpenChange,
  onApprove,
  onRevise,
  onDelete,
}: ABCompareModalProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Succeeded":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "NeedsWork":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "Failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>A/B Comparison</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Version */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Original Version</h3>
              <Badge variant="outline">Original</Badge>
            </div>
            
            <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-500 text-lg mb-2">Original Clip</div>
                <div className="text-sm text-gray-400">
                  {originalJob.photoId} • {originalJob.presetId}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusIcon(originalJob.status)}
                  <Badge variant="secondary">{originalJob.status}</Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Prompt</label>
                <div className="mt-1 text-sm bg-muted p-3 rounded">
                  {originalJob.prompt}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Job ID</label>
                <div className="mt-1 text-sm font-mono text-muted-foreground">
                  {originalJob.id}
                </div>
              </div>
            </div>
          </div>
          
          {/* Revised Version */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Revised Version</h3>
              <Badge variant="default">Revised</Badge>
            </div>
            
            <div className="aspect-video bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-blue-600 text-lg mb-2">Revised Clip</div>
                <div className="text-sm text-blue-500">
                  {revisedJob.photoId} • {revisedJob.presetId}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusIcon(revisedJob.status)}
                  <Badge variant="secondary">{revisedJob.status}</Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Prompt</label>
                <div className="mt-1 text-sm bg-muted p-3 rounded">
                  {revisedJob.prompt}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Job ID</label>
                <div className="mt-1 text-sm font-mono text-muted-foreground">
                  {revisedJob.id}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Choose which version to keep, or request further revisions
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => onDelete(originalJob.id)}
            >
              Delete Both
            </Button>
            <Button
              variant="outline"
              onClick={() => onRevise(revisedJob.id)}
            >
              Request Revision
            </Button>
            <Button
              onClick={() => onApprove(revisedJob.id)}
              disabled={revisedJob.status !== "Succeeded"}
            >
              Approve Revised
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
