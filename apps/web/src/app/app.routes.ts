import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/platform-admin/platform-admin.component').then(
        (m) => m.PlatformAdminComponent
      ),
  },
  {
    path: 'portal',
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'jobs',
    loadComponent: () =>
      import('./pages/jobs/jobs').then((m) => m.Jobs),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'admin',
  },
  {
    path: '**',
    redirectTo: 'admin',
  },
];
