import { Router } from 'express';
import {
  checkAdminHealth,
  getDashboard,
  getPlatformSettings,
  updatePlatformSettings,
} from './admin.controller';
import { requirePlatformAdmin } from '../auth/auth.middleware';

export const adminRouter = Router();

adminRouter.use(requirePlatformAdmin);

adminRouter.get('/dashboard', getDashboard);
adminRouter.get('/health', checkAdminHealth);
adminRouter.get('/settings', getPlatformSettings);
adminRouter.put('/settings', updatePlatformSettings);
