// tests/e2e/web.spec.ts
import { test, expect } from '@playwright/test';

test.describe('CareerOS Web Application E2E Tests (Live DB & Full Role Separation - No Mocks)', () => {

  test('1. Root Entry Point: Default Route Redirects to College Login Page', async ({ page }) => {
    // Navigating to base URL must redirect to /#/login and present college-based login
    await page.goto('/');
    await page.waitForURL(/#\/login/, { timeout: 10000 });

    // Verify College Placement Portal branding
    await expect(page.locator('.brand-title b')).toHaveText('CareerOS');
    await expect(page.locator('.brand-title span')).toHaveText('COLLEGE PLACEMENT PORTAL');
    await expect(page.locator('h2')).toContainText('Sign In to Your Institution');

    // Verify quick college chips are rendered
    const chips = page.locator('.quick-chips .college-chip');
    await expect(chips.first()).toBeVisible();
    await expect(chips.filter({ hasText: '4821' })).toBeVisible();
    await expect(chips.filter({ hasText: '7314' })).toBeVisible();

    // Verify discrete super-admin login link is present
    const adminLink = page.locator('a[routerLink="/admin/login"]');
    await expect(adminLink.first()).toBeVisible();

    // Authentication shortcuts must never be exposed on either login page.
    await expect(page.getByText(/1-Click Sign In/i)).toHaveCount(0);
  });

  test('2. College Tenant Resolution: Live Database Isolation Status Cards', async ({ page }) => {
    await page.goto('/#/login');

    // Click 7314 ABC College quick chip
    const abcChip = page.locator('.college-chip', { hasText: '7314' });
    await abcChip.click();

    // Verify database isolation card shows ABC College & careeros_abc
    const isolationCard = page.locator('.isolation-card');
    await expect(isolationCard).toBeVisible({ timeout: 10000 });
    await expect(isolationCard).toContainText('TENANT VERIFIED · DATABASE ISOLATED');
    await expect(isolationCard).toContainText('ABC College');
    await expect(isolationCard).toContainText('careeros_abc');

    // Switch to 4821 SITRC quick chip
    const sitrcChip = page.locator('.college-chip', { hasText: '4821' });
    await sitrcChip.click();

    // Verify database isolation card updates to SITRC & careeros_sitrc
    await expect(isolationCard).toContainText('Sandip Institute');
    await expect(isolationCard).toContainText('careeros_sitrc');
  });

  test('3. Route Guard Security: Unauthenticated Access to /admin Redirects to /admin/login', async ({ page }) => {
    // Clear any existing session in localStorage
    await page.goto('/#/login');
    await page.evaluate(() => localStorage.clear());

    // Attempt direct navigation to protected Super Admin console via hash route
    await page.goto('/#/admin');

    // Verify route guard intercepts and redirects to /#/admin/login
    await page.waitForURL(/#\/admin\/login/, { timeout: 10000 });
    await expect(page.locator('.brand-text span')).toHaveText('PLATFORM SUPER-ADMIN CONSOLE');
    await expect(page.locator('h2')).toContainText('Super-Administrator Authentication');
  });

  test('4. Super Admin Login & Live Console Navigation', async ({ page }) => {
    await page.goto('/#/admin/login');

    await expect(page.getByText(/1-Click Fast Dev Authentication/i)).toHaveCount(0);
    await page.getByLabel('Platform Administrator Email').fill('super.admin@careeros.com');
    await page.getByLabel('Password').fill('Admin@CareerOS2026!');
    await page.getByRole('button', { name: /Authenticate & Launch Console/i }).click();

    // Console is unlocked and navigates to /#/admin
    await page.waitForURL(/#\/admin/, { timeout: 10000 });
    const consoleContainer = page.locator('.platform-console');
    await expect(consoleContainer).toBeVisible({ timeout: 15000 });

    // Verify Brand
    await expect(page.locator('.brand-copy b')).toHaveText('CareerOS');
    await expect(page.locator('.brand-copy span')).toHaveText('PLATFORM CONTROL');

    // Verify live aggregated metrics from PostgreSQL
    const metricCards = page.locator('.metrics .metric');
    await expect(metricCards.first()).toBeVisible({ timeout: 10000 });
    const instMetric = page.locator('.metric').filter({ hasText: 'Institutions' }).first();
    await expect(instMetric.locator('.metric-value')).not.toBeEmpty();

    // Navigate to Institutions Tab
    await page.locator('.nav-item', { hasText: 'Institutions' }).click();
    await expect(page.locator('.crumb b')).toHaveText('Institutions');
    await expect(page.locator('table')).toBeVisible();

    // Test Institutions Search Filter
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill('Sandip');
    await expect(page.locator('tbody tr', { hasText: 'Sandip' }).first()).toBeVisible();

    // Navigate to Subscriptions Tab
    await page.locator('.nav-item', { hasText: 'Subscriptions' }).click();
    await expect(page.locator('.crumb b')).toHaveText('Subscriptions');

    // Navigate to Infrastructure Tab (Tenant Isolated Databases)
    await page.locator('.nav-item', { hasText: 'Infrastructure' }).click();
    await expect(page.locator('.crumb b')).toHaveText('Infrastructure');
    await expect(page.locator('tbody tr', { hasText: 'careeros_sitrc' }).first()).toBeVisible();

    // Test Admin Sign Out
    const signOutBtn = page.locator('.sidebar-footer button', { hasText: 'Sign Out / Exit' });
    await signOutBtn.click();

    // Redirected back to college login
    await page.waitForURL(/#\/login/, { timeout: 10000 });
    await expect(page.locator('h2')).toContainText('Sign In to Your Institution');
  });

  test('5. Student Portal Workflow: Login, Command Center, Priority SLA & Jobs', async ({ page }) => {
    await page.goto('/#/login');

    await page.locator('.college-chip', { hasText: '4821' }).click();
    await expect(page.locator('.isolation-card')).toBeVisible({ timeout: 10000 });
    await page.getByLabel('Registered student email').fill('aarav.sharma@sitrc.ac.in');
    await page.getByLabel('Password / Student PIN').fill('Student@Pass123!');
    await page.getByRole('button', { name: /Sign In to Placement Command Center/i }).click();

    // Redirects to /#/portal
    await page.waitForURL(/#\/portal/, { timeout: 10000 });

    // Verify Student Header with live student name & DB isolation status
    await expect(page.locator('header span', { hasText: /DB: careeros_sitrc/i })).toBeVisible();
    await expect(page.locator('h1')).toContainText('Good morning, Aarav');

    // Verify Priority SLA Action Queue
    const slaSection = page.locator('.rounded-xl', { hasText: 'Priority SLA Action Queue' });
    await expect(slaSection).toBeVisible();
    await expect(slaSection.locator('span', { hasText: /No-Show Strikes/i })).toBeVisible();

    // Verify Career Readiness Score Gauge
    const readinessCard = page.locator('.rounded-xl', { hasText: 'Career Readiness' });
    await expect(readinessCard).toBeVisible();
    await expect(readinessCard.locator('b', { hasText: /%/ }).first()).toBeVisible();

    // Navigate to Jobs Page via Sidebar
    const jobsNavLink = page.locator('nav[aria-label="Main Navigation"] button', { hasText: 'Jobs' });
    await jobsNavLink.click();

    // Verify Jobs Page loaded
    await page.waitForURL(/#\/jobs/, { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Campus Placement Opportunities');

    // Verify real placement opportunities from PostgreSQL
    const jobCards = page.locator('.grid > div.rounded-xl');
    await expect(jobCards.first()).toBeVisible({ timeout: 10000 });

    // Test Tier Filter Chips
    const dreamChip = page.getByRole('button', { name: 'Dream', exact: true });
    if (await dreamChip.isVisible()) {
      await dreamChip.click();
      await page.waitForTimeout(300);
    }
    const allChip = page.getByRole('button', { name: /All Drives/i });
    await allChip.click();

    // Test 1-Click Apply on an available job
    const applyBtn = page.locator('button', { hasText: 'Apply with Resume' }).first();
    if (await applyBtn.isVisible()) {
      await applyBtn.click();
      // Should show applied badge or success banner
      await expect(
        page.locator('.bg-emerald-50', { hasText: /Applied|Application submitted/i }).first()
      ).toBeVisible({ timeout: 10000 });
    }

    // Student Sign Out
    const studentSignOutBtn = page.locator('header button', { hasText: 'Sign Out' });
    await studentSignOutBtn.click();

    // Redirected back to college login
    await page.waitForURL(/#\/login/, { timeout: 10000 });
    await expect(page.locator('h2')).toContainText('Sign In to Your Institution');
  });

});
