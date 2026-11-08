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

export async function startServer() {
  const app = createApp();

  const server = app.listen(port, host, async () => {
    console.log(`[CareerOS Server] Online on http://${host}:${port}`);

    try {
      await sequelize.authenticate();
      console.log('[Database] Database connected successfully.');
      await verifyAndInitializeDatabases();
    } catch (err: any) {
      console.warn('[Database] Database check warning:', err?.message || err);
    }
  });

  process.on('SIGTERM', () => {
    server.close(() => process.exit(0));
  });

  return { app, server };
}

if (require.main === module) {
  startServer();
}

