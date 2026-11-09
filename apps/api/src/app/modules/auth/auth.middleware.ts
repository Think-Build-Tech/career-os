import { NextFunction, Request, Response } from 'express';
import { verifyToken } from './auth.security';

export function requireAuthentication(req: Request, res: Response, next: NextFunction) {
  const header = req.header('authorization');
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  try {
    const auth = verifyToken(header.slice(7));
    const requestedTenantId = req.header('x-tenant-id');
    if (auth.tenantId && requestedTenantId && auth.tenantId !== requestedTenantId) {
      return res.status(403).json({ success: false, message: 'Authenticated tenant does not match the requested tenant' });
    }
    (req as any).auth = auth;
    return next();
  } catch (error: any) {
    return res.status(401).json({ success: false, message: error?.message || 'Invalid authentication token' });
  }
}

export function requirePlatformAdmin(req: Request, res: Response, next: NextFunction) {
  return requireAuthentication(req, res, () => {
    const role = String((req as any).auth?.role || '');
    if (!['SUPER_ADMIN', 'SUPPORT_ADMIN', 'BILLING_ADMIN', 'INFRA_ADMIN', 'OPERATOR'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Platform administrator access required' });
    }
    return next();
  });
}
