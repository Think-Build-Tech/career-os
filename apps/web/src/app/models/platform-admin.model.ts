// apps/web/src/app/models/platform-admin.model.ts

export type AdminPageId =
  | 'overview'
  | 'institutions'
  | 'onboarding'
  | 'infrastructure'
  | 'ai-usage'
  | 'migrations'
  | 'system-status'
  | 'subscriptions'
  | 'admins'
  | 'audit'
  | 'settings';

export interface AdminApiResponse<T> {
  success: boolean;
  data?: T;
  dashboard?: any;
  tenants?: any;
  tenant?: any;
  subscriptions?: any;
  subscription?: any;
  admins?: any;
  admin?: any;
  jobs?: any;
  job?: any;
  health?: any;
  settings?: any;
  isolation?: any;
  message?: string;
  error?: string;
  timestamp?: string;
}

export interface TenantDatabaseInfo {
  id?: string;
  provider: string;
  database_name: string;
  host_reference?: string;
  secret_reference?: string;
  region?: string;
  schema_version: string;
  status: string;
  storage_used?: string;
  user_count?: number;
  plan?: string;
  monthly_cost?: string;
}

export interface TenantDto {
  id: string;
  college_code: string;
  name: string;
  slug: string;
  institution_type: 'UNIVERSITY' | 'ENGINEERING_COLLEGE' | 'AUTONOMOUS_INSTITUTE' | string;
  status: 'ACTIVE' | 'PROVISIONING' | 'SUSPENDED' | 'ATTENTION' | string;
  schema_version?: string;
  user_count?: number;
  storage_gb?: number | string;
  ai_usage_count?: number | string;
  ai_cost_inr?: number | string;
  plan_code?: string;
  last_active_at?: string;
  created_at?: string;
  database?: TenantDatabaseInfo;
}

export interface CreateTenantRequest {
  college_code: string;
  name: string;
  slug: string;
  institution_type: string;
  status?: string;
}

export interface SubscriptionDto {
  id: string;
  tenant_id: string;
  tenant_name?: string;
  college_code?: string;
  plan_code: 'ENTERPRISE' | 'STANDARD' | 'STARTER' | string;
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | string;
  student_limit?: number;
  ai_monthly_limit?: string | number;
  starts_at: string;
  renewal_at?: string;
}

export interface CreateSubscriptionRequest {
  tenant_id: string;
  plan_code: string;
  status: string;
  starts_at: string;
}

export interface PlatformAdminDto {
  id: string;
  global_user_id: string;
  name?: string;
  email?: string;
  access_level: 'SUPER_ADMIN' | 'SUPPORT_ADMIN' | 'BILLING_ADMIN' | 'INFRA_ADMIN' | 'OPERATOR' | string;
  status: 'ACTIVE' | 'INACTIVE' | string;
  created_at?: string;
  global_user?: {
    id: string;
    email: string;
    status: string;
    last_login_at?: string;
  };
}

export interface CreatePlatformAdminRequest {
  email?: string;
  global_user_id?: string;
  access_level: string;
  status?: string;
}

export interface ProvisioningJobDto {
  id: string;
  tenant_id: string;
  tenant_name?: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | string;
  current_step: string;
  progress_percentage?: number;
  created_at?: string;
  completed_at?: string;
}

export interface CreateProvisioningJobRequest {
  tenant_id: string;
  status: string;
  current_step?: string;
  job_type?: string;
}

export interface AdminDashboardDto {
  generatedAt?: string;
  database?: { healthy: boolean };
  metrics: {
    totalInstitutions: number;
    activeInstitutions: number;
    newInstitutions?: number;
    totalUsers: number;
    aiRequests: number;
    inputTokens: number;
    outputTokens: number;
    estimatedAiCost: number;
    messages?: number;
    assessments?: number;
  };
  institutions?: any[];
  audit?: any[];
  integrations?: any[];
  syncJobs?: any[];
  aiByInstitution?: any[];
  aiByFeature?: any[];
}

export interface ServiceHealthItem {
  name: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE' | string;
  description: string;
  availability_24h?: string;
}

export interface AdminHealthDto {
  api: string;
  database: string;
  databaseLatencyMs?: number;
  uptimeSeconds?: number;
  memoryMb?: number;
  timestamp?: string;
}

export interface PlatformSettingsDto {
  defaultAiModule: boolean;
  assessmentHub: boolean;
  alumniNetwork: boolean;
  adminMfa: boolean;
  supportApproval: boolean;
  verboseAuthErrors: boolean;
  provisioningPaused: boolean;
  maintenanceMode: boolean;
}

export interface WorkloadBreakdown {
  feature_name: string;
  request_count: number | string;
  percentage?: number;
}

export interface ModelMixBreakdown {
  fast_percentage: number;
  reasoning_percentage: number;
  advanced_percentage: number;
}

export interface QualitySafetyMetrics {
  failed_runs_percentage: number | string;
  flagged_chats: number | string;
  escalated_reviews?: number | string;
  avg_latency_seconds: number | string;
}

export interface AiDepartmentUsage {
  department_id: string;
  department_name: string;
  student_count: number;
  requests: string | number;
  input_tokens: string;
  output_tokens: string;
  embedding_tokens: string;
  estimated_cost_inr: string | number;
  share_percentage: string | number;
  workload_mix: WorkloadBreakdown[];
  model_usage: ModelMixBreakdown;
  quality: QualitySafetyMetrics;
}

export interface AiTenantUsageSummary {
  tenant_id: string;
  institution_name: string;
  college_code: string;
  plan: 'Enterprise' | 'Standard' | string;
  department_count: number;
  total_requests: string;
  total_tokens: string;
  embedding_tokens: string;
  estimated_cost_inr: string;
  budget_used_percentage: number;
  departments: AiDepartmentUsage[];
}

export interface TenantMigrationStatus {
  tenant_id: string;
  institution_name: string;
  current_version: string;
  target_version: string;
  status: 'Complete' | 'Scheduled' | 'Failed' | 'Pending';
  last_attempt?: string;
  duration?: string;
}

export interface AuditLogDto {
  id: string;
  timestamp: string;
  actor: string;
  institution?: string;
  action: string;
  entity: string;
  result: 'Success' | 'Failed' | string;
  correlation_id?: string;
}

export interface AdminSidebarNavItem {
  id: AdminPageId;
  label: string;
  icon: string;
  section: 'platform' | 'operations' | 'commercial' | 'security' | 'footer';
}

export interface CollegeResolutionResult {
  tenant: TenantDto;
  isolation: {
    is_isolated_database: boolean;
    database_name: string;
    provider: string;
    schema_version: string;
    status: string;
    host?: string;
    region?: string;
  };
  message: string;
}

