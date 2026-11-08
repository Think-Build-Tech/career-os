const { Client } = require('pg');

async function seedData(targetDb) {
  console.log(`\n========================================`);
  console.log(` Seeding Data into Database: ${targetDb}`);
  console.log(`========================================`);

  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: targetDb,
    password: 'admin',
    port: 5432,
  });

  try {
    await client.connect();

    // 1. Ensure uuid generation
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

    // 2. Set default UUIDs for common domain tables
    const domainTables = [
      'institutions', 'departments', 'programs', 'cohorts', 'users',
      'student_profiles', 'companies', 'job_opportunities', 'placement_seasons',
      'skills', 'resumes', 'assessments', 'alumni_profiles'
    ];
    for (const t of domainTables) {
      try {
        await client.query(`ALTER TABLE "${t}" ALTER COLUMN id SET DEFAULT gen_random_uuid();`);
      } catch (err) {
        // Table might not exist or already set
      }
    }

    // 3. Upsert Prototype Institutions
    console.log('[1/7] Seeding Institutions...');
    const instSITRC = await client.query(`
      INSERT INTO institutions (id, external_tenant_id, name, code, university_name, timezone, status, settings, created_at, updated_at)
      VALUES (
        'e46a93b9-44fa-4169-826a-d73021e4a5f6',
        '00000000-0000-0000-0000-000000000001',
        'Sandip Institute of Technology & Research Centre (SITRC)',
        '4821',
        'Savitribai Phule Pune University (SPPU)',
        'Asia/Kolkata',
        'ACTIVE',
        '{"autonomous": false, "tier": 1, "state": "Maharashtra", "city": "Nashik", "aicte_approved": true}'::jsonb,
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        external_tenant_id = EXCLUDED.external_tenant_id,
        name = EXCLUDED.name,
        code = EXCLUDED.code,
        status = EXCLUDED.status,
        updated_at = NOW()
      RETURNING id;
    `);
    const sitrcInstId = instSITRC.rows[0].id;

    // Seed other colleges into institutions table
    const otherColleges = [
      { id: '11111111-1111-1111-1111-111111111111', tenant_id: '00000000-0000-0000-0000-000000000002', name: 'ABC College of Engineering', code: '7314' },
      { id: '22222222-2222-2222-2222-222222222222', tenant_id: '00000000-0000-0000-0000-000000000003', name: 'XYZ Institute of Technology', code: '2608' },
      { id: '33333333-3333-3333-3333-333333333333', tenant_id: '00000000-0000-0000-0000-000000000004', name: 'DEF College of Engineering', code: '9143' },
      { id: '44444444-4444-4444-4444-444444444444', tenant_id: '00000000-0000-0000-0000-000000000005', name: 'PQR Vidyapeeth', code: '5530' },
    ];
    for (const c of otherColleges) {
      await client.query(`
        INSERT INTO institutions (id, external_tenant_id, name, code, university_name, timezone, status, settings, created_at, updated_at)
        VALUES ($1, $2, $3, $4, 'State University', 'Asia/Kolkata', 'ACTIVE', '{}'::jsonb, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();
      `, [c.id, c.tenant_id, c.name, c.code]);
    }

    // 4. Seed Departments for SITRC
    console.log('[2/7] Seeding Departments...');
    const depts = [
      { id: 'a1000000-0000-0000-0000-000000000001', name: 'Computer Science and Engineering', code: 'CSE' },
      { id: 'a1000000-0000-0000-0000-000000000002', name: 'Information Technology', code: 'IT' },
      { id: 'a1000000-0000-0000-0000-000000000003', name: 'Electronics and Telecommunication', code: 'EXTC' },
      { id: 'a1000000-0000-0000-0000-000000000004', name: 'Mechanical Engineering', code: 'MECH' },
    ];
    for (const d of depts) {
      await client.query(`
        INSERT INTO departments (id, institution_id, name, code, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, 'ACTIVE', NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();
      `, [d.id, sitrcInstId, d.name, d.code]);
    }

    // 5. Seed Programs
    console.log('[3/7] Seeding Programs...');
    const progs = [
      {
        id: 'b1000000-0000-0000-0000-000000000001',
        dept_id: 'a1000000-0000-0000-0000-000000000001',
        name: 'Bachelor of Technology in Computer Science & Engineering',
        code: 'BTECH_CSE',
        degree_type: 'B_TECH',
        duration_years: 4
      },
      {
        id: 'b1000000-0000-0000-0000-000000000002',
        dept_id: 'a1000000-0000-0000-0000-000000000002',
        name: 'Bachelor of Technology in Information Technology',
        code: 'BTECH_IT',
        degree_type: 'B_TECH',
        duration_years: 4
      }
    ];
    for (const p of progs) {
      await client.query(`
        INSERT INTO programs (id, department_id, name, code, degree_type, duration_years, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, 'ACTIVE', NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();
      `, [p.id, p.dept_id, p.name, p.code, p.degree_type, p.duration_years]);
    }

    // 6. Seed Cohorts
    console.log('[4/7] Seeding Cohorts...');
    const cohorts = [
      {
        id: 'c1000000-0000-0000-0000-000000000001',
        program_id: 'b1000000-0000-0000-0000-000000000001',
        admission_year: 2022,
        graduation_year: 2026,
        batch_name: 'B.Tech CSE - Batch of 2026'
      },
      {
        id: 'c1000000-0000-0000-0000-000000000002',
        program_id: 'b1000000-0000-0000-0000-000000000001',
        admission_year: 2021,
        graduation_year: 2025,
        batch_name: 'B.Tech CSE - Batch of 2025'
      }
    ];
    for (const co of cohorts) {
      await client.query(`
        INSERT INTO cohorts (id, program_id, admission_year, graduation_year, batch_name, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, 'ACTIVE', NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET batch_name = EXCLUDED.batch_name, updated_at = NOW();
      `, [co.id, co.program_id, co.admission_year, co.graduation_year, co.batch_name]);
    }

    // 7. Seed Core Users (TPO & Students)
    console.log('[5/7] Seeding Users & Students...');
    const users = [
      {
        id: 'fa100000-0000-0000-0000-000000000001',
        email: 'tpo@sitrc.ac.in',
        first_name: 'Dr. Rajesh',
        last_name: 'Kulkarni',
        phone: '+919822012345',
        role: 'TPO_ADMIN'
      },
      {
        id: 'fa100000-0000-0000-0000-000000000002',
        email: 'aarav.sharma@sitrc.ac.in',
        first_name: 'Aarav',
        last_name: 'Sharma',
        phone: '+919876501234',
        role: 'STUDENT',
        roll: '2022CS014',
        prn: '72210842B'
      },
      {
        id: 'fa100000-0000-0000-0000-000000000003',
        email: 'sneha.patil@sitrc.ac.in',
        first_name: 'Sneha',
        last_name: 'Patil',
        phone: '+919876505678',
        role: 'STUDENT',
        roll: '2022CS089',
        prn: '72210889C'
      },
      {
        id: 'fa100000-0000-0000-0000-000000000004',
        email: 'rohan.deshmukh@sitrc.ac.in',
        first_name: 'Rohan',
        last_name: 'Deshmukh',
        phone: '+919876509012',
        role: 'STUDENT',
        roll: '2022CS102',
        prn: '72210902D'
      }
    ];

    for (const u of users) {
      await client.query(`
        INSERT INTO users (id, email, phone, first_name, last_name, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, 'ACTIVE', NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, updated_at = NOW();
      `, [u.id, u.email, u.phone, u.first_name, u.last_name]);

      if (u.role === 'STUDENT') {
        const studentId = `fa2${u.id.substring(3)}`;
        await client.query(`
          INSERT INTO student_profiles (id, user_id, department_id, program_id, cohort_id, roll_number, prn_number, placement_status, profile_completion_percent, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, 'SEEKING', 85, NOW(), NOW())
          ON CONFLICT (id) DO UPDATE SET roll_number = EXCLUDED.roll_number, updated_at = NOW();
        `, [
          studentId,
          u.id,
          'a1000000-0000-0000-0000-000000000001', // CSE dept
          'b1000000-0000-0000-0000-000000000001', // CSE program
          'c1000000-0000-0000-0000-000000000001', // 2026 cohort
          u.roll,
          u.prn
        ]);
      }
    }

    // 8. Seed Companies & Placement Season
    console.log('[6/7] Seeding Placement Season & Companies...');
    const season = await client.query(`
      INSERT INTO placement_seasons (id, name, start_date, end_date, status, metadata, created_at, updated_at)
      VALUES (
        'fa300000-0000-0000-0000-000000000001',
        'Campus Placement Season 2025-2026',
        '2025-07-01',
        '2026-06-30',
        'ACTIVE',
        '{"academic_year": "2025-2026"}'::jsonb,
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW()
      RETURNING id;
    `);

    const companies = [
      {
        id: 'fa400000-0000-0000-0000-000000000001',
        name: 'Google India Pvt Ltd',
        website: 'https://google.com',
        industry: 'Technology',
        hq: 'Bengaluru, Karnataka',
        tier: 'TIER_1_SUPER_DREAM'
      },
      {
        id: 'fa400000-0000-0000-0000-000000000002',
        name: 'Microsoft India (R&D)',
        website: 'https://microsoft.com',
        industry: 'Technology',
        hq: 'Hyderabad, Telangana',
        tier: 'TIER_1_SUPER_DREAM'
      },
      {
        id: 'fa400000-0000-0000-0000-000000000003',
        name: 'Barclays Global Service Centre',
        website: 'https://barclays.com',
        industry: 'FinTech',
        hq: 'Pune, Maharashtra',
        tier: 'TIER_2_DREAM'
      },
      {
        id: 'fa400000-0000-0000-0000-000000000004',
        name: 'Tata Consultancy Services',
        website: 'https://tcs.com',
        industry: 'IT Services',
        hq: 'Mumbai, Maharashtra',
        tier: 'TIER_3_MASS'
      }
    ];

    for (const c of companies) {
      await client.query(`
        INSERT INTO companies (id, name, website_url, industry, headquarters, status, metadata, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, 'ACTIVE', $6, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();
      `, [c.id, c.name, c.website, c.industry, c.hq, JSON.stringify({ tier: c.tier })]);
    }

    // 9. Seed Job Opportunities
    console.log('[7/7] Seeding Job Opportunities...');
    const jobs = [
      {
        id: 'fa500000-0000-0000-0000-000000000001',
        company_id: 'fa400000-0000-0000-0000-000000000001',
        season_id: 'fa300000-0000-0000-0000-000000000001',
        title: 'Software Development Engineer (SDE-1)',
        source: 'CAMPUS',
        employment_type: 'FULL_TIME',
        work_mode: 'HYBRID',
        location: 'Bengaluru / Hyderabad',
        comp_min: 1800000,
        comp_max: 2400000,
        status: 'PUBLISHED'
      },
      {
        id: 'fa500000-0000-0000-0000-000000000002',
        company_id: 'fa400000-0000-0000-0000-000000000003',
        season_id: 'fa300000-0000-0000-0000-000000000001',
        title: 'Graduate Technology Analyst',
        source: 'CAMPUS',
        employment_type: 'FULL_TIME',
        work_mode: 'HYBRID',
        location: 'Pune / Mumbai',
        comp_min: 1100000,
        comp_max: 1450000,
        status: 'PUBLISHED'
      }
    ];

    for (const j of jobs) {
      await client.query(`
        INSERT INTO job_opportunities (id, company_id, placement_season_id, title, source, employment_type, work_mode, location, compensation_min, compensation_max, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, updated_at = NOW();
      `, [j.id, j.company_id, j.season_id, j.title, j.source, j.employment_type, j.work_mode, j.location, j.comp_min, j.comp_max, j.status]);
    }

    // 10. Seed Resumes, Job Applications & Offers for Student Aarav Sharma
    console.log('[8/10] Seeding Resumes, Applications & Offers...');
    const resumeId = 'fa600000-0000-0000-0000-000000000001';
    const resumeVerId = 'fa700000-0000-0000-0000-000000000001';
    const studentProfileId = 'fa200000-0000-0000-0000-000000000002';
    const studentUserId = 'fa100000-0000-0000-0000-000000000002';

    await client.query(`
      INSERT INTO resumes (id, student_id, name, is_primary, status, created_at, updated_at)
      VALUES ($1, $2, 'Aarav_Sharma_SDE_Resume_2026.pdf', true, 'ACTIVE', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `, [resumeId, studentProfileId]);

    await client.query(`
      INSERT INTO resume_versions (id, resume_id, file_object_key, parsed_text, parsed_data, content_hash, version_number, created_at)
      VALUES ($1, $2, 'resumes/aarav/v1.pdf', 'Aarav Sharma - Software Engineer', '{"skills": ["React Native", "Angular", "Node.js", "PostgreSQL", "Docker"]}'::jsonb, 'hash-v1-aarav-2026', 1, NOW())
      ON CONFLICT (id) DO NOTHING;
    `, [resumeVerId, resumeId]);

    const appId = 'fa900000-0000-0000-0000-000000000001';
    await client.query(`
      INSERT INTO job_applications (id, student_id, job_opportunity_id, resume_version_id, status, applied_at, created_at, updated_at)
      VALUES ($1, $2, 'fa500000-0000-0000-0000-000000000002', $3, 'OFFERED', NOW(), NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `, [appId, studentProfileId, resumeVerId]);

    const offerId = 'fa800000-0000-0000-0000-000000000001';
    await client.query(`
      INSERT INTO job_offers (id, application_id, student_id, job_opportunity_id, company_id, status, total_ctc, currency, decision_deadline, offered_at, created_at, updated_at)
      VALUES ($1, $2, $3, 'fa500000-0000-0000-0000-000000000002', 'fa400000-0000-0000-0000-000000000003', 'OFFERED', 1450000.00, 'INR', '2026-12-31 23:59:59+00', NOW(), NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `, [offerId, appId, studentProfileId]);

    // 11. Seed Academic Records, Events & Copilot Chat Conversation
    console.log('[9/10] Seeding Academic Records & Events...');
    await client.query(`
      INSERT INTO student_academic_records (id, student_id, record_type, semester, cgpa, sgpa, percentage, active_backlogs, total_backlogs, source_type, verified, effective_from, created_at)
      VALUES ('faa00000-0000-0000-0000-000000000001', $1, 'SEMESTER', 'Semester 6', 9.15, 9.30, 88.5, 0, 0, 'COLLEGE_ERP', true, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `, [studentProfileId]);

    await client.query(`
      INSERT INTO academic_events (id, department_id, event_type, title, starts_at, ends_at, is_mandatory, created_at, updated_at)
      VALUES ('fab00000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'EXAM', 'Semester 7 Midterm Examinations', '2026-11-20 09:00:00+00', '2026-11-20 13:00:00+00', true, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `, []);

    console.log('[10/10] Seeding Chat Conversation...');
    await client.query(`
      INSERT INTO conversations (id, conversation_type, title, created_by, status, created_at, updated_at)
      VALUES ('fac00000-0000-0000-0000-000000000001', 'DIRECT', 'Placement Copilot: Aarav Sharma', $1, 'ACTIVE', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `, [studentUserId]);

    console.log(`✅ Successfully seeded database: ${targetDb}`);
  } catch (err) {
    console.error(`❌ Error seeding database ${targetDb}:`, err.message);
  } finally {
    await client.end();
  }
}

async function main() {
  // Seed into main development database
  await seedData('careeros_dev');

  // Seed into isolated database for SITRC
  await seedData('careeros_sitrc');
  
  // Seed into isolated database for ABC College
  await seedData('careeros_abc');

  console.log('\n🎉 ALL DATABASES (careeros_dev, careeros_sitrc, careeros_abc) SUCCESSFULLY SEEDED AND RUNNING LOCALLY!');
}

main();