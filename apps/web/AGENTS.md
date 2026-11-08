# CareerOS — Platform Admin Console · Angular Web Agent Guide (AGENTS.md)

This document is the **canonical reference and architectural guide** for the **Platform Super-Admin Console** implemented in the Angular `apps/web` frontend, corresponding directly to [careeros_platform_admin_prototype_v5.html](../../careeros_platform_admin_prototype_v5.html) and integrated with the backend Express API in `apps/api`.

> [!IMPORTANT]
> The Platform Admin Console operates at the platform/super-admin scope. It is responsible for managing tenant colleges, database isolation, infrastructure, AI usage drilldowns, migrations, subscriptions, platform administrators, audit logs, and global settings. Every college tenant is resolved during login (using its 4-digit code) and operates on a dedicated isolated database instance.

---

## Table of Contents

1. [Architecture Overview & File Structure](#1-architecture-overview--file-structure)
2. [College Tenant Resolution & Database Isolation Architecture](#2-college-tenant-resolution--database-isolation-architecture)
3. [Environment & Global Conventions](#3-environment--global-conventions)
4. [Navigation & Page Map](#4-navigation--page-map)
5. [Page 1 — Overview (Dashboard)](#5-page-1--overview-dashboard)
6. [Page 2 — Institutions](#6-page-2--institutions)
7. [Page 3 — Onboarding](#7-page-3--onboarding)
8. [Page 4 — Infrastructure](#8-page-4--infrastructure)
9. [Page 5 — AI & Usage (3-Level Drilldown)](#9-page-5--ai--usage-3-level-drilldown)
10. [Page 6 — Migrations](#10-page-6--migrations)
11. [Page 7 — System Status](#11-page-7--system-status)
12. [Page 8 — Subscriptions](#12-page-8--subscriptions)
13. [Page 9 — Platform Admins](#13-page-9--platform-admins)
14. [Page 10 — Audit Logs](#14-page-10--audit-logs)
15. [Page 11 — Settings](#15-page-11--settings)
16. [Drawer — Add Institution (5-Step Onboarding Wizard)](#16-drawer--add-institution-5-step-onboarding-wizard)
17. [College Login & Tenant Switcher Modal](#17-college-login--tenant-switcher-modal)
18. [Complete API Reference](#18-complete-api-reference)
19. [Angular Service Layer](#19-angular-service-layer)
20. [TypeScript Models & DTOs](#20-typescript-models--dtos)
21. [State Management](#21-state-management)
22. [Component Hierarchy & Build Verification](#22-component-hierarchy--build-verification)

---

## 1. Architecture Overview & File Structure

The Platform Admin Console is implemented with Angular 19+ standalone components, signals-based state management, and full Express API backend integration:

```
apps/
├── web/                                          ← Angular 19+ frontend
│   └── src/app/
│       ├── pages/
│       │   ├── platform-admin/                   ← Platform Admin Console (IMPLEMENTED)
│       │   │   ├── platform-admin.component.ts   ← Main component & routing logic
│       │   │   ├── platform-admin.component.html ← Complete 11-page templates + drawer + modal
│       │   │   └── platform-admin.component.css  ← Prototype v5 design tokens & styling
│       │   ├── home/                             ← Student portal home (existing)
│       │   ├── sidebar/                          ← Student sidebar (existing)
│       │   └── jobs/                             ← Student jobs portal (existing)
│       ├── services/
│       │   ├── platform-admin-api.service.ts     ← Admin & Control HTTP client (IMPLEMENTED)
│       │   ├── platform-admin-state.service.ts   ← Admin signals state & actions (IMPLEMENTED)
│       │   ├── api.service.ts                    ← Student portal API service
│       │   └── portal-state.service.ts           ← Student portal state
│       ├── models/
│       │   ├── platform-admin.model.ts           ← Admin DTOs & interfaces (IMPLEMENTED)
│       │   └── api.model.ts                      ← Student portal DTOs
│       ├── core/
│       │   ├── auth/auth-session.service.ts      ← Tenant session & DB isolation state (UPDATED)
│       │   └── interceptors/
│       │       └── tenant.interceptors.ts        ← x-tenant-id injection interceptor
│       ├── app.routes.ts                         ← /admin route configuration (UPDATED)
│       └── app.config.ts                         ← HttpClient with tenant interceptor (UPDATED)
│
├── api/                                          ← Node.js / Express backend
│   └── src/app/
│       ├── routes/api.router.ts                  ← Master route aggregator
│       └── modules/
│           ├── control/                          ← Tenant DB & control plane (UPDATED)
│           │   ├── control.controller.ts         ← resolveTenant & getResolvableColleges added
│           │   ├── control.router.ts             ← /control/resolve/:codeOrSlug mounted
│           │   └── models/control.models.ts      ← Tenant, TenantDatabase, ProvisioningJob
│           ├── admin/                            ← /api/admin (dashboard, health, settings)
│           ├── institution/                      ← /api/institutions
│           ├── department/                       ← /api/departments
│           ├── identity/                         ← /api/identity (RBAC roles, assignments)
│           ├── tacie/                            ← /api/tacie (AI runs, resume analysis, quotas)
│           ├── audit/                            ← /api/audit
│           ├── integration/                      ← /api/integrations (connections, sync jobs)
│           ├── moderation/                       ← /api/moderation
│           └── user/                             ← /api/users
```

---

## 2. College Tenant Resolution & Database Isolation Architecture

CareerOS implements **physical multi-tenancy** where each college tenant operates on an isolated PostgreSQL database:

```
                      ┌──────────────────────────────────────┐
                      │    College Login / Resolution UI     │
                      │  (Enters 4-digit code e.g. 4821)    │
                      └──────────────────┬───────────────────┘
                                         │ GET /api/control/resolve/4821
                                         ▼
                      ┌──────────────────────────────────────┐
                      │   Control Plane Tenant Resolver      │
                      │   - Verifies College Code            │
                      │   - Resolves Isolated Database Name  │
                      └──────────────────┬───────────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
┌───────────────┐                ┌───────────────┐                ┌───────────────┐
│ SITRC (4821)  │                │   ABC (7314)  │                │   DEF (9143)  │
│ DB:           │                │ DB:           │                │ DB:           │
│ careeros_sitrc│                │ careeros_abc  │                │ careeros_def  │
│ PostgreSQL 17 │                │ PostgreSQL 17 │                │ PostgreSQL 17 │
│ Schema: v28   │                │ Schema: v28   │                │ Schema: v26   │
└───────────────┘                └───────────────┘                └───────────────┘
```

### Pre-Configured Prototype Colleges

| College Code | Institution Name | Slug | Isolated Database Name | Engine | Schema Version | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`4821`** | Sandip Institute of Technology & Research (SITRC) | `sitrc` | `careeros_sitrc` | PostgreSQL 17 | `v28` | **Healthy / Active** |
| **`7314`** | ABC College of Engineering | `abc-coe` | `careeros_abc` | PostgreSQL 17 | `v28` | **Healthy / Active** |
| **`2608`** | XYZ Institute of Technology | `xyz-iot` | `careeros_xyz` | PostgreSQL 17 | `v27` | **Creating / Provisioning** |
| **`9143`** | DEF College of Engineering | `def-college` | `careeros_def` | PostgreSQL 17 | `v26` | **Migration Issue** |
| **`5530`** | PQR Vidyapeeth | `pqr-vidyapeeth` | `careeros_pqr` | PostgreSQL 17 | `v27` | **Paused / Suspended** |

### How Resolution Works at Runtime

1. **User or Administrator Enters Code**: In the College Resolver modal (accessible via top bar or sidebar badge), the user enters a 4-digit code (e.g. `4821`).
2. **Resolution API Call**:
   ```bash
   GET http://localhost:5000/api/control/resolve/4821
   ```
3. **Response Payload**:
   ```json
   {
     "success": true,
     "tenant": {
       "id": "00000000-0000-0000-0000-000000000001",
       "college_code": "4821",
       "name": "SITRC (Sandip Institute of Technology & Research Centre)",
       "slug": "sitrc",
       "institution_type": "ENGINEERING_COLLEGE",
       "status": "ACTIVE"
     },
     "isolation": {
       "is_isolated_database": true,
       "database_name": "careeros_sitrc",
       "provider": "PostgreSQL 17",
       "schema_version": "v28",
       "status": "HEALTHY"
     },
     "message": "Tenant resolved: SITRC (4821)"
   }
   ```
4. **Active Session Binding**: `AuthSessionService.setResolvedCollegeTenant()` stores the tenant ID, code, and isolated database name in `localStorage`.
5. **Automatic Request Header Injection**: `tenantHeadersInterceptor` injects `x-tenant-id` into all subsequent HTTP requests:
   ```typescript
   headers['x-tenant-id'] = currentTenantId;
   ```

---

## 3. Environment & Global Conventions

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `BASE_URL` | `http://localhost:5000` | Base URL for the CareerOS API |
| `API_PREFIX` | `/api` | Root prefix for all API modules |

### Standard Request Headers
```http
Content-Type: application/json
x-tenant-id: 00000000-0000-0000-0000-000000000001
Authorization: Bearer <TOKEN>
```

---

## 4. Navigation & Page Map

The console layout features a sticky 248px sidebar, top bar with active college tenant indicator, breadcrumb, and main content area.

| Section | Nav Item | Page ID | Hash / Route | Breadcrumb |
| :--- | :--- | :--- | :--- | :--- |
| **Platform** | Overview | `overview` | `/admin#overview` | CareerOS / Overview |
| | Institutions | `institutions` | `/admin#institutions` | CareerOS / Institutions |
| | Onboarding | `onboarding` | `/admin#onboarding` | CareerOS / Onboarding |
| **Operations** | Infrastructure | `infrastructure` | `/admin#infrastructure` | CareerOS / Infrastructure |
| | AI & Usage | `ai-usage` | `/admin#ai-usage` | CareerOS / AI & Usage |
| | Migrations | `migrations` | `/admin#migrations` | CareerOS / Migrations |
| | System Status | `system-status` | `/admin#system-status` | CareerOS / System Status |
| **Commercial** | Subscriptions | `subscriptions` | `/admin#subscriptions` | CareerOS / Subscriptions |
| **Security** | Platform Admins | `admins` | `/admin#admins` | CareerOS / Platform Admins |
| | Audit Logs | `audit` | `/admin#audit` | CareerOS / Audit Logs |
| **Footer** | Settings | `settings` | `/admin#settings` | CareerOS / Settings |

---

## 5. Page 1 — Overview (Dashboard)

The primary operational dashboard of CareerOS.

### Components & UI Sections

1. **Hero**: Title, greeting, subtitle, and "Export snapshot" button.
2. **Metrics Grid (4 Columns)**:
   - Institutions: `42` (`+3 this month`)
   - Active Tenants: `38` (`90.4% of provisioned institutions`)
   - Active Users: `26.8K` (`+8.4% month over month`)
   - Estimated AI Cost: `₹68.4K` (`+6.1% vs previous month`)
3. **Layout3 (3-Column Cards)**:
   - **Tenant Health**: Status breakdown (36 Healthy & active, 2 Provisioning, 3 Attention required, 1 Suspended).
   - **Infrastructure Health**: Grid showing API availability (99.99%), Database health (42/42 Healthy), Background jobs (Normal), ERP sync (Degraded).
   - **Monthly Usage**: Cross-institution consumption bars (AI requests 72.4K, Embedding jobs 9.3K, Messages 184K, Assessments 12.8K).
4. **Institutions Table**:
   - Real-time search by college name or code.
   - Status badges (`● Active`, `● Provisioning`, `● Attention`, `● Suspended`).
   - Database health badges.
   - Action buttons with 1-click college tenant switcher.
5. **Bottom Grid**:
   - **Recent Activity**: Chronological event feed (ERP sync, New provisioning, Schema migration).
   - **Needs Attention**: Actionable alerts (Migration failed, ERP sync delayed, Storage >85%) with review/inspect buttons.

### Backend Endpoints
- `GET /api/admin/dashboard`
- `GET /api/admin/health`
- `GET /api/control/tenants?page=1&limit=20`

---

## 6. Page 2 — Institutions

Full tenant fleet management page.

### Components & UI Sections
- **Stat Cards (4 Columns)**: Total institutions (42), Active (38), Provisioning (2), Needs attention (3).
- **Table Card**: Real-time search, plan filter, status filter.
- **Extended Table Columns**: Institution name + logo, 4-digit code, Status badge, User count, Database status, Plan code, Storage (GB), Estimated AI cost (INR), Actions.
- **Top Actions**: "+ Add Institution" button triggers the 5-step onboarding drawer.

### Backend Endpoints
- `GET /api/control/tenants?page=1&limit=50`
- `GET /api/institutions`
- `DELETE /api/control/tenants/:id`

---

## 7. Page 3 — Onboarding

Tenant onboarding pipeline and lifecycle tracking.

### Components & UI Sections
- **Stat Cards (3 Columns)**: In progress (4), Awaiting action (2), Completed this month (3, avg setup 19 min).
- **Onboarding Queue Card**: Progress lines for active tenants:
  - XYZ Institute: Step 4 of 7 (58% progress)
  - PQR University: Admin invitation pending (34% progress)
  - NOVA College: Department configuration (72% progress)
- **Provisioning Pipeline Card**: 7 standard lifecycle steps:
  1. Register tenant + allocate code (`01`)
  2. Create PostgreSQL database (`02`)
  3. Apply schema migrations (`03`)
  4. Create institution + roles (`04`)
  5. Create administrator (`05`)
  6. Configure departments (`06`)
  7. Activate tenant (`07`)

### Backend Endpoints
- `GET /api/control/jobs?page=1&limit=20`
- `POST /api/control/jobs`
- `POST /api/control/tenants`

---

## 8. Page 4 — Infrastructure

Database isolation health and storage utilization.

### Components & UI Sections
- **Stat Cards (4 Columns)**: Databases (42 / 42 reachable), Avg CPU (23%), Storage used (1.12 TB, 68%), Backup success (100%).
- **Database Health Card**: Tenant-isolated database instances with PostgreSQL version and schema version:
  - `careeros_sitrc · PostgreSQL 17 · schema v28` (Healthy)
  - `careeros_abc · PostgreSQL 17 · schema v28` (Healthy)
  - `careeros_def · PostgreSQL 17 · schema v26` (Migration issue)
- **Storage by Tenant Card**: Largest storage consumers with usage bars:
  - ABC College: 42.2 GB (84%)
  - SITRC: 18.7 GB (38%)
  - DEF College: 15.6 GB (31%)

### Backend Endpoints
- `GET /api/admin/health`
- `GET /api/control/tenants`
- `GET /api/integrations/sync-jobs`

---

## 9. Page 5 — AI & Usage (3-Level Drilldown)

The deepest and most comprehensive page in the console, providing visibility into TACIE AI usage across the platform, institutions, and individual departments.

### Level 1: Platform-Wide Overview
- **Stat Cards**: AI requests (72.4K, +11.8%), Total tokens (181.2M), Embedding tokens (22.8M), Estimated cost (₹68.4K).
- **Platform Usage Trend**: Weekly bar chart visualizing request volume progression.
- **Workload Mix Grid**:
  - Resume analysis: 12,482 requests (17.2%)
  - Resume & JD chat: 15,941 requests (22.0%)
  - Candidate matching: 8,844 requests (12.2%)
  - Skill gap analysis: 8,191 requests (11.3%)
  - Moderation: 8,235 requests (11.4%)
  - Other TACIE tasks: 18,707 requests (25.9%)

### Level 2: Institution Tenant Level (Accordion)
Each college tenant is displayed in an expandable summary card:
- College Identity: Logo, Name, Code, Plan, Department count.
- Metrics: Total requests, Total tokens, Embedding tokens, Cost in INR.
- Budget Consumption Bar: e.g. 61% for SITRC, 78% (warning tone) for ABC College.
- Chevron expander (`⌄`) to reveal department drilldown.

### Level 3: Department-Level Breakdown (Inside Expanded Tenant)
- **Summary Metrics**: Avg tokens/request, Successful runs %, Avg cost/request.
- **Department Table**:
  - Columns: Department, Requests, Input tokens, Output tokens, Embeddings, Estimated cost, Share %, Details toggle.
- **Department Detail Block (3 Sub-Panels)**:
  1. **Workload Mix**: Bars for Resume chat, Resume analysis, Matching, Skill gap, Moderation.
  2. **Model Usage**: Fast/low-cost %, Reasoning %, Advanced %, Top consumers breakdown.
  3. **Quality & Safety**: Failed runs %, Flagged chats, Avg latency, Moderation escalation summary.

### Cross-Tenant Ranking & Alerts
- **Highest-Cost Departments**: SITRC Computer Eng (₹6,740), ABC Computer Eng (₹4,721), DEF Computer Eng (₹4,318), SITRC AI & Data Science (₹4,196).
- **Usage Alerts**: Budget threshold alerts (>75%), abnormal chat volume spikes.

### Backend Endpoints
- `GET /api/tacie/runs`
- `GET /api/departments`
- `GET /api/tacie/quota/:userId`
- `POST /api/tacie/credits/grant`

---

## 10. Page 6 — Migrations

Coordinates schema version migrations across the database-per-college tenant fleet.

### Components & UI Sections
- **Stat Cards (4 Columns)**: Target schema (`v28`), Up to date (`31`), Pending (`8`), Failed (`3`).
- **Tenant Migration Status Table**:
  - Columns: Institution, Current schema, Target schema, Status badge, Last attempt, Duration, Actions.
  - Examples:
    - SITRC: `v28` → `v28` (Complete, 18s)
    - ABC College: `v27` → `v28` (Scheduled)
    - DEF College: `v26` → `v28` (Failed, 11s, with "Retry" action)

---

## 11. Page 7 — System Status

Platform-wide reliability and uptime monitor.

### Components & UI Sections
- **Header**: Overall platform health badge (`● Operational`).
- **Services Health Card**:
  - API Gateway (99.99% availability)
  - Authentication (Tenant resolution & sessions)
  - Tenant Databases (42 of 42 reachable)
  - TACIE AI Engine (LLM and embedding requests)
  - ERP Sync (3 institutions reporting delays, Degraded)
- **Active Incidents Card**: Live operational events with timestamps and status indicators.

---

## 12. Page 8 — Subscriptions

Commercial plan management and recurring limits.

### Components & UI Sections
- **Stat Cards (3 Columns)**: Monthly recurring revenue (`₹24.7L`), Enterprise tenants (`18`), Renewals due within 30 days (`5`).
- **Subscriptions Table**: Institution, Plan tier, Status, Student capacity, AI monthly limit, Renewal date, Manage action.

---

## 13. Page 9 — Platform Admins

Security and role-based access control for platform-level operators.

### Components & UI Sections
- **Administrators Card**: User name, email, access level badge, and status.
- **Role Definitions Card**: Principle of least privilege:
  - Super Admin: Full platform control (1 user)
  - Support Admin: Tenant diagnostics + support sessions (3 users)
  - Billing Admin: Plans, subscriptions, invoices (2 users)
  - Infra Admin: Databases, migrations, incidents (2 users)

---

## 14. Page 10 — Audit Logs

Immutable operational log of platform actions.

### Components & UI Sections
- **Header & Filter Bar**: Filter chips for Institution, Action, and Date. "Export logs" button.
- **Audit Table**:
  - Columns: Time, Actor, Institution, Action, Entity, Result badge (`Success`/`Failed`), Correlation ID (`mono` font).

---

## 15. Page 11 — Settings

Platform-level configuration and operational policies.

### Components & UI Sections
- **Platform Defaults Card**:
  - Default AI module (TACIE enabled for new tenants) [Toggle]
  - Assessment hub enabled during onboarding [Toggle]
  - Alumni network available to new institutions [Toggle]
- **Security Defaults Card**:
  - Admin MFA required for platform administrators [Toggle]
  - Support session approval required before tenant access [Toggle]
  - Verbose auth errors kept generic [Toggle]
- **Danger Zone Card (Full Width)**:
  - Pause tenant provisioning during maintenance [Button]
  - Maintenance mode configuration [Button]

### Backend Endpoints
- `GET /api/admin/settings`
- `PUT /api/admin/settings`

---

## 16. Drawer — Add Institution (5-Step Onboarding Wizard)

Slide-out drawer containing a 5-step stepper to onboard and provision a new college tenant:

```
[ Step 1: Institution Details ]
    ↓
[ Step 2: Plan & Quotas ]
    ↓
[ Step 3: Primary Admin Setup ]
    ↓
[ Step 4: Departments Configuration ]
    ↓
[ Step 5: Review & Provision Workspace 🚀 ]
```

### Steps Detail
1. **Institution Details**: Name, Short name / slug, Institution type (Engineering College, University, Autonomous), Domain, City, State, Affiliation. Displays the auto-generated 4-digit login code.
2. **Plan & Quotas**: Plan tier (Enterprise, Standard, Starter), Student capacity limit, AI monthly quota. Displays the isolated database name (`careeros_<slug>`).
3. **Primary Administrator**: Full name, Official email address for invitation dispatch.
4. **Departments**: Initial department list configuration (e.g. Computer Engineering, AI & Data Science, Mechanical).
5. **Review & Provision**: Complete summary card with auto-provisioning confirmation.

---

## 17. College Login & Tenant Switcher Modal

Accessible from the top bar or sidebar active tenant badge:
- **Input**: Enter any 4-digit code (e.g. `4821`, `7314`, `2608`, `9143`, `5530`) or college slug.
- **Quick-Picks**: Clickable chips for all prototype colleges.
- **Real-Time Verification**: Calls `GET /api/control/resolve/:codeOrSlug`.
- **Isolation Card**: Displays the verified college name, isolated database name, engine (`PostgreSQL 17`), schema version (`v28`), and health status.
- **Action**: "Switch to this College Tenant" updates `AuthSessionService` and sets the active `x-tenant-id` header across the entire application.

---

## 18. Complete API Reference

| Module | Method | Route | Description |
| :--- | :--- | :--- | :--- |
| **Control** | `GET` | `/api/control/resolve/:codeOrSlug` | Resolve college tenant & isolated DB |
| | `GET` | `/api/control/colleges` | List all resolvable college tenants |
| | `GET` | `/api/control/tenants` | List all tenants (paginated) |
| | `POST` | `/api/control/tenants` | Create new tenant record |
| | `GET` | `/api/control/tenants/:id` | Get tenant by ID |
| | `PUT` | `/api/control/tenants/:id` | Update tenant details |
| | `DELETE` | `/api/control/tenants/:id` | Delete tenant record |
| | `GET` | `/api/control/subscriptions` | List all tenant subscriptions |
| | `POST` | `/api/control/subscriptions` | Create subscription plan |
| | `GET` | `/api/control/admins` | List platform administrators |
| | `POST` | `/api/control/admins` | Invite platform administrator |
| | `PUT` | `/api/control/admins/:id` | Update admin access level |
| | `DELETE` | `/api/control/admins/:id` | Revoke platform admin access |
| | `GET` | `/api/control/jobs` | List provisioning jobs queue |
| | `POST` | `/api/control/jobs` | Queue new provisioning job |
| **Admin** | `GET` | `/api/admin/dashboard` | Aggregated platform dashboard KPIs |
| | `GET` | `/api/admin/health` | Platform & database health probe |
| | `GET` | `/api/admin/settings` | Get global platform settings |
| | `PUT` | `/api/admin/settings` | Update platform settings / maintenance |
| **Institutions**| `GET` | `/api/institutions` | List institution records |
| | `POST` | `/api/institutions` | Create institution record |
| **Departments** | `GET` | `/api/departments` | List departments |
| | `POST` | `/api/departments` | Create department |
| | `GET` | `/api/departments/:id/settings`| Department AI settings |
| **Identity** | `GET` | `/api/identity/roles` | List RBAC roles |
| | `POST` | `/api/identity/assignments` | Assign scoped role |
| **TACIE AI** | `GET` | `/api/tacie/runs` | List AI execution runs |
| | `GET` | `/api/tacie/quota/:userId` | Get user/tenant AI quota |
| | `POST` | `/api/tacie/credits/grant` | Grant additional AI credits |
| **Audit** | `GET` | `/api/audit` | List immutable audit log entries |
| | `POST` | `/api/audit` | Create audit log entry |

---

## 19. Angular Service Layer

### `PlatformAdminApiService`
Implemented in [`apps/web/src/app/services/platform-admin-api.service.ts`](file:///c:/Users/athar/OneDrive/Desktop/CareerOS/apps/web/src/app/services/platform-admin-api.service.ts):
- `resolveCollegeTenant(codeOrSlug: string): Observable<CollegeResolutionResult>`
- `getResolvableColleges(): Observable<TenantDto[]>`
- `getDashboard(): Observable<AdminDashboardDto>`
- `getAdminHealth(): Observable<AdminHealthDto>`
- `getPlatformSettings(): Observable<PlatformSettingsDto>`
- `updatePlatformSettings(settings: Partial<PlatformSettingsDto>): Observable<PlatformSettingsDto>`
- `getTenants(page, limit): Observable<TenantDto[]>`
- `createTenant(payload): Observable<TenantDto>`
- `updateTenant(id, payload): Observable<TenantDto>`
- `deleteTenant(id): Observable<any>`
- `getSubscriptions(page, limit): Observable<SubscriptionDto[]>`
- `createSubscription(payload): Observable<SubscriptionDto>`
- `getPlatformAdmins(page, limit): Observable<PlatformAdminDto[]>`
- `createPlatformAdmin(payload): Observable<PlatformAdminDto>`
- `updatePlatformAdmin(id, payload): Observable<PlatformAdminDto>`
- `deletePlatformAdmin(id): Observable<any>`
- `getProvisioningJobs(page, limit): Observable<ProvisioningJobDto[]>`
- `createProvisioningJob(payload): Observable<ProvisioningJobDto>`
- `getAuditLogs(page, limit): Observable<AuditLogDto[]>`

---

## 20. TypeScript Models & DTOs

Implemented in [`apps/web/src/app/models/platform-admin.model.ts`](file:///c:/Users/athar/OneDrive/Desktop/CareerOS/apps/web/src/app/models/platform-admin.model.ts):
- `AdminPageId`: Union of all 11 page keys
- `TenantDto`: Full college tenant entity with isolated database specs
- `TenantDatabaseInfo`: Provider, database name, schema version, status
- `AdminDashboardDto`: Aggregated metrics and KPI counters
- `PlatformSettingsDto`: Platform & security toggle configurations
- `AiTenantUsageSummary`: Level 2 tenant AI consumption summary
- `AiDepartmentUsage`: Level 3 department AI drilldown
- `WorkloadBreakdown`, `ModelMixBreakdown`, `QualitySafetyMetrics`: Sub-block metrics
- `CollegeResolutionResult`: Resolution response with verification & DB metadata
- `SubscriptionDto`, `PlatformAdminDto`, `ProvisioningJobDto`, `AuditLogDto`

---

## 21. State Management

Implemented in [`apps/web/src/app/services/platform-admin-state.service.ts`](file:///c:/Users/athar/OneDrive/Desktop/CareerOS/apps/web/src/app/services/platform-admin-state.service.ts):
- Signals-based reactive state with zero unnecessary re-renders.
- Computed signals for `filteredTenants` and `filteredAiTenants`.
- Accordion set signals: `expandedAiTenants` and `expandedAiDepts`.
- Drawer stepper signals: `isAddInstitutionDrawerOpen` and `drawerStep`.
- Resolution signals: `isCollegeLoginModalOpen`, `loginCodeInput`, `isResolvingCollege`, `resolvedCollegeResult`, `collegeResolutionError`.
- Auto-refresh via `refreshAllData()` on startup.

---

## 22. Component Hierarchy & Build Verification

```
PlatformAdminComponent (apps/web/src/app/pages/platform-admin)
├── Sidebar
│   ├── Brand Header
│   ├── Active College Tenant Badge (Click to Resolve / Switch)
│   ├── Nav Sections (Platform, Operations, Commercial, Security, Footer)
│   └── User Box (Platform Super-Admin)
├── Topbar
│   ├── Breadcrumb (CareerOS / <Active Page>)
│   ├── Active College Quick-Indicator Button
│   └── "+ Add Institution" Action Button
├── Page Container (@if switches between 11 pages)
│   ├── 1. Overview
│   ├── 2. Institutions
│   ├── 3. Onboarding
│   ├── 4. Infrastructure
│   ├── 5. AI & Usage (Expandable Accordion & Department Drilldowns)
│   ├── 6. Migrations
│   ├── 7. System Status
│   ├── 8. Subscriptions
│   ├── 9. Platform Admins
│   ├── 10. Audit Logs
│   └── 11. Settings
├── Add Institution Drawer (5-Step Stepper Wizard)
├── College Login & Tenant Database Resolution Modal
└── Toast Notification Bar
```

### Build Status
Both web and API projects build cleanly with zero errors:
```bash
npx nx build web    # Output: dist/apps/web (Successfully built)
npx nx build api    # Output: dist/apps/api (Successfully built)
```
