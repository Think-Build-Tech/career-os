// apps/web/src/app/services/platform-admin-api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AdminApiResponse,
  AdminDashboardDto,
  AdminHealthDto,
  PlatformSettingsDto,
  TenantDto,
  CreateTenantRequest,
  SubscriptionDto,
  CreateSubscriptionRequest,
  PlatformAdminDto,
  CreatePlatformAdminRequest,
  ProvisioningJobDto,
  CreateProvisioningJobRequest,
  AuditLogDto,
  CollegeResolutionResult,
} from '../models/platform-admin.model';

@Injectable({
  providedIn: 'root',
})
export class PlatformAdminApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  // ─── College Tenant Resolution & Database Isolation ──────────────────
  resolveCollegeTenant(codeOrSlug: string): Observable<CollegeResolutionResult> {
    const trimmed = codeOrSlug.trim();
    return this.http
      .get<AdminApiResponse<any>>(`${this.baseUrl}/control/resolve/${encodeURIComponent(trimmed)}`)
      .pipe(
        map((res: any) => ({
          tenant: res.tenant,
          isolation: res.isolation,
          message: res.message,
        }))
      );
  }

  getResolvableColleges(): Observable<TenantDto[]> {
    return this.http.get<any>(`${this.baseUrl}/control/colleges`).pipe(
      map((res) => (Array.isArray(res.colleges) ? res.colleges : []))
    );
  }

  // ─── Dashboard & System Metrics ──────────────────────────────────────
  getDashboard(): Observable<AdminDashboardDto> {
    return this.http.get<any>(`${this.baseUrl}/admin/dashboard`).pipe(
      map((res) => (res.dashboard ? res.dashboard : res.data || res))
    );
  }

  getAdminHealth(): Observable<AdminHealthDto> {
    return this.http.get<any>(`${this.baseUrl}/admin/health`).pipe(
      map((res) => (res.health ? res.health : res.data || res))
    );
  }

  // ─── Settings ─────────────────────────────────────────────────────────
  getPlatformSettings(): Observable<PlatformSettingsDto> {
    return this.http.get<any>(`${this.baseUrl}/admin/settings`).pipe(
      map((res) => (res.settings ? res.settings : res.data || res))
    );
  }

  updatePlatformSettings(settings: Partial<PlatformSettingsDto>): Observable<PlatformSettingsDto> {
    return this.http.put<any>(`${this.baseUrl}/admin/settings`, settings).pipe(
      map((res) => (res.settings ? res.settings : res.data || res))
    );
  }

  // ─── Tenants ──────────────────────────────────────────────────────────
  getTenants(page = 1, limit = 50): Observable<TenantDto[]> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<any>(`${this.baseUrl}/control/tenants`, { params }).pipe(
      map((res) => {
        const list = Array.isArray(res.tenants?.rows)
          ? res.tenants.rows
          : Array.isArray(res.tenants)
          ? res.tenants
          : Array.isArray(res.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        return list;
      })
    );
  }

  getTenantById(id: string): Observable<TenantDto> {
    return this.http.get<any>(`${this.baseUrl}/control/tenants/${id}`).pipe(
      map((res) => res.tenant || res.data || res)
    );
  }

  createTenant(payload: any): Observable<TenantDto> {
    return this.http.post<any>(`${this.baseUrl}/control/tenants`, payload).pipe(
      map((res) => res.tenant || res.data || res)
    );
  }

  updateTenant(id: string, payload: Partial<TenantDto>): Observable<TenantDto> {
    return this.http.put<any>(`${this.baseUrl}/control/tenants/${id}`, payload).pipe(
      map((res) => res.tenant || res.data || res)
    );
  }

  deleteTenant(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/control/tenants/${id}`);
  }

  // ─── Subscriptions ───────────────────────────────────────────────────
  getSubscriptions(page = 1, limit = 50): Observable<SubscriptionDto[]> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<any>(`${this.baseUrl}/control/subscriptions`, { params }).pipe(
      map((res) => {
        const list = Array.isArray(res.subscriptions?.rows)
          ? res.subscriptions.rows
          : Array.isArray(res.subscriptions)
          ? res.subscriptions
          : Array.isArray(res.data)
          ? res.data
          : [];
        return list;
      })
    );
  }

  createSubscription(payload: CreateSubscriptionRequest): Observable<SubscriptionDto> {
    return this.http.post<any>(`${this.baseUrl}/control/subscriptions`, payload).pipe(
      map((res) => res.subscription || res.data || res)
    );
  }

  // ─── Platform Admins ─────────────────────────────────────────────────
  getPlatformAdmins(page = 1, limit = 50): Observable<PlatformAdminDto[]> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<any>(`${this.baseUrl}/control/admins`, { params }).pipe(
      map((res) => {
        const list = Array.isArray(res.admins?.rows)
          ? res.admins.rows
          : Array.isArray(res.admins)
          ? res.admins
          : Array.isArray(res.data)
          ? res.data
          : [];
        return list;
      })
    );
  }

  createPlatformAdmin(payload: CreatePlatformAdminRequest): Observable<PlatformAdminDto> {
    return this.http.post<any>(`${this.baseUrl}/control/admins`, payload).pipe(
      map((res) => res.admin || res.data || res)
    );
  }

  updatePlatformAdmin(id: string, payload: Partial<PlatformAdminDto>): Observable<PlatformAdminDto> {
    return this.http.put<any>(`${this.baseUrl}/control/admins/${id}`, payload).pipe(
      map((res) => res.admin || res.data || res)
    );
  }

  deletePlatformAdmin(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/control/admins/${id}`);
  }

  // ─── Provisioning Jobs ───────────────────────────────────────────────
  getProvisioningJobs(page = 1, limit = 50): Observable<ProvisioningJobDto[]> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<any>(`${this.baseUrl}/control/jobs`, { params }).pipe(
      map((res) => {
        const list = Array.isArray(res.jobs?.rows)
          ? res.jobs.rows
          : Array.isArray(res.jobs)
          ? res.jobs
          : Array.isArray(res.data)
          ? res.data
          : [];
        return list;
      })
    );
  }

  createProvisioningJob(payload: CreateProvisioningJobRequest): Observable<ProvisioningJobDto> {
    return this.http.post<any>(`${this.baseUrl}/control/jobs`, payload).pipe(
      map((res) => res.job || res.data || res)
    );
  }

  // ─── Audit Logs ──────────────────────────────────────────────────────
  getAuditLogs(page = 1, limit = 50): Observable<AuditLogDto[]> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<any>(`${this.baseUrl}/audit`, { params }).pipe(
      map((res) => {
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.logs?.rows)
          ? res.logs.rows
          : Array.isArray(res?.logs)
          ? res.logs
          : Array.isArray(res?.data)
          ? res.data
          : [];
        return list.map((item: any) => ({
          id: item.id,
          timestamp: item.created_at || item.timestamp,
          actor: item.actor || item.actor_user_id || '',
          institution: item.institution || '',
          action: item.action,
          entity: item.entity || item.entity_type,
          result: item.result || 'RECORDED',
          correlation_id: item.correlation_id,
        }));
      })
    );
  }

  // ─── Department creation for onboarding step 4 ──────────────────────
  createDepartment(payload: { institution_id: string; name: string; code: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/departments`, payload);
  }

  // ─── Institution creation for onboarding step 5 ─────────────────────
  createInstitution(payload: { name: string; code: string; domain: string; status: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/institutions`, payload);
  }

  // ─── Integrations & Sync Jobs ─────────────────────────────────────────
  getIntegrations(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/integrations/connections`).pipe(
      map((res) => {
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        return list;
      })
    );
  }

  getSyncJobs(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/integrations/sync-jobs`).pipe(
      map((res) => {
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        return list;
      })
    );
  }

  getAiRuns(limit = 50): Observable<any[]> {
    const params = new HttpParams().set('page', '1').set('limit', limit);
    return this.http.get<any>(`${this.baseUrl}/tacie/runs`, { params }).pipe(
      map((res) => {
        const list = Array.isArray(res?.runs?.rows)
          ? res.runs.rows
          : Array.isArray(res?.runs)
          ? res.runs
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        return list;
      })
    );
  }
}

