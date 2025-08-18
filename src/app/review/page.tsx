"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Play, Download } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { TopNav } from "@/components/TopNav";
import { ABCompareModal } from "@/components/ABCompareModal";
import { toast } from "sonner";
import type { ClipJob, ClipReview } from "@/lib/types";

export default function ReviewPage() {
  const router = useRouter();
  const { jobs, reviews, setReview, updateJob } = useAppStore();
  const [selectedTab, setSelectedTab] = useState("all");
  const [compareModal, setCompareModal] = useState<{
    open: boolean;
    originalJob: ClipJob | null;
    revisedJob: ClipJob | null;
  }>({
    open: false,
    originalJob: null,
    revisedJob: null,
  });
  
  const completedJobs = jobs.filter(job => 
    job.status === "Succeeded" || job.status === "NeedsWork" || job.status === "Failed"
  );
  
  const approvedJobs = completedJobs.filter(job => 
    reviews[job.id]?.decision === "Approved"
  );
  
  const needsWorkJobs = completedJobs.filter(job => 
    job.status === "NeedsWork" && reviews[job.id]?.decision !== "Approved"
  );
  
  const failedJobs = completedJobs.filter(job => 
    job.status === "Failed" && reviews[job.id]?.decision !== "Approved"
  );
  
  const handleApprove = (jobId: string) => {
    const review: ClipReview = {
      jobId,
      decision: "Approved",
      decidedAt: Date.now(),
    };
    setReview(review);
    toast.success("Clip approved!");
  };
  
  const handleRevise = (jobId: string) => {
    const review: ClipReview = {
      jobId,
      decision: "Revise",
      decidedAt: Date.now(),
    };
    setReview(review);
    
    // Create a revised job (in real app, this would re-queue with different settings)
    const originalJob = jobs.find(j => j.id === jobId);
    if (originalJob) {
      const revisedJob: ClipJob = {
        ...originalJob,
        id: `revised-${Date.now()}-${jobId}`,
        status: "Queued",
        replacesJobId: jobId,
        startedAt: undefined,
        finishedAt: undefined,
        outputClipSrc: undefined,
      };
      
      updateJob(revisedJob);
      toast.info("Revision job created");
    }
  };
  
  const handleDelete = (jobId: string) => {
    const review: ClipReview = {
      jobId,
      decision: "Deleted",
      decidedAt: Date.now(),
    };
    setReview(review);
    toast.success("Clip deleted");
  };
  
  const handleCompare = (originalJob: ClipJob, revisedJob: ClipJob) => {
    setCompareModal({
      open: true,
      originalJob,
      revisedJob,
    });
  };
  
  const renderJobCard = (job: ClipJob) => {
    const review = reviews[job.id];
    const isApproved = review?.decision === "Approved";
    const isRevised = review?.decision === "Revise";
    const isDeleted = review?.decision === "Deleted";
    
    const getStatusIcon = () => {
      switch (job.status) {
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
      <Card key={job.id} className={`transition-all hover:shadow-md ${
        isApproved ? "ring-2 ring-green-200" : 
        isRevised ? "ring-2 ring-yellow-200" : 
        isDeleted ? "ring-2 ring-red-200" : ""
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div>
                <CardTitle className="text-base">Job {job.id.slice(-8)}</CardTitle>
                <CardDescription>
                  Photo: {job.photoId} • Preset: {job.presetId}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{job.status}</Badge>
              {isApproved && <Badge className="bg-green-100 text-green-800">Approved</Badge>}
              {isRevised && <Badge className="bg-yellow-100 text-yellow-800">Needs Revision</Badge>}
              {isDeleted && <Badge className="bg-red-100 text-red-800">Deleted</Badge>}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Video Preview */}
            <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Play className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-500">
                  {job.outputClipSrc ? "Video Preview" : "Processing..."}
                </div>
              </div>
            </div>
            
            {/* Prompt */}
            <div className="text-sm">
              <span className="font-medium">Prompt:</span> {job.prompt}
            </div>
            
            {/* Actions */}
            {!isApproved && !isDeleted && (
              <div className="flex items-center space-x-2">
                {job.status === "Succeeded" && (
                  <Button
                    size="sm"
                    onClick={() => handleApprove(job.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                )}
                
                {(job.status === "NeedsWork" || job.status === "Failed") && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRevise(job.id)}
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Revise
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(job.id)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
            
            {/* Revision Info */}
            {isRevised && (
              <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                Revision requested - check for updated job
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  
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
              onClick={() => router.push("/generate")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Generate
            </Button>
            
            <div>
              <h1 className="text-3xl font-bold">Review Clips</h1>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary">
                  {completedJobs.length} clip{completedJobs.length !== 1 ? "s" : ""} ready for review
                </Badge>
                <span className="text-muted-foreground">
                  Approve, revise, or delete generated content
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => router.push("/export")}
              disabled={approvedJobs.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export ({approvedJobs.length})
            </Button>
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({completedJobs.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedJobs.length})</TabsTrigger>
            <TabsTrigger value="needsWork">Needs Work ({needsWorkJobs.length})</TabsTrigger>
            <TabsTrigger value="failed">Failed ({failedJobs.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {completedJobs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No completed jobs to review
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedJobs.map(renderJobCard)}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="approved" className="space-y-4">
            {approvedJobs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No approved clips yet
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedJobs.map(renderJobCard)}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="needsWork" className="space-y-4">
            {needsWorkJobs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No clips need revision
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {needsWorkJobs.map(renderJobCard)}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="failed" className="space-y-4">
            {failedJobs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No failed clips
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {failedJobs.map(renderJobCard)}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/generate")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Generate
          </Button>
          
          {approvedJobs.length > 0 && (
            <Button
              onClick={() => router.push("/export")}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export {approvedJobs.length} Approved Clip{approvedJobs.length !== 1 ? "s" : ""}
            </Button>
          )}
        </div>
      </div>
      
      {/* A/B Compare Modal */}
      {compareModal.open && compareModal.originalJob && compareModal.revisedJob && (
        <ABCompareModal
          originalJob={compareModal.originalJob}
          revisedJob={compareModal.revisedJob}
          open={compareModal.open}
          onOpenChange={(open) => setCompareModal({ ...compareModal, open })}
          onApprove={handleApprove}
          onRevise={handleRevise}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
