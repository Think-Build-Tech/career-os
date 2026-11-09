// apps/web/src/app/services/platform-admin-state.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { finalize, forkJoin } from 'rxjs';
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

  // ─── Loading & Error State ─────────────────────────────────────────────
  readonly isLoading = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);
  readonly loadError = signal<string | null>(null);
  readonly actionError = signal<string | null>(null);
  readonly toastMessage = signal<string | null>(null);

  // ─── Live Data Signals (Backed by Real API / DB) ───────────────────────
  readonly dashboardMetrics = signal<AdminDashboardDto | null>(null);
  readonly adminHealth = signal<AdminHealthDto | null>(null);
  readonly tenants = signal<TenantDto[]>([]);
  readonly institutionsSearchQuery = signal<string>('');
  readonly subscriptions = signal<SubscriptionDto[]>([]);
  readonly platformAdmins = signal<PlatformAdminDto[]>([]);
  readonly provisioningJobs = signal<ProvisioningJobDto[]>([]);
  readonly auditLogs = signal<AuditLogDto[]>([]);
  readonly integrations = signal<any[]>([]);
  readonly syncJobs = signal<any[]>([]);
  readonly aiRuns = signal<any[]>([]);
  readonly resolvableColleges = signal<TenantDto[]>([]);

  readonly platformSettings = signal<PlatformSettingsDto | null>(null);

  // ─── Filter & Search Computeds ─────────────────────────────────────────
  readonly filteredTenants = computed(() => {
    const q = this.institutionsSearchQuery().toLowerCase().trim();
    const list = this.tenants();
    if (!q) return list;
    return list.filter(
      (t) =>
        t.name?.toLowerCase().includes(q) ||
        t.college_code?.includes(q) ||
        (t.slug && t.slug.toLowerCase().includes(q))
    );
  });

  readonly tenantStatusCounts = computed(() => {
    const list = this.tenants();
    return {
      active: list.filter((t) => t.status === 'ACTIVE').length,
      provisioning: list.filter((t) => t.status === 'PROVISIONING' || t.status === 'CREATING').length,
      attention: list.filter((t) => t.status === 'ATTENTION' || t.status === 'MIGRATION_ISSUE').length,
    };
  });

  readonly databaseTenants = computed(() => {
    return this.tenants().filter((t) => t.database?.database_name);
  });

  readonly aiTenantSearchQuery = signal<string>('');

  readonly aiByFeature = computed(() => {
    const runs = this.aiRuns();
    const map = new Map<string, { feature: string; requests: number; input_tokens: number; output_tokens: number }>();
    for (const r of runs) {
      const feat = r.feature_name || r.feature || 'General AI';
      const existing = map.get(feat) || { feature: feat, requests: 0, input_tokens: 0, output_tokens: 0 };
      existing.requests += 1;
      existing.input_tokens += Number(r.prompt_tokens || r.input_tokens || 0);
      existing.output_tokens += Number(r.completion_tokens || r.output_tokens || 0);
      map.set(feat, existing);
    }
    return Array.from(map.values());
  });

  readonly aiByInstitution = computed(() => {
    const q = this.aiTenantSearchQuery().toLowerCase().trim();
    const rows = this.dashboardMetrics()?.aiByInstitution;
    const list = Array.isArray(rows) ? rows : [];
    if (!q) return list;
    return list.filter((item: any) => JSON.stringify(item).toLowerCase().includes(q));
  });

  // ─── Modal & Drawer Signals ────────────────────────────────────────────
  readonly isAddInstitutionDrawerOpen = signal<boolean>(false);
  readonly newInstitutionForm = signal({
    collegeCode: '',
    name: '',
    slug: '',
    institutionType: 'ENGINEERING_COLLEGE',
    status: 'ACTIVE',
    planCode: 'ENTERPRISE',
  });

  readonly inviteAdminEmail = signal<string>('');
  readonly inviteAdminAccessLevel = signal<string>('SUPER_ADMIN');

  readonly isCollegeLoginModalOpen = signal<boolean>(false);
  readonly loginCodeInput = signal<string>('');
  readonly isResolvingCollege = signal<boolean>(false);
  readonly resolvedCollegeResult = signal<CollegeResolutionResult | null>(null);
  readonly collegeResolutionError = signal<string | null>(null);

  constructor() {
    this.refreshAllData();
  }

  // ─── Live Data Refresh ─────────────────────────────────────────────────
  refreshAllData(): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    forkJoin({
      dashboard: this.api.getDashboard(),
      health: this.api.getAdminHealth(),
      tenants: this.api.getTenants(1, 100),
      subs: this.api.getSubscriptions(1, 100),
      admins: this.api.getPlatformAdmins(1, 100),
      jobs: this.api.getProvisioningJobs(1, 100),
      logs: this.api.getAuditLogs(1, 50),
      settings: this.api.getPlatformSettings(),
      colleges: this.api.getResolvableColleges(),
      integrations: this.api.getIntegrations(),
      syncJobs: this.api.getSyncJobs(),
      aiRuns: this.api.getAiRuns(50),
    }).pipe(finalize(() => this.isLoading.set(false))).subscribe({
      next: ({
        dashboard,
        health,
        tenants,
        subs,
        admins,
        jobs,
        logs,
        settings,
        colleges,
        integrations,
        syncJobs,
        aiRuns,
      }) => {
        this.dashboardMetrics.set(dashboard);
        this.adminHealth.set(health);
        this.tenants.set(tenants);
        this.subscriptions.set(subs);
        this.platformAdmins.set(admins);
        this.provisioningJobs.set(jobs);
        this.auditLogs.set(logs);
        this.platformSettings.set(settings);
        this.resolvableColleges.set(colleges);
        this.integrations.set(integrations);
        this.syncJobs.set(syncJobs);
        this.aiRuns.set(aiRuns);
      },
      error: (err) => {
        this.loadError.set(err?.error?.message || err?.message || 'Failed to fetch platform admin data from API');
      },
    });
  }

  navigateTo(page: AdminPageId): void {
    this.activePage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ─── Settings Toggles ──────────────────────────────────────────────────
  toggleSetting(key: keyof PlatformSettingsDto): void {
    const current = this.platformSettings();
    if (!current) return;
    const updated = { ...current, [key]: !current[key] };
    this.api.updatePlatformSettings(updated).subscribe({
      next: (saved) => {
        this.platformSettings.set(saved);
        this.showToast(`Updated setting: ${key}`);
      },
      error: (err) => this.actionError.set(err?.error?.message || err?.message || 'Failed to update setting'),
    });
  }

  // ─── Add Institution ───────────────────────────────────────────────────
  openAddInstitutionDrawer(): void {
    this.newInstitutionForm.set({
      collegeCode: '',
      name: '',
      slug: '',
      institutionType: 'ENGINEERING_COLLEGE',
      status: 'ACTIVE',
      planCode: 'ENTERPRISE',
    });
    this.isAddInstitutionDrawerOpen.set(true);
  }

  closeAddInstitutionDrawer(): void {
    this.isAddInstitutionDrawerOpen.set(false);
  }

  submitNewInstitution(): void {
    const f = this.newInstitutionForm();
    if (!f.name?.trim() || !f.collegeCode?.trim()) {
      this.actionError.set('Institution name and college code are required.');
      return;
    }
    const slug = (f.slug || f.name).toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    this.isSaving.set(true);
    this.actionError.set(null);

    this.api
      .createTenant({
        college_code: f.collegeCode.trim(),
        name: f.name.trim(),
        slug,
        institution_type: f.institutionType,
        plan_code: f.planCode,
        status: f.status,
      })
      .subscribe({
        next: (created) => {
          this.isSaving.set(false);
          this.closeAddInstitutionDrawer();
          this.showToast(`Institution ${created.name || f.name} (${f.collegeCode}) provisioned successfully!`);
          this.refreshAllData();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.actionError.set(err?.error?.message || err?.message || 'Failed to create tenant through API.');
        },
      });
  }

  deleteTenant(tenant: TenantDto): void {
    if (!confirm(`Are you sure you want to delete tenant "${tenant.name}" (${tenant.college_code})?`)) {
      return;
    }
    this.isSaving.set(true);
    this.api.deleteTenant(tenant.id).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.tenants.update((list) => list.filter((t) => t.id !== tenant.id));
        this.showToast(`Tenant ${tenant.name} deleted.`);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.actionError.set(err?.error?.message || err?.message || 'Failed to delete tenant');
      },
    });
  }

  // ─── Platform Admins Management ────────────────────────────────────────
  invitePlatformAdmin(): void {
    const email = this.inviteAdminEmail().trim();
    if (!email) {
      this.actionError.set('Admin email is required');
      return;
    }
    this.isSaving.set(true);
    this.actionError.set(null);

    this.api
      .createPlatformAdmin({
        email,
        access_level: this.inviteAdminAccessLevel(),
        status: 'ACTIVE',
      })
      .subscribe({
        next: (created) => {
          this.isSaving.set(false);
          this.inviteAdminEmail.set('');
          this.showToast(`Administrator invited successfully!`);
          this.refreshAllData();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.actionError.set(err?.error?.message || err?.message || 'Failed to invite platform admin');
        },
      });
  }

  updateAdminAccess(admin: PlatformAdminDto, accessLevel: string): void {
    this.isSaving.set(true);
    this.api.updatePlatformAdmin(admin.id, { access_level: accessLevel }).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.platformAdmins.update((list) =>
          list.map((a) => (a.id === admin.id ? { ...a, access_level: accessLevel } : a))
        );
        this.showToast(`Admin access updated to ${accessLevel}`);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.actionError.set(err?.error?.message || 'Failed to update admin access');
      },
    });
  }

  revokePlatformAdmin(admin: PlatformAdminDto): void {
    if (!confirm(`Revoke platform administrator privileges for ${admin.name || admin.email || admin.id}?`)) {
      return;
    }
    this.isSaving.set(true);
    this.api.deletePlatformAdmin(admin.id).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.platformAdmins.update((list) => list.filter((a) => a.id !== admin.id));
        this.showToast(`Administrator privileges revoked.`);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.actionError.set(err?.error?.message || 'Failed to revoke administrator');
      },
    });
  }

  // ─── College Login & Tenant DB Resolution ──────────────────────────────
  openCollegeLoginModal(): void {
    this.loginCodeInput.set(this.auth.collegeCode() || '');
    this.collegeResolutionError.set(null);
    this.resolvedCollegeResult.set(null);
    this.isCollegeLoginModalOpen.set(true);
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
        this.collegeResolutionError.set(err?.error?.message || `No institution found for "${code}".`);
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
      `Active Tenant Switched: ${res.tenant.name} (${res.tenant.college_code}) · DB: ${res.isolation?.database_name}`
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
