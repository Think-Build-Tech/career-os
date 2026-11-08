import { JobApplication, UserProfile, ApiResponse } from '@career-os/shared';

export interface DataStore {
  profile: UserProfile;
  jobs: JobApplication[];
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Mercer',
  email: 'alex.mercer@career-os.dev',
  title: 'Senior Full-Stack Engineer',
  skills: ['Angular', 'React Native', 'Node.js', 'TypeScript', 'Nx', 'Docker', 'PostgreSQL'],
  summary: 'Building high-performance multi-platform career acceleration software with Node.js and TypeScript.',
};

const DEFAULT_JOBS: JobApplication[] = [
  {
    id: 'job-1',
    company: 'Stripe',
    role: 'Staff Infrastructure Engineer',
    location: 'Remote / San Francisco',
    salary: '$210,000 - $240,000',
    status: 'interviewing',
    appliedDate: '2026-10-10',
    notes: 'Passed technical screen, scheduled virtual onsite.',
  },
  {
    id: 'job-2',
    company: 'Vercel',
    role: 'Senior Frontend Platform Engineer',
    location: 'Remote',
    salary: '$190,000 - $220,000',
    status: 'applied',
    appliedDate: '2026-10-12',
    notes: 'Application submitted via referral.',
  },
  {
    id: 'job-3',
    company: 'Datadog',
    role: 'Lead Backend Engineer',
    location: 'New York, NY / Hybrid',
    salary: '$200,000 - $235,000',
    status: 'offer',
    appliedDate: '2026-09-28',
    notes: 'Offer package under review.',
  },
];

class Store {
  private profile: UserProfile = { ...DEFAULT_PROFILE };
  private jobs: JobApplication[] = [...DEFAULT_JOBS];

  getProfile(): UserProfile {
    return { ...this.profile };
  }

  updateProfile(patch: Partial<UserProfile>): UserProfile {
    this.profile = {
      ...this.profile,
      ...patch,
      skills: patch.skills ? [...patch.skills] : this.profile.skills,
    };
    return { ...this.profile };
  }

  getJobs(): JobApplication[] {
    return [...this.jobs];
  }

  getJobById(id: string): JobApplication | undefined {
    return this.jobs.find((j) => j.id === id);
  }

  addJob(job: Partial<JobApplication>): JobApplication {
    const newJob: JobApplication = {
      id: job.id || `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      company: job.company || 'Unknown Company',
      role: job.role || 'Software Engineer',
      location: job.location || 'Remote',
      salary: job.salary || 'Competitive',
      status: job.status || 'applied',
      appliedDate: job.appliedDate || new Date().toISOString().split('T')[0],
      notes: job.notes ?? '',
    };
    this.jobs.unshift(newJob);
    return newJob;
  }

  updateJob(id: string, patch: Partial<JobApplication>): JobApplication | null {
    const index = this.jobs.findIndex((j) => j.id === id);
    if (index === -1) return null;

    this.jobs[index] = {
      ...this.jobs[index],
      ...patch,
      id, // ensure ID is immutable
    };
    return { ...this.jobs[index] };
  }

  deleteJob(id: string): boolean {
    const initialLen = this.jobs.length;
    this.jobs = this.jobs.filter((j) => j.id !== id);
    return this.jobs.length < initialLen;
  }

  reset(): void {
    this.profile = { ...DEFAULT_PROFILE };
    this.jobs = [...DEFAULT_JOBS];
  }
}

export const store = new Store();

export function createApiResponse<T>(data: T, message?: string, success = true): ApiResponse<T> {
  return {
    success,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

