// src/app/pages/home/home.component.ts
import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, forkJoin, of, catchError } from 'rxjs';
import { AuthSessionService } from '../../core/auth/auth-session.service';
import { ApiService } from '../../services/api.service';
import { PortalStateService } from '../../services/portal-state.service';
import { Sidebar } from '../sidebar/sidebar';
import {
  PageId,
  StudentActionItemDto,
  PlacementComplianceDto,
  SkillGapAnalysisDto,
  AcademicEventDto,
  ConflictCheckResponse,
  JobOpportunityDto,
  StudentApplicationDto,
  AssessmentDto,
  AssessmentBadgeDto,
  LearningPostDto,
  AlumniProfileDto,
  ReferralPostDto,
  ChatMessageDto,
  StudentCareerProfileDto,
  ResumeDocumentDto,
  StudentProjectDto
} from '../../models/api.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  readonly auth = inject(AuthSessionService);
  private readonly api = inject(ApiService);
  readonly portal = inject(PortalStateService);

  readonly roleBenchmarks = [
    { key: 'backend', label: 'Backend Eng', roleName: 'Backend Engineer' },
    { key: 'fullstack', label: 'Full-Stack', roleName: 'Full-Stack Engineer' },
    { key: 'cloud', label: 'Cloud / SRE', roleName: 'Cloud SRE Engineer' }
  ];

  // Core Home Dashboard Signals
  readonly selectedRoleKey = signal('backend');
  readonly actions = signal<StudentActionItemDto[]>([]);
  readonly compliance = signal<PlacementComplianceDto | null>(null);
  readonly skillGap = signal<SkillGapAnalysisDto | null>(null);
  readonly events = signal<AcademicEventDto[]>([]);
  readonly conflicts = signal<ConflictCheckResponse | null>(null);
  readonly priorityDrives = signal<JobOpportunityDto[]>([]);
  readonly isLoading = signal(false);
  readonly loadError = signal<string | null>(null);

  // Extended Portal Signals for All Sidebar Pages
  readonly applications = signal<StudentApplicationDto[]>([]);
  readonly assessments = signal<AssessmentDto[]>([]);
  readonly badges = signal<AssessmentBadgeDto[]>([]);
  readonly learningPosts = signal<LearningPostDto[]>([]);
  readonly alumniProfiles = signal<AlumniProfileDto[]>([]);
  readonly alumniReferrals = signal<ReferralPostDto[]>([]);
  readonly careerProfile = signal<StudentCareerProfileDto | null>(null);
  readonly resumes = signal<ResumeDocumentDto[]>([]);
  readonly projects = signal<StudentProjectDto[]>([]);

  // Chat Signals
  readonly chatMessages = signal<ChatMessageDto[]>([]);
  readonly chatInputText = signal<string>('');
  readonly selectedConversationId = signal<string | null>(null);
  readonly isSendingChat = signal<boolean>(false);

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
    this.isLoading.set(true);
    this.loadError.set(null);

    forkJoin({
      actions: this.api.getStudentActionItems(studentId).pipe(catchError(() => of([]))),
      compliance: this.api.getStudentCompliance(studentId).pipe(catchError(() => of(null))),
      skillGap: this.api.analyzeSkillGap(studentId, 'Backend Engineer').pipe(catchError(() => of(null))),
      events: this.api.getAcademicEvents().pipe(catchError(() => of([]))),
      jobs: this.api.getJobOpportunities(1, 10).pipe(catchError(() => of([]))),
      applications: this.api.getPlacementDrives().pipe(catchError(() => of([]))),
      assessments: this.api.getAssessments().pipe(catchError(() => of([]))),
      badges: this.api.getEarnedAssessmentBadges().pipe(catchError(() => of([]))),
      learning: this.api.getLearningPosts().pipe(catchError(() => of([]))),
      alumni: this.api.getAlumniProfiles().pipe(catchError(() => of([]))),
      referrals: this.api.getAlumniReferrals().pipe(catchError(() => of([]))),
      careerProfile: this.api.getStudentCareerProfile(studentId).pipe(catchError(() => of(null))),
      resumes: this.api.getStudentResumes(studentId).pipe(catchError(() => of([]))),
      projects: this.api.getStudentProjects().pipe(catchError(() => of([]))),
      conflicts: deptId
        ? this.api
            .detectTimetableConflicts({
              department_id: deptId,
              starts_at: new Date().toISOString(),
              ends_at: new Date(Date.now() + 7 * 86400000).toISOString()
            })
            .pipe(catchError(() => of(null)))
        : of(null)
    })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => {
          this.actions.set(data.actions);
          this.portal.pendingSlaCount.set(data.actions.filter(a => !a.completed_at).length);
          this.compliance.set(data.compliance);
          this.skillGap.set(data.skillGap);
          this.events.set(data.events.slice(0, 5));
          this.priorityDrives.set(data.jobs.slice(0, 5));
          this.portal.totalOpenJobsCount.set(data.jobs.length);
          this.conflicts.set(data.conflicts);

          this.applications.set(data.applications);
          this.assessments.set(data.assessments);
          this.badges.set(data.badges);
          this.learningPosts.set(data.learning);
          this.alumniProfiles.set(data.alumni);
          this.alumniReferrals.set(data.referrals);
          this.careerProfile.set(data.careerProfile);
          this.resumes.set(data.resumes);
          this.projects.set(data.projects);

          // Initialize chat if conversations exist
          const convs = this.portal.conversations();
          if (convs.length > 0 && !this.selectedConversationId()) {
            this.selectConversation(convs[0].id);
          }
        },
        error: (error) => {
          this.loadError.set(error?.error?.message || error?.message || 'The student dashboard API data could not be loaded.');
        }
      });
  }

  selectConversation(conversationId: string): void {
    this.selectedConversationId.set(conversationId);
    this.portal.activeConversationId.set(conversationId);
    this.api.getMessagesInConversation(conversationId).subscribe({
      next: (msgs) => this.chatMessages.set(msgs),
      error: () => this.chatMessages.set([])
    });
  }

  sendChatMessage(): void {
    const text = this.chatInputText().trim();
    const convId = this.selectedConversationId();
    const studentId = this.auth.studentId();
    if (!text || !studentId) return;

    this.isSendingChat.set(true);
    const optimisticMsg: ChatMessageDto = {
      id: `temp-${Date.now()}`,
      conversation_id: convId || '',
      sender_id: this.auth.userId(),
      content: text,
      created_at: new Date().toISOString()
    };
    this.chatMessages.update(list => [...list, optimisticMsg]);
    this.chatInputText.set('');

    this.api.askTacieAdvisor({ student_id: studentId, message: text }).subscribe({
      next: (res) => {
        this.isSendingChat.set(false);
        const aiMsg: ChatMessageDto = {
          id: `ai-${Date.now()}`,
          conversation_id: convId || '',
          sender_id: 'tacie-ai',
          content: res.content || res.reply || 'Analysis completed.',
          created_at: new Date().toISOString()
        };
        this.chatMessages.update(list => [...list, aiMsg]);
      },
      error: () => {
        this.isSendingChat.set(false);
        this.portal.showToast('TACIE Advisor response failed');
      }
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

  acceptOffer(offerId: string): void {
    const studentId = this.auth.studentId();
    if (!studentId) return;
    this.api.acceptJobOffer(offerId, {
      studentId,
      signed_document_object_key: `tenants/apex/offers/${studentId}/signed.pdf`,
      signature_reference: `SIG-${Date.now()}`
    }).subscribe({
      next: () => {
        this.portal.showToast('Offer accepted and signed successfully!');
        this.loadData(studentId);
      },
      error: (err) => {
        this.portal.showToast(err?.error?.message || 'Could not accept offer');
      }
    });
  }

  getPageTitle(page: PageId): string {
    switch (page) {
      case 'home': return 'Command Center';
      case 'jobs': return 'Campus Placement Drives';
      case 'apps': return 'My Applications & Offers';
      case 'grow': return 'Skills & Assessments';
      case 'people': return 'Alumni Network & Referrals';
      case 'msgs': return 'Messages & TACIE AI Advisor';
      case 'more': return 'My Career Dossier & Profile';
      default: return 'Placement Portal';
    }
  }

  getBarToneClass(tone?: string): string {
    switch (tone) {
      case 'good': return 'bg-[#127a55]';
      case 'warn': return 'bg-[#d98b13]';
      case 'bad':  return 'bg-[#b42318]';
      default:     return 'bg-[#4a33e0]';
    }
  }

  formatCurrency(value: unknown): string {
    const number = Number(value ?? 0);
    return Number.isFinite(number)
      ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(number)
      : '—';
  }

  logout(): void {
    this.auth.clearSessionOnLogout();
  }
}
