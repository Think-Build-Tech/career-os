// tests/e2e/api.spec.ts
import { test, expect } from '@playwright/test';

const SITRC_TENANT_ID = '00000000-0000-0000-0000-000000000001';
const STUDENT_USER_ID = 'fa100000-0000-0000-0000-000000000002';
const STUDENT_PROFILE_ID = 'fa200000-0000-0000-0000-000000000002';
const GOOGLE_OPP_ID = 'fa500000-0000-0000-0000-000000000001';
const BARCLAYS_OPP_ID = 'fa500000-0000-0000-0000-000000000002';

const standardHeaders = {
  'Content-Type': 'application/json',
  'x-tenant-id': SITRC_TENANT_ID,
};

test.describe('CareerOS Backend API & Live Database E2E Tests (No Mocks)', () => {

  test('1. System Health Check', async ({ request }) => {
    const res = await request.get('/api/health');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.status).toBe('healthy');
    expect(data.data.service).toBe('CareerOS Node.js API');
  });

  test('2. College Tenant Resolution & Physical Database Isolation (4821 SITRC)', async ({ request }) => {
    const res = await request.get('/api/control/resolve/4821');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.tenant.college_code).toBe('4821');
    expect(data.tenant.name).toContain('Sandip Institute');
    expect(data.tenant.database.database_name).toBe('careeros_sitrc');
    expect(data.isolation.is_isolated_database).toBe(true);
  });

  test('3. College Tenant Resolution (7314 ABC College)', async ({ request }) => {
    const res = await request.get('/api/control/resolve/7314');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.tenant.college_code).toBe('7314');
    expect(data.tenant.database.database_name).toBe('careeros_abc');
    expect(data.isolation.is_isolated_database).toBe(true);
  });

  test('4. College Tenant Resolution (8899 KKWIEER)', async ({ request }) => {
    const res = await request.get('/api/control/resolve/8899');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.tenant.college_code).toBe('8899');
  });

  test('5. Control Plane: List All Registered Tenants', async ({ request }) => {
    const res = await request.get('/api/control/tenants?page=1&limit=100');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.tenants).toBeDefined();
    const rows = data.tenants.rows || data.tenants;
    expect(rows.length).toBeGreaterThanOrEqual(1);

    const hasSitrc = rows.some((t: any) => t.college_code === '4821');
    expect(hasSitrc).toBe(true);
  });

  test('6. Control Plane: Create and Onboard New Tenant in PostgreSQL', async ({ request }) => {
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    const newTenantPayload = {
      college_code: randomCode,
      name: `Automated Test Institute ${randomCode}`,
      slug: `auto-test-${randomCode}`,
      institution_type: 'ENGINEERING_COLLEGE',
      status: 'ACTIVE',
    };

    const res = await request.post('/api/control/tenants', {
      headers: standardHeaders,
      data: newTenantPayload,
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.tenant.college_code).toBe(randomCode);
    expect(data.tenant.id).toBeDefined();

    // Verify tenant can now be resolved from database
    const resolveRes = await request.get(`/api/control/resolve/${randomCode}`);
    expect(resolveRes.ok()).toBeTruthy();
    const resolveData = await resolveRes.json();
    expect(resolveData.tenant.college_code).toBe(randomCode);
  });

  test('7. Control Plane: List Subscriptions', async ({ request }) => {
    const res = await request.get('/api/control/subscriptions?page=1&limit=20');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.subscriptions).toBeDefined();
  });

  test('8. Control Plane: List Platform Admins', async ({ request }) => {
    const res = await request.get('/api/control/admins');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.admins).toBeDefined();
  });

  test('9. Platform Super Admin: Aggregated Dashboard KPIs', async ({ request }) => {
    const res = await request.get('/api/admin/dashboard');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.dashboard.metrics).toBeDefined();
    expect(data.dashboard.metrics.totalInstitutions).toBeGreaterThan(0);
    expect(data.dashboard.institutions.length).toBeGreaterThan(0);
  });

  test('10. Platform Super Admin: Get and Update Settings', async ({ request }) => {
    const getRes = await request.get('/api/admin/settings');
    expect(getRes.ok()).toBeTruthy();
    const initialSettings = await getRes.json();
    expect(initialSettings.success).toBe(true);

    const updatedPayload = {
      defaultAiModule: true,
      adminMfa: true,
      maintenanceMode: false,
    };

    const putRes = await request.put('/api/admin/settings', {
      headers: standardHeaders,
      data: updatedPayload,
    });
    expect(putRes.ok()).toBeTruthy();
    const putData = await putRes.json();
    expect(putData.success).toBe(true);
    expect(putData.settings.defaultAiModule).toBe(true);
  });

  test('11. Students: Fetch Verified Student Profile by ID', async ({ request }) => {
    const res = await request.get(`/api/students/${STUDENT_PROFILE_ID}`, {
      headers: standardHeaders,
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    const student = data.student || data.data;
    expect(student).toBeDefined();
  });

  let createdActionItemId: string;

  test('12. Students: Create Priority Action Item in SLA Queue', async ({ request }) => {
    const res = await request.post('/api/students/action-items', {
      headers: standardHeaders,
      data: {
        student_id: STUDENT_PROFILE_ID,
        title: 'Review Barclays Pre-Placement Talk Details',
        action_type: 'PLACEMENT_ACTION',
        priority: 'HIGH',
      },
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.actionItem.id).toBeDefined();
    createdActionItemId = data.actionItem.id;
  });

  test('13. Students: Complete Action Item in SLA Queue', async ({ request }) => {
    expect(createdActionItemId).toBeDefined();
    const res = await request.patch(`/api/students/action-items/${createdActionItemId}/complete`, {
      headers: standardHeaders,
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.actionItem.status).toBe('COMPLETED');
  });

  test('14. Placements: Check Placement Compliance Status & Strikes', async ({ request }) => {
    const res = await request.get(`/api/placements/compliance/${STUDENT_PROFILE_ID}`, {
      headers: standardHeaders,
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    const compliance = data.compliance || data.data;
    expect(compliance.active_strikes).toBe(0);
    expect(compliance.compliance_status).toBe('GOOD_STANDING');
    expect(compliance.debarred_until).toBeNull();
  });

  test('15. Placements: Discover Active Job Opportunities', async ({ request }) => {
    const res = await request.get('/api/placements/opportunities?page=1&limit=20', {
      headers: standardHeaders,
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    const rows = data.opportunities?.rows || data.opportunities || data.data;
    expect(rows.length).toBeGreaterThan(0);
  });

  test('16. Placements: 1-Click Apply with Verified Resume Binding', async ({ request }) => {
    const res = await request.post('/api/placements/apply', {
      headers: standardHeaders,
      data: {
        opportunity_id: GOOGLE_OPP_ID,
        student_id: STUDENT_PROFILE_ID,
        resume_id: 'fa700000-0000-0000-0000-000000000001',
      },
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.application.id).toBeDefined();
    expect(data.application.status).toBe('APPLIED');
  });

  test('17. Placements: Accept Full-Time Job Offer with Signature Evidence', async ({ request }) => {
    const res = await request.post(`/api/placements/offers/fa800000-0000-0000-0000-000000000001/accept`, {
      headers: standardHeaders,
      data: {
        studentId: STUDENT_PROFILE_ID,
        signed_document_object_key: `tenants/${SITRC_TENANT_ID}/offers/barclays_signed.pdf`,
        signature_reference: 'DOCUSIGN_PLAYWRIGHT_TEST_VERIFIED',
      },
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.offer.status).toBe('ACCEPTED');
  });

  test('18. TACIE AI: Student Skill Gap Analysis', async ({ request }) => {
    const res = await request.post('/api/tacie/skill-gap', {
      headers: standardHeaders,
      data: {
        student_id: STUDENT_PROFILE_ID,
        target_role: 'Backend Cloud Engineer',
      },
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    const gap = data.skillGap || data.analysis || data.data;
    expect(gap).toBeDefined();
    expect(gap.student_id).toBe(STUDENT_PROFILE_ID);
  });

  test('19. TACIE AI: User AI Quota Balance', async ({ request }) => {
    const res = await request.get(`/api/tacie/quota/${STUDENT_USER_ID}`, {
      headers: standardHeaders,
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    const quota = data.quota || data.data;
    expect(quota.credit_limit).toBeGreaterThan(0);
    expect(quota.used_credits).toBeDefined();
  });

  test('20. Academic: List Academic Events & Exam Conflict Detection', async ({ request }) => {
    const res = await request.get('/api/academic/events', {
      headers: standardHeaders,
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    const events = data.events?.rows || (Array.isArray(data.events) ? data.events : data.data || []);
    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThan(0);
  });

  test('21. Chat: Placement Copilot Live Messaging', async ({ request }) => {
    const res = await request.post('/api/chat/messages', {
      headers: standardHeaders,
      data: {
        conversation_id: 'fac00000-0000-0000-0000-000000000001',
        sender_id: STUDENT_USER_ID,
        content: 'How should I prepare for Google SDE-1 Technical Round?',
      },
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message.content).toBe('How should I prepare for Google SDE-1 Technical Round?');
  });
});
