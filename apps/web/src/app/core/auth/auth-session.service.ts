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
