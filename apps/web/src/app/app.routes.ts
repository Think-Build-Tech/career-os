// apps/web/src/app/app.routes.ts

import { Route } from '@angular/router';
import { adminAuthGuard } from './core/auth/admin-auth.guard';
import { studentAuthGuard } from './core/auth/student-auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/college-login.component').then(
        (m) => m.CollegeLoginComponent
      ),
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./pages/admin-login/admin-login.component').then(
        (m) => m.AdminLoginComponent
      ),
  },
  {
    path: 'admin-login',
    redirectTo: 'admin/login',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./pages/platform-admin/platform-admin.component').then(
        (m) => m.PlatformAdminComponent
      ),
  },
  {
    path: 'portal',
    canActivate: [studentAuthGuard],
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'jobs',
    canActivate: [studentAuthGuard],
    loadComponent: () =>
      import('./pages/jobs/jobs').then((m) => m.Jobs),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
