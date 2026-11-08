import { Router } from 'express';
import {
  checkAdminHealth,
  getDashboard,
  getPlatformSettings,
  updatePlatformSettings,
} from './admin.controller';

export const adminRouter = Router();

adminRouter.get('/dashboard', getDashboard);
adminRouter.get('/health', checkAdminHealth);
adminRouter.get('/settings', getPlatformSettings);
adminRouter.put('/settings', updatePlatformSettings);
