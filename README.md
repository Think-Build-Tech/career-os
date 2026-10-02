# CareerOS

CareerOS is a pnpm/Turborepo monorepo containing the CareerOS administration frontend, API, shared UI, shared state, shared types, and workspace tooling.

This document has two parts:

1. Monorepo setup and development documentation.
2. Documentation for the current implemented code, especially the identity module.

## Requirements

- Node.js `>=24.20.0`
- pnpm `11.25.0`
- PostgreSQL for the API database

The repository currently declares Node `>=24.20.0`. Node `22.x` produces an engine warning and is not the declared supported runtime.

## Getting Started

From the repository root:

```powershell
pnpm install
```

Run the full workspace development command:

```powershell
pnpm dev
```

Run an individual project:

```powershell
pnpm --filter api dev
pnpm --filter admin dev
```

The API defaults to port `5001`. The admin Vite app defaults to port `3001`.

## Workspace Commands

Commands available at the root:

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Run persistent development tasks through Turborepo |
| `pnpm build` | Build all packages and apps |
| `pnpm check-types` | Run TypeScript checks across the workspace |
| `pnpm lint` | Run workspace lint tasks |
| `pnpm test` | Run workspace tests |
| `pnpm format` | Format TypeScript, TSX, and Markdown files |
| `pnpm clean` | Run package clean tasks |

Use a package filter when working on one project:

```powershell
pnpm --filter api check-types
pnpm --filter @repo/types check-types
pnpm --filter @repo/ui test
```

## Repository Structure

```text
career-os/
├── apps/
│   ├── admin/                 # React 19 + Vite administration app
│   └── api/                   # Express + Sequelize API
├── packages/
│   ├── config-eslint/         # Shared ESLint configurations
│   ├── config-typescript/     # Shared TypeScript configurations
│   ├── jest-presets/          # Node and browser Jest presets
│   ├── logger/                # @repo/logger
│   ├── state/                 # @repo/state
│   ├── types/                 # @repo/types shared contracts
│   └── ui/                    # @repo/ui shared React components
├── package.json               # Root scripts and tool versions
├── pnpm-workspace.yaml        # Workspace package globs
├── pnpm-lock.yaml             # Locked dependency graph
└── turbo.json                 # Turborepo task pipeline
```

The workspace currently contains `apps/admin` and `apps/api`. The original starter applications that are not listed above are not part of the current working tree.

## Adding New Apps and Services

The workspace automatically includes any direct child of `apps/*` or `packages/*` because of `pnpm-workspace.yaml`. New projects should be created from the repository root and should remain private workspace projects unless they are intended to be published.

### Add a Next.js App

Create a new Next.js application directly under `apps`:

```powershell
pnpm create next-app@latest apps/portal --typescript --eslint --app --src-dir --use-pnpm
```

When prompted, choose the project options that match the existing frontend conventions. Confirm that the generated `apps/portal/package.json` has a unique package name and that its scripts include at least:

```json
{
	"scripts": {
		"dev": "next dev",
		"build": "next build",
		"start": "next start",
		"check-types": "tsc --noEmit"
	}
}
```

Run the new app with:

```powershell
pnpm --filter portal dev
```

### Add Another Vite Frontend

For a React/Vite application similar to the admin app:

```powershell
pnpm create vite apps/analytics --template react-ts
pnpm install
pnpm --filter analytics dev
```

Add the workspace-standard scripts to the generated package when needed:

```json
{
	"scripts": {
		"dev": "vite --host 0.0.0.0",
		"build": "vite build",
		"check-types": "tsc --noEmit",
		"lint": "eslint src/ --max-warnings 0"
	}
}
```

### Add Another API or Worker Service

For a new Node/TypeScript service, create the directory and package manifest under `apps`:

```powershell
New-Item -ItemType Directory apps/worker/src -Force
Set-Location apps/worker
pnpm init
pnpm add typescript tsx
pnpm add -D @types/node
Set-Location ../..
pnpm install
```

The new service should have a unique package name and these baseline scripts:

```json
{
	"private": true,
	"type": "module",
	"scripts": {
		"dev": "tsx watch src/index.ts",
		"build": "tsc --noEmit",
		"check-types": "tsc --noEmit"
	}
}
```

Reuse workspace packages instead of copying shared code:

```powershell
pnpm --filter worker add @repo/logger@workspace:* @repo/types@workspace:*
```

Do not run `git init` inside a new app. The monorepo root owns Git history, formatting, dependency locking, and Turborepo orchestration.

## Shared Code Conventions

Use `apps` for deployable products and services. Use `packages` for code that is intentionally consumed by two or more apps or services.

| Put code in | Use it for |
| --- | --- |
| `apps/admin` | Admin-specific pages, routes, and UI workflows |
| `apps/api` | HTTP handlers, API modules, database models, repositories, and services |
| `packages/ui` | Reusable React components and design primitives |
| `packages/state` | Reusable client state and state adapters |
| `packages/types` | Frontend/API contracts and serializable payload types |
| `packages/logger` | Cross-application logging behavior |
| `packages/config-*` | Shared lint and TypeScript configuration |
| `packages/jest-presets` | Shared test configuration |

### When to Extract Shared Code

Extract code into a package when at least one of these is true:

- Two apps need the same type, component, utility, or state behavior.
- The code defines a cross-boundary contract, such as an API request payload.
- Keeping separate copies would allow the implementations to drift.
- The code needs its own tests or release boundary.

Keep code inside an app when it is specific to one product, one API module, one screen, or one deployment environment. Do not move server-only Sequelize models, repositories, or Express controllers into a frontend-consumed package.

### Creating a Shared Package

Create a package as a direct child of `packages`:

```powershell
New-Item -ItemType Directory packages/validation/src -Force
Set-Location packages/validation
pnpm init
Set-Location ../..
```

Use the `@repo/*` naming convention and mark the package private unless it will be published:

```json
{
	"name": "@repo/validation",
	"version": "0.0.0",
	"private": true,
	"type": "module",
	"exports": {
		".": {
			"types": "./src/index.ts",
			"import": "./src/index.ts"
		}
	},
	"scripts": {
		"check-types": "tsc --noEmit",
		"lint": "eslint src/"
	}
}
```

Then consume it from an app or service:

```powershell
pnpm --filter admin add @repo/validation@workspace:*
```

Import through the package entrypoint rather than reaching into another package's `src` directory:

```ts
import { validateTenantPayload } from "@repo/validation";
```

### Shared Package Rules

- Export public APIs from `src/index.ts`.
- Keep browser-safe packages free of Node, Express, Sequelize, and database imports.
- Use `@repo/types` for serializable contracts shared by frontend and API.
- Add a workspace dependency with `workspace:*`; do not use relative imports across packages.
- Add `check-types`, and add `lint`, `test`, or `build` when the package needs them.
- Run `pnpm install` from the repository root after changing workspace dependencies.
- Run `pnpm check-types` before opening a pull request.

## Applications

### Admin

`apps/admin` is a React 19 single-page application built with Vite and React Router.

```powershell
pnpm --filter admin dev
pnpm --filter admin build
pnpm --filter admin check-types
pnpm --filter admin lint
```

It consumes shared contracts from `@repo/types`, shared state from `@repo/state`, and shared UI from `@repo/ui`.

### API

`apps/api` is an Express 5 API using Sequelize and PostgreSQL.

```powershell
pnpm --filter api dev
pnpm --filter api build
pnpm --filter api start
pnpm --filter api check-types
pnpm --filter api lint
pnpm --filter api test
```

The API entrypoint is `apps/api/src/index.ts`. The Express application is created in `apps/api/src/server.ts`.

## API Environment

The Sequelize configuration reads these variables:

| Variable | Purpose |
| --- | --- |
| `PG_DB_NAME` | PostgreSQL database name |
| `PG_DB_HOST` | PostgreSQL host |
| `DB_USER` | Database user |
| `DB_PASS` | Database password |
| `DB_DIALECT` | Sequelize dialect; defaults to `postgres` |
| `DB_LOGGING` | Enables Sequelize logging when truthy |
| `PORT` | API port; defaults to `5001` |

Example local environment:

```text
PG_DB_NAME=career_os
PG_DB_HOST=localhost
DB_USER=postgres
DB_PASS=your-local-password
DB_DIALECT=postgres
PORT=5001
```

The API currently defines the Sequelize connection but does not run migrations or automatically synchronize the schema. Database migrations and production secret management still need to be added.

## Shared Packages

### `@repo/types`

`packages/types` contains frontend-safe TypeScript contracts. Identity create and update payloads are exported from the package entrypoint:

```ts
import type {
	TenantCreatePayload,
	TenantUpdatePayload,
} from "@repo/types";
```

The package must not import Sequelize, Express, or other server-only dependencies.

### `@repo/ui`

Shared React UI components live under `packages/ui/src`. The package includes the existing link, navbar, and counter-button components and has its own build, lint, typecheck, and Jest tasks.

### `@repo/state`

Shared client state utilities live under `packages/state/src`.

### Tooling Packages

- `@repo/config-eslint` centralizes lint configuration.
- `@repo/config-typescript` centralizes TypeScript base configurations.
- `@repo/jest-presets` provides Node and browser test presets.
- `@repo/logger` provides the shared logger used by the API entrypoint.

## Current Code: Identity Module

The API identity module is located at `apps/api/src/modules/identity` and is organized by responsibility:

```text
identity/
├── controller/       # HTTP request handlers
├── model/            # Sequelize models and associations
├── repository/       # Persistence operations
├── route/            # Express route composition
├── service/          # Application/service layer
├── types/            # Legacy API-local type location; shared payloads now live in @repo/types
└── index.ts          # Loads associations and exports identityRoutes
```

### Models

#### Account Models

- `IdAccount`: user account with email, names, status, and timestamps.
- `ExternalIdentity`: external provider identity linked to an account. Provider and subject are unique together.
- `IdSession`: account session with current tenant, expiration, and optional revocation.

#### Tenant Models

- `Tenant`: tenant organization and core metadata.
- `TenantAuthProvider`: tenant-specific authentication provider configuration.
- `TenantBranding`: portal branding configuration.
- `TenantDatabaseRegistry`: database provider, region, secret reference, and schema version.
- `TenantDeployments`: deployment mode, environment, region, and routing target.
- `TenantDomains`: tenant hostnames and verification/TLS state.
- `TenantFeatures`: tenant feature enablement and JSON configuration.
- `TenantInvitation`: invitation email, membership type, status, and expiry.

#### Catalog Models

- `FeaturesBase`: globally defined feature catalog entries.
- `SubscriptionPlans`: subscription plan and billing limits.

#### Membership Models

- `AccountTenantMembership`: account-to-tenant membership join model.
- `TenantSubscription`: tenant subscription linked to a plan.

All models use UUID primary keys. Models with timestamps use `created_at` and `updated_at`; Sequelize manages them through `createdAt` and `updatedAt` configuration.

### Associations

Association definitions are isolated under `model/mapping` and loaded from `identity/index.ts`.

| Source | Relationship | Target | Alias |
| --- | --- | --- | --- |
| `Tenant` | has many | `TenantDomains` | `tenant_domains` |
| `Tenant` | has many | `TenantFeatures` | `tenant_features` |
| `Tenant` | has one | `TenantBranding` | `branding` |
| `Tenant` | has many | `TenantDatabaseRegistry` | `database_registries` |
| `Tenant` | has many | `TenantDeployments` | `deployments` |
| `Tenant` | has many | `TenantInvitation` | `invitations` |
| `Tenant` | has many | `TenantAuthProvider` | `auth_providers` |
| `Tenant` | has many | `TenantSubscription` | `subscriptions` |
| `Tenant` | has many | `AccountTenantMembership` | `memberships` |
| `Tenant` | has many | `IdSession` | `sessions` |
| `IdAccount` | has many | `ExternalIdentity` | `external_identities` |
| `IdAccount` | has many | `IdSession` | `sessions` |
| `IdAccount` | has many | `AccountTenantMembership` | `memberships` |
| `FeaturesBase` | has many | `TenantFeatures` | `features` |
| `SubscriptionPlans` | has many | `TenantSubscription` | `subscriptions` |

The reverse `belongsTo` associations use aliases such as `tenant`, `account`, `feature`, `plan`, and `current_tenant`.

### Repositories

Repositories mirror the model domains under `identity/repository`.

`BaseRepository` provides:

- `create(data)`
- `getById(id, options)`
- `getAll(options)`
- `getOne(where, options)`
- `update(where, data, options)`
- `updateById(id, data, options)`
- `delete(where)`
- `deleteById(id)`

Every read operation accepts Sequelize options, including relation loading:

```ts
const tenant = await tenantRepository.getById(tenantId, {
	include: ["branding", "tenant_domains", "memberships"],
});
```

`TenantRepository` additionally provides `getTenantByName`, `getAllTenants`, `updateTenant`, and `deleteTenant`.

### Services

Services mirror the repository domains under `identity/service`. `BaseService` delegates persistence operations and is generic over:

- model type
- create payload type
- update payload type

Each concrete service is bound to its corresponding shared payload contract. This keeps service calls consistent between the admin frontend and API.

### Controllers

Controllers mirror the same domains under `identity/controller`. `BaseController` provides standard handlers for:

- `POST /`
- `GET /`
- `GET /:id`
- `PATCH /:id`
- `DELETE /:id`

Controllers use typed request bodies from `@repo/types`, return `404` for missing resources, return `201` after creation, and forward unexpected errors to Express error middleware.

### Routes

Identity routes are mounted in `apps/api/src/server.ts` at `/api/identity`.

Available resources:

```text
/accounts
/external-identities
/sessions
/tenants
/tenant-auth-providers
/tenant-branding
/tenant-database-registries
/tenant-deployments
/tenant-domains
/tenant-features
/tenant-invitations
/features
/subscription-plans
/account-tenant-memberships
/tenant-subscriptions
```

Example requests:

```text
GET    /api/identity/tenants
GET    /api/identity/tenants/:id?include=branding,tenant_domains,memberships
GET    /api/identity/tenants/by-name?name=Acme
POST   /api/identity/tenants
PATCH  /api/identity/tenants/:id
DELETE /api/identity/tenants/:id
```

The `include` query parameter accepts comma-separated association aliases. The tenant `by-name` route is registered before `/:id` so it is not interpreted as an ID.

## Current Code: Institute Module

The institute module is located at `apps/api/src/modules/institute`. It follows the same domain-oriented organization as the identity module:

```text
institute/
├── controller/       # Explicit Express handler functions
├── model/
│   ├── member/       # Member profiles and member-owned records
│   ├── academic/     # Departments, programs, and batches
│   ├── access/       # Roles, permissions, and join models
│   └── mapping/      # Sequelize association registration
├── repository/       # Persistence classes by domain
├── service/          # Service classes by domain
├── route/            # Reserved for institute route composition
└── utils/            # Module utilities
```

### Institute Models

#### Member Models

- `Member`: institute member linked to an identity account.
- `Certification`: member certification with issuing organization, issue date, and credential URL.
- `Project`: member project with description, repository URL, and demo URL.
- `ProfessionalExperience`: member employment history, including company, title, dates, and current-role state.
- `MemberProfile`: one-to-one profile with headline, biography, location, and social links.
- `AlumniProfile`: one-to-one alumni information with program, graduation year, mentorship, and referral availability.
- `MemberSkill`: member skill snapshot with proficiency and verification state.
- `TpoProfile`: one-to-one TPO profile with designation, scope, and department.
- `FacultyProfile`: one-to-one faculty profile with employee number, designation, and department.
- `StudentProfile`: one-to-one student profile with enrollment, department, program, batch, CGPA, backlog, and placement data.

#### Academic Models

- `Department`: department hierarchy with optional `parent_department_id`.
- `Program`: academic program belonging to a department.
- `Batch`: program batch with start and graduation years.

#### Access Models

- `Role`: role catalog with unique code, name, and system-role flag.
- `Permission`: permission catalog with unique code and module.
- `MemberRole`: member-to-role assignment with assignment timestamp.
- `RolePermission`: role-to-permission join model with a unique role/permission pair.

All institute models use UUID primary keys and managed `created_at`/`updated_at` timestamps. URL fields use Sequelize URL validation, and profile/join constraints use unique foreign keys where the relationship is one-to-one.

### Institute Associations

Association definitions are under `institute/model/mapping`.

| Source | Relationship | Target | Alias |
| --- | --- | --- | --- |
| `Member` | belongs to | `IdAccount` | `account` |
| `Member` | has many | `Certification` | `certifications` |
| `Member` | has many | `Project` | `projects` |
| `Member` | has many | `ProfessionalExperience` | `professional_experiences` |
| `Member` | has one | `MemberProfile` | `profile` |
| `Member` | has one | `AlumniProfile` | `alumni_profile` |
| `Member` | has many | `MemberSkill` | `skills` |
| `Member` | has one | `TpoProfile` | `tpo_profile` |
| `Member` | has one | `FacultyProfile` | `faculty_profile` |
| `Member` | has one | `StudentProfile` | `student_profile` |
| `Member` | has many | `MemberRole` | `roles` |
| `Department` | has many | `Program` | `programs` |
| `Department` | has many | `FacultyProfile` | `faculty_profiles` |
| `Department` | has many | `StudentProfile` | `student_profiles` |
| `Department` | self has many | `Department` | `child_departments` |
| `Program` | has many | `Batch` | `batches` |
| `Program` | has many | `StudentProfile` | `student_profiles` |
| `Batch` | has many | `StudentProfile` | `student_profiles` |
| `Role` | has many | `MemberRole` | `member_roles` |
| `Role` | has many | `RolePermission` | `role_permissions` |
| `Permission` | has many | `RolePermission` | `role_permissions` |

The reverse associations use aliases such as `member`, `department`, `program`, `batch`, `role`, and `permission`. One-to-one relationships are enforced with unique child foreign keys such as `member_id` on profile models.

### Institute Repositories

Repositories mirror the institute model domains:

```text
institute/repository/
├── base.repository.ts
├── member/
├── academic/
└── access/
```

The institute base repository re-exports the shared identity `BaseRepository`, so every institute repository supports:

- `create(data)`
- `getById(id, options)`
- `getAll(options)`
- `getOne(where, options)`
- `update(where, data, options)`
- `updateById(id, data, options)`
- `delete(where)`
- `deleteById(id)`

Read methods accept Sequelize options and can load institute relationships with `include` aliases.

### Institute Services

Services mirror the repository domains under `institute/service`:

```text
institute/service/
├── base.service.ts
├── member/
├── academic/
└── access/
```

Each service owns the matching repository and delegates the shared CRUD operations. Resource-specific business rules can be added directly to an individual service without changing the shared identity implementation.

### Institute Controllers

Institute controllers are intentionally plain Express functions rather than classes or a base controller hierarchy. Each controller exports explicit handlers such as:

```ts
export const createMember = async (req, res, next) => {
	try {
		const member = await memberService.create(req.body);
		res.status(201).json(member);
	} catch (error) {
		next(error);
	}
};
```

Each resource controller owns its service instance and normally exports handlers for create, list, get-by-ID, update, and delete. This makes scope checks, authorization rules, and resource-specific behavior easy to add directly inside the relevant function.

The controller utility only centralizes mechanical request parsing for resource IDs and comma-separated `include` aliases; it is not a controller base class.

Institute routes have not yet been composed or mounted. The `institute/route` directory is reserved for route modules that will connect these handlers to Express.

## Testing and Validation

The current validation baseline is:

```powershell
pnpm --filter @repo/types check-types
pnpm --filter api check-types
pnpm check-types
pnpm lint
pnpm test
```

The API currently has Jest tests under `apps/api/src/__tests__`. Shared UI and logger packages also contain tests. New identity behavior should add focused repository/service/controller tests before production use.

## Current Limitations

- No migration files are currently documented or wired into the API.
- Authentication and authorization middleware are not yet applied to identity routes.
- Controllers provide TypeScript payload safety, but production request validation should also be added at runtime.
- The API has a basic status endpoint at `/status` and a sample `/message/:name` endpoint.
- Node `>=24.20.0` is required by the root package configuration.
