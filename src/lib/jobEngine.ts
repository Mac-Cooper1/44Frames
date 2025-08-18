import type { ClipJob, ClipStatus } from "@/lib/types";

class JobEngine {
  private isRunning = false;
  private concurrencyCap = 8;
  private runningJobs = new Set<string>();
  private onUpdate?: (job: ClipJob) => void;

  startEngine(onUpdate: (job: ClipJob) => void) {
    this.onUpdate = onUpdate;
    this.isRunning = true;
    this.processQueue();
  }

  stopEngine() {
    this.isRunning = false;
  }

  enqueue(jobs: ClipJob[]) {
    // Add jobs to the queue
    if (this.onUpdate) {
      jobs.forEach(job => this.onUpdate!(job));
    }
    
    // Start processing if engine is running
    if (this.isRunning) {
      this.processQueue();
    }
  }

  private async processQueue() {
    if (!this.isRunning || !this.onUpdate) return;

    // Get all queued jobs
    const queuedJobs = this.getQueuedJobs();
    
    // Start jobs up to concurrency cap
    const availableSlots = this.concurrencyCap - this.runningJobs.size;
    const jobsToStart = queuedJobs.slice(0, availableSlots);
    
    jobsToStart.forEach(job => {
      this.startJob(job);
    });
  }

  private getQueuedJobs(): ClipJob[] {
    // This would typically query the store, but for now we'll return empty
    // The actual implementation will be handled by the store
    return [];
  }

  private async startJob(job: ClipJob) {
    if (!this.onUpdate) return;
    
    // Mark as running
    const runningJob: ClipJob = {
      ...job,
      status: "Running" as ClipStatus,
      startedAt: Date.now(),
    };
    
    this.runningJobs.add(job.id);
    this.onUpdate(runningJob);
    
    // Simulate processing time (0.8-2.4 seconds)
    const duration = 800 + Math.random() * 1600;
    
    setTimeout(() => {
      this.completeJob(job);
    }, duration);
  }

  private completeJob(job: ClipJob) {
    if (!this.onUpdate) return;
    
    this.runningJobs.delete(job.id);
    
    // Determine outcome based on odds
    const rand = Math.random();
    let status: ClipStatus;
    let outputClipSrc: string | undefined;
    
    if (rand < 0.7) {
      status = "Succeeded";
      outputClipSrc = `/sample-assets/clips/${job.photoId}_${job.presetId}.mp4`;
    } else if (rand < 0.9) {
      status = "NeedsWork";
    } else {
      status = "Failed";
    }
    
    const completedJob: ClipJob = {
      ...job,
      status,
      finishedAt: Date.now(),
      outputClipSrc,
    };
    
    this.onUpdate(completedJob);
    
    // Continue processing queue
    this.processQueue();
  }

  getRunningCount(): number {
    return this.runningJobs.size;
  }

  getStatus(): { isRunning: boolean; runningCount: number; concurrencyCap: number } {
    return {
      isRunning: this.isRunning,
      runningCount: this.runningJobs.size,
      concurrencyCap: this.concurrencyCap,
    };
  }
}

// Export singleton instance
export const jobEngine = new JobEngine();
