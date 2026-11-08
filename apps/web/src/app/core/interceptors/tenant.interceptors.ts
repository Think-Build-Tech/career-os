import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthSessionService } from '../auth/auth-session.service';

export const tenantHeadersInterceptor: HttpInterceptorFn = (req, next) => {
    const authSession = inject(AuthSessionService);
    const currentTenantId = authSession.tenantId();
    const token = authSession.session()?.accessToken;

    const headers: Record<string, string> = {
        "Content-Type" : "application/json",
    };

    if(currentTenantId){
        headers['x-tenant-id'] = currentTenantId;
    }
    if(token){
        headers['Authorization'] = `Bearer ${token}`
    }

    return next(req.clone({ setHeaders: headers }));
};
