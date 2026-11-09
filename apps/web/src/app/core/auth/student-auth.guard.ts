// apps/web/src/app/core/auth/student-auth.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSessionService } from './auth-session.service';

export const studentAuthGuard: CanActivateFn = () => {
  const auth = inject(AuthSessionService);
  const router = inject(Router);

  if (auth.isStudentAuthenticated()) {
    return true;
  }

  // Not authenticated -> Redirect to college login
  return router.createUrlTree(['/login']);
};
