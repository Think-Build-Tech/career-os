// src/app/pages/home/home.component.ts
import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of, catchError } from 'rxjs';
import { AuthSessionService } from '../../core/auth/auth-session.service';
import { ApiService } from '../../services/api.service';
import { PortalStateService } from '../../services/portal-state.service';
import {
  StudentActionItemDto,
  PlacementComplianceDto,
  SkillGapAnalysisDto,
  AcademicEventDto,
  ConflictCheckResponse,
  JobOpportunityDto
} from '../../models/api.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  private readonly auth = inject(AuthSessionService);
  private readonly api = inject(ApiService);
  readonly portal = inject(PortalStateService);

  readonly roleBenchmarks = [
    { key: 'backend', label: 'Backend Eng', roleName: 'Backend Engineer' },
    { key: 'fullstack', label: 'Full-Stack', roleName: 'Full-Stack Engineer' },
    { key: 'cloud', label: 'Cloud / SRE', roleName: 'Cloud SRE Engineer' }
  ];

  readonly selectedRoleKey = signal('backend');
  readonly actions = signal<StudentActionItemDto[]>([]);
  readonly compliance = signal<PlacementComplianceDto | null>(null);
  readonly skillGap = signal<SkillGapAnalysisDto | null>(null);
  readonly events = signal<AcademicEventDto[]>([]);
  readonly conflicts = signal<ConflictCheckResponse | null>(null);
  readonly priorityDrives = signal<JobOpportunityDto[]>([]);

  readonly firstName = computed(() =>
    this.portal.studentDisplayInfo().fullName.split(' ')[0] || 'Student'
  );
  readonly pendingActions = computed(() =>
    this.actions().filter(a => !a.completed_at)
  );

  constructor() {
    effect(
      () => {
        const studentId = this.auth.studentId();
        if (studentId) {
          this.loadData(studentId);
        }
      },
      { allowSignalWrites: true }
    );
  }

  loadData(studentId: string): void {
    const deptId = this.auth.departmentId();
    forkJoin({
      actions: this.api.getStudentActionItems(studentId).pipe(catchError(() => of([]))),
      compliance: this.api.getStudentCompliance(studentId).pipe(catchError(() => of(null))),
      skillGap: this.api.analyzeSkillGap(studentId, 'Backend Engineer').pipe(catchError(() => of(null))),
      events: this.api.getAcademicEvents().pipe(catchError(() => of([]))),
      jobs: this.api.getJobOpportunities(1, 5).pipe(catchError(() => of([]))),
      conflicts: deptId
        ? this.api
            .detectTimetableConflicts({
              department_id: deptId,
              starts_at: new Date().toISOString(),
              ends_at: new Date(Date.now() + 7 * 86400000).toISOString()
            })
            .pipe(catchError(() => of(null)))
        : of(null)
    }).subscribe(({ actions, compliance, skillGap, events, jobs, conflicts }) => {
      this.actions.set(actions);
      this.portal.pendingSlaCount.set(actions.filter(a => !a.completed_at).length);
      this.compliance.set(compliance);
      this.skillGap.set(skillGap);
      this.events.set(events.slice(0, 3));
      this.priorityDrives.set(jobs.slice(0, 3));
      this.conflicts.set(conflicts);
    });
  }

  switchRoleBenchmark(key: string, roleName: string): void {
    this.selectedRoleKey.set(key);
    const studentId = this.auth.studentId();
    if (!studentId) return;
    this.api.analyzeSkillGap(studentId, roleName).subscribe(res => this.skillGap.set(res));
  }

  completeSla(item: StudentActionItemDto): void {
    this.api.completeActionItem(item.id).subscribe(() => {
      this.actions.update(list =>
        list.map(a => (a.id === item.id ? { ...a, completed_at: new Date().toISOString() } : a))
      );
      this.portal.pendingSlaCount.set(this.pendingActions().length);
      this.portal.showToast('SLA Action confirmed & completed');
    });
  }

  getBarToneClass(tone?: string): string {
    switch (tone) {
      case 'good': return 'bg-[#127a55]';
      case 'warn': return 'bg-[#d98b13]';
      case 'bad':  return 'bg-[#b42318]';
      default:     return 'bg-[#4a33e0]';
    }
  }
}