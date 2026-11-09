// apps/web/src/app/core/auth/admin-auth.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSessionService } from './auth-session.service';

export const adminAuthGuard: CanActivateFn = () => {
  const auth = inject(AuthSessionService);
  const router = inject(Router);

  if (auth.isAdminAuthenticated()) {
    return true;
  }

  // Not authenticated as platform super admin -> Redirect to dedicated hidden admin login
  return router.createUrlTree(['/admin/login']);
};
