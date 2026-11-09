// apps/web/src/app/pages/jobs/jobs.ts
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthSessionService } from '../../core/auth/auth-session.service';
import { PortalStateService } from '../../services/portal-state.service';
import { JobOpportunityDto } from '../../models/api.model';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './jobs.html',
  styleUrl: './jobs.css',
})
export class Jobs implements OnInit {
  private readonly api = inject(ApiService);
  readonly auth = inject(AuthSessionService);
  readonly portal = inject(PortalStateService);
  private readonly router = inject(Router);

  readonly jobs = signal<JobOpportunityDto[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly searchQuery = signal<string>('');
  readonly selectedTier = signal<string>('ALL');
  readonly appliedJobIds = signal<Set<string>>(new Set());
  readonly applyingJobId = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly filteredJobs = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const tier = this.selectedTier();
    return this.jobs().filter((job) => {
      const compName = job.company?.name || job.company_name || '';
      const compTier = job.company?.tier || job.tier_label || '';
      const matchSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        compName.toLowerCase().includes(q) ||
        (job.location && job.location.toLowerCase().includes(q));
      const matchTier = tier === 'ALL' || compTier === tier;
      return matchSearch && matchTier;
    });
  });

  ngOnInit(): void {
    this.portal.activePage.set('jobs');
    this.loadJobs();
  }

  loadJobs(): void {
    this.isLoading.set(true);
    this.api.getJobOpportunities(1, 50).subscribe({
      next: (data) => {
        this.jobs.set(data);
        this.portal.totalOpenJobsCount.set(data.length);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.message || 'Failed to load jobs from API');
      },
    });
  }

  apply(job: JobOpportunityDto): void {
    const studentId = this.auth.studentId();
    if (!studentId) {
      this.errorMessage.set('Your authenticated student profile is missing. Sign in again.');
      return;
    }
    this.applyingJobId.set(job.id);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.api.getStudentResumes(studentId).subscribe({
      next: (resumes) => {
        const resume = resumes[0];
        if (!resume) {
          this.applyingJobId.set(null);
          this.errorMessage.set('Create and publish a resume version before applying.');
          return;
        }
        this.api.getResumeVersions(resume.id).subscribe({
          next: (versions) => {
            const latestVersion = [...versions].sort((a, b) => b.version_number - a.version_number)[0];
            if (!latestVersion) {
              this.applyingJobId.set(null);
              this.errorMessage.set('Publish a resume version before applying.');
              return;
            }
            this.submitApplication(job, studentId, latestVersion.id);
          },
          error: (error) => this.handleApplicationError(error),
        });
      },
      error: (error) => this.handleApplicationError(error),
    });
  }

  private submitApplication(job: JobOpportunityDto, studentId: string, resumeVersionId: string): void {
    this.api.applyForJob({ opportunity_id: job.id, student_id: studentId, resume_id: resumeVersionId }).subscribe({
      next: () => {
        this.applyingJobId.set(null);
        this.appliedJobIds.update((set) => new Set([...set, job.id]));
        this.successMessage.set(
          `Application submitted successfully for ${job.title} at ${job.company?.name || job.company_name || 'the selected company'}.`
        );
        setTimeout(() => this.successMessage.set(null), 5000);
      },
      error: (error) => this.handleApplicationError(error),
    });
  }

  private handleApplicationError(error: any): void {
    this.applyingJobId.set(null);
    this.errorMessage.set(error?.error?.message || error?.message || 'Failed to submit application. Please retry.');
  }

  isApplied(jobId: string): boolean {
    return this.appliedJobIds().has(jobId);
  }

  formatCtc(ctc?: number): string {
    if (!ctc) return 'Competitive';
    if (ctc >= 100000) {
      return `₹${(ctc / 100000).toFixed(1)} LPA`;
    }
    return `₹${ctc.toLocaleString('en-IN')}`;
  }

  logout(): void {
    this.auth.clearSessionOnLogout();
  }
}
