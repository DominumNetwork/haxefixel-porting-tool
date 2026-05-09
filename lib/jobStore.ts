export type Job = {
  jobId: string;
  state: 'queued' | 'running' | 'done' | 'error';
  logs: string[];
  downloadUrl?: string;
  engine?: string;
};

const jobs = new Map<string, Job>();

export const jobStore = {
  set(job: Job) {
    jobs.set(job.jobId, job);
  },
  get(jobId: string) {
    return jobs.get(jobId);
  },
  update(jobId: string, patch: Partial<Job>) {
    const j = jobs.get(jobId);
    if (!j) return;
    jobs.set(jobId, { ...j, ...patch });
  }
};
