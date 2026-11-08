export type JobStatus =
  | 'wishlist'
  | 'applied'
  | 'interviewing'
  | 'offer'
  | 'rejected';

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  salary: string;
  status: JobStatus;
  appliedDate: string;
  notes?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  title: string;
  skills: string[];
  summary: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface JobStats {
  total: number;
  applied: number;
  interviewing: number;
  offer: number;
  rejected: number;
}

export const STATUS_LABELS: Record<JobStatus, string> = {
  wishlist: 'Saved',
  applied: 'Applied',
  interviewing: 'Interviewing',
  offer: 'Offer Received',
  rejected: 'Archived',
};

export const STATUS_COLORS: Record<JobStatus, { bg: string; text: string; border: string }> = {
  wishlist: { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' },
  applied: { bg: '#EFF6FF', text: '#1D4ED8', border: '#93C5FD' },
  interviewing: { bg: '#FEF3C7', text: '#B45309', border: '#FCD34D' },
  offer: { bg: '#ECFDF5', text: '#047857', border: '#6EE7B7' },
  rejected: { bg: '#FEE2E2', text: '#B91C1C', border: '#FCA5A5' },
};

export function calculateJobStats(jobs: JobApplication[]): JobStats {
  return jobs.reduce(
    (acc, job) => {
      acc.total += 1;
      if (job.status === 'applied') acc.applied += 1;
      if (job.status === 'interviewing') acc.interviewing += 1;
      if (job.status === 'offer') acc.offer += 1;
      if (job.status === 'rejected') acc.rejected += 1;
      return acc;
    },
    { total: 0, applied: 0, interviewing: 0, offer: 0, rejected: 0 }
  );
}
