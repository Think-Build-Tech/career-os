import express, { Express } from 'express';
import cors from 'cors';
import { requestLogger } from './middleware/logger.middleware';
import { notFoundHandler, errorHandler } from './middleware/error.middleware';
import { apiRouter } from './routes/api.router';
import './modules/models/tenant-associations';
import { sequelize } from './config/database';
import { initializeControlModels } from './modules/control/models';
import { QueryTypes } from 'sequelize';

initializeControlModels(sequelize);

export function createApp(): Express {
  const app = express();

  // Enable full permissive CORS for web frontend and local clients
  const corsOptions = {
    origin: true, // Echo origin to support credentials and all dev hosts
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'x-tenant-id'],
    optionsSuccessStatus: 204,
  };

  app.use(cors(corsOptions));

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Maintenance mode remains manageable through /api/admin while protecting all other API flows.
  app.use(async (req, res, next) => {
    if (req.method === 'OPTIONS' || req.path === '/' || req.path.startsWith('/api/health') || req.path.startsWith('/api/admin')) {
      return next();
    }
    try {
      const rows = await sequelize.query<{ value: Record<string, unknown> }>(
        "SELECT value FROM platform_settings WHERE key = 'default'",
        { type: QueryTypes.SELECT }
      );
      if (rows[0]?.value?.['maintenanceMode'] === true) {
        return res.status(503).json({ success: false, message: 'CareerOS is in maintenance mode' });
      }
    } catch {
      // The settings table is created on first settings access; absence must not block startup.
    }
    return next();
  });

  // Request logging
  app.use(requestLogger);

  // Root endpoint info
  app.get('/', (req, res) => {
    res.json({
      name: 'CareerOS Backend API',
      version: '1.0.0',
      runtime: 'Node.js',
      description: 'Career Operating System Backend API built with Express and TypeScript',
      endpoints: {
        health: '/api/health',
        students: '/api/students',
        institutions: '/api/institutions',
        departments: '/api/departments',
        companies: '/api/companies',
        placements: '/api/placements',
        tacie: '/api/tacie',
        assessments: '/api/assessments',
        alumni: '/api/alumni',
        chat: '/api/chat',
        skills: '/api/skills',
        resumes: '/api/resumes',
        projects: '/api/projects',
        users: '/api/users',
        identity: '/api/identity',
        notifications: '/api/notifications',
        learning: '/api/learning',
        control: '/api/control',
        academic: '/api/academic',
        cohorts: '/api/cohorts',
        integrations: '/api/integrations',
        knowledge: '/api/knowledge',
        moderation: '/api/moderation',
        programs: '/api/programs',
        reputation: '/api/reputation',
        rewards: '/api/rewards',
      },
    });
  });

  // Mount API routes
  app.use('/api', apiRouter);

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

