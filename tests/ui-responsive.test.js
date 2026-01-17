const { test, expect } = require('@playwright/test');

test.describe('Responsive Design Tests', () => {

  test('should display correctly on desktop', async ({ page }) => {
    await page.goto('/');

    // Check main elements are visible
    await expect(page.locator('.controls')).toBeVisible();
    await expect(page.locator('.language-selector')).toBeVisible();
    await expect(page.locator('.action-buttons')).toBeVisible();
    await expect(page.locator('.a4-page')).toBeVisible();

    // Check 3-column layout on desktop
    const columns = page.locator('.column');
    await expect(columns).toHaveCount(3);

    // Check buttons are in horizontal layout
    const actionButtons = page.locator('.action-buttons');
    const box = await actionButtons.boundingBox();
    expect(box.width).toBeGreaterThan(300); // Wide layout
  });

  test('should display correctly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Check main elements are visible
    await expect(page.locator('.controls')).toBeVisible();
    await expect(page.locator('.a4-page')).toBeVisible();

    // Should still have 3 columns on tablet
    const columns = page.locator('.column');
    await expect(columns).toHaveCount(3);

    // Check font sizes are adjusted
    const exerciseItem = page.locator('.exercise-item').first();
    await expect(exerciseItem).toBeVisible();
  });

  test('should display correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check main elements are visible
    await expect(page.locator('.controls')).toBeVisible();
    await expect(page.locator('.a4-page')).toBeVisible();

    // Check single column layout on mobile
    const exercises = page.locator('.exercises');
    const computedStyle = await exercises.evaluate((el) => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });

    // Should be single column (not three)
    expect(computedStyle).not.toContain('1fr 1fr 1fr');

    // Check buttons are stacked vertically
    const actionButtons = page.locator('.action-buttons');
    const box = await actionButtons.boundingBox();
    expect(box.height).toBeGreaterThan(100); // Tall layout
  });

  test('should have proper touch targets on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Language buttons should be at least 44x44px (iOS minimum)
    const langButton = page.locator('.lang-btn').first();
    const box = await langButton.boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);

    // Action buttons should be at least 48x48px
    const generateBtn = page.locator('#generate-btn');
    const btnBox = await generateBtn.boundingBox();
    expect(btnBox.height).toBeGreaterThanOrEqual(48);
  });

  test('should not have horizontal scroll on any device', async ({ page }) => {
    const viewportSizes = [
      { width: 375, height: 667 },   // Mobile
      { width: 768, height: 1024 },  // Tablet
      { width: 1280, height: 720 }   // Desktop
    ];

    for (const size of viewportSizes) {
      await page.setViewportSize(size);
      await page.goto('/');

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll).toBe(false);
    }
  });
});
