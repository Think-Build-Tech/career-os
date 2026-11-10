import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { AuthSessionService } from '../core/auth/auth-session.service';
import { ApiService } from './api.service';
import {
  PageId,
  ChatGroupKey,
  SidebarNavItem,
  UserDto,
  StudentProfileDto,
  AcademicRecordDto,
  InstitutionDto,
  ConversationDto,
  NotificationDto,
  SavedItemDto
} from '../models/api.model';

@Injectable({ providedIn: 'root' })
export class PortalStateService {
  private readonly auth = inject(AuthSessionService);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  // Live Backend Signals
  readonly currentUser = signal<UserDto | null>(null);
  readonly studentProfile = signal<StudentProfileDto | null>(null);
  readonly latestAcademicRecord = signal<AcademicRecordDto | null>(null);
  readonly currentInstitution = signal<InstitutionDto | null>(null);
  readonly notifications = signal<NotificationDto[]>([]);
  readonly conversations = signal<ConversationDto[]>([]);
  readonly savedItems = signal<SavedItemDto[]>([]);
  readonly isShellLoading = signal(false);
  readonly shellLoadError = signal<string | null>(null);

  readonly totalOpenJobsCount = signal<number>(0);
  readonly pendingSlaCount = signal<number>(0);
  readonly pendingOffersCount = signal<number>(0);

  // Navigation & Global UI Signals
  readonly activePage = signal<PageId>('home');
  readonly activeSubTab = signal<string | null>(null);
  readonly activeApplicationView = signal<'pipeline' | 'offers'>('pipeline');
  readonly activeConversationId = signal<string | null>(null);

  readonly isMessagesSubnavOpen = signal<boolean>(false);
  readonly isMobileChatThreadOpen = signal<boolean>(false);
  readonly isCommandPaletteOpen = signal<boolean>(false);
  readonly activeDrawer = signal<{ type: string; payload?: any } | null>(null);
  readonly toastMessage = signal<string | null>(null);

  readonly expandedChatGroups = signal<Record<ChatGroupKey, boolean>>({
    tacie: true,
    alumni: true
  });

  readonly studentDisplayInfo = computed(() => {
    const user = this.currentUser();
    const student = this.studentProfile();
    const academic = this.latestAcademicRecord();
    const inst = this.currentInstitution();

    const userName = user?.name || (user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : null);
    const fullName = userName ?? student?.user?.name ?? 'Student';
    const initials = fullName
      .split(' ')
      .filter(Boolean)
      .map(p => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return {
      initials: initials || 'ST',
      fullName,
      degree: student?.degree ?? '—',
      enrollmentNumber: student?.enrollment_number ?? '—',
      batchYear: student?.batch_year ?? '—',
      cgpa: academic?.cgpa ?? '—',
      instituteCode: inst?.code ?? '—',
      departmentLabel: student?.department_id ?? '—'
    };
  });

  readonly unreadNotificationCount = computed(() =>
    this.notifications().filter(n => !n.is_read && !n.read_at).length
  );

  readonly sidebarNavItems = computed<SidebarNavItem[]>(() => [
    {
      id: 'home',
      label: 'Home',
      iconId: 'i-home',
      badgeText: this.pendingSlaCount() > 0 ? `${this.pendingSlaCount()} SLA` : undefined,
      badgeTone: 'warn'
    },
    {
      id: 'jobs',
      label: 'Jobs',
      iconId: 'i-jobs',
      badgeText: this.totalOpenJobsCount() > 0 ? `${this.totalOpenJobsCount()}` : undefined,
      badgeTone: 'default'
    },
    {
      id: 'apps',
      label: 'Applications',
      iconId: 'i-apps',
      badgeText: this.pendingOffersCount() > 0 ? `${this.pendingOffersCount()} Offer` : undefined,
      badgeTone: 'warn'
    },
    { id: 'grow',   label: 'Grow',      iconId: 'i-grow' },
    { id: 'people', label: 'People',    iconId: 'i-people' },
    { id: 'msgs',   label: 'Messages',  iconId: 'i-msg' },
    { id: 'more',   label: 'My Career', iconId: 'i-more' }
  ]);

  readonly generalAdvisorConversations = computed(() =>
    this.conversations().filter(c => c.conversation_type === 'TACIE_ADVISOR' && !c.role_context)
  );

  readonly appliedRoleAdvisorConversations = computed(() =>
    this.conversations().filter(
      c => (c.conversation_type === 'TACIE_ADVISOR' && Boolean(c.role_context)) || c.conversation_type === 'PLACEMENT_SUPPORT'
    )
  );

  readonly alumniConversations = computed(() =>
    this.conversations().filter(
      c => c.conversation_type === 'ALUMNI_REFERRAL' || c.conversation_type === 'MENTORSHIP' || c.conversation_type === 'DIRECT'
    )
  );

  constructor() {
    effect(
      () => {
        const tenantId = this.auth.tenantId();
        const userId = this.auth.userId();
        const studentId = this.auth.studentId();
        if (tenantId && userId && studentId) {
          this.initializeShellData(userId, studentId);
        }
      },
      { allowSignalWrites: true }
    );
  }

  initializeShellData(userId: string, studentId: string): void {
    this.isShellLoading.set(true);
    this.shellLoadError.set(null);
    forkJoin({
      user: this.api.getUserById(userId),
      student: this.api.getStudentById(studentId),
      academics: this.api.getAcademicRecords(1, 10),
      institutions: this.api.getInstitutions(1, 5),
      opportunities: this.api.getJobOpportunities(1, 50),
      conversations: this.api.getConversations(),
      notifications: this.api.getNotifications(),
      saved: this.api.getSavedItems(userId)
    })
      .pipe(finalize(() => this.isShellLoading.set(false)))
      .subscribe({
        next: ({ user, student, academics, institutions, opportunities, conversations, notifications, saved }) => {
          this.currentUser.set(user);
          this.studentProfile.set(student);
          const rec = academics.find(r => r.student_id === studentId) ?? academics[0] ?? null;
          this.latestAcademicRecord.set(rec);
          this.currentInstitution.set(institutions[0] ?? null);
          this.totalOpenJobsCount.set(opportunities.length);
          this.conversations.set(conversations);
          this.notifications.set(notifications);
          this.savedItems.set(saved);

          if (conversations.length && !this.activeConversationId()) {
            this.activeConversationId.set(conversations[0].id);
          }
        },
        error: (error) => {
          const message = error?.error?.message || error?.message || 'The student portal API data could not be loaded.';
          this.shellLoadError.set(message);
        }
      }
    );
  }

  navigateToPage(page: PageId, subTab?: string, appView?: 'pipeline' | 'offers'): void {
    const isDesktop = window.innerWidth > 820;
    if (page === 'msgs' && this.activePage() === 'msgs' && isDesktop) {
      this.isMessagesSubnavOpen.update(v => !v);
      return;
    }
    this.activePage.set(page);
    this.isMessagesSubnavOpen.set(page === 'msgs');
    if (page === 'msgs' && !isDesktop) {
      this.isMobileChatThreadOpen.set(false);
    }
    if (subTab) this.activeSubTab.set(subTab);
    if (appView) this.activeApplicationView.set(appView);

    if (page === 'jobs') {
      this.router.navigate(['/jobs']);
    } else {
      this.router.navigate(['/portal']);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleChatSection(group: ChatGroupKey): void {
    this.expandedChatGroups.update(s => ({ ...s, [group]: !s[group] }));
  }

  selectConversation(conversationId: string): void {
    this.activeConversationId.set(conversationId);
    if (this.activePage() !== 'msgs') {
      this.activePage.set('msgs');
      this.isMessagesSubnavOpen.set(true);
    }
    this.isMobileChatThreadOpen.set(true);
  }

  createNewAdvisorThread(): void {
    const userId = this.auth.userId();
    if (!userId) return;
    this.api
      .createConversation({
        conversation_type: 'TACIE_ADVISOR',
        title: 'New Strategy Thread',
        participant_ids: [userId]
      })
      .subscribe({
        next: created => {
          this.conversations.update(list => [created, ...list]);
          this.selectConversation(created.id);
          this.showToast('New TACIE AI thread initialized');
        },
        error: () => this.showToast('Could not create TACIE thread')
      });
  }

  openActionModalOrDrawer(type: string, payload?: any): void {
    if (type === 'notifications') {
      this.notifications()
        .filter(n => !n.is_read && !n.read_at)
        .forEach(n => {
          this.api.markNotificationAsRead(n.id).subscribe(() => {
            this.notifications.update(list => list.map(i => (i.id === n.id ? { ...i, is_read: true } : i)));
          });
        });
    }
    if (type === 'cmd-palette') {
      this.isCommandPaletteOpen.set(true);
      return;
    }
    if (type === 'tpo-governance') {
      this.router.navigate(['/admin']);
      return;
    }
    this.activeDrawer.set({ type, payload });
  }

  closeDrawer(): void {
    this.activeDrawer.set(null);
  }

  closeCommandPalette(): void {
    this.isCommandPaletteOpen.set(false);
  }

  showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      if (this.toastMessage() === msg) this.toastMessage.set(null);
    }, 2600);
  }
}
