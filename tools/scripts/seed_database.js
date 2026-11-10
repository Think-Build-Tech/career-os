const { Client } = require('pg');
const { createHash, scryptSync } = require('crypto');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), 'apps/api/.env') });
dotenv.config();

const DB_NAME = process.env.DB_NAME || 'careeros_dev';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 5432);
const SEED_ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'atharvabholework@gmail.com';
const SEED_ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || process.env.SEED_PASSWORD || 'Password@123';
const SEED_USER_PASSWORD = process.env.SEED_USER_PASSWORD || process.env.SEED_PASSWORD || 'Password@123';
const APPLY_SCHEMA = process.env.SEED_APPLY_SCHEMA !== 'false';
const CONFIRMED_DB = process.env.SEED_CONFIRM_DB;

const REQUIRED_TABLES = [
  'tenants', 'tenant_databases', 'subscriptions', 'global_users', 'platform_admins', 'institutions',
  'departments', 'programs', 'cohorts', 'users', 'tenant_memberships', 'student_profiles',
  'student_academic_records', 'student_career_profiles', 'companies', 'job_opportunities', 'resumes',
  'resume_versions', 'job_applications', 'assessments', 'skills', 'ai_runs', 'conversations',
  'notifications', 'student_projects', 'alumni_profiles', 'learning_posts', 'audit_logs',
];

const CREATED_AT = '2026-07-01T09:00:00.000Z';
const UPDATED_AT = '2026-11-09T09:00:00.000Z';

function stableUuid(label) {
  const hex = createHash('sha256').update(`careeros-seed:${label}`).digest('hex').slice(0, 32).split('');
  hex[12] = '4';
  hex[16] = ['8', '9', 'a', 'b'][Number.parseInt(hex[16], 16) % 4];
  const value = hex.join('');
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`;
}

function passwordHash(password, accountLabel) {
  const salt = createHash('sha256').update(`careeros-seed-salt:${accountLabel}`).digest('hex').slice(0, 32);
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function assertIdentifier(value) {
  if (!/^[a-z_][a-z0-9_]*$/.test(value)) throw new Error(`Unsafe SQL identifier: ${value}`);
  return `"${value}"`;
}

async function upsert(client, table, row, conflictColumn = 'id') {
  const columns = Object.keys(row);
  const updateColumns = columns.filter((column) => column !== conflictColumn && column !== 'created_at');
  const sql = `
    INSERT INTO ${assertIdentifier(table)} (${columns.map(assertIdentifier).join(', ')})
    VALUES (${columns.map((_, index) => `$${index + 1}`).join(', ')})
    ON CONFLICT (${assertIdentifier(conflictColumn)}) DO UPDATE SET
      ${updateColumns.map((column) => `${assertIdentifier(column)} = EXCLUDED.${assertIdentifier(column)}`).join(', ')};
  `;
  await client.query(sql, columns.map((column) => row[column]));
}

function record(label, values) {
  return { id: stableUuid(label), ...values };
}

function timestamps(values, createdAt = CREATED_AT) {
  return { ...values, created_at: createdAt, updated_at: UPDATED_AT };
}

async function findMissingRequiredTables(client) {
  const { rows } = await client.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ANY($1::text[])`,
    [REQUIRED_TABLES],
  );
  const found = new Set(rows.map((row) => row.table_name));
  return REQUIRED_TABLES.filter((table) => !found.has(table));
}

function loadSchemaSql() {
  const schemaPath = [
    path.resolve(process.cwd(), 'apps/api/src/app/config/schema.sql'),
    path.resolve(process.cwd(), 'schema.sql'),
    '/app/schema.sql',
  ].find((candidate) => fs.existsSync(candidate));
  if (!schemaPath) throw new Error('Schema file not found in the workspace or API container.');
  return fs.readFileSync(schemaPath, 'utf8');
}

/**
 * schema.sql is a pg_dump-style schema snapshot. The API may already have
 * created its control-plane tables before this one-off seed task runs, so the
 * snapshot must be made repeatable before it is applied. Existing tables and
 * indexes are retained; missing domain objects are added.
 */
function makeSchemaIdempotent(schemaSql) {
  if (schemaSql.includes('DO $careeros$')) return schemaSql;
  return schemaSql
    // schema.sql was dumped by PostgreSQL 17, while Terraform provisions
    // PostgreSQL 16. This setting does not exist on the deployed engine.
    .replace(/^SET transaction_timeout = 0;\r?\n/gm, '')
    .replace(/^CREATE TABLE public\./gm, 'CREATE TABLE IF NOT EXISTS public.')
    .replace(/^CREATE (UNIQUE )?INDEX (?!IF NOT EXISTS )/gm, 'CREATE $1INDEX IF NOT EXISTS ')
    .replace(
      /ALTER TABLE ONLY public\.([a-z_][a-z0-9_]*)\s+ADD CONSTRAINT ([a-z_][a-z0-9_]*)\s+([\s\S]*?);/g,
      (_statement, tableName, constraintName, definition) => `DO $careeros$\nBEGIN\n  IF NOT EXISTS (\n    SELECT 1\n    FROM pg_catalog.pg_constraint\n    WHERE conname = '${constraintName}'\n      AND conrelid = 'public.${tableName}'::regclass\n  ) THEN\n    ALTER TABLE ONLY public.${tableName}\n      ADD CONSTRAINT ${constraintName} ${definition.trim()};\n  END IF;\nEND\n$careeros$;`,
    );
}

async function ensureSchema(client) {
  const missing = await findMissingRequiredTables(client);
  if (!missing.length) return;
  if (!APPLY_SCHEMA) {
    throw new Error(
      `Database schema is incomplete and SEED_APPLY_SCHEMA=false. Missing tables: ${missing.join(', ')}`,
    );
  }
  console.log(`[seed] Completing database schema in ${DB_NAME}; ${missing.length} required tables are missing...`);
  await client.query(makeSchemaIdempotent(loadSchemaSql()));
}

async function verifyRequiredTables(client) {
  const missing = await findMissingRequiredTables(client);
  if (missing.length) throw new Error(`Database schema is incomplete. Missing tables: ${missing.join(', ')}`);
}

async function seed(client) {
  const id = (label) => stableUuid(label);

  const tenantId = id('tenant-apex');
  const institutionId = id('institution-apex');
  const departmentCseId = id('department-cse');
  const departmentEceId = id('department-ece');
  const programCseId = id('program-btech-cse');
  const programEceId = id('program-btech-ece');
  const cohortCseId = id('cohort-cse-2027');
  const cohortEceId = id('cohort-ece-2027');

  const accounts = {
    admin: {
      global: id('global-admin'),
      local: null,
      email: SEED_ADMIN_EMAIL,
      first: process.env.SEED_ADMIN_FIRST_NAME || 'Atharva',
      last: process.env.SEED_ADMIN_LAST_NAME || 'Bhole',
    },
    tpo: { global: id('global-tpo'), local: id('user-tpo'), email: 'ananya.rao@apex.edu.in', first: 'Ananya', last: 'Rao' },
    meera: { global: id('global-meera'), local: id('user-meera'), email: 'meera.joshi@students.apex.edu.in', first: 'Meera', last: 'Joshi' },
    arjun: { global: id('global-arjun'), local: id('user-arjun'), email: 'arjun.nair@students.apex.edu.in', first: 'Arjun', last: 'Nair' },
    kavya: { global: id('global-kavya'), local: id('user-kavya'), email: 'kavya.iyer@students.apex.edu.in', first: 'Kavya', last: 'Iyer' },
    alumni: { global: id('global-alumni'), local: id('user-alumni'), email: 'rohan.mehta@alumni.apex.edu.in', first: 'Rohan', last: 'Mehta' },
  };

  const students = {
    meera: id('student-meera'),
    arjun: id('student-arjun'),
    kavya: id('student-kavya'),
  };

  await upsert(client, 'tenants', timestamps(record('tenant-apex', {
    college_code: '1042',
    name: 'Apex Institute of Technology',
    slug: 'apex-institute-of-technology',
    institution_type: 'AUTONOMOUS_INSTITUTE',
    status: 'ACTIVE',
    activated_at: '2025-06-15T06:30:00.000Z',
  })));
  await upsert(client, 'tenant_databases', timestamps(record('tenant-database-apex', {
    tenant_id: tenantId,
    provider: 'PostgreSQL 17',
    database_name: DB_NAME,
    host_reference: DB_HOST,
    secret_reference: 'environment:DB_PASSWORD',
    region: process.env.AWS_REGION || 'ap-south-1',
    schema_version: 'v28',
    status: 'HEALTHY',
  })));
  await upsert(client, 'subscriptions', timestamps(record('subscription-apex', {
    tenant_id: tenantId,
    plan_code: 'ENTERPRISE',
    status: 'ACTIVE',
    starts_at: '2026-07-01T00:00:00.000Z',
    ends_at: '2027-06-30T23:59:59.000Z',
    metadata: { student_limit: 5000, ai_monthly_credits: 250000, billing_cycle: 'ANNUAL' },
  })));
  await upsert(client, 'tenant_provisioning_jobs', timestamps(record('provisioning-apex', {
    tenant_id: tenantId,
    status: 'COMPLETED',
    current_step: 'READY',
    attempts: 1,
    error_details: null,
    started_at: '2025-06-15T06:00:00.000Z',
    completed_at: '2025-06-15T06:12:00.000Z',
  })));

  for (const [key, account] of Object.entries(accounts)) {
    const password = key === 'admin' ? SEED_ADMIN_PASSWORD : SEED_USER_PASSWORD;
    await upsert(client, 'global_users', timestamps({
      id: account.global,
      email: account.email,
      password_hash: passwordHash(password, account.email),
      status: 'ACTIVE',
      last_login_at: key === 'admin' ? '2026-11-08T12:30:00.000Z' : null,
    }));
    if (account.local) {
      await upsert(client, 'users', timestamps({
        id: account.local,
        global_user_id: account.global,
        email: account.email,
        phone: key === 'tpo' ? '+91 98765 41020' : null,
        first_name: account.first,
        last_name: account.last,
        avatar_url: null,
        status: 'ACTIVE',
      }));
      await upsert(client, 'tenant_memberships', timestamps(record(`membership-${key}`, {
        tenant_id: tenantId,
        global_user_id: account.global,
        local_user_id: account.local,
        status: 'ACTIVE',
      })));
    }
  }
  await upsert(client, 'platform_admins', timestamps(record('platform-admin-primary', {
    global_user_id: accounts.admin.global,
    access_level: 'SUPER_ADMIN',
    status: 'ACTIVE',
  })));
  await upsert(client, 'platform_settings', {
    key: 'default',
    value: {
      defaultAiModule: true,
      assessmentHub: true,
      alumniNetwork: true,
      adminMfa: true,
      supportApproval: true,
      verboseAuthErrors: false,
      provisioningPaused: false,
      maintenanceMode: false,
    },
    updated_at: UPDATED_AT,
  }, 'key');

  await upsert(client, 'institutions', timestamps({
    id: institutionId,
    external_tenant_id: tenantId,
    name: 'Apex Institute of Technology',
    code: 'AIT',
    university_name: 'Apex Technical University',
    timezone: 'Asia/Kolkata',
    status: 'ACTIVE',
    settings: { city: 'Pune', state: 'Maharashtra', autonomous: true, academic_year: '2026-2027' },
  }));
  await upsert(client, 'departments', timestamps({
    id: departmentCseId, institution_id: institutionId, department_head_user_id: accounts.tpo.local,
    name: 'Computer Science and Engineering', code: 'CSE', status: 'ACTIVE',
  }));
  await upsert(client, 'departments', timestamps({
    id: departmentEceId, institution_id: institutionId, department_head_user_id: accounts.tpo.local,
    name: 'Electronics and Communication Engineering', code: 'ECE', status: 'ACTIVE',
  }));
  await upsert(client, 'programs', timestamps({
    id: programCseId, department_id: departmentCseId, name: 'Bachelor of Technology in Computer Science and Engineering',
    code: 'BTECH-CSE', degree_type: 'B_TECH', duration_years: 4, status: 'ACTIVE',
  }));
  await upsert(client, 'programs', timestamps({
    id: programEceId, department_id: departmentEceId, name: 'Bachelor of Technology in Electronics and Communication Engineering',
    code: 'BTECH-ECE', degree_type: 'B_TECH', duration_years: 4, status: 'ACTIVE',
  }));
  await upsert(client, 'cohorts', timestamps({
    id: cohortCseId, program_id: programCseId, admission_year: 2023, graduation_year: 2027,
    batch_name: 'Computer Science and Engineering - Class of 2027', status: 'ACTIVE',
  }));
  await upsert(client, 'cohorts', timestamps({
    id: cohortEceId, program_id: programEceId, admission_year: 2023, graduation_year: 2027,
    batch_name: 'Electronics and Communication Engineering - Class of 2027', status: 'ACTIVE',
  }));

  const studentRows = [
    { key: 'meera', id: students.meera, department: departmentCseId, program: programCseId, cohort: cohortCseId, roll: 'AIT23CSE041', prn: 'AIT2023CSE0041', cgpa: 9.12, sgpa: 9.28, completion: 94 },
    { key: 'arjun', id: students.arjun, department: departmentCseId, program: programCseId, cohort: cohortCseId, roll: 'AIT23CSE067', prn: 'AIT2023CSE0067', cgpa: 8.64, sgpa: 8.81, completion: 88 },
    { key: 'kavya', id: students.kavya, department: departmentEceId, program: programEceId, cohort: cohortEceId, roll: 'AIT23ECE029', prn: 'AIT2023ECE0029', cgpa: 8.91, sgpa: 9.04, completion: 91 },
  ];
  for (const student of studentRows) {
    await upsert(client, 'student_profiles', timestamps({
      id: student.id,
      user_id: accounts[student.key].local,
      department_id: student.department,
      program_id: student.program,
      cohort_id: student.cohort,
      roll_number: student.roll,
      prn_number: student.prn,
      placement_status: 'SEEKING',
      profile_completion_percent: student.completion,
    }));
    await upsert(client, 'student_academic_memberships', timestamps(record(`academic-membership-${student.key}`, {
      student_id: student.id, department_id: student.department, program_id: student.program, cohort_id: student.cohort,
      effective_from: '2023-08-01T00:00:00.000Z', effective_to: null, is_current: true, change_reason: 'Initial admission',
    })));
    await upsert(client, 'student_academic_records', {
      id: id(`academic-record-${student.key}`), student_id: student.id, record_type: 'SEMESTER', semester: 'Semester 6',
      cgpa: student.cgpa, sgpa: student.sgpa, percentage: Number((student.cgpa * 9.5).toFixed(2)), active_backlogs: 0,
      total_backlogs: 0, source_type: 'COLLEGE_ERP', source_reference: `ERP-${student.prn}`, verified: true,
      verified_by: accounts.tpo.local, verified_at: '2026-07-10T10:00:00.000Z', effective_from: '2026-06-30T00:00:00.000Z',
      effective_until: null, created_at: '2026-07-10T10:00:00.000Z',
    });
    await upsert(client, 'student_privacy_preferences', timestamps(record(`privacy-${student.key}`, {
      student_id: student.id, recruiter_discovery_enabled: true, resume_visibility: 'COMPANIES_ONLY',
      alumni_connection_enabled: true, learning_profile_visibility: 'CAMPUS_ONLY', assessment_visibility: 'COMPANIES_ONLY',
    })));
    await upsert(client, 'student_placement_compliance', timestamps(record(`compliance-${student.key}`, {
      student_id: student.id, active_strikes: 0, total_strikes: 0, compliance_status: 'GOOD_STANDING',
      debarred_until: null, last_event_at: null, notes: 'Eligible for all campus placement activities.',
    })));
  }

  await upsert(client, 'student_career_profiles', timestamps(record('career-meera', {
    student_id: students.meera,
    headline: 'Backend and cloud engineering student focused on dependable distributed systems',
    bio: 'Computer science undergraduate with experience building event-driven services, PostgreSQL-backed APIs, and AWS deployments.',
    preferred_roles: ['Backend Engineer', 'Cloud Engineer', 'Software Development Engineer'],
    preferred_locations: ['Pune', 'Bengaluru', 'Hyderabad'], preferred_work_modes: ['HYBRID', 'ONSITE'],
    expected_salary_min: 900000, expected_salary_max: 1800000,
    linkedin_url: 'https://www.linkedin.com/in/meera-joshi-engineering',
    github_url: 'https://github.com/meera-joshi-engineering', portfolio_url: null, open_to_work: true,
  })));
  await upsert(client, 'student_career_profiles', timestamps(record('career-arjun', {
    student_id: students.arjun, headline: 'Full-stack engineer interested in product development and platform tooling',
    bio: 'Computer science undergraduate building accessible Angular applications and TypeScript services.',
    preferred_roles: ['Full-Stack Engineer', 'Frontend Engineer'], preferred_locations: ['Pune', 'Mumbai'],
    preferred_work_modes: ['HYBRID', 'REMOTE'], expected_salary_min: 800000, expected_salary_max: 1500000,
    linkedin_url: 'https://www.linkedin.com/in/arjun-nair-engineering', github_url: 'https://github.com/arjun-nair-engineering',
    portfolio_url: null, open_to_work: true,
  })));

  const roleTpoId = id('role-central-tpo');
  const roleStudentId = id('role-student');
  await upsert(client, 'roles', timestamps({ id: roleTpoId, name: 'Central Training and Placement Officer', code: 'CENTRAL_TPO', description: 'Institution-wide placement administration', status: 'ACTIVE' }));
  await upsert(client, 'roles', timestamps({ id: roleStudentId, name: 'Student', code: 'STUDENT', description: 'Student career and placement access', status: 'ACTIVE' }));
  const permissions = [
    ['permission-drives-manage', 'DRIVES', 'MANAGE', 'Create and manage placement drives'],
    ['permission-students-read', 'STUDENTS', 'READ', 'View student placement profiles'],
    ['permission-applications-create', 'APPLICATIONS', 'CREATE', 'Submit job applications'],
  ];
  for (const [label, resource, action, description] of permissions) {
    await upsert(client, 'permissions', timestamps({ id: id(label), resource, action, description }));
  }
  await upsert(client, 'role_permissions', { id: id('role-permission-tpo-drives'), role_id: roleTpoId, permission_id: id('permission-drives-manage'), created_at: CREATED_AT });
  await upsert(client, 'role_permissions', { id: id('role-permission-tpo-students'), role_id: roleTpoId, permission_id: id('permission-students-read'), created_at: CREATED_AT });
  await upsert(client, 'role_permissions', { id: id('role-permission-student-applications'), role_id: roleStudentId, permission_id: id('permission-applications-create'), created_at: CREATED_AT });
  await upsert(client, 'role_assignments', timestamps({ id: id('assignment-tpo'), user_id: accounts.tpo.local, role_id: roleTpoId, scope_type: 'INSTITUTION', scope_id: institutionId, valid_from: CREATED_AT, valid_until: null }));
  for (const student of studentRows) {
    await upsert(client, 'role_assignments', timestamps({ id: id(`assignment-${student.key}`), user_id: accounts[student.key].local, role_id: roleStudentId, scope_type: 'STUDENT', scope_id: student.id, valid_from: CREATED_AT, valid_until: null }));
  }

  const skillRows = [
    ['skill-typescript', 'TypeScript', 'typescript', 'PROGRAMMING'],
    ['skill-nodejs', 'Node.js', 'nodejs', 'BACKEND'],
    ['skill-postgresql', 'PostgreSQL', 'postgresql', 'DATABASE'],
    ['skill-aws', 'Amazon Web Services', 'amazon-web-services', 'CLOUD'],
    ['skill-angular', 'Angular', 'angular', 'FRONTEND'],
    ['skill-docker', 'Docker', 'docker', 'DEVOPS'],
  ];
  for (const [label, name, slug, category] of skillRows) {
    await upsert(client, 'skills', timestamps({ id: id(label), name, slug, category, status: 'ACTIVE' }));
  }
  const meeraSkills = [
    ['typescript', 'ADVANCED', 91], ['nodejs', 'ADVANCED', 88], ['postgresql', 'ADVANCED', 90],
    ['aws', 'INTERMEDIATE', 82], ['docker', 'ADVANCED', 87],
  ];
  for (const [slug, proficiency, score] of meeraSkills) {
    const studentSkillId = id(`student-skill-meera-${slug}`);
    await upsert(client, 'student_skills', timestamps({
      id: studentSkillId, student_id: students.meera, skill_id: id(`skill-${slug}`), proficiency_level: proficiency,
      verification_status: 'ASSESSMENT_VERIFIED', verified_score: score,
    }));
    await upsert(client, 'skill_evidence', timestamps({
      id: id(`skill-evidence-meera-${slug}`), student_skill_id: studentSkillId, evidence_type: 'PROJECT_VERIFIED',
      reference_id: null, metadata: { reviewer: 'Placement Technology Panel', evidence: 'Capstone and technical assessment' },
      verified_by: accounts.tpo.local, verified_at: '2026-10-10T11:00:00.000Z',
    }));
  }

  const companyRows = [
    ['company-persistent', 'Persistent Systems Limited', 'https://www.persistent.com', 'Software and Technology Services', 'Pune, Maharashtra', 'DREAM'],
    ['company-infosys', 'Infosys Limited', 'https://www.infosys.com', 'Information Technology Services', 'Bengaluru, Karnataka', 'STANDARD'],
    ['company-razorpay', 'Razorpay Software Private Limited', 'https://razorpay.com', 'Financial Technology', 'Bengaluru, Karnataka', 'SUPER_DREAM'],
  ];
  for (const [label, name, website, industry, headquarters, tier] of companyRows) {
    await upsert(client, 'companies', timestamps({
      id: id(label), name, legal_name: name, website_url: website, industry,
      description: `${name} campus recruitment partner for engineering and technology roles.`, headquarters,
      status: 'ACTIVE', metadata: { placement_tier: tier, verified: true },
    }));
  }
  await upsert(client, 'company_contacts', timestamps({
    id: id('company-contact-persistent'), company_id: id('company-persistent'), name: 'Priya Menon',
    email: 'priya.menon@example-recruiting.com', phone: '+91 98765 48210', designation: 'University Relations Manager', is_primary: true,
  }));

  const seasonId = id('placement-season-2026-2027');
  const tierId = id('placement-tier-dream');
  await upsert(client, 'placement_seasons', timestamps({
    id: seasonId, name: 'Campus Placement Season 2026-2027', start_date: '2026-07-01', end_date: '2027-06-30',
    status: 'ACTIVE', metadata: { academic_year: '2026-2027', graduating_batch: 2027 },
  }));
  await upsert(client, 'placement_tiers', timestamps({
    id: tierId, placement_season_id: seasonId, name: 'Dream Opportunity', code: 'DREAM', rank: 1,
    minimum_compensation: 1000000, maximum_compensation: 2500000,
  }));
  const opportunityRows = [
    ['opportunity-persistent-backend', 'company-persistent', 'Graduate Software Engineer - Backend', 'FULL_TIME', 'HYBRID', 'Pune, Maharashtra', 900000, 1200000, '2026-11-24T18:30:00.000Z'],
    ['opportunity-infosys-cloud', 'company-infosys', 'Cloud Platform Engineer', 'FULL_TIME', 'HYBRID', 'Bengaluru, Karnataka', 850000, 1100000, '2026-11-28T18:30:00.000Z'],
    ['opportunity-razorpay-intern', 'company-razorpay', 'Backend Engineering Intern', 'INTERNSHIP', 'ONSITE', 'Bengaluru, Karnataka', 600000, 900000, '2026-12-02T18:30:00.000Z'],
  ];
  for (const [label, companyLabel, title, employmentType, workMode, location, min, max, closesAt] of opportunityRows) {
    await upsert(client, 'job_opportunities', timestamps({
      id: id(label), company_id: id(companyLabel), placement_season_id: seasonId, title, source: 'CAMPUS',
      employment_type: employmentType, work_mode: workMode, location, compensation_min: min, compensation_max: max,
      application_url: null, status: 'PUBLISHED', created_by: accounts.tpo.local,
      published_at: '2026-11-01T08:00:00.000Z', closes_at: closesAt,
    }));
  }
  const driveId = id('drive-persistent-backend');
  await upsert(client, 'placement_drives', timestamps({
    id: driveId, job_opportunity_id: id('opportunity-persistent-backend'), placement_season_id: seasonId,
    placement_tier_id: tierId, name: 'Persistent Systems Graduate Engineering Campus Drive', status: 'REGISTRATION_OPEN',
    starts_at: '2026-11-26T04:30:00.000Z', ends_at: '2026-11-27T12:30:00.000Z',
    metadata: { venue: 'Main Auditorium', rounds: ['Online Assessment', 'Technical Interview', 'HR Interview'] },
  }));

  const resumeId = id('resume-meera-primary');
  const resumeVersionId = id('resume-version-meera-primary');
  const resumeText = 'Meera Joshi - Backend and Cloud Engineering student. Experience with TypeScript, Node.js, PostgreSQL, Docker, AWS, REST APIs, and event-driven systems.';
  await upsert(client, 'resumes', timestamps({ id: resumeId, student_id: students.meera, name: 'Meera Joshi - Backend Engineering Resume', is_primary: true, status: 'ACTIVE' }));
  await upsert(client, 'resume_versions', {
    id: resumeVersionId, resume_id: resumeId, file_object_key: 'tenants/apex/resumes/meera-joshi/backend-resume-v1.pdf',
    parsed_text: resumeText, parsed_data: { skills: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'], education: 'B.Tech Computer Science and Engineering' },
    content_hash: sha256(resumeText), version_number: 1, created_at: '2026-10-20T08:30:00.000Z',
  });
  const applicationId = id('application-meera-persistent');
  await upsert(client, 'job_applications', timestamps({
    id: applicationId, student_id: students.meera, job_opportunity_id: id('opportunity-persistent-backend'),
    drive_id: driveId, resume_version_id: resumeVersionId, status: 'SHORTLISTED', applied_at: '2026-11-03T10:15:00.000Z',
  }));
  await upsert(client, 'application_status_history', {
    id: id('application-history-meera-shortlisted'), application_id: applicationId, from_status: 'SUBMITTED',
    to_status: 'SHORTLISTED', changed_by: accounts.tpo.local, reason: 'Meets academic and technical eligibility criteria.',
    created_at: '2026-11-06T09:00:00.000Z',
  });
  await upsert(client, 'job_offers', timestamps({
    id: id('offer-meera-persistent'), application_id: applicationId, student_id: students.meera,
    job_opportunity_id: id('opportunity-persistent-backend'), company_id: id('company-persistent'), placement_tier_id: tierId,
    status: 'OFFERED', compensation: 1050000, total_ctc: 1200000, currency: 'INR', offer_date: '2026-11-08',
    decision_deadline: '2026-11-15T18:30:00.000Z', joining_date: '2027-07-12',
    offer_letter_object_key: 'tenants/apex/offers/meera-joshi/persistent-offer.pdf', accepted_at: null, declined_at: null,
    decline_reason: null, signed_document_object_key: null, signature_reference: null,
    offered_at: '2026-11-08T09:30:00.000Z', responded_at: null,
  }));
  await upsert(client, 'student_action_items', timestamps({
    id: id('action-meera-offer'), student_id: students.meera, action_type: 'OFFER_DECISION',
    title: 'Review Persistent Systems employment offer', description: 'Accept or decline the offer before the decision deadline.',
    status: 'PENDING', priority: 'HIGH', deadline: '2026-11-15T18:30:00.000Z', action_url: '/applications?view=offers',
    target_entity_type: 'JOB_OFFER', target_entity_id: id('offer-meera-persistent'), completed_at: null,
  }));
  await upsert(client, 'saved_items', {
    id: id('saved-meera-cloud-job'), user_id: accounts.meera.local, student_id: students.meera,
    item_type: 'JOB_OPPORTUNITY', item_id: id('opportunity-infosys-cloud'), metadata: { note: 'Review cloud requirements' },
    created_at: '2026-11-07T16:00:00.000Z',
  });

  await upsert(client, 'student_projects', timestamps({
    id: id('project-meera-event-platform'), student_id: students.meera, title: 'Event-Driven Campus Placement Platform',
    summary: 'A reliable placement workflow system using asynchronous events and transactional outbox processing.',
    description: 'Designed and implemented a TypeScript service that coordinates job applications, interview scheduling, and notifications with PostgreSQL and Redis.',
    project_type: 'CAPSTONE', student_role: 'Backend Lead',
    contribution_description: 'Designed the data model, API contracts, retry strategy, and deployment pipeline.',
    impact_description: 'Reduced duplicate workflow execution in load tests and supported more than 10,000 scheduled events.',
    github_url: 'https://github.com/meera-joshi-engineering/campus-placement-platform', project_url: null,
    missing_keywords: [], start_date: '2026-01-10', end_date: '2026-06-15', is_ongoing: false,
    visibility: 'PUBLIC', verification_status: 'VERIFIED', verified_by: accounts.tpo.local, verified_at: '2026-07-02T08:00:00.000Z',
  }));

  await upsert(client, 'academic_events', timestamps({
    id: id('academic-event-semester-exams'), department_id: departmentCseId, program_id: programCseId, cohort_id: cohortCseId,
    event_type: 'EXAM', title: 'Semester Seven Midterm Examinations',
    description: 'Department midterm examinations for the seventh semester.', starts_at: '2026-11-18T03:30:00.000Z',
    ends_at: '2026-11-22T11:30:00.000Z', location: 'Academic Block A', is_mandatory: true,
  }));

  const assessmentId = id('assessment-dsa-benchmark');
  const assignmentId = id('assessment-assignment-meera');
  await upsert(client, 'assessments', timestamps({
    id: assessmentId, title: 'Data Structures and Algorithms Readiness Assessment',
    description: 'Proctored placement readiness assessment covering algorithms, data structures, and complexity analysis.',
    assessment_type: 'TECHNICAL', scope_type: 'COHORT', scope_id: cohortCseId, duration_minutes: 90,
    maximum_score: 100, passing_score: 60, metadata: { question_count: 30, proctored: true },
    status: 'PUBLISHED', created_by: accounts.tpo.local,
  }));
  await upsert(client, 'assessment_assignments', timestamps({
    id: assignmentId, assessment_id: assessmentId, scope_type: 'STUDENT', scope_id: students.meera,
    available_from: '2026-10-01T00:00:00.000Z', due_at: '2026-10-31T18:30:00.000Z', max_attempts: 1,
    created_by: accounts.tpo.local,
  }));
  await upsert(client, 'assessment_attempts', timestamps({
    id: id('assessment-attempt-meera'), assessment_id: assessmentId, assignment_id: assignmentId, student_id: students.meera,
    attempt_number: 1, status: 'GRADED', score: 86, started_at: '2026-10-12T04:30:00.000Z',
    submitted_at: '2026-10-12T05:54:00.000Z', graded_at: '2026-10-12T06:00:00.000Z',
  }));

  const aiRunId = id('ai-run-meera-skill-gap');
  await upsert(client, 'ai_runs', {
    id: aiRunId, run_type: 'SKILL_GAP_ANALYSIS', model_name: 'gemini-1.5-pro', model_version: '2026-09',
    input_snapshot_hash: sha256('meera-skill-gap-backend-engineer'), status: 'COMPLETED', prompt_tokens: 1840,
    completion_tokens: 720, estimated_cost: 0.0184, error_details: null,
    started_at: '2026-11-05T07:30:00.000Z', completed_at: '2026-11-05T07:30:05.000Z', created_at: '2026-11-05T07:30:00.000Z',
  });
  await upsert(client, 'ai_usage_quotas', timestamps({
    id: id('ai-quota-meera'), scope_type: 'USER', scope_id: accounts.meera.local, credit_limit: 100,
    used_credits: 18, reset_frequency: 'MONTHLY', last_reset_at: '2026-11-01T00:00:00.000Z', is_active: true,
  }));
  await upsert(client, 'skill_gap_analyses', timestamps({
    id: id('skill-gap-meera'), student_id: students.meera, target_role: 'Backend Engineer',
    job_opportunity_id: id('opportunity-persistent-backend'), resume_version_id: resumeVersionId, ai_run_id: aiRunId,
    metadata: { readiness_score: 84, strengths: ['TypeScript', 'PostgreSQL', 'API design'], priorities: ['Distributed tracing', 'Kubernetes'] },
  }));

  const alumniProfileId = id('alumni-profile-rohan');
  await upsert(client, 'alumni_profiles', timestamps({
    id: alumniProfileId, user_id: accounts.alumni.local, former_student_id: null, graduation_year: 2021,
    headline: 'Senior Software Engineer at a global financial technology company',
    bio: 'Backend engineer and Apex alumnus mentoring students on system design, interview preparation, and early-career growth.',
    referrals_enabled: true, mentoring_enabled: true, student_chat_enabled: true, status: 'ACTIVE',
  }));
  await upsert(client, 'mentorship_availability_slots', timestamps({
    id: id('mentorship-slot-rohan'), alumni_id: alumniProfileId, topic: 'SYSTEM_DESIGN_MOCK',
    starts_at: '2026-11-14T10:30:00.000Z', ends_at: '2026-11-14T11:15:00.000Z', duration_minutes: 45,
    meeting_link: 'https://meet.example.com/apex-system-design', is_booked: false, status: 'AVAILABLE',
  }));

  const conversationId = id('conversation-meera-advisor');
  await upsert(client, 'conversations', timestamps({
    id: conversationId, conversation_type: 'TACIE_ADVISOR', title: 'Backend Engineering Preparation Plan',
    created_by: accounts.meera.local, status: 'ACTIVE', metadata: { target_role: 'Backend Engineer' },
  }));
  await upsert(client, 'conversation_participants', {
    id: id('participant-meera-advisor'), conversation_id: conversationId, user_id: accounts.meera.local,
    participant_type: 'STUDENT', joined_at: '2026-11-05T07:25:00.000Z', left_at: null, created_at: '2026-11-05T07:25:00.000Z',
  });
  await upsert(client, 'messages', {
    id: id('message-meera-advisor-question'), conversation_id: conversationId, sender_type: 'USER',
    sender_user_id: accounts.meera.local, message_type: 'TEXT',
    content: 'Help me prioritize my preparation for backend engineering interviews over the next four weeks.',
    parent_message_id: null, created_at: '2026-11-05T07:26:00.000Z', edited_at: null, deleted_at: null,
  });
  await upsert(client, 'messages', {
    id: id('message-meera-advisor-answer'), conversation_id: conversationId, sender_type: 'AI_ASSISTANT',
    sender_user_id: null, message_type: 'TEXT',
    content: 'Focus first on data structures and API design, then add database performance, concurrency, and two timed system-design practice sessions.',
    parent_message_id: id('message-meera-advisor-question'), created_at: '2026-11-05T07:26:05.000Z', edited_at: null, deleted_at: null,
  });

  await upsert(client, 'notifications', timestamps({
    id: id('notification-meera-offer'), user_id: accounts.meera.local, notification_type: 'OFFER_RECEIVED',
    title: 'Employment offer received', body: 'Persistent Systems has issued an offer. Review it before the decision deadline.',
    metadata: { offer_id: id('offer-meera-persistent'), deadline: '2026-11-15T18:30:00.000Z' }, read_at: null,
  }));
  await upsert(client, 'notifications', timestamps({
    id: id('notification-meera-assessment'), user_id: accounts.meera.local, notification_type: 'ASSESSMENT_RESULT',
    title: 'Assessment result published', body: 'Your Data Structures and Algorithms readiness score is now available.',
    metadata: { assessment_id: assessmentId, score: 86 }, read_at: '2026-10-12T07:00:00.000Z',
  }));

  await upsert(client, 'learning_posts', timestamps({
    id: id('learning-post-tpo-interviews'), author_user_id: accounts.tpo.local, content_type: 'GUIDE',
    title: 'Preparing for Structured Technical Interviews',
    content: 'Use a repeatable approach: clarify requirements, state assumptions, compare alternatives, implement carefully, and test edge cases.',
    scope_type: 'INSTITUTION', scope_id: institutionId, status: 'PUBLISHED', published_at: '2026-10-25T06:30:00.000Z',
  }));

  const integrationId = id('integration-campus-erp');
  await upsert(client, 'integration_connections', timestamps({
    id: integrationId, integration_type: 'COLLEGE_ERP', name: 'Apex Academic ERP',
    secret_reference: 'secretsmanager:apex/academic-erp', metadata: { sync_scope: ['students', 'academics'], schedule: 'DAILY' },
    status: 'ACTIVE', last_synced_at: '2026-11-09T02:30:00.000Z',
  }));
  await upsert(client, 'sync_jobs', timestamps({
    id: id('sync-job-campus-erp'), integration_connection_id: integrationId, job_type: 'ACADEMIC_RECORD_SYNC',
    status: 'COMPLETED', metadata: { semester: 'Semester 6' }, records_processed: 1248, records_failed: 0,
    error_details: null, started_at: '2026-11-09T02:30:00.000Z', completed_at: '2026-11-09T02:33:18.000Z',
  }));

  await upsert(client, 'audit_logs', {
    id: id('audit-placement-drive-published'), actor_user_id: accounts.tpo.local, action: 'PLACEMENT_DRIVE_PUBLISHED',
    entity_type: 'PLACEMENT_DRIVE', entity_id: driveId, previous_value: { status: 'DRAFT' },
    new_value: { status: 'REGISTRATION_OPEN' }, ip_address: '10.10.12.24',
    user_agent: 'CareerOS Seed Data', correlation_id: id('correlation-placement-drive'), created_at: '2026-11-01T08:05:00.000Z',
  });

  return {
    tenant: { name: 'Apex Institute of Technology', code: '1042' },
    adminEmail: accounts.admin.email,
    studentEmails: [accounts.meera.email, accounts.arjun.email, accounts.kavya.email],
    tpoEmail: accounts.tpo.email,
  };
}

async function verifySeed(client) {
  const checks = [
    { label: 'tenant', table: 'tenants', ids: [stableUuid('tenant-apex')] },
    { label: 'global users', table: 'global_users', ids: ['admin', 'tpo', 'meera', 'arjun', 'kavya', 'alumni'].map((key) => stableUuid(`global-${key}`)) },
    { label: 'local users', table: 'users', ids: ['tpo', 'meera', 'arjun', 'kavya', 'alumni'].map((key) => stableUuid(`user-${key}`)) },
    { label: 'students', table: 'student_profiles', ids: ['meera', 'arjun', 'kavya'].map((key) => stableUuid(`student-${key}`)) },
    { label: 'companies', table: 'companies', ids: ['persistent', 'infosys', 'razorpay'].map((key) => stableUuid(`company-${key}`)) },
    { label: 'opportunities', table: 'job_opportunities', ids: ['persistent-backend', 'infosys-cloud', 'razorpay-intern'].map((key) => stableUuid(`opportunity-${key}`)) },
    { label: 'resumes', table: 'resumes', ids: [stableUuid('resume-meera-primary')] },
    { label: 'applications', table: 'job_applications', ids: [stableUuid('application-meera-persistent')] },
    { label: 'assessments', table: 'assessments', ids: [stableUuid('assessment-dsa-benchmark')] },
    { label: 'AI runs', table: 'ai_runs', ids: [stableUuid('ai-run-meera-skill-gap')] },
  ];
  const results = [];
  for (const check of checks) {
    const { rows } = await client.query(
      `SELECT count(*)::int AS count FROM ${assertIdentifier(check.table)} WHERE id = ANY($1::uuid[])`,
      [check.ids],
    );
    const actual = rows[0].count;
    if (actual !== check.ids.length) {
      throw new Error(`Seed verification failed for ${check.label}: expected ${check.ids.length}, found ${actual}`);
    }
    results.push({ label: check.label, count: actual });
  }
  return results;
}

async function main() {
  if (!CONFIRMED_DB || CONFIRMED_DB !== DB_NAME) {
    throw new Error(`Set SEED_CONFIRM_DB=${DB_NAME} to confirm the exact database target.`);
  }
  if (!SEED_ADMIN_PASSWORD || SEED_ADMIN_PASSWORD.length < 12) {
    throw new Error('Set SEED_ADMIN_PASSWORD (or SEED_PASSWORD) to at least 12 characters.');
  }
  if (!SEED_USER_PASSWORD || SEED_USER_PASSWORD.length < 12) {
    throw new Error('Set SEED_USER_PASSWORD (or SEED_PASSWORD) to at least 12 characters.');
  }

  const client = new Client({
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' } : undefined,
  });

  try {
    console.log(`[seed] Connecting to ${DB_HOST}:${DB_PORT}/${DB_NAME} as ${DB_USER}...`);
    await client.connect();
    await ensureSchema(client);
    await verifyRequiredTables(client);
    await client.query('BEGIN');
    await client.query("SELECT pg_advisory_xact_lock(hashtext('careeros-deterministic-seed-v1'))");
    const summary = await seed(client);
    const verification = await verifySeed(client);
    await client.query('COMMIT');
    console.log('[seed] Database seed completed successfully.');
    console.log(`[seed] Institution: ${summary.tenant.name} (${summary.tenant.code})`);
    console.log(`[seed] Platform administrator: ${summary.adminEmail}`);
    console.log(`[seed] TPO account: ${summary.tpoEmail}`);
    console.log(`[seed] Student accounts: ${summary.studentEmails.join(', ')}`);
    console.log(`[seed] Verified rows: ${verification.map((item) => `${item.label}=${item.count}`).join(', ')}`);
    console.log('[seed] Passwords are the values supplied through SEED_ADMIN_PASSWORD and SEED_USER_PASSWORD.');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    await client.end().catch(() => undefined);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`[seed] ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = {
  makeSchemaIdempotent,
  findMissingRequiredTables,
};
