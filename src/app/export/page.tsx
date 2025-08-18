"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, FileText, Archive, CheckCircle } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { TopNav } from "@/components/TopNav";
import { zipApproved, csvManifest, getFilenameSchema } from "@/lib/exportHelpers";
import { toast } from "sonner";

export default function ExportPage() {
  const router = useRouter();
  const { jobs, reviews } = useAppStore();
  const [isExporting, setIsExporting] = useState(false);
  
  const approvedJobs = jobs.filter(job => 
    reviews[job.id]?.decision === "Approved" && job.outputClipSrc
  );
  
  const handleDownloadZip = async () => {
    if (approvedJobs.length === 0) {
      toast.error("No approved clips to export");
      return;
    }
    
    setIsExporting(true);
    toast.info("Preparing ZIP file...");
    
    try {
      const zipBlob = await zipApproved(jobs, reviews);
      
      // Create download link
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `44-frames-clips-${new Date().toISOString().split("T")[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("ZIP file downloaded successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to create ZIP file");
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleDownloadCSV = () => {
    if (approvedJobs.length === 0) {
      toast.error("No approved clips to export");
      return;
    }
    
    try {
      const csvBlob = csvManifest(jobs, reviews);
      
      // Create download link
      const url = URL.createObjectURL(csvBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `44-frames-manifest-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("CSV manifest downloaded successfully!");
    } catch (error) {
      console.error("CSV export error:", error);
      toast.error("Failed to create CSV file");
    }
  };
  
  const getExportStats = () => {
    const totalJobs = jobs.length;
    const completedJobs = jobs.filter(job => 
      job.status === "Succeeded" || job.status === "NeedsWork" || job.status === "Failed"
    ).length;
    const approvedCount = approvedJobs.length;
    const needsWorkCount = jobs.filter(job => 
      job.status === "NeedsWork" && reviews[job.id]?.decision !== "Approved"
    ).length;
    const failedCount = jobs.filter(job => 
      job.status === "Failed" && reviews[job.id]?.decision !== "Approved"
    ).length;
    
    return {
      total: totalJobs,
      completed: completedJobs,
      approved: approvedCount,
      needsWork: needsWorkCount,
      failed: failedCount,
    };
  };
  
  const stats = getExportStats();
  
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
              onClick={() => router.push("/review")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Review
            </Button>
            
            <div>
              <h1 className="text-3xl font-bold">Export Clips</h1>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary">
                  {approvedJobs.length} approved clip{approvedJobs.length !== 1 ? "s" : ""} ready
                </Badge>
                <span className="text-muted-foreground">
                  Download your approved motion clips
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-600 font-medium">Ready to Export</span>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Jobs</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.needsWork}</div>
            <div className="text-sm text-muted-foreground">Needs Work</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </div>
        </div>
        
        {/* Export Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* ZIP Export */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Archive className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Download ZIP</CardTitle>
              <CardDescription>
                Get all approved clips in a single compressed file
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {approvedJobs.length} Clip{approvedJobs.length !== 1 ? "s" : ""}
                </div>
                <div className="text-sm text-muted-foreground">
                  Ready for download
                </div>
              </div>
              
              <Button
                onClick={handleDownloadZip}
                disabled={approvedJobs.length === 0 || isExporting}
                className="w-full"
                size="lg"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Preparing...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download ZIP
                  </>
                )}
              </Button>
              
              <p className="text-xs text-muted-foreground mt-2">
                Includes all approved MP4 files
              </p>
            </CardContent>
          </Card>
          
          {/* CSV Export */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Download CSV Manifest</CardTitle>
              <CardDescription>
                Detailed spreadsheet with metadata and decisions
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  Complete Record
                </div>
                <div className="text-sm text-muted-foreground">
                  Source, preset, duration, decisions
                </div>
              </div>
              
              <Button
                onClick={handleDownloadCSV}
                disabled={approvedJobs.length === 0}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <FileText className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
              
              <p className="text-xs text-muted-foreground mt-2">
                Excel-compatible format
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* File Naming Convention */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>File Naming Convention</CardTitle>
            <CardDescription>
              How your exported files will be named
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Badge variant="outline">Format</Badge>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {getFilenameSchema("kitchen_01", "preset_1", 10)}
                </code>
              </div>
              <div className="text-sm text-muted-foreground">
                <strong>Structure:</strong> photo_id_preset_id_duration.mp4
              </div>
              <div className="text-sm text-muted-foreground">
                <strong>Example:</strong> kitchen_01_preset_1_10s.mp4
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Approved Clips List */}
        {approvedJobs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Approved Clips ({approvedJobs.length})</CardTitle>
              <CardDescription>
                These clips will be included in your export
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-green-200 to-green-300 rounded flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {getFilenameSchema(job.photoId, job.presetId, 10)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {job.photoId} • {job.presetId}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/review")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Review
          </Button>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => router.push("/billing")}
            >
              Manage Subscription
            </Button>
            
            <Button
              onClick={() => router.push("/")}
              className="bg-primary hover:bg-primary/90"
            >
              Start New Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
