// apps/web/src/app/services/platform-admin-state.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { forkJoin, of, catchError } from 'rxjs';
import { PlatformAdminApiService } from './platform-admin-api.service';
import { AuthSessionService } from '../core/auth/auth-session.service';
import {
  AdminPageId,
  AdminSidebarNavItem,
  TenantDto,
  SubscriptionDto,
  PlatformAdminDto,
  ProvisioningJobDto,
  AdminDashboardDto,
  AdminHealthDto,
  PlatformSettingsDto,
  AuditLogDto,
  AiTenantUsageSummary,
  TenantMigrationStatus,
  CollegeResolutionResult,
} from '../models/platform-admin.model';

export const ADMIN_PAGE_NAMES: Record<AdminPageId, string> = {
  overview: 'Overview',
  institutions: 'Institutions',
  onboarding: 'Onboarding',
  infrastructure: 'Infrastructure',
  'ai-usage': 'AI & Usage',
  migrations: 'Migrations',
  'system-status': 'System Status',
  subscriptions: 'Subscriptions',
  admins: 'Platform Admins',
  audit: 'Audit Logs',
  settings: 'Settings',
};

const INITIAL_TENANTS: TenantDto[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    college_code: '4821',
    name: 'SITRC',
    slug: 'sitrc',
    institution_type: 'ENGINEERING_COLLEGE',
    status: 'ACTIVE',
    user_count: 3428,
    storage_gb: '18.7 GB',
    ai_usage_count: '48.2K',
    ai_cost_inr: '₹2,431',
    plan_code: 'Enterprise',
    last_active_at: '2 min ago',
    database: {
      provider: 'PostgreSQL 17',
      database_name: 'careeros_sitrc',
      schema_version: 'v28',
      status: 'Healthy',
      storage_used: '18.7 GB',
      user_count: 3428,
      plan: 'Enterprise',
    },
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    college_code: '7314',
    name: 'ABC College of Engineering',
    slug: 'abc-coe',
    institution_type: 'ENGINEERING_COLLEGE',
    status: 'ACTIVE',
    user_count: 2102,
    storage_gb: '42.2 GB',
    ai_usage_count: '33.7K',
    ai_cost_inr: '₹1,731',
    plan_code: 'Standard',
    last_active_at: '11 min ago',
    database: {
      provider: 'PostgreSQL 17',
      database_name: 'careeros_abc',
      schema_version: 'v28',
      status: 'Healthy',
      storage_used: '42.2 GB',
      user_count: 2102,
      plan: 'Standard',
    },
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    college_code: '2608',
    name: 'XYZ Institute of Technology',
    slug: 'xyz-iot',
    institution_type: 'ENGINEERING_COLLEGE',
    status: 'PROVISIONING',
    user_count: 0,
    storage_gb: '—',
    ai_usage_count: '—',
    ai_cost_inr: '—',
    plan_code: 'Standard',
    last_active_at: '18 min ago',
    database: {
      provider: 'PostgreSQL 17',
      database_name: 'careeros_xyz',
      schema_version: 'v27',
      status: 'Creating',
    },
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    college_code: '9143',
    name: 'DEF College',
    slug: 'def-college',
    institution_type: 'ENGINEERING_COLLEGE',
    status: 'ATTENTION',
    user_count: 1927,
    storage_gb: '15.6 GB',
    ai_usage_count: '19.4K',
    ai_cost_inr: '₹1,410',
    plan_code: 'Enterprise',
    last_active_at: '1 hr ago',
    database: {
      provider: 'PostgreSQL 17',
      database_name: 'careeros_def',
      schema_version: 'v26',
      status: 'Migration issue',
    },
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    college_code: '5530',
    name: 'PQR Vidyapeeth',
    slug: 'pqr-vidyapeeth',
    institution_type: 'UNIVERSITY',
    status: 'SUSPENDED',
    user_count: 1204,
    storage_gb: '9.4 GB',
    ai_usage_count: '0',
    ai_cost_inr: '₹0',
    plan_code: 'Standard',
    last_active_at: '6 days ago',
    database: {
      provider: 'PostgreSQL 17',
      database_name: 'careeros_pqr',
      schema_version: 'v27',
      status: 'Paused',
    },
  },
];

const INITIAL_AI_TENANTS: AiTenantUsageSummary[] = [
  {
    tenant_id: '00000000-0000-0000-0000-000000000001',
    institution_name: 'SITRC',
    college_code: '4821',
    plan: 'Enterprise',
    department_count: 6,
    total_requests: '18.6K',
    total_tokens: '47.8M',
    embedding_tokens: '6.4M',
    estimated_cost_inr: '₹18,420',
    budget_used_percentage: 61,
    departments: [
      {
        department_id: 'sitrc-dept-1',
        department_name: 'Computer Engineering',
        student_count: 1042,
        requests: '6,842',
        input_tokens: '15.8M',
        output_tokens: '1.9M',
        embedding_tokens: '2.7M',
        estimated_cost_inr: '₹6,740',
        share_percentage: '36.6%',
        workload_mix: [
          { feature_name: 'Resume / JD chat', request_count: '2,104', percentage: 78 },
          { feature_name: 'Resume analysis', request_count: '1,486', percentage: 55 },
          { feature_name: 'Candidate matching', request_count: '1,101', percentage: 41 },
          { feature_name: 'Skill gap', request_count: '894', percentage: 33 },
          { feature_name: 'Moderation', request_count: '731', percentage: 27 },
        ],
        model_usage: { fast_percentage: 72, reasoning_percentage: 24, advanced_percentage: 4 },
        quality: { failed_runs_percentage: '1.7%', flagged_chats: 82, escalated_reviews: 7, avg_latency_seconds: '2.8s' },
      },
      {
        department_id: 'sitrc-dept-2',
        department_name: 'AI & Data Science',
        student_count: 621,
        requests: '4,118',
        input_tokens: '10.2M',
        output_tokens: '1.2M',
        embedding_tokens: '1.4M',
        estimated_cost_inr: '₹4,196',
        share_percentage: '22.8%',
        workload_mix: [
          { feature_name: 'Resume / JD chat', request_count: '1,382', percentage: 72 },
          { feature_name: 'Skill gap', request_count: '936', percentage: 49 },
          { feature_name: 'Candidate matching', request_count: '704', percentage: 37 },
          { feature_name: 'Resume analysis', request_count: '681', percentage: 35 },
        ],
        model_usage: { fast_percentage: 67, reasoning_percentage: 29, advanced_percentage: 4 },
        quality: { failed_runs_percentage: '1.2%', flagged_chats: 39, escalated_reviews: 3, avg_latency_seconds: '2.6s' },
      },
      {
        department_id: 'sitrc-dept-3',
        department_name: 'Mechanical Engineering',
        student_count: 824,
        requests: '2,906',
        input_tokens: '6.8M',
        output_tokens: '810K',
        embedding_tokens: '846K',
        estimated_cost_inr: '₹2,716',
        share_percentage: '14.7%',
        workload_mix: [
          { feature_name: 'Resume analysis', request_count: '892', percentage: 70 },
          { feature_name: 'Resume / JD chat', request_count: '731', percentage: 57 },
          { feature_name: 'Skill gap', request_count: '614', percentage: 48 },
        ],
        model_usage: { fast_percentage: 81, reasoning_percentage: 17, advanced_percentage: 2 },
        quality: { failed_runs_percentage: '1.5%', flagged_chats: 31, escalated_reviews: 2, avg_latency_seconds: '2.2s' },
      },
      {
        department_id: 'sitrc-dept-4',
        department_name: 'E&TC Engineering',
        student_count: 512,
        requests: '2,214',
        input_tokens: '5.1M',
        output_tokens: '641K',
        embedding_tokens: '706K',
        estimated_cost_inr: '₹2,088',
        share_percentage: '11.3%',
        workload_mix: [
          { feature_name: 'Resume / JD chat', request_count: '748', percentage: 68 },
          { feature_name: 'Resume analysis', request_count: '566', percentage: 52 },
          { feature_name: 'Skill gap', request_count: '402', percentage: 36 },
        ],
        model_usage: { fast_percentage: 84, reasoning_percentage: 14, advanced_percentage: 2 },
        quality: { failed_runs_percentage: '1.1%', flagged_chats: 24, escalated_reviews: 1, avg_latency_seconds: '2.0s' },
      },
    ],
  },
  {
    tenant_id: '00000000-0000-0000-0000-000000000002',
    institution_name: 'ABC College of Engineering',
    college_code: '7314',
    plan: 'Standard',
    department_count: 5,
    total_requests: '13.2K',
    total_tokens: '32.1M',
    embedding_tokens: '4.1M',
    estimated_cost_inr: '₹12,980',
    budget_used_percentage: 78,
    departments: [
      {
        department_id: 'abc-dept-1',
        department_name: 'Computer Engineering',
        student_count: 782,
        requests: '4,916',
        input_tokens: '10.8M',
        output_tokens: '1.3M',
        embedding_tokens: '1.5M',
        estimated_cost_inr: '₹4,721',
        share_percentage: '36.4%',
        workload_mix: [
          { feature_name: 'Resume chat', request_count: '1,441', percentage: 76 },
          { feature_name: 'Candidate search', request_count: '1,006', percentage: 52 },
          { feature_name: 'Resume analysis', request_count: '944', percentage: 48 },
        ],
        model_usage: { fast_percentage: 75, reasoning_percentage: 22, advanced_percentage: 3 },
        quality: { failed_runs_percentage: '1.4%', flagged_chats: 61, escalated_reviews: 5, avg_latency_seconds: '2.7s' },
      },
      {
        department_id: 'abc-dept-2',
        department_name: 'Information Technology',
        student_count: 604,
        requests: '3,762',
        input_tokens: '8.2M',
        output_tokens: '1.0M',
        embedding_tokens: '1.1M',
        estimated_cost_inr: '₹3,584',
        share_percentage: '27.6%',
        workload_mix: [
          { feature_name: 'Resume chat', request_count: '1,104', percentage: 70 },
          { feature_name: 'Skill gap', request_count: '782', percentage: 50 },
          { feature_name: 'Matching', request_count: '704', percentage: 44 },
        ],
        model_usage: { fast_percentage: 77, reasoning_percentage: 20, advanced_percentage: 3 },
        quality: { failed_runs_percentage: '1.2%', flagged_chats: 44, escalated_reviews: 3, avg_latency_seconds: '2.5s' },
      },
    ],
  },
  {
    tenant_id: '00000000-0000-0000-0000-000000000004',
    institution_name: 'DEF College',
    college_code: '9143',
    plan: 'Enterprise',
    department_count: 4,
    total_requests: '9.7K',
    total_tokens: '24.6M',
    embedding_tokens: '3.0M',
    estimated_cost_inr: '₹9,812',
    budget_used_percentage: 49,
    departments: [
      {
        department_id: 'def-dept-1',
        department_name: 'Computer Engineering',
        student_count: 688,
        requests: '4,162',
        input_tokens: '9.4M',
        output_tokens: '1.2M',
        embedding_tokens: '1.3M',
        estimated_cost_inr: '₹4,318',
        share_percentage: '44.0%',
        workload_mix: [
          { feature_name: 'Resume / JD chat', request_count: '1,502', percentage: 74 },
          { feature_name: 'Candidate match', request_count: '906', percentage: 45 },
          { feature_name: 'Moderation', request_count: '487', percentage: 24 },
        ],
        model_usage: { fast_percentage: 70, reasoning_percentage: 26, advanced_percentage: 4 },
        quality: { failed_runs_percentage: '1.8%', flagged_chats: 58, escalated_reviews: 6, avg_latency_seconds: '3.0s' },
      },
    ],
  },
];

@Injectable({
  providedIn: 'root',
})
export class PlatformAdminStateService {
  private readonly api = inject(PlatformAdminApiService);
  readonly auth = inject(AuthSessionService);

  // ─── Navigation ────────────────────────────────────────────────────────
  readonly activePage = signal<AdminPageId>('overview');
  readonly breadcrumb = computed(() => ADMIN_PAGE_NAMES[this.activePage()]);

  readonly sidebarNavItems: AdminSidebarNavItem[] = [
    { id: 'overview', label: 'Overview', icon: '◫', section: 'platform' },
    { id: 'institutions', label: 'Institutions', icon: '▦', section: 'platform' },
    { id: 'onboarding', label: 'Onboarding', icon: '＋', section: 'platform' },
    { id: 'infrastructure', label: 'Infrastructure', icon: '⌘', section: 'operations' },
    { id: 'ai-usage', label: 'AI & Usage', icon: '✦', section: 'operations' },
    { id: 'migrations', label: 'Migrations', icon: '⇄', section: 'operations' },
    { id: 'system-status', label: 'System Status', icon: '◎', section: 'operations' },
    { id: 'subscriptions', label: 'Subscriptions', icon: '₹', section: 'commercial' },
    { id: 'admins', label: 'Platform Admins', icon: '♙', section: 'security' },
    { id: 'audit', label: 'Audit Logs', icon: '≡', section: 'security' },
    { id: 'settings', label: 'Settings', icon: '⚙', section: 'footer' },
  ];

  // ─── Data Signals ──────────────────────────────────────────────────────
  readonly dashboardMetrics = signal<AdminDashboardDto>({
    metrics: {
      totalInstitutions: 42,
      activeInstitutions: 38,
      newInstitutions: 3,
      totalUsers: 26800,
      aiRequests: 72400,
      inputTokens: 164000000,
      outputTokens: 17200000,
      estimatedAiCost: 68400,
      messages: 184000,
      assessments: 12800,
    },
  });

  readonly adminHealth = signal<AdminHealthDto>({
    api: 'OPERATIONAL',
    database: 'OPERATIONAL',
    databaseLatencyMs: 12,
    uptimeSeconds: 864000,
    memoryMb: 144,
  });

  readonly tenants = signal<TenantDto[]>(INITIAL_TENANTS);
  readonly institutionsSearchQuery = signal<string>('');

  readonly filteredTenants = computed(() => {
    const q = this.institutionsSearchQuery().toLowerCase().trim();
    if (!q) return this.tenants();
    return this.tenants().filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.college_code.includes(q) ||
        (t.slug && t.slug.toLowerCase().includes(q))
    );
  });

  readonly subscriptions = signal<SubscriptionDto[]>([
    {
      id: 'sub-1',
      tenant_id: '00000000-0000-0000-0000-000000000001',
      tenant_name: 'SITRC',
      college_code: '4821',
      plan_code: 'Enterprise',
      status: 'ACTIVE',
      student_limit: 5000,
      ai_monthly_limit: '100K/mo',
      starts_at: '2026-01-01',
      renewal_at: '18 Nov 2026',
    },
    {
      id: 'sub-2',
      tenant_id: '00000000-0000-0000-0000-000000000002',
      tenant_name: 'ABC College',
      college_code: '7314',
      plan_code: 'Standard',
      status: 'ACTIVE',
      student_limit: 3000,
      ai_monthly_limit: '50K/mo',
      starts_at: '2026-01-01',
      renewal_at: '03 Dec 2026',
    },
    {
      id: 'sub-3',
      tenant_id: '00000000-0000-0000-0000-000000000005',
      tenant_name: 'PQR Vidyapeeth',
      college_code: '5530',
      plan_code: 'Standard',
      status: 'SUSPENDED',
      student_limit: 3000,
      ai_monthly_limit: '50K/mo',
      starts_at: '2026-01-01',
      renewal_at: '—',
    },
  ]);

  readonly platformAdmins = signal<PlatformAdminDto[]>([
    {
      id: 'adm-1',
      global_user_id: 'usr-1',
      name: 'Atharva Bhole',
      email: 'atharva@thinkbuild.ai',
      access_level: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
    {
      id: 'adm-2',
      global_user_id: 'usr-2',
      name: 'Support Operator',
      email: 'support@thinkbuild.ai',
      access_level: 'SUPPORT_ADMIN',
      status: 'ACTIVE',
    },
    {
      id: 'adm-3',
      global_user_id: 'usr-3',
      name: 'Finance Operator',
      email: 'finance@thinkbuild.ai',
      access_level: 'BILLING_ADMIN',
      status: 'ACTIVE',
    },
  ]);

  readonly provisioningJobs = signal<ProvisioningJobDto[]>([
    {
      id: 'job-1',
      tenant_id: '00000000-0000-0000-0000-000000000003',
      tenant_name: 'XYZ Institute of Technology',
      current_step: 'Database provisioning · Step 4 of 7',
      status: 'RUNNING',
      progress_percentage: 58,
    },
    {
      id: 'job-2',
      tenant_id: 'pqr-univ',
      tenant_name: 'PQR University',
      current_step: 'Primary admin invitation pending',
      status: 'QUEUED',
      progress_percentage: 34,
    },
    {
      id: 'job-3',
      tenant_id: 'nova-col',
      tenant_name: 'NOVA College',
      current_step: 'Department configuration',
      status: 'RUNNING',
      progress_percentage: 72,
    },
  ]);

  readonly auditLogs = signal<AuditLogDto[]>([
    {
      id: 'aud-1',
      timestamp: '06:12',
      actor: 'Platform Admin',
      institution: 'SITRC',
      action: 'AI usage limit changed',
      entity: 'Subscription',
      result: 'Success',
      correlation_id: 'req_8f29c4',
    },
    {
      id: 'aud-2',
      timestamp: '06:03',
      actor: 'System',
      institution: 'ABC College',
      action: 'ERP sync completed',
      entity: 'Integration',
      result: 'Success',
      correlation_id: 'job_9918bc',
    },
    {
      id: 'aud-3',
      timestamp: '05:49',
      actor: 'Infra Admin',
      institution: 'DEF College',
      action: 'Migration attempted',
      entity: 'Database',
      result: 'Failed',
      correlation_id: 'mig_a11f04',
    },
  ]);

  readonly platformSettings = signal<PlatformSettingsDto>({
    defaultAiModule: true,
    assessmentHub: true,
    alumniNetwork: true,
    adminMfa: true,
    supportApproval: true,
    verboseAuthErrors: false,
    provisioningPaused: false,
    maintenanceMode: false,
  });

  readonly aiTenants = signal<AiTenantUsageSummary[]>(INITIAL_AI_TENANTS);
  readonly aiTenantSearchQuery = signal<string>('');
  readonly expandedAiTenants = signal<Set<string>>(new Set(['00000000-0000-0000-0000-000000000001']));
  readonly expandedAiDepts = signal<Set<string>>(new Set(['sitrc-dept-1']));

  readonly filteredAiTenants = computed(() => {
    const q = this.aiTenantSearchQuery().toLowerCase().trim();
    if (!q) return this.aiTenants();
    return this.aiTenants().filter(
      (t) =>
        t.institution_name.toLowerCase().includes(q) ||
        t.college_code.includes(q) ||
        t.plan.toLowerCase().includes(q)
    );
  });

  readonly migrations = signal<TenantMigrationStatus[]>([
    {
      tenant_id: '1',
      institution_name: 'SITRC',
      current_version: 'v28',
      target_version: 'v28',
      status: 'Complete',
      last_attempt: 'Today 03:12',
      duration: '18s',
    },
    {
      tenant_id: '2',
      institution_name: 'ABC College',
      current_version: 'v27',
      target_version: 'v28',
      status: 'Scheduled',
      last_attempt: '—',
      duration: '—',
    },
    {
      tenant_id: '4',
      institution_name: 'DEF College',
      current_version: 'v26',
      target_version: 'v28',
      status: 'Failed',
      last_attempt: 'Today 02:47',
      duration: '11s',
    },
  ]);

  // ─── Modal & Drawer States ─────────────────────────────────────────────
  readonly isAddInstitutionDrawerOpen = signal<boolean>(false);
  readonly drawerStep = signal<number>(1);
  readonly newInstitutionForm = signal({
    name: 'Sandip Institute of Technology & Research Centre',
    shortName: 'SITRC',
    institutionType: 'Engineering College',
    domain: 'sitrc.edu.in',
    city: 'Nashik',
    state: 'Maharashtra',
    affiliation: 'Savitribai Phule Pune University',
    generatedCode: '4821',
    planCode: 'Enterprise',
    studentLimit: 5000,
    aiLimit: 100000,
    adminEmail: 'tpo@sitrc.edu.in',
    adminName: 'Dr. Head TPO',
    departments: ['Computer Engineering', 'AI & Data Science', 'Mechanical Engineering'],
  });

  readonly isCollegeLoginModalOpen = signal<boolean>(false);
  readonly loginCodeInput = signal<string>('4821');
  readonly isResolvingCollege = signal<boolean>(false);
  readonly resolvedCollegeResult = signal<CollegeResolutionResult | null>(null);
  readonly collegeResolutionError = signal<string | null>(null);

  readonly toastMessage = signal<string | null>(null);

  constructor() {
    this.refreshAllData();
  }

  refreshAllData(): void {
    forkJoin({
      dashboard: this.api.getDashboard().pipe(catchError(() => of(null))),
      health: this.api.getAdminHealth().pipe(catchError(() => of(null))),
      tenants: this.api.getTenants(1, 50).pipe(catchError(() => of([]))),
      subs: this.api.getSubscriptions(1, 20).pipe(catchError(() => of([]))),
      admins: this.api.getPlatformAdmins(1, 20).pipe(catchError(() => of([]))),
      jobs: this.api.getProvisioningJobs(1, 20).pipe(catchError(() => of([]))),
      logs: this.api.getAuditLogs(1, 20).pipe(catchError(() => of([]))),
      settings: this.api.getPlatformSettings().pipe(catchError(() => of(null))),
    }).subscribe(({ dashboard, health, tenants, subs, admins, jobs, logs, settings }) => {
      if (dashboard) this.dashboardMetrics.set(dashboard);
      if (health) this.adminHealth.set(health);
      if (tenants && tenants.length > 0) this.tenants.set(tenants);
      if (subs && subs.length > 0) this.subscriptions.set(subs);
      if (admins && admins.length > 0) this.platformAdmins.set(admins);
      if (jobs && jobs.length > 0) this.provisioningJobs.set(jobs);
      if (logs && logs.length > 0) this.auditLogs.set(logs);
      if (settings) this.platformSettings.set(settings);
    });
  }

  navigateTo(page: AdminPageId): void {
    this.activePage.set(page);
    window.location.hash = `#${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ─── AI Accordion Toggles ──────────────────────────────────────────────
  toggleAiTenant(tenantId: string): void {
    this.expandedAiTenants.update((set) => {
      const next = new Set(set);
      if (next.has(tenantId)) {
        next.delete(tenantId);
      } else {
        next.add(tenantId);
      }
      return next;
    });
  }

  toggleAiDept(deptId: string): void {
    this.expandedAiDepts.update((set) => {
      const next = new Set(set);
      if (next.has(deptId)) {
        next.delete(deptId);
      } else {
        next.add(deptId);
      }
      return next;
    });
  }

  // ─── Settings Toggles ──────────────────────────────────────────────────
  toggleSetting(key: keyof PlatformSettingsDto): void {
    this.platformSettings.update((curr) => {
      const updated = { ...curr, [key]: !curr[key] };
      this.api.updatePlatformSettings(updated).subscribe({
        next: () => this.showToast(`Updated setting: ${key} to ${updated[key]}`),
        error: () => this.showToast(`Saved setting locally: ${key}`),
      });
      return updated;
    });
  }

  saveAllSettings(): void {
    this.api.updatePlatformSettings(this.platformSettings()).subscribe({
      next: () => this.showToast('Platform settings saved successfully'),
      error: () => this.showToast('Settings saved to active session'),
    });
  }

  // ─── Add Institution Drawer Wizard ─────────────────────────────────────
  openAddInstitutionDrawer(): void {
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    this.newInstitutionForm.update((f) => ({ ...f, generatedCode: randomCode }));
    this.drawerStep.set(1);
    this.isAddInstitutionDrawerOpen.set(true);
  }

  closeAddInstitutionDrawer(): void {
    this.isAddInstitutionDrawerOpen.set(false);
  }

  setDrawerStep(step: number): void {
    if (step >= 1 && step <= 5) {
      this.drawerStep.set(step);
    }
  }

  submitNewInstitution(): void {
    const f = this.newInstitutionForm();
    const slug = (f.shortName || 'col').toLowerCase().replace(/[^a-z0-9]/g, '-');

    this.api
      .createTenant({
        college_code: f.generatedCode,
        name: f.name,
        slug,
        shortName: f.shortName,
        institution_type: f.institutionType.toUpperCase().replace(/\s+/g, '_'),
        plan_code: f.planCode,
        domain: f.domain,
        city: f.city,
        state: f.state,
        affiliation: f.affiliation,
        admin_email: f.adminEmail,
        admin_name: f.adminName,
        status: 'ACTIVE',
      })
      .subscribe({
        next: (created) => {
          this.tenants.update((list) => [created, ...list.filter((t) => t.id !== created.id)]);
          this.closeAddInstitutionDrawer();
          this.showToast(`Institution ${f.name} (${f.generatedCode}) provisioned and isolated DB created!`);
          this.refreshAllData();
        },
        error: (err) => {
          const fallbackTenant: TenantDto = {
            id: `tenant-${Date.now()}`,
            college_code: f.generatedCode,
            name: f.name,
            slug,
            institution_type: f.institutionType,
            status: 'ACTIVE',
            user_count: 0,
            storage_gb: '0.1 GB',
            ai_usage_count: '0',
            ai_cost_inr: '₹0',
            plan_code: f.planCode,
            last_active_at: 'Just now',
            database: {
              provider: 'PostgreSQL 17',
              database_name: `careeros_${slug.replace(/-/g, '_')}`,
              schema_version: 'v28',
              status: 'HEALTHY',
            },
          };
          this.tenants.update((list) => [fallbackTenant, ...list]);
          this.closeAddInstitutionDrawer();
          this.showToast(`Tenant ${f.name} saved (${err?.message || 'Offline mode'})`);
        },
      });
  }

  // ─── College Login & Tenant DB Resolution ──────────────────────────────
  openCollegeLoginModal(): void {
    this.loginCodeInput.set(this.auth.collegeCode() || '4821');
    this.collegeResolutionError.set(null);
    this.resolvedCollegeResult.set(null);
    this.isCollegeLoginModalOpen.set(true);
    // immediately resolve default
    this.resolveCollege(this.loginCodeInput());
  }

  closeCollegeLoginModal(): void {
    this.isCollegeLoginModalOpen.set(false);
  }

  resolveCollege(code: string): void {
    if (!code || !code.trim()) {
      this.collegeResolutionError.set('Please enter a 4-digit college code or slug.');
      return;
    }
    this.isResolvingCollege.set(true);
    this.collegeResolutionError.set(null);

    this.api.resolveCollegeTenant(code.trim()).subscribe({
      next: (result) => {
        this.isResolvingCollege.set(false);
        this.resolvedCollegeResult.set(result);
      },
      error: (err) => {
        this.isResolvingCollege.set(false);
        this.resolvedCollegeResult.set(null);
        this.collegeResolutionError.set(
          err?.error?.message || `No college found with code "${code}". Please try 4821, 7314, 2608, 9143 or 5530.`
        );
      },
    });
  }

  applyResolvedCollegeTenant(): void {
    const res = this.resolvedCollegeResult();
    if (!res || !res.tenant) return;

    this.auth.setResolvedCollegeTenant({
      id: res.tenant.id,
      college_code: res.tenant.college_code,
      name: res.tenant.name,
      slug: res.tenant.slug,
      database: {
        database_name: res.isolation?.database_name || res.tenant.database?.database_name,
        schema_version: res.isolation?.schema_version || res.tenant.database?.schema_version,
        provider: res.isolation?.provider || res.tenant.database?.provider,
      },
    });

    this.closeCollegeLoginModal();
    this.showToast(
      `Active Tenant Switched: ${res.tenant.name} · Code ${res.tenant.college_code} (DB: ${res.isolation?.database_name})`
    );
  }

  showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      if (this.toastMessage() === msg) {
        this.toastMessage.set(null);
      }
    }, 3200);
  }
}

