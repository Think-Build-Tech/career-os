import { Router, Request, Response } from 'express';
import { createApiResponse } from '../data/store';

export const healthRouter = Router();

healthRouter.get('/', (req: Request, res: Response) => {
  const healthData = {
    status: 'healthy',
    service: 'CareerOS Node.js API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform,
    memoryMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
  };

  res.json(createApiResponse(healthData, 'Service is operational'));
});

