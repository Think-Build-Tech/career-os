const { Client } = require('pg');

async function run() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'careeros_dev',
    password: 'admin',
    port: 5432,
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL: careeros_dev');

    // 1. Ensure uuid-ossp extension exists
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    console.log('Verified uuid-ossp extension');

    // 2. Create tenants table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tenants (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        college_code CHAR(4) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        institution_type VARCHAR(64) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'PROVISIONING',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        activated_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('Created or verified tenants table');

    // 3. Create global_users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS global_users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
        last_login_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('Created or verified global_users table');

    // 4. Create tenant_memberships table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tenant_memberships (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        global_user_id UUID NOT NULL REFERENCES global_users(id) ON DELETE CASCADE,
        local_user_id UUID,
        status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(tenant_id, global_user_id)
      );
    `);
    console.log('Created or verified tenant_memberships table');

    // 5. Create tenant_databases table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tenant_databases (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    `);
    console.log('Created or verified tenant_databases table');

    // 6. Create tenant_provisioning_jobs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tenant_provisioning_jobs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    `);
    console.log('Created or verified tenant_provisioning_jobs table');

    // 7. Create subscriptions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        plan_code VARCHAR(64) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
        starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        ends_at TIMESTAMPTZ,
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('Created or verified subscriptions table');

    // 8. Create platform_admins table
    await client.query(`
      CREATE TABLE IF NOT EXISTS platform_admins (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        global_user_id UUID NOT NULL UNIQUE REFERENCES global_users(id) ON DELETE CASCADE,
        access_level VARCHAR(32) NOT NULL DEFAULT 'SUPER_ADMIN',
        status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('Created or verified platform_admins table');

    // Ensure default gen_random_uuid() for all primary keys
    for (const table of ['tenants', 'global_users', 'tenant_memberships', 'tenant_databases', 'tenant_provisioning_jobs', 'subscriptions', 'platform_admins']) {
      try {
        await client.query(`ALTER TABLE "${table}" ALTER COLUMN id SET DEFAULT gen_random_uuid();`);
      } catch (err) {
        // Ignored if already default
      }
    }

    // 9. Seed 5 prototype college tenants
    console.log('\n--- Seeding Prototype Colleges & Tenant Databases ---');
    const colleges = [
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

    for (const c of colleges) {
      // Upsert tenant
      await client.query(`
        INSERT INTO tenants (id, college_code, name, slug, institution_type, status, activated_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
          college_code = EXCLUDED.college_code,
          name = EXCLUDED.name,
          slug = EXCLUDED.slug,
          institution_type = EXCLUDED.institution_type,
          status = EXCLUDED.status,
          updated_at = NOW();
      `, [c.id, c.college_code, c.name, c.slug, c.institution_type, c.status]);

      // Upsert tenant_database
      await client.query(`
        INSERT INTO tenant_databases (tenant_id, provider, database_name, host_reference, secret_reference, region, schema_version, status, updated_at)
        VALUES ($1, 'PostgreSQL 17', $2, 'localhost:5432', 'vault://db/tenants/' || $3, 'ap-south-1 (Mumbai)', $4, $5, NOW())
        ON CONFLICT (tenant_id) DO UPDATE SET
          database_name = EXCLUDED.database_name,
          schema_version = EXCLUDED.schema_version,
          status = EXCLUDED.status,
          updated_at = NOW();
      `, [c.id, c.db_name, c.slug, c.schema, c.db_status]);

      // Upsert subscription
      await client.query(`
        INSERT INTO subscriptions (tenant_id, plan_code, status, starts_at, updated_at)
        VALUES ($1, $2, 'ACTIVE', NOW(), NOW())
        ON CONFLICT DO NOTHING;
      `, [c.id, c.plan]);
    }
    console.log(`Seeded ${colleges.length} college tenants with isolated databases & subscriptions`);

    // 10. Seed global users and platform admins
    const admins = [
      { email: 'atharva@thinkbuild.ai', name: 'Atharva Bhole', access: 'SUPER_ADMIN' },
      { email: 'support@thinkbuild.ai', name: 'Support Operator', access: 'SUPPORT_ADMIN' },
      { email: 'finance@thinkbuild.ai', name: 'Finance Operator', access: 'BILLING_ADMIN' },
    ];

    for (const a of admins) {
      const userRes = await client.query(`
        INSERT INTO global_users (id, email, password_hash, status, created_at, updated_at)
        VALUES (gen_random_uuid(), $1, 'scrypt_hashed_secret', 'ACTIVE', NOW(), NOW())
        ON CONFLICT (email) DO UPDATE SET status = 'ACTIVE'
        RETURNING id;
      `, [a.email]);
      const userId = userRes.rows[0].id;

      await client.query(`
        INSERT INTO platform_admins (id, global_user_id, access_level, status, created_at, updated_at)
        VALUES (gen_random_uuid(), $1, $2, 'ACTIVE', NOW(), NOW())
        ON CONFLICT (global_user_id) DO UPDATE SET access_level = EXCLUDED.access_level, updated_at = NOW();
      `, [userId, a.access] );
    }
    console.log(`Seeded ${admins.length} platform administrator accounts`);

    // 11. Seed provisioning jobs
    await client.query(`
      INSERT INTO tenant_provisioning_jobs (id, tenant_id, status, current_step, attempts, created_at, updated_at)
      VALUES 
        (gen_random_uuid(), '00000000-0000-0000-0000-000000000003', 'RUNNING', 'Database provisioning · Step 4 of 7', 1, NOW(), NOW())
      ON CONFLICT DO NOTHING;
    `);
    console.log('Seeded provisioning queue jobs');

    // 12. Create the physical isolated databases if they don't exist yet!
    console.log('\n--- Checking & Creating Physical Isolated Databases ---');
    const adminClient = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: 'admin',
      port: 5432,
    });
    await adminClient.connect();

    const existingDbs = (await adminClient.query('SELECT datname FROM pg_database;')).rows.map(r => r.datname);
    for (const c of colleges) {
      if (!existingDbs.includes(c.db_name)) {
        try {
          await adminClient.query(`CREATE DATABASE "${c.db_name}";`);
          console.log(`+ Created isolated PostgreSQL database: "${c.db_name}"`);
        } catch (e) {
          console.log(`- Database "${c.db_name}" creation notice: ${e.message}`);
        }
      } else {
        console.log(`✓ Isolated PostgreSQL database "${c.db_name}" already exists`);
      }
    }
    await adminClient.end();

    console.log('\n✅ ALL DATABASE TABLES, TENANT ISOLATION, AND SCHEMAS SUCCESSFULLY INITIALIZED!');
  } catch (err) {
    console.error('Fatal Database Initialization Error:', err);
  } finally {
    await client.end();
  }
}

run();
