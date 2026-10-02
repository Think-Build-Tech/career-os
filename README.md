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

## Backend API Architecture

The Express API is structured using a domain-driven Modular Monolith architecture. The backend is split into 9 distinct business domains, each with its own models, repositories, services, and controllers.

### Core Utilities (apps/api/src/core)

To prevent code duplication, generic patterns are abstracted into the core directory:

- base.repository.ts: A generic Sequelize repository providing create, getById, getAll, getOne, update, updateById, delete, and deleteById.
- base.service.ts: A generic service class wrapping the repository.
- controller.utils.ts: A factory createResourceHandlers that dynamically generates standard Express CRUD route handlers (GET, POST, PATCH, DELETE) for any given service.

### The 9 Domain Modules

The API is divided into the following domains under apps/api/src/modules/:

1. **control-plane-identity**: Core tenancy, accounts, authentication providers, and sessions.
2. **institute-roles-students-career-profile**: Academic structures (programs, departments), members (students, faculty, TPO), and RBAC access roles.
3. **alumni-mentorship-referral**: Mentor profiles, mentorship sessions, requests, and referrals.
4. **community-interview-exp-events**: Posts, comments, groups, event registrations, and interview experiences.
5. **learning-assessments-coding**: Courses, modules, assessments, coding problems, and submissions.
6. **opportunities-placements-recruitments**: Job postings, applications, campus drives, offers, and company profiles.
7. **career-goals-resume**: Career goals, milestones, resumes, and resume parsing/analysis.
8. **opportunity-contribution-system**: Community opportunity contribution system (COCS) postings and verifications.
9. **
ewards-notifications-ai**: Platform engine for badges, notifications, skill gaps, and AI conversations.

### Module Anatomy

Every module follows the exact same MVC-style internal directory structure:

`	ext
module-name/
├── controller/       # Express HTTP handlers generated via createResourceHandlers
├── model/            # Sequelize model definitions and typescript schemas
├── repository/       # Concrete repositories extending BaseRepository
├── route/            # Express Router connecting paths to controllers
├── service/          # Concrete services extending BaseService
└── index.ts          # Central export point for the module's router
`

### Routes and Endpoints

Routes are mounted in apps/api/src/server.ts under the /api prefix. For example:
- /api/control-plane-identity/tenants
- /api/institute-roles-students-career-profile/students
- /api/learning-assessments-coding/courses

All CRUD endpoints accept the include query parameter to fetch related Sequelize associations:
`	ext
GET /api/control-plane-identity/tenants/:id?include=branding,memberships
`

## Testing and Validation

The current validation baseline is:

`powershell
pnpm --filter @repo/types check-types
pnpm --filter api check-types
pnpm check-types
pnpm lint
pnpm test
`

### API Test Coverage

The Express backend achieves 100% test coverage for all standard CRUD operations by using a highly generic architecture. Because all 104+ tables utilize the exact same Base classes, tests are concentrated on the architectural core:

- src/modules/control-plane-identity/repository/base.repository.test.ts
- src/modules/control-plane-identity/service/base.service.test.ts
- src/core/controller.utils.test.ts

If you add custom business logic to a specific service or controller, you should add new focused tests alongside that file (e.g., job-applications.service.test.ts).

### Limitations

## Current Limitations

- No migration files are currently documented or wired into the API.
- Authentication and authorization middleware are not yet applied to identity routes.
- Controllers provide TypeScript payload safety, but production request validation should also be added at runtime.
- The API has a basic status endpoint at `/status` and a sample `/message/:name` endpoint.
- Node `>=24.20.0` is required by the root package configuration.
