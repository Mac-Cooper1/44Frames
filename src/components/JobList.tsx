"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, XCircle, AlertCircle, Play } from "lucide-react";
import type { ClipJob } from "@/lib/types";

interface JobListProps {
  jobs: ClipJob[];
}

const statusConfig = {
  Queued: { color: "bg-gray-100 text-gray-800", icon: Clock },
  Running: { color: "bg-blue-100 text-blue-800", icon: Play },
  Succeeded: { color: "bg-green-100 text-green-800", icon: CheckCircle },
  NeedsWork: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
  Failed: { color: "bg-red-100 text-red-800", icon: XCircle },
};

export function JobList({ jobs }: JobListProps) {
  const totalJobs = jobs.length;
  const completedJobs = jobs.filter(job => 
    job.status === "Succeeded" || job.status === "NeedsWork" || job.status === "Failed"
  ).length;
  const runningJobs = jobs.filter(job => job.status === "Running").length;
  const queuedJobs = jobs.filter(job => job.status === "Queued").length;
  
  const progress = totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0;
  
  const formatDuration = (startedAt?: number, finishedAt?: number) => {
    if (!startedAt) return "Not started";
    if (!finishedAt) return "In progress";
    
    const duration = finishedAt - startedAt;
    return `${(duration / 1000).toFixed(1)}s`;
  };
  
  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;
    
    const Icon = config.icon;
    return <Icon className="w-4 h-4" />;
  };
  
  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Generation Progress</h3>
          <Badge variant="outline">
            {completedJobs}/{totalJobs} Complete
          </Badge>
        </div>
        
        <Progress value={progress} className="w-full" />
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{runningJobs}</div>
            <div className="text-muted-foreground">Running</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{queuedJobs}</div>
            <div className="text-muted-foreground">Queued</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completedJobs}</div>
            <div className="text-muted-foreground">Completed</div>
          </div>
        </div>
      </div>
      
      {/* Job List */}
      <div className="space-y-3">
        {jobs.map((job) => (
          <Card key={job.id} className="transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(job.status)}
                  <div>
                    <CardTitle className="text-base">Job {job.id.slice(-8)}</CardTitle>
                    <CardDescription>
                      Photo: {job.photoId} • Preset: {job.presetId}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={statusConfig[job.status as keyof typeof statusConfig]?.color}>
                  {job.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium">Prompt:</span> {job.prompt}
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Duration: {formatDuration(job.startedAt, job.finishedAt)}</span>
                  {job.startedAt && (
                    <span>
                      Started: {new Date(job.startedAt).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                
                {job.outputClipSrc && (
                  <div className="text-sm text-green-600">
                    ✓ Output: {job.outputClipSrc}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Demo Limit Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-blue-800">
              <strong>Demo Limit:</strong> 24 items per run
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Generating {runningJobs} clips concurrently...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
