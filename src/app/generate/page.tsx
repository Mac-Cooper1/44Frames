"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, CheckCircle, Clock } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { JobList } from "@/components/JobList";
import { TopNav } from "@/components/TopNav";
import { jobEngine } from "@/lib/jobEngine";
import { toast } from "sonner";

export default function GeneratePage() {
  const router = useRouter();
  const { jobs, updateJob } = useAppStore();
  const [isEngineRunning, setIsEngineRunning] = useState(false);
  
  useEffect(() => {
    if (jobs.length === 0) {
      router.push("/prompt");
      return;
    }
    
    // Start the job engine if not already running
    if (!isEngineRunning) {
      setIsEngineRunning(true);
      jobEngine.startEngine((updatedJob) => {
        // Update the job in the store
        updateJob(updatedJob);
        
        // Show toast for completed jobs
        if (updatedJob.status === "Succeeded") {
          toast.success(`Clip generated successfully!`);
        } else if (updatedJob.status === "NeedsWork") {
          toast.warning(`Clip needs revision`);
        } else if (updatedJob.status === "Failed") {
          toast.error(`Clip generation failed`);
        }
      });
    }
  }, [jobs.length, router, isEngineRunning, updateJob]);
  
  const handleContinueToReview = () => {
    const completedJobs = jobs.filter(job => 
      job.status === "Succeeded" || job.status === "NeedsWork" || job.status === "Failed"
    );
    
    if (completedJobs.length > 0) {
      router.push("/review");
    } else {
      toast.info("Wait for jobs to complete before reviewing");
    }
  };
  
  const handleBackToPrompt = () => {
    router.push("/prompt");
  };
  
  if (jobs.length === 0) {
    return null;
  }
  
  const totalJobs = jobs.length;
  const completedJobs = jobs.filter(job => 
    job.status === "Succeeded" || job.status === "NeedsWork" || job.status === "Failed"
  ).length;
  const runningJobs = jobs.filter(job => job.status === "Running").length;
  const queuedJobs = jobs.filter(job => job.status === "Queued").length;
  
  const isAllComplete = completedJobs === totalJobs;
  
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
              onClick={handleBackToPrompt}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Prompt
            </Button>
            
            <div>
              <h1 className="text-3xl font-bold">Generate Clips</h1>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary">
                  {totalJobs} job{totalJobs !== 1 ? "s" : ""} in queue
                </Badge>
                <span className="text-muted-foreground">
                  Processing with AI-powered motion generation
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {isAllComplete ? (
              <Button onClick={handleContinueToReview} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Continue to Review
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-blue-600">Processing...</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalJobs}</div>
            <div className="text-sm text-muted-foreground">Total Jobs</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{runningJobs}</div>
            <div className="text-sm text-muted-foreground">Running</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{queuedJobs}</div>
            <div className="text-sm text-muted-foreground">Queued</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedJobs}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
        </div>
        
        {/* Job List */}
        <JobList jobs={jobs} />
        
        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBackToPrompt}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Prompt Composer
          </Button>
          
          {isAllComplete && (
            <Button
              onClick={handleContinueToReview}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Review Generated Clips
            </Button>
          )}
        </div>
        
        {/* Progress Notice */}
        {!isAllComplete && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Generation in Progress
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Processing {runningJobs} clips concurrently. 
                  {queuedJobs > 0 && ` ${queuedJobs} remaining in queue.`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
