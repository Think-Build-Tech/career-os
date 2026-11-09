import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

export type CareerOsRole = 'STUDENT' | 'CENTRAL_TPO' | 'DEPT_TPO' | 'ALUMNI' | 'RECRUITER'
  | 'SUPER_ADMIN' | 'SUPPORT_ADMIN' | 'BILLING_ADMIN' | 'INFRA_ADMIN' | 'OPERATOR';

export interface AuthenticatedSession {
  accessToken: string;
  isLoggedIn?: boolean;
  tenantId?: string;
  userId: string;
  studentId?: string;
  collegeCode?: string;
  institutionName?: string;
  institutionSlug?: string;
  databaseName?: string;
  schemaVersion?: string;
  databaseProvider?: string;
  departmentId?: string;
  institutionId?: string;
  roleCode: CareerOsRole;
  userEmail?: string;
  userName?: string;
}

const SESSION_STORAGE_KEY = 'careeros_active_session';
const ADMIN_ROLES: CareerOsRole[] = ['SUPER_ADMIN', 'SUPPORT_ADMIN', 'BILLING_ADMIN', 'INFRA_ADMIN', 'OPERATOR'];

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly router = inject(Router);
  private readonly sessionSignal = signal<AuthenticatedSession | null>(this.loadStoredSession());

  readonly session = this.sessionSignal.asReadonly();
  readonly isAuthenticated = computed(() => Boolean(this.sessionSignal()?.isLoggedIn && this.sessionSignal()?.accessToken));
  readonly isAdminAuthenticated = computed(() => {
    const session = this.sessionSignal();
    return Boolean(session?.isLoggedIn && session.accessToken && ADMIN_ROLES.includes(session.roleCode));
  });
  readonly isStudentAuthenticated = computed(() => {
    const session = this.sessionSignal();
    return Boolean(session?.isLoggedIn && session.accessToken && session.roleCode === 'STUDENT');
  });

  readonly tenantId = computed(() => this.sessionSignal()?.tenantId ?? '');
  readonly userId = computed(() => this.sessionSignal()?.userId ?? '');
  readonly studentId = computed(() => this.sessionSignal()?.studentId ?? '');
  readonly departmentId = computed(() => this.sessionSignal()?.departmentId ?? null);
  readonly collegeCode = computed(() => this.sessionSignal()?.collegeCode ?? '');
  readonly institutionName = computed(() => this.sessionSignal()?.institutionName ?? '');
  readonly databaseName = computed(() => this.sessionSignal()?.databaseName ?? '');
  readonly schemaVersion = computed(() => this.sessionSignal()?.schemaVersion ?? '');
  readonly databaseProvider = computed(() => this.sessionSignal()?.databaseProvider ?? '');
  readonly roleCode = computed(() => this.sessionSignal()?.roleCode ?? null);
  readonly userName = computed(() => this.sessionSignal()?.userName ?? '');
  readonly userEmail = computed(() => this.sessionSignal()?.userEmail ?? '');

  setSessionOnLogin(sessionData: AuthenticatedSession): void {
    const updated: AuthenticatedSession = { ...sessionData, isLoggedIn: true };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
    this.sessionSignal.set(updated);
  }

  setResolvedCollegeTenant(tenant: {
    id: string;
    college_code: string;
    name: string;
    slug?: string;
    database?: { database_name?: string; schema_version?: string; provider?: string };
  }): void {
    const current = this.sessionSignal();
    if (!current) return;
    const updated: AuthenticatedSession = {
      ...current,
      tenantId: tenant.id,
      collegeCode: tenant.college_code,
      institutionName: tenant.name,
      institutionSlug: tenant.slug,
      databaseName: tenant.database?.database_name,
      schemaVersion: tenant.database?.schema_version,
      databaseProvider: tenant.database?.provider,
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
    this.sessionSignal.set(updated);
  }

  loginAsCollegeStudent(collegeCode = '4821', studentEmail = 'aarav.sharma@sitrc.ac.in'): void {
    const current = this.sessionSignal();
    const studentSession: AuthenticatedSession = {
      isLoggedIn: true,
      accessToken: 'dev-student-token-aarav',
      tenantId: current?.tenantId || '00000000-0000-0000-0000-000000000001',
      userId: 'fa100000-0000-0000-0000-000000000002',
      studentId: 'fa200000-0000-0000-0000-000000000002',
      collegeCode: collegeCode || current?.collegeCode || '4821',
      institutionName: current?.institutionName || 'Sandip Institute of Technology & Research Centre (SITRC)',
      institutionSlug: current?.institutionSlug || 'sitrc',
      databaseName: current?.databaseName || 'careeros_sitrc',
      schemaVersion: current?.schemaVersion || 'v28',
      databaseProvider: current?.databaseProvider || 'PostgreSQL 17',
      roleCode: 'STUDENT',
      userEmail: studentEmail,
      userName: 'Aarav Sharma',
    };
    this.setSessionOnLogin(studentSession);
    this.router.navigate(['/portal']);
  }

  loginAsAdmin(adminEmail = 'super.admin@careeros.com'): void {
    const current = this.sessionSignal();
    const adminSession: AuthenticatedSession = {
      isLoggedIn: true,
      accessToken: 'dev-super-admin-token',
      tenantId: current?.tenantId || '00000000-0000-0000-0000-000000000001',
      userId: 'fa100000-0000-0000-0000-000000000001',
      studentId: '',
      collegeCode: current?.collegeCode || '4821',
      institutionName: current?.institutionName || 'Sandip Institute of Technology & Research Centre (SITRC)',
      institutionSlug: current?.institutionSlug || 'sitrc',
      databaseName: current?.databaseName || 'careeros_sitrc',
      schemaVersion: current?.schemaVersion || 'v28',
      databaseProvider: current?.databaseProvider || 'PostgreSQL 17',
      roleCode: 'SUPER_ADMIN',
      userEmail: adminEmail || 'super.admin@careeros.com',
      userName: 'Platform Super Admin',
    };
    this.setSessionOnLogin(adminSession);
    this.router.navigate(['/admin']);
  }

  clearSessionOnLogout(): void {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    this.sessionSignal.set(null);
    this.router.navigate(['/login']);
  }

  private loadStoredSession(): AuthenticatedSession | null {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as AuthenticatedSession;
      return parsed?.isLoggedIn && parsed.accessToken && parsed.userId ? parsed : null;
    } catch {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
  }
}
