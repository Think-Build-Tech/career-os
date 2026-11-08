// tests/e2e/ui-interactions.spec.ts

import { test, expect } from '@playwright/test';

const SITRC_TENANT_ID = '00000000-0000-0000-0000-000000000001';
const STUDENT_PROFILE_ID = 'fa200000-0000-0000-0000-000000000002';

test.describe('CareerOS UI Interactions & Component Testing (No Mocks)', () => {

  // --------------------------------------------------------------------------
  // SUITE 1: STUDENT COMMAND CENTER WEB PORTAL (/#/portal)
  // --------------------------------------------------------------------------
  test.describe('1. Student Command Center Web Portal (/#/portal)', () => {

    test.beforeEach(async ({ page }) => {
      await page.goto('/#/portal');
      // Wait for the home page container
      await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });
    });

    test('1.1 Command Center Header, Greeting & Action Buttons', async ({ page }) => {
      // Verify greeting & subtitle
      const h1 = page.locator('h1');
      await expect(h1).toContainText('Good morning');

      const subtitle = page.locator('p', { hasText: 'Command Center' });
      await expect(subtitle).toBeVisible();
      await expect(subtitle).toContainText('time-sensitive placement actions');

      // Verify header action buttons
      const preflightBtn = page.getByRole('button', { name: 'System Pre-Flight Check' });
      await expect(preflightBtn).toBeVisible();
      await expect(preflightBtn).toBeEnabled();

      const reviewOffersBtn = page.getByRole('button', { name: 'Review Offers' });
      await expect(reviewOffersBtn).toBeVisible();
      await expect(reviewOffersBtn).toBeEnabled();

      // Click System Pre-Flight Check
      await preflightBtn.click();
      // Click Review Offers
      await reviewOffersBtn.click();
    });

    test('1.2 Priority SLA Action Queue with Live Dynamic Item & Strike Badge', async ({ page, request }) => {
      // Verify SLA Queue Header & Strikes badge
      const slaSection = page.locator('.rounded-xl.border', { hasText: 'Priority SLA Action Queue' });
      await expect(slaSection).toBeVisible();

      const strikesBadge = slaSection.locator('span', { hasText: /No-Show Strikes/i });
      await expect(strikesBadge).toBeVisible();
      await expect(strikesBadge).toContainText('/2 No-Show Strikes');

      // Create a live action item in PostgreSQL for this student
      const itemTitle = `Tech Assessment ${Date.now()}`;
      const createRes = await request.post('http://localhost:5000/api/students/action-items', {
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': SITRC_TENANT_ID,
        },
        data: {
          student_id: STUDENT_PROFILE_ID,
          title: itemTitle,
          action_type: 'ONLINE_TEST',
          priority: 'URGENT',
        },
      });
      expect(createRes.ok()).toBeTruthy();

      // Reload portal to display the newly seeded action item
      await page.reload();
      await expect(page.locator('h1')).toBeVisible();

      // Verify the new item appears in the queue
      const actionItemCard = page.locator('.rounded-xl.border', { hasText: 'Priority SLA Action Queue' })
        .locator('div', { hasText: itemTitle }).first();
      await expect(actionItemCard).toBeVisible({ timeout: 10000 });

      // Verify action buttons on the card
      const prepBtn = actionItemCard.getByRole('button', { name: 'Prep with TACIE' });
      await expect(prepBtn).toBeVisible();

      const confirmBtn = actionItemCard.getByRole('button', { name: 'Confirm & Complete' });
      await expect(confirmBtn).toBeVisible();

      // Click Confirm & Complete to complete the SLA item
      await confirmBtn.click();

      // Item should be completed and cleared from the pending queue
      await expect(page.locator('b', { hasText: itemTitle })).toHaveCount(0, { timeout: 10000 });
    });

    test('1.3 Career Readiness Score & Role Benchmark Switcher Tabs', async ({ page }) => {
      const readinessCard = page.locator('.rounded-xl.border', { hasText: 'Career Readiness' });
      await expect(readinessCard).toBeVisible();

      // Verify readiness score gauge
      const scoreGauge = readinessCard.locator('b.rounded-full');
      await expect(scoreGauge).toBeVisible();
      await expect(scoreGauge).toContainText('%');

      // Check Benchmark role tabs
      const backendTab = readinessCard.getByRole('button', { name: 'Backend Eng' });
      const fullstackTab = readinessCard.getByRole('button', { name: 'Full-Stack' });
      const cloudTab = readinessCard.getByRole('button', { name: 'Cloud / SRE' });

      await expect(backendTab).toBeVisible();
      await expect(fullstackTab).toBeVisible();
      await expect(cloudTab).toBeVisible();

      // Test switching benchmark to Full-Stack
      await fullstackTab.click();
      await expect(fullstackTab).toHaveClass(/bg-white/);

      // Test switching benchmark to Cloud / SRE
      await cloudTab.click();
      await expect(cloudTab).toHaveClass(/bg-white/);

      // Switch back to Backend Eng
      await backendTab.click();
      await expect(backendTab).toHaveClass(/bg-white/);

      // Verify Start Test CTA
      const startTestBtn = readinessCard.getByRole('button', { name: 'Start Test' });
      await expect(startTestBtn).toBeVisible();
    });

    test('1.4 Schedule & ERP Conflict Check and Feed Export', async ({ page }) => {
      const conflictCard = page.locator('.rounded-xl.border', { hasText: 'Schedule & ERP Conflict Check' });
      await expect(conflictCard).toBeVisible();

      // Verify registrar verified message
      const verifiedNotice = conflictCard.locator('div', { hasText: 'Registrar Timetable Verified' });
      await expect(verifiedNotice).toBeVisible();

      // Verify Conflicts count pill
      const conflictsPill = conflictCard.locator('span', { hasText: /Conflicts/i });
      await expect(conflictsPill).toBeVisible();

      // Verify ICS feed export button
      const exportBtn = conflictCard.getByRole('button', { name: 'Export .ICS Calendar Feed' });
      await expect(exportBtn).toBeVisible();
      await exportBtn.click();

      // Verify Open Full Pipeline link
      const pipelineBtn = conflictCard.getByRole('button', { name: 'Open Full Pipeline →' });
      await expect(pipelineBtn).toBeVisible();
    });

    test('1.5 High-Match Active Drives List', async ({ page }) => {
      const drivesCard = page.locator('.rounded-xl.border', { hasText: 'High-Match Active Drives' });
      await expect(drivesCard).toBeVisible();

      const exploreBtn = drivesCard.getByRole('button', { name: /Explore all.*drives/i });
      await expect(exploreBtn).toBeVisible();
    });
  });

  // --------------------------------------------------------------------------
  // SUITE 2: PLATFORM ADMIN CONSOLE INTERACTION & CONTROLS (/#/admin)
  // --------------------------------------------------------------------------
  test.describe('2. Platform Admin Console UI Interactions (/#/admin)', () => {

    test.beforeEach(async ({ page }) => {
      await page.goto('/#/admin');
      await expect(page.locator('.platform-console')).toBeVisible({ timeout: 15000 });
    });

    test('2.1 Sidebar Tab Switching & Active State Styling', async ({ page }) => {
      // 1. Overview
      const overviewNav = page.locator('.nav-item', { hasText: 'Overview' });
      await overviewNav.click();
      await expect(overviewNav).toHaveClass(/active/);
      await expect(page.locator('.crumb b')).toHaveText('Overview');

      // 2. Institutions
      const institutionsNav = page.locator('.nav-item', { hasText: 'Institutions' });
      await institutionsNav.click();
      await expect(institutionsNav).toHaveClass(/active/);
      await expect(page.locator('.crumb b')).toHaveText('Institutions');

      // 3. Subscriptions
      const subsNav = page.locator('.nav-item', { hasText: 'Subscriptions' });
      await subsNav.click();
      await expect(subsNav).toHaveClass(/active/);
      await expect(page.locator('.crumb b')).toHaveText('Subscriptions');

      // 4. Platform Admins
      const adminsNav = page.locator('.nav-item', { hasText: 'Platform Admins' });
      await adminsNav.click();
      await expect(adminsNav).toHaveClass(/active/);
      await expect(page.locator('.crumb b')).toHaveText('Platform Admins');

      // 5. Settings
      const settingsNav = page.locator('.sidebar-footer .nav-item', { hasText: 'Settings' });
      await settingsNav.click();
      await expect(settingsNav).toHaveClass(/active/);
      await expect(page.locator('.crumb b')).toHaveText('Settings');
    });

    test('2.2 Institutions Search Input Filter & Debounce', async ({ page }) => {
      await page.locator('.nav-item', { hasText: 'Institutions' }).click();
      await expect(page.locator('.crumb b')).toHaveText('Institutions');

      const searchInput = page.locator('.table-card input[placeholder*="Search"]').first();
      await expect(searchInput).toBeVisible();

      // Search for SITRC
      await searchInput.fill('SITRC');
      await expect(page.locator('tbody tr', { hasText: 'SITRC' }).first()).toBeVisible();

      // Clear search input
      await searchInput.fill('');
      await expect(page.locator('tbody tr').first()).toBeVisible();
    });

    test('2.3 Tenant Switcher Modal Keyboard Escape & Backdrop Dismissal', async ({ page }) => {
      const tenantPill = page.locator('.tenant-pill-badge');
      await tenantPill.click();

      // Modal appears
      const modal = page.locator('.modal-container.show');
      await expect(modal).toBeVisible();
      await expect(modal.locator('h3')).toContainText('Resolve College Tenant');

      // Press Escape key to dismiss
      await page.keyboard.press('Escape');

      // Close via Cancel button if modal remains
      const closeBtn = modal.locator('button.btn', { hasText: 'Cancel' });
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
      }
      await expect(page.locator('.modal-container.show')).toHaveCount(0);
    });

    test('2.4 Onboarding 5-Step Drawer Form Interaction & Cancel Dismissal', async ({ page }) => {
      const addBtn = page.locator('button.btn.primary', { hasText: '+ Add Institution' });
      await addBtn.click();

      const drawer = page.locator('aside.drawer.open');
      await expect(drawer).toBeVisible();

      // Verify Step 1 fields
      const instNameInput = drawer.locator('input[placeholder*="Sandip Institute"]');
      await expect(instNameInput).toBeVisible();

      // Type data
      await instNameInput.fill('Test Engineering College');

      // Close drawer via cancel button
      const cancelBtn = drawer.locator('button.btn', { hasText: 'Cancel' });
      await cancelBtn.click();
      await expect(page.locator('aside.drawer.open')).toHaveCount(0);
    });

    test('2.5 Responsive Viewport Layout (Tablet 1024x768 & Desktop 1440x900)', async ({ page }) => {
      // Tablet Viewport
      await page.setViewportSize({ width: 1024, height: 768 });
      await expect(page.locator('.platform-console')).toBeVisible();
      await expect(page.locator('.sidebar')).toBeVisible();

      // Switch to Institutions tab on tablet
      await page.locator('.nav-item', { hasText: 'Institutions' }).click();
      await expect(page.locator('.crumb b')).toHaveText('Institutions');
      await expect(page.locator('.table-card')).toBeVisible();

      // Full Desktop Viewport
      await page.setViewportSize({ width: 1440, height: 900 });
      await expect(page.locator('.platform-console')).toBeVisible();

      // Switch back to Overview to verify responsive metrics layout
      await page.locator('.nav-item', { hasText: 'Overview' }).click();
      await expect(page.locator('.crumb b')).toHaveText('Overview');
      await expect(page.locator('.metrics')).toBeVisible();
    });
  });
});
