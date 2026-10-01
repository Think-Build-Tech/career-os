export type JobStatus = "applied" | "interview" | "offer" | "rejected";

export type JobApplication = {
  id: string;
  company: string;
  role: string;
  status: JobStatus;
  appliedAt: string;
};

export type DashboardSummary = {
  applications: number;
  interviews: number;
  offers: number;
  responseRate: number;
};

export type Workspace = {
  id: string;
  name: string;
};

export type { TenantCreatePayload, TenantUpdatePayload } from "./identity/tenant";
export type * from "./identity/payloads";