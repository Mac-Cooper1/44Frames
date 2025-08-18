import JSZip from "jszip";
import type { ClipJob, ClipReview } from "@/lib/types";

export async function zipApproved(
  jobs: ClipJob[],
  reviews: Record<string, ClipReview>
): Promise<Blob> {
  const zip = new JSZip();
  
  // Filter for approved jobs
  const approvedJobs = jobs.filter(job => 
    reviews[job.id]?.decision === "Approved" && job.outputClipSrc
  );
  
  // Add sample MP4 files to zip (in real app, these would be actual video files)
  for (const job of approvedJobs) {
    if (job.outputClipSrc) {
      // Create a dummy MP4 content for demo purposes
      const dummyContent = `# Demo MP4 content for ${job.id}\n# This would be the actual video file\n# Generated from ${job.photoId} with preset ${job.presetId}`;
      
      const filename = `${job.photoId}_${job.presetId}.mp4`;
      zip.file(filename, dummyContent);
    }
  }
  
  // Generate and return the zip file
  const zipBlob = await zip.generateAsync({ type: "blob" });
  return zipBlob;
}

export function csvManifest(
  jobs: ClipJob[],
  reviews: Record<string, ClipReview>
): Blob {
  // Filter for approved jobs
  const approvedJobs = jobs.filter(job => 
    reviews[job.id]?.decision === "Approved"
  );
  
  // Create CSV headers
  const headers = [
    "Filename",
    "Source Image",
    "Preset",
    "Duration (seconds)",
    "Decision",
    "Timestamp",
    "Prompt"
  ];
  
  // Create CSV rows
  const rows = approvedJobs.map(job => {
    const review = reviews[job.id];
    const filename = `${job.photoId}_${job.presetId}.mp4`;
    const timestamp = review?.decidedAt ? new Date(review.decidedAt).toISOString() : "";
    
    return [
      filename,
      job.photoId,
      job.presetId,
      "10", // Default duration for demo
      review?.decision || "Pending",
      timestamp,
      `"${job.prompt}"` // Wrap in quotes to handle commas
    ].join(",");
  });
  
  // Combine headers and rows
  const csvContent = [headers.join(","), ...rows].join("\n");
  
  // Create and return blob
  return new Blob([csvContent], { type: "text/csv" });
}

export function getFilenameSchema(photoId: string, presetId: string, duration: number): string {
  return `${photoId}_${presetId}_${duration}s.mp4`;
}
