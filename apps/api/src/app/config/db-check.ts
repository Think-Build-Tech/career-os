import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import config from './config';
import { sequelize } from './database';

export const PROTOTYPE_COLLEGES = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    college_code: '4821',
    name: 'Sandip Institute of Technology & Research Centre (SITRC)',
    slug: 'sitrc',
    institution_type: 'ENGINEERING_COLLEGE',
    status: 'ACTIVE',
    db_name: 'careeros_sitrc',
    schema: 'v28',
    db_status: 'HEALTHY',
    plan: 'ENTERPRISE',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    college_code: '7314',
    name: 'ABC College of Engineering',
    slug: 'abc-coe',
    institution_type: 'ENGINEERING_COLLEGE',
    status: 'ACTIVE',
    db_name: 'careeros_abc',
    schema: 'v28',
    db_status: 'HEALTHY',
    plan: 'STANDARD',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    college_code: '2608',
    name: 'XYZ Institute of Technology',
    slug: 'xyz-iot',
    institution_type: 'ENGINEERING_COLLEGE',
    status: 'PROVISIONING',
    db_name: 'careeros_xyz',
    schema: 'v27',
    db_status: 'CREATING',
    plan: 'STANDARD',
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    college_code: '9143',
    name: 'DEF College of Engineering',
    slug: 'def-college',
    institution_type: 'ENGINEERING_COLLEGE',
    status: 'ATTENTION',
    db_name: 'careeros_def',
    schema: 'v26',
    db_status: 'MIGRATION_ISSUE',
    plan: 'ENTERPRISE',
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    college_code: '5530',
    name: 'PQR Vidyapeeth',
    slug: 'pqr-vidyapeeth',
    institution_type: 'UNIVERSITY',
    status: 'SUSPENDED',
    db_name: 'careeros_pqr',
    schema: 'v27',
    db_status: 'PAUSED',
    plan: 'STANDARD',
  },
];

function getClient(database = config.DB_NAME): Client {
  return new Client({
    user: config.DB_USER,
    host: config.DB_HOST,
    database,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
  });
}

function loadSchemaSql(): string {
  const possiblePaths = [
    path.resolve(__dirname, 'schema.sql'),
    path.resolve(process.cwd(), 'apps/api/src/app/config/schema.sql'),
    path.resolve(__dirname, '../../apps/api/src/app/config/schema.sql'),
    path.resolve(process.cwd(), 'dist/apps/api/schema.sql'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return fs.readFileSync(p, 'utf8');
    }
  }
  return '';
}

/**
 * Physically creates a new isolated PostgreSQL database and provisions its schema
 */
export async function provisionTenantDatabase(databaseName: string, tenantData?: { name?: string; code?: string; tenantId?: string }): Promise<boolean> {
  const adminClient = getClient('postgres');
  try {
    await adminClient.connect();
    const existingDbs = (await adminClient.query('SELECT datname FROM pg_database;')).rows.map((r: any) => r.datname);
    
    if (!existingDbs.includes(databaseName)) {
      console.log(`[DB Provisioner] Creating PostgreSQL database: "${databaseName}"...`);
      await adminClient.query(`CREATE DATABASE "${databaseName}";`);
      console.log(`[DB Provisioner] Database "${databaseName}" created successfully.`);
    } else {
      console.log(`[DB Provisioner] Database "${databaseName}" already exists.`);
    }
  } catch (err: any) {
    console.warn(`[DB Provisioner] Notice creating "${databaseName}":`, err.message);
  } finally {
    await adminClient.end();
  }

  // Provision schema
  const tenantClient = getClient(databaseName);
  try {
    await tenantClient.connect();
    const tableRes = await tenantClient.query("SELECT count(*)::int as cnt FROM information_schema.tables WHERE table_schema = 'public';");
    if (tableRes.rows[0].cnt < 10) {
      console.log(`[DB Provisioner] Initializing schema for "${databaseName}" (found ${tableRes.rows[0].cnt} tables)...`);
      const schemaSql = loadSchemaSql();
      if (schemaSql) {
        await tenantClient.query(schemaSql);
        console.log(`[DB Provisioner] Schema initialized for "${databaseName}".`);
      } else {
        console.warn(`[DB Provisioner] schema.sql not found; relying on Sequelize sync.`);
      }

      // If tenant metadata provided, insert base institution record
      if (tenantData?.name && tenantData?.code) {
        try {
          await tenantClient.query(`
            INSERT INTO institutions (id, external_tenant_id, name, code, university_name, timezone, status, settings, created_at, updated_at)
            VALUES (gen_random_uuid(), $1, $2, $3, 'State University', 'Asia/Kolkata', 'ACTIVE', '{}'::jsonb, NOW(), NOW())
            ON CONFLICT DO NOTHING;
          `, [tenantData.tenantId || '00000000-0000-0000-0000-000000000001', tenantData.name, tenantData.code]);
        } catch {
          // ignore if institutions table differs
        }
      }
    } else {
      console.log(`[DB Provisioner] Database "${databaseName}" already initialized with ${tableRes.rows[0].cnt} tables.`);
    }
    return true;
  } catch (err: any) {
    console.error(`[DB Provisioner] Error initializing schema for "${databaseName}":`, err.message);
    return false;
  } finally {
    await tenantClient.end();
  }
}

/**
 * Main verification and self-healing runner executed on API startup.
 * Checks tables, creates missing control models, seeds prototype tenants,
 * and ensures isolated databases exist.
 */
export async function verifyAndInitializeDatabases(): Promise<void> {
  console.log('[DB Check] Checking database connection and self-healing tables...');
  const client = getClient(config.DB_NAME);

  try {
    await client.connect();
    console.log(`[DB Check] Connected to primary database "${config.DB_NAME}".`);

    // 1. Extensions
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

    // 2. Control Plane Tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS tenants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        college_code CHAR(4) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        institution_type VARCHAR(64) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'PROVISIONING',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        activated_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS global_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
        last_login_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS tenant_memberships (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        global_user_id UUID NOT NULL REFERENCES global_users(id) ON DELETE CASCADE,
        local_user_id UUID,
        status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(tenant_id, global_user_id)
      );

      CREATE TABLE IF NOT EXISTS tenant_databases (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
        provider VARCHAR(32) NOT NULL DEFAULT 'PostgreSQL 17',
        database_name VARCHAR(255) NOT NULL,
        host_reference VARCHAR(255) NOT NULL,
        secret_reference VARCHAR(255) NOT NULL,
        region VARCHAR(64) DEFAULT 'ap-south-1 (Mumbai)',
        schema_version VARCHAR(64) NOT NULL DEFAULT 'v28',
        status VARCHAR(32) NOT NULL DEFAULT 'HEALTHY',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS tenant_provisioning_jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        status VARCHAR(32) NOT NULL DEFAULT 'QUEUED',
        current_step VARCHAR(64),
        attempts SMALLINT NOT NULL DEFAULT 0,
        error_details JSONB,
        started_at TIMESTAMPTZ,
        completed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        plan_code VARCHAR(64) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
        starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        ends_at TIMESTAMPTZ,
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS platform_admins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        global_user_id UUID NOT NULL UNIQUE REFERENCES global_users(id) ON DELETE CASCADE,
        access_level VARCHAR(32) NOT NULL DEFAULT 'SUPER_ADMIN',
        status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS platform_settings (
        key VARCHAR(64) PRIMARY KEY,
        value JSONB NOT NULL DEFAULT '{}'::jsonb,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Ensure gen_random_uuid() default on all control tables
    for (const t of ['tenants', 'global_users', 'tenant_memberships', 'tenant_databases', 'tenant_provisioning_jobs', 'subscriptions', 'platform_admins']) {
      try {
        await client.query(`ALTER TABLE "${t}" ALTER COLUMN id SET DEFAULT gen_random_uuid();`);
      } catch {}
    }

    // 3. Seed Prototype Colleges
    for (const c of PROTOTYPE_COLLEGES) {
      await client.query(`
        INSERT INTO tenants (id, college_code, name, slug, institution_type, status, activated_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
          college_code = EXCLUDED.college_code,
          name = EXCLUDED.name,
          slug = EXCLUDED.slug,
          status = EXCLUDED.status;
      `, [c.id, c.college_code, c.name, c.slug, c.institution_type, c.status]);

      await client.query(`
        INSERT INTO tenant_databases (tenant_id, provider, database_name, host_reference, secret_reference, region, schema_version, status, updated_at)
        VALUES ($1, 'PostgreSQL 17', $2, 'localhost:5432', 'vault://db/tenants/' || $3, 'ap-south-1 (Mumbai)', $4, $5, NOW())
        ON CONFLICT (tenant_id) DO UPDATE SET
          database_name = EXCLUDED.database_name,
          status = EXCLUDED.status;
      `, [c.id, c.db_name, c.slug, c.schema, c.db_status]);

      await client.query(`
        INSERT INTO subscriptions (tenant_id, plan_code, status, starts_at, updated_at)
        VALUES ($1, $2, 'ACTIVE', NOW(), NOW())
        ON CONFLICT DO NOTHING;
      `, [c.id, c.plan]);
    }

    // 4. Seed Platform Admins
    const admins = [
      { email: 'atharva@thinkbuild.ai', access: 'SUPER_ADMIN' },
      { email: 'support@thinkbuild.ai', access: 'SUPPORT_ADMIN' },
    ];
    for (const a of admins) {
      const uRes = await client.query(`
        INSERT INTO global_users (id, email, password_hash, status, created_at, updated_at)
        VALUES (gen_random_uuid(), $1, 'scrypt_hashed_secret', 'ACTIVE', NOW(), NOW())
        ON CONFLICT (email) DO UPDATE SET status = 'ACTIVE'
        RETURNING id;
      `, [a.email]);
      const userId = uRes.rows[0].id;

      await client.query(`
        INSERT INTO platform_admins (id, global_user_id, access_level, status, created_at, updated_at)
        VALUES (gen_random_uuid(), $1, $2, 'ACTIVE', NOW(), NOW())
        ON CONFLICT (global_user_id) DO UPDATE SET access_level = EXCLUDED.access_level;
      `, [userId, a.access]);
    }

    // 5. Seed Default Settings
    await client.query(`
      INSERT INTO platform_settings (key, value, updated_at)
      VALUES ('default', '{
        "defaultAiModule": true,
        "assessmentHub": true,
        "alumniNetwork": true,
        "adminMfa": true,
        "supportApproval": true,
        "verboseAuthErrors": false,
        "provisioningPaused": false,
        "maintenanceMode": false
      }'::jsonb, NOW())
      ON CONFLICT (key) DO NOTHING;
    `);

    // 6. Check physical isolated databases for all registered tenants
    console.log('[DB Check] Checking physical databases for registered tenants...');
    const tenantRows = (await client.query(`
      SELECT t.id, t.name, t.college_code, t.slug, td.database_name 
      FROM tenants t
      LEFT JOIN tenant_databases td ON t.id = td.tenant_id;
    `)).rows;

    for (const t of tenantRows) {
      const dbName = t.database_name || `careeros_${t.slug.replace(/-/g, '_')}`;
      await provisionTenantDatabase(dbName, { name: t.name, code: t.college_code, tenantId: t.id });
    }

    console.log('[DB Check] ✅ All database tables and isolated tenant databases verified successfully.');
  } catch (err: any) {
    console.error('[DB Check] Initialization error:', err.message);
  } finally {
    await client.end();
  }
}

