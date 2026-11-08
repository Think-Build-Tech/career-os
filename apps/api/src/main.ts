import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'apps/api/.env') });
dotenv.config({ path: path.resolve(__dirname, '../../apps/api/.env') });
dotenv.config();

import { createApp } from './app/app';
import { sequelize } from './app/config/database';
import { verifyAndInitializeDatabases } from './app/config/db-check';

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 5000;

const app = createApp();

const server = app.listen(port, host, async () => {
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                   💼 CareerOS Node.js API                            ║
╠══════════════════════════════════════════════════════════════════════╣
║  • Status:       Online & Ready                                      ║
║  • Host:         ${host}                                            ║
║  • Port:         ${port}                                                ║
║  • Root Info:    http://localhost:${port}/                           ║
║  • Base API:     http://localhost:${port}/api                        ║
╠══════════════════════════════════════════════════════════════════════╣
║                     Registered Module Routes (26)                    ║
╠══════════════════════════════════════════════════════════════════════╣
║  • /api/health          • /api/academic       • /api/alumni          ║
║  • /api/assessments     • /api/audit          • /api/chat            ║
║  • /api/cohorts         • /api/companies      • /api/control         ║
║  • /api/departments     • /api/identity       • /api/institutions    ║
║  • /api/integrations    • /api/knowledge      • /api/learning        ║
║  • /api/moderation      • /api/notifications  • /api/placements      ║
║  • /api/programs        • /api/projects       • /api/reputation      ║
║  • /api/resumes         • /api/rewards        • /api/skills          ║
║  • /api/students        • /api/tacie          • /api/users           ║
╚══════════════════════════════════════════════════════════════════════╝
`);

  try {
    await sequelize.authenticate();
    console.log('[Database] Database connected successfully.');

    // Verify database tables and self-heal missing control & isolated tenant databases
    await verifyAndInitializeDatabases();

    if (process.env['DB_SYNC'] === 'true') {
      console.log('[Database] Synchronizing schema (DB_SYNC=true)...');
      await sequelize.sync({ alter: true });
      console.log('[Database] Schema synchronized successfully.');
    }
  } catch (err: any) {
    console.warn('[Database] Database connection/sync warning:', err?.message || err);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('[Server] Closed out remaining connections.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[Server] SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('[Server] Closed out remaining connections.');
    process.exit(0);
  });
});
