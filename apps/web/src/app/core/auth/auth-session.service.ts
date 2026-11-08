import { Injectable, signal, computed } from '@angular/core';

export interface TenantDatabaseIsolationInfo {
  provider: string;
  database_name: string;
  host_reference?: string;
  schema_version: string;
  status: string;
  region?: string;
}

export interface AuthenticatedSession {
  accessToken?: string;
  tenantId: string;
  userId: string;
  studentId: string;
  collegeCode?: string;
  institutionName?: string;
  institutionSlug?: string;
  databaseName?: string;
  schemaVersion?: string;
  databaseProvider?: string;
  departmentId?: string;
  institutionId?: string;
  roleCode: 'STUDENT' | 'CENTRAL_TPO' | 'DEPT_TPO' | 'ALUMNI' | 'RECRUITER' | 'SUPER_ADMIN';
}

const SESSION_STORAGE_KEY = 'careeros_active_session';

const DEFAULT_SESSION: AuthenticatedSession = {
  tenantId: '00000000-0000-0000-0000-000000000001',
  userId: 'fa100000-0000-0000-0000-000000000002',
  studentId: 'fa200000-0000-0000-0000-000000000002',
  collegeCode: '4821',
  institutionName: 'SITRC (Sandip Institute of Technology)',
  institutionSlug: 'sitrc',
  databaseName: 'careeros_sitrc',
  schemaVersion: 'v28',
  databaseProvider: 'PostgreSQL 17',
  roleCode: 'STUDENT',
};

@Injectable({
  providedIn: 'root',
})
export class AuthSessionService {
  private readonly sessionSignal = signal<AuthenticatedSession>(this.loadStoredSession() ?? DEFAULT_SESSION);
  readonly session = this.sessionSignal.asReadonly();

  readonly isAuthenticated = computed(() => Boolean(this.sessionSignal()?.tenantId && this.sessionSignal()?.userId));
  readonly tenantId = computed(() => this.sessionSignal()?.tenantId ?? DEFAULT_SESSION.tenantId);
  readonly userId = computed(() => this.sessionSignal()?.userId ?? DEFAULT_SESSION.userId);
  readonly studentId = computed(() => this.sessionSignal()?.studentId ?? DEFAULT_SESSION.studentId);
  readonly departmentId = computed(() => this.sessionSignal()?.departmentId ?? null);
  readonly collegeCode = computed(() => this.sessionSignal()?.collegeCode ?? '4821');
  readonly institutionName = computed(() => this.sessionSignal()?.institutionName ?? 'SITRC');
  readonly databaseName = computed(() => this.sessionSignal()?.databaseName ?? 'careeros_sitrc');
  readonly schemaVersion = computed(() => this.sessionSignal()?.schemaVersion ?? 'v28');
  readonly databaseProvider = computed(() => this.sessionSignal()?.databaseProvider ?? 'PostgreSQL 17');
  readonly roleCode = computed(() => this.sessionSignal()?.roleCode ?? 'SUPER_ADMIN');

  setSessionOnLogin(sessionData: AuthenticatedSession): void {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    } catch {
      // storage quota or private mode fallback
    }
    this.sessionSignal.set(sessionData);
  }

  setResolvedCollegeTenant(tenantInfo: {
    id: string;
    college_code: string;
    name: string;
    slug: string;
    database?: {
      database_name?: string;
      schema_version?: string;
      provider?: string;
    };
  }): void {
    const current = this.sessionSignal();
    const updated: AuthenticatedSession = {
      ...current,
      tenantId: tenantInfo.id,
      collegeCode: tenantInfo.college_code,
      institutionName: tenantInfo.name,
      institutionSlug: tenantInfo.slug,
      databaseName: tenantInfo.database?.database_name || `careeros_${tenantInfo.slug}`,
      schemaVersion: tenantInfo.database?.schema_version || 'v28',
      databaseProvider: tenantInfo.database?.provider || 'PostgreSQL 17',
    };
    this.setSessionOnLogin(updated);
  }

  switchActiveTenant(newTenantId: string, newCollegeCode?: string, newName?: string): void {
    const current = this.sessionSignal();
    const updated: AuthenticatedSession = {
      ...current,
      tenantId: newTenantId,
      collegeCode: newCollegeCode ?? current.collegeCode,
      institutionName: newName ?? current.institutionName,
    };
    this.setSessionOnLogin(updated);
  }

  clearSessionOnLogout(): void {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
    this.sessionSignal.set(DEFAULT_SESSION);
  }

  private loadStoredSession(): AuthenticatedSession | null {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthenticatedSession) : null;
    } catch {
      return null;
    }
  }
}
