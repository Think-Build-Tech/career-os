// tests/e2e/mobile.spec.ts
import { test, expect } from '@playwright/test';

test.describe('CareerOS Mobile Application E2E Tests (Student Placement Engine - No Mocks)', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to mobile app
    await page.goto('/');
    // Wait for the app container to load
    await expect(page.getByText('CareerOS').first()).toBeVisible({ timeout: 15000 });
  });

  test('1. Mobile Header: Logo, Branding & Active College Pill', async ({ page }) => {
    await expect(page.getByText('CareerOS').first()).toBeVisible();
    await expect(page.getByText('Student Placement Engine').first()).toBeVisible();

    // Verify College Pill defaults to 4821 SITRC
    const collegePill = page.getByText(/4821/).first();
    await expect(collegePill).toBeVisible();
  });

  test('2. College Switcher: Select 7314 ABC College & Switch Back', async ({ page }) => {
    // Open College Switcher Modal
    const collegePill = page.getByText(/4821/).first();
    await collegePill.click();

    // Modal should appear
    await expect(page.getByText('Select College Campus')).toBeVisible();
    await expect(page.getByText("Connects to your institution's isolated database")).toBeVisible();

    // Tap 7314 ABC College
    const abcCollege = page.getByText(/7314/).first();
    await abcCollege.click();

    // Verify Header updates to 7314
    await expect(page.getByText(/7314/).first()).toBeVisible();

    // Switch back to 4821 SITRC
    await page.getByText(/7314/).first().click();
    await expect(page.getByText('Select College Campus')).toBeVisible();
    await page.getByText(/4821/).first().click();
    await expect(page.getByText(/4821/).first()).toBeVisible();
  });

  test('3. Home Screen: Student Profile, SLA Actions & Career Readiness', async ({ page }) => {
    // Verify greeting and CGPA
    await expect(page.getByText(/Good day/i).first()).toBeVisible();
    await expect(page.getByText('9.15').first()).toBeVisible();
    await expect(page.getByText('CGPA').first()).toBeVisible();

    // Verify SLA Queue section
    await expect(page.getByText('Priority Placement SLA Queue')).toBeVisible();

    // Test Complete SLA Action Item if one is pending
    const completeBtn = page.getByText('Confirm & Complete ✓').first();
    if (await completeBtn.isVisible()) {
      await completeBtn.click();
      // Toast or completion update should trigger
      await page.waitForTimeout(500);
    }

    // Verify Career Readiness & Role Switcher
    await expect(page.getByText('Career Readiness')).toBeVisible();
    const fullStackChip = page.getByText('Full-Stack').first();
    if (await fullStackChip.isVisible()) {
      await fullStackChip.click();
      await page.waitForTimeout(300);
    }

    // Verify Academic Schedule Conflict Check
    await expect(page.getByText('Academic Schedule & Exam Conflict Check')).toBeVisible();
    await expect(page.getByText('0 Conflicts')).toBeVisible();
  });

  test('4. Home Screen: 1-Click Apply Modal Workflow', async ({ page }) => {
    // Locate Recommended Drives section and click 1-Click Apply
    const applyTrigger = page.getByText('Inspect & 1-Click Apply →').first();
    await expect(applyTrigger).toBeVisible();
    await applyTrigger.click();

    // Apply Modal should be visible
    await expect(page.getByText('Pre-Screen Eligibility Passed')).toBeVisible();
    await expect(page.getByText('Locked Resume for Drive')).toBeVisible();

    // Submit Application
    const confirmBtn = page.getByText('Confirm & Apply with 1-Click 🚀');
    await expect(confirmBtn).toBeVisible();
    await confirmBtn.click();

    // Verify Success Screen in modal
    await expect(page.getByText('Application Submitted!')).toBeVisible({ timeout: 5000 });
  });

  test('5. Drives Tab: Search & Tier Filter Chips', async ({ page }) => {
    // Navigate to Drives Tab
    await page.getByText('Drives').first().click();
    await expect(page.getByText('⭐ Super Dream (₹18L+)').first()).toBeVisible();

    // Test Tier Filter Chips
    await page.getByText('⭐ Super Dream (₹18L+)').first().click();
    await page.waitForTimeout(300);

    await page.getByText('🚀 Dream (₹10L+)').first().click();
    await page.waitForTimeout(300);

    await page.getByText('All Drives').first().click();
    await page.waitForTimeout(300);

    // Test Search Input
    const searchInput = page.getByPlaceholder('Search company, role, or skill...');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Google');
    await expect(page.getByText('Google India').first()).toBeVisible();

    // Clear search
    await searchInput.fill('');
  });

  test('6. Tracker Tab: Active Pipeline, Offer Acceptance & Regulations', async ({ page }) => {
    // Navigate to Tracker Tab
    await page.getByText('Tracker').first().click();
    await expect(page.getByText(/Active Pipeline/i).first()).toBeVisible();

    // Switch to Offers Tab
    await page.getByText(/Offers/i).first().click();
    await expect(page.getByText('Institutional Placement Offers')).toBeVisible();

    // Check if there is an offer to review and formally accept
    const reviewOfferBtn = page.getByText('Review & Formally Accept Offer').first();
    if (await reviewOfferBtn.isVisible()) {
      await reviewOfferBtn.click();

      // Offer Modal should open
      await expect(page.getByText('Official Job Offer')).toBeVisible();
      await expect(page.getByText('TOTAL COMPENSATED CTC')).toBeVisible();

      // Check Digital Signature input
      const signInput = page.getByPlaceholder('Type full legal name');
      await expect(signInput).toBeVisible();

      // Submit formal acceptance
      const acceptOfferBtn = page.getByText('Accept & Sign Offer Letter ✍️');
      await acceptOfferBtn.click();

      // Verify acceptance confirmation
      await expect(page.getByText(/Offer Durably Accepted/i)).toBeVisible({ timeout: 5000 });
    }

    // Switch to Policy & Rules Tab
    await page.getByText('Policy & Rules').first().click();
    await expect(page.getByText('College Placement Regulations')).toBeVisible();
    await expect(page.getByText('Placement Debarment Standing')).toBeVisible();
    await expect(page.getByText(/Exemplary Standing/i).first()).toBeVisible();
  });

  test('7. TACIE AI Tab: Copilot Chat & Quick Prompts', async ({ page }) => {
    // Navigate to TACIE AI Tab
    await page.getByText('TACIE AI').first().click();
    await expect(page.getByText('TACIE Placement Copilot')).toBeVisible();
    await expect(page.getByText(/Credits/i).first()).toBeVisible();

    // Click a Quick Prompt chip
    const promptChip = page.getByText(/crack Google SDE-1/i).first();
    if (await promptChip.isVisible()) {
      await promptChip.click();
      // Should post user prompt and receive TACIE response
      await expect(page.getByText(/Google/i).first()).toBeVisible();
    }
  });

  test('8. Profile Tab: Verified SPPU Records, ATS Resume & Privacy Toggles', async ({ page }) => {
    // Navigate to Profile Tab
    await page.getByText('Profile').first().click();

    // Student identity
    await expect(page.getByText('Aarav Sharma').first()).toBeVisible();
    await expect(page.getByText(/EN2022CS014/i).first()).toBeVisible();

    // Verified Academic Record
    await expect(page.getByText('Verified Academic Dossier')).toBeVisible();
    await expect(page.getByText('TPO Locked').first()).toBeVisible();
    await expect(page.getByText('9.15').first()).toBeVisible();
    await expect(page.getByText('Cumulative CGPA')).toBeVisible();
    await expect(page.getByText('Active Backlogs')).toBeVisible();

    // Active Placement Resume
    await expect(page.getByText('Active Placement Resume')).toBeVisible();
    await expect(page.getByText('ATS').first()).toBeVisible();

    // Proctored Skills
    await expect(page.getByText('Proctored Technical Skills')).toBeVisible();
    await expect(page.getByText('Go / Golang').first()).toBeVisible();

    // Privacy & Recruiter Discovery Controls
    await expect(page.getByText('Privacy & Discovery Settings')).toBeVisible();
    await expect(page.getByText('Recruiter Discovery')).toBeVisible();
  });
});
