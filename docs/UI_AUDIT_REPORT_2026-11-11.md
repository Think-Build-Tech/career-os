# CareerOS Web UI Audit Report

Audit date: 11 November 2026  
Scope: Angular web application in `apps/web` (student login, admin login, student portal, jobs, and platform admin console). The Expo mobile application was not included.  
Methods: source review, Angular production build, focused headless-browser checks, Playwright route/login smoke tests, and local API probes.

## Executive summary

The Angular production bundle compiles successfully, and both login pages render correctly after removal of the one-click authentication shortcuts. The credential forms remain usable and their fields now have programmatic labels.

The live, data-backed UI cannot currently be certified end to end in this workspace. The service listening on `localhost:5000` returns `404` for both `/` and `/api/health`, while the repository defines both routes. A production static build also requires the documented `/api` reverse proxy; a plain static file server cannot provide that proxy.

Beyond the environment blocker, the audit found several confirmed frontend defects. Applications/offers data wiring and the inconsistent API response-envelope handling were remediated; the highest-impact remaining items are notifications rendering the wrong modal, tenant branding leakage, and a missing web unit-test target.

## Verification results

| Check | Result | Notes |
| --- | --- | --- |
| `npx nx build web --output-style=static` | Pass | Production bundle: 329.75 kB initial raw size; no budget error. |
| Student login shortcut absent | Pass | Headless browser found zero `1-Click Sign In` controls. |
| Admin login shortcut absent | Pass | Headless browser found zero one-click admin controls. |
| Login field accessibility | Pass | Both student and admin email/password fields are discoverable by label. |
| Unauthenticated `/admin` route guard | Pass | Redirects to `/#/admin/login`. |
| Web Playwright suite | Blocked/failing | 1 of 5 passed in the audited static environment; data/auth tests could not reach a functioning API/reverse proxy. |
| Web unit tests | Fail to start | Nx reports `Cannot find configuration for task web:test`. |
| Local API contract probe | Fail | The process on port 5000 returns 404 for repository-defined `/` and `/api/health`. |

## Remediated during this audit

### AUTH-01 — One-click student and admin authentication bypasses

Status: Fixed  
Previous severity: Critical

The student page embedded seeded credentials and fell back to a locally fabricated student session when API authentication failed. The admin page embedded super-admin credentials and fell back to a locally fabricated privileged session. The buttons, component methods, fake token/session helpers, and E2E reliance on those controls have been removed. Tests now submit the regular credential forms.

Affected files:

- `apps/web/src/app/pages/login/college-login.component.html`
- `apps/web/src/app/pages/login/college-login.component.ts`
- `apps/web/src/app/pages/admin-login/admin-login.component.html`
- `apps/web/src/app/pages/admin-login/admin-login.component.ts`
- `apps/web/src/app/core/auth/auth-session.service.ts`
- `tests/e2e/web.spec.ts`
- `tests/e2e/ui-interactions.spec.ts`

### A11Y-01 — Login labels were not associated with inputs

Status: Fixed  
Previous severity: Medium

The student and administrator credential labels now use matching `for` and `id` attributes. This also gives stable accessible locators to the browser tests.

## Confirmed findings

### UI-01 — Applications page consumes the placement-drives endpoint as application records

Status: Fixed  
Previous severity: High  
Area: Student portal / Applications

The portal now calls `GET /api/placements/applications?student_id=...`. The API returns a student-scoped projection with company, role, tier, compensation, locked resume, application date, and stage fields required by the UI.

Evidence:

- `apps/web/src/app/services/api.service.ts` (`getPlacementDrives`)
- `apps/web/src/app/pages/home/home.ts` (`applications: this.api.getPlacementDrives()`)
- `apps/api/src/app/modules/placement/placement.router.ts`

### UI-02 — Offers UI is fabricated rather than API-backed

Status: Fixed  
Previous severity: High  
Area: Student portal / Applications / Offers

The tab now loads `/api/placements/offers?student_id=...`, renders the returned count and offer records, and submits the returned offer UUID when accepting. The API enriches each offer with company, role, tier, compensation, deadline, and normalized status fields.

Evidence:

- `apps/web/src/app/pages/home/home.html` (offers count and fixed offer card)
- `apps/web/src/app/pages/home/home.ts` (`acceptOffer`)

Remaining limitation: the signing/upload evidence flow is still a placeholder and is covered by UI-05.

### UI-02A — Successful API responses were rendered as empty collections

Status: Fixed  
Previous severity: High  
Area: Student portal / API integration

The client previously read only the standard `data` property even though many controllers return named envelopes such as `opportunities`, `assessments`, `profiles`, `posts`, or `notifications`, frequently with a nested `rows` array. The API client now supports both envelope formats and normalizes the scalar mutation responses used by the portal.

### UI-03 — Notifications open the System Pre-Flight modal

Severity: High  
Area: Student portal shell

`openActionModalOrDrawer('notifications')` marks notifications read and sets `activeDrawer`, but the template renders the same hard-coded System Pre-Flight dialog for every `activeDrawer.type`. No notification list is shown.

Evidence:

- `apps/web/src/app/services/portal-state.service.ts` (`openActionModalOrDrawer`)
- `apps/web/src/app/pages/home/home.html` (single unconditional `activeDrawer` template)

Recommended fix: render drawer content by `drawer.type`; only show pre-flight checks for `preflight`, and show notification records for `notifications`.

### UI-04 — Pre-flight results are hard-coded and never submitted

Severity: High  
Area: Assessments

Launching any assessment opens a modal that always reports browser, webcam, network, and identity checks as passed. It does not perform device checks or call `POST /api/assessments/preflight`, even though the API client supports that route.

Recommended fix: implement real browser permission/device/network checks, submit their results, handle denial/failure states, and only enable assessment launch after a successful API response.

### UI-05 — Cross-tenant “Apex” branding and object paths leak into the student portal

Severity: High  
Area: People, offers, tenant isolation

The portal uses “Apex Institute of Technology,” “Apex Alumni,” and `tenants/apex/...` regardless of the authenticated institution. This is misleading for SITRC and every other tenant and undermines the tenant-isolation UX.

Evidence:

- `apps/web/src/app/pages/home/home.html` (People page copy and alumni fallbacks)
- `apps/web/src/app/pages/home/home.ts` (offer document key)

Recommended fix: derive all institution labels, slugs, and storage paths from the authenticated session/API response; never use a tenant literal in shared UI code.

### UI-06 — Referral and mentorship CTAs do not perform their advertised actions

Severity: High  
Area: People

“Referral requested successfully” only displays a toast and never calls `requestAlumniReferral`. “Message / Request Mentorship” only opens the generic Messages view and never calls the mentorship booking API. The service methods already exist but are unused.

Recommended fix: add resume selection and confirmation for referrals, slot selection for mentorship, submit through the existing service methods, and render API errors/success states.

### UI-07 — Learning guide rows look actionable but are not interactive

Severity: Medium  
Area: Grow

Each guide ends with a styled `Read Guide →` span, but there is no link or click handler. Users cannot open a guide.

Recommended fix: use an anchor/button with a real detail route or document URL and keyboard focus styling.

### UI-08 — Command-palette search input has no behavior

Severity: Medium  
Area: Global navigation

The palette input accepts text but has no bound query, filtering, or command execution. Only the fixed destination buttons work.

Recommended fix: bind a query signal, filter commands and conversations, support arrow-key selection, and announce result counts.

### UI-09 — Student dashboard can silently convert API failures into plausible empty states

Severity: High  
Area: Student portal

Most requests in `HomeComponent.loadData` catch errors individually and replace them with `[]` or `null`. Because the enclosing `forkJoin` still succeeds, `loadError` is usually never set. Users may see empty lists, default readiness values, or “Loading...” copy indefinitely instead of a clear failure.

Recommended fix: preserve per-widget error state, distinguish empty from failed, and avoid fabricated defaults such as `82% Ready`, `9.12`, or `2027` when verified data is unavailable.

### UI-10 — Platform admin initialization performs the full API refresh twice

Severity: Medium  
Area: Platform admin

`PlatformAdminStateService` calls `refreshAllData()` in its constructor, and `PlatformAdminComponent.ngOnInit()` immediately calls it again. Each refresh fans out to 13 endpoints, doubling load and increasing race/flicker risk.

Recommended fix: keep one initialization owner and add request cancellation or deduplication for manual refreshes.

### UI-11 — Platform admin refresh is all-or-nothing

Severity: Medium  
Area: Platform admin

One failed endpoint rejects the entire `forkJoin`; otherwise healthy sections remain unpopulated. This is especially fragile for optional integrations, sync jobs, AI runs, or audit logs.

Recommended fix: handle errors per data source, retain successfully loaded sections, and show section-specific warnings.

### UI-12 — Maintenance mode confirmation logic is stale and not connected to the template

Severity: High  
Area: Platform admin / Settings

The template directly calls `state.toggleSetting('maintenanceMode')`, so maintenance mode changes immediately. The component spec references confirmation methods that do not exist in the current component, demonstrating that the tests and implementation have diverged.

Recommended fix: restore a real confirmation dialog for enabling maintenance mode, bind it from the template, and add a functioning test target so the spec is compiled.

### UI-13 — Admin page navigation is not deep-linkable or restorable

Severity: Medium  
Area: Platform admin navigation

Admin tabs only update an in-memory signal. The URL does not change, browser Back does not traverse tabs, and refresh returns to Overview. This also conflicts with the documented `/admin#institutions` style while Angular already uses hash-based routing (`/#/admin`).

Recommended fix: represent tabs as child routes or query parameters compatible with hash routing.

### UI-14 — Dialogs and drawers lack accessible modal behavior

Severity: Medium  
Area: Student and admin overlays

The custom overlays generally lack `role="dialog"`, `aria-modal`, an accessible title relationship, focus trapping/restoration, and Escape handling. Several icon-only close buttons also lack accessible names.

Recommended fix: use Angular CDK Dialog/Overlay or implement equivalent focus and keyboard behavior, with `aria-labelledby` and named close controls.

## Integration and environment blockers

### ENV-01 — Port 5000 does not serve the checked-out CareerOS API contract

Severity: Blocking for live verification

The listener on `localhost:5000` returned Express 404 responses for both `/` and `/api/health`. The checked-out API registers both endpoints, so the running process is stale, misconfigured, or belongs to another service. The development frontend is configured to use `http://localhost:5000/api`.

Action: identify/stop the conflicting process, start this repository's `api` target, verify `/api/health`, then rerun the web and UI Playwright projects.

### ENV-02 — Production static hosting needs an `/api` reverse proxy

Severity: Deployment requirement

`environment.prod.ts` intentionally uses a relative `/api` URL. Serving `dist/apps/web/browser` with a plain static server produces API 404s. The deployment must route `/api/*` to the Express service, as documented in the environment file.

## Test and quality gaps

### TEST-01 — Web unit specs are orphaned

Severity: High

The repository contains Angular `*.spec.ts` files, but `apps/web/project.json` has no `test` target. `npx nx test web` fails before compiling any spec. This allowed stale tests referencing non-existent maintenance-confirmation methods to remain unnoticed.

### TEST-02 — E2E setup depends on a pre-seeded live database but has no server lifecycle

Severity: Medium

The Playwright configuration assumes web, API, and database services are already running. It has no `webServer` configuration or health-gated setup. Failures therefore conflate UI regressions with missing/stale services.

Recommended fix: add deterministic service startup/health checks in CI, seed through an isolated test database, and keep credentials in test-only environment configuration.

### TEST-03 — Critical actions have little or no automated coverage

Severity: Medium

There is no functioning automated coverage for real offer acceptance evidence, referral submission, mentorship booking, notification content, assessment pre-flight failure, partial admin API failure, keyboard modal behavior, or tenant-brand isolation.

## Recommended remediation order

1. Restore the correct API on port 5000 and add health-gated E2E startup.
2. Fix Applications and Offers data wiring; remove fabricated offer/default verified data.
3. Split notification and pre-flight modal behavior, then implement real pre-flight submission.
4. Remove all remaining tenant literals and wire referral/mentorship actions to their APIs.
5. Add the Angular test target and repair stale specs, especially maintenance-mode confirmation.
6. Improve partial-error rendering, modal accessibility, and route-backed admin navigation.

