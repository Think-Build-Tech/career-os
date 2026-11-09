import { Router } from 'express';
import { bootstrapAdmin, loginAdmin, loginStudent } from './auth.controller';

export const authRouter = Router();

authRouter.post('/admin/bootstrap', bootstrapAdmin);
authRouter.post('/admin/login', loginAdmin);
authRouter.post('/student/login', loginStudent);
