// tests/e2e/web.spec.ts
import { test, expect } from '@playwright/test';

test.describe('CareerOS Web Application E2E Tests (Angular Platform Admin Console - No Mocks)', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to base URL which redirects to /admin
    await page.goto('/');
    // Wait for the main console container
    await expect(page.locator('.platform-console')).toBeVisible({ timeout: 15000 });
  });

  test('1. Platform Console: Layout, Brand & Active Tenant Badge', async ({ page }) => {
    // Check Brand and Console Header
    await expect(page.locator('.brand-copy b')).toHaveText('CareerOS');
    await expect(page.locator('.brand-copy span')).toHaveText('PLATFORM CONSOLE');

    // Check Tenant Pill Badge (Default 4821 SITRC)
    const tenantBadge = page.locator('.tenant-pill-badge');
    await expect(tenantBadge).toBeVisible();
    await expect(page.locator('.tenant-pill-name')).toContainText('4821');
    await expect(page.locator('.tenant-pill-db')).toContainText('careeros_sitrc');
  });

  test('2. Overview Tab: Live Aggregated Metrics', async ({ page }) => {
    // Ensure Overview page is active
    await page.locator('.nav-item', { hasText: 'Overview' }).click();

    // Check eyebrow and hero header
    await expect(page.locator('.hero h1')).toContainText('Good morning. Here’s CareerOS at a glance.');

    // Check KPI metrics loaded from PostgreSQL
    const metricCards = page.locator('.metrics .metric');
    await expect(metricCards.first()).toBeVisible();

    // Metric 1: Institutions count
    const instMetric = page.locator('.metric').filter({ hasText: 'Institutions' }).first();
    await expect(instMetric.locator('.metric-value').first()).not.toBeEmpty();
  });

  test('3. Tenant Switcher Modal: Resolve & Switch to 7314 ABC College DB', async ({ page }) => {
    // Open College Login / Switcher Modal
    await page.locator('.tenant-pill-badge').click();
    const modal = page.locator('.modal-container.show');
    await expect(modal).toBeVisible();
    await expect(modal.locator('h3')).toContainText('Resolve College Tenant');

    // Select 7314 ABC College via quick chip
    const abcChip = modal.locator('.quick-college-chip', { hasText: '7314' });
    await abcChip.click();

    // Verify isolation card appears with verified status
    const isolationCard = modal.locator('.isolation-card');
    await expect(isolationCard).toBeVisible({ timeout: 10000 });
    await expect(isolationCard).toContainText('TENANT VERIFIED · DATABASE ISOLATED');
    await expect(isolationCard).toContainText('careeros_abc');

    // Click Switch to this College Tenant
    const switchBtn = modal.locator('button.btn.primary', { hasText: 'Switch to this College Tenant' });
    await expect(switchBtn).toBeEnabled();
    await switchBtn.click();

    // Modal should close and header badge should update to 7314 / careeros_abc
    await expect(page.locator('.modal-container.show')).toHaveCount(0);
    await expect(page.locator('.tenant-pill-name')).toContainText('7314');
    await expect(page.locator('.tenant-pill-db')).toContainText('careeros_abc');

    // Switch back to 4821 SITRC for subsequent tests
    await page.locator('.tenant-pill-badge').click();
    await expect(page.locator('.modal-container.show')).toBeVisible();
    await page.locator('.quick-college-chip', { hasText: '4821' }).click();
    await expect(page.locator('.isolation-card')).toContainText('careeros_sitrc');
    await page.locator('button.btn.primary', { hasText: 'Switch to this College Tenant' }).click();
    await expect(page.locator('.tenant-pill-name')).toContainText('4821');
  });

  test('4. Institutions Tab: Search & Table Listing', async ({ page }) => {
    // Navigate to Institutions
    await page.locator('.nav-item', { hasText: 'Institutions' }).click();
    await expect(page.locator('.crumb b')).toHaveText('Institutions');

    // Search for Sandip / SITRC
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('Sandip');
      // Verify table row matches
      await expect(page.locator('tbody tr', { hasText: 'Sandip' }).first()).toBeVisible();
    }
  });

  test('5. Subscriptions & Platform Admins Tabs', async ({ page }) => {
    // Navigate to Subscriptions
    await page.locator('.nav-item', { hasText: 'Subscriptions' }).click();
    await expect(page.locator('.crumb b')).toHaveText('Subscriptions');

    // Navigate to Platform Admins
    await page.locator('.nav-item', { hasText: 'Platform Admins' }).click();
    await expect(page.locator('.crumb b')).toHaveText('Platform Admins');
  });

  test('6. Onboarding Drawer: 5-Step College Provisioning Workflow', async ({ page }) => {
    // Click + Add Institution to open 5-step drawer
    await page.locator('button.btn.primary', { hasText: '+ Add Institution' }).click();
    const drawer = page.locator('aside.drawer.open');
    await expect(drawer).toBeVisible();

    // Step 1: Fill Institution Details
    const uniqueNum = Math.floor(1000 + Math.random() * 9000);
    const instName = `Apex Institute of Tech ${uniqueNum}`;

    await drawer.locator('input[placeholder*="Sandip Institute"]').fill(instName);
    await drawer.locator('input[placeholder="SITRC"]').fill(`AIT${uniqueNum}`);
    await drawer.locator('input[placeholder*="college.edu.in"]').fill(`apex${uniqueNum}.edu.in`);

    // Advance to Step 2
    await drawer.locator('button.btn.primary', { hasText: 'Continue →' }).click();

    // Advance to Step 3
    await drawer.locator('button.btn.primary', { hasText: 'Continue →' }).click();

    // Advance to Step 4
    await drawer.locator('button.btn.primary', { hasText: 'Continue →' }).click();

    // Advance to Step 5 (Review & Provision)
    await drawer.locator('button.btn.primary', { hasText: 'Continue →' }).click();
    await expect(drawer.locator('button.btn.primary', { hasText: 'Provision Workspace' })).toBeVisible();

    // Submit provisioning
    await drawer.locator('button.btn.primary', { hasText: 'Provision Workspace' }).click();

    // Drawer closes after submit
    await expect(page.locator('aside.drawer.open')).toHaveCount(0, { timeout: 15000 });
  });

  test('7. Settings Tab & Maintenance Mode Confirmation Dialog', async ({ page }) => {
    // Navigate to Settings
    await page.locator('.sidebar-footer .nav-item', { hasText: 'Settings' }).click();
    await expect(page.locator('.crumb b')).toHaveText('Settings');

    // Locate maintenance mode action button
    const maintenanceBtn = page.getByRole('button', { name: /maintenance/i }).first();
    await expect(maintenanceBtn).toBeVisible();

    const initialText = await maintenanceBtn.innerText();

    if (initialText.includes('Enable maintenance')) {
      // Click Enable maintenance -> Should open confirmation modal
      await maintenanceBtn.click();
      const confirmModal = page.locator('.modal-container.show');
      await expect(confirmModal).toBeVisible();
      await expect(confirmModal.locator('h3')).toHaveText('Enable Maintenance Mode?');

      // Test Cancel button closes dialog without changing state
      await confirmModal.locator('button.btn', { hasText: 'Cancel' }).click();
      await expect(page.locator('.modal-container.show')).toHaveCount(0);
      await expect(maintenanceBtn).toContainText('Enable maintenance');

      // Click again and confirm
      await maintenanceBtn.click();
      await page.locator('.modal-container.show button.btn.primary').click();
      await expect(page.locator('.modal-container.show')).toHaveCount(0);

      // Now maintenance mode should be active
      await expect(maintenanceBtn).toContainText('Disable maintenance');

      // Click Disable maintenance (does not require confirmation)
      await maintenanceBtn.click();
      await expect(maintenanceBtn).toContainText('Enable maintenance');
    }
  });
});
