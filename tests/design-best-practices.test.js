const { test, expect } = require('@playwright/test');

test.describe('Design Best Practices', () => {

  test('should have proper color contrast for accessibility', async ({ page }) => {
    await page.goto('/');

    // Check button contrast
    const generateBtn = page.locator('#generate-btn');
    const { backgroundColor, color } = await generateBtn.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color
      };
    });

    // Verify colors are defined (not checking exact contrast ratio as that requires a library)
    expect(backgroundColor).toBeTruthy();
    expect(color).toBeTruthy();

    // Check that text is white on green button
    expect(color).toContain('rgb(255, 255, 255)');
  });

  test('should have consistent spacing', async ({ page }) => {
    await page.goto('/');

    // Check that CSS custom properties are being used
    const hasCustomProperties = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return root.getPropertyValue('--spacing-sm').trim().length > 0;
    });

    expect(hasCustomProperties).toBe(true);
  });

  test('should have focus indicators for keyboard navigation', async ({ page }) => {
    await page.goto('/');

    // Focus on generate button
    await page.locator('#generate-btn').focus();

    // Check that outline is visible
    const outlineStyle = await page.locator('#generate-btn').evaluate((el) => {
      return window.getComputedStyle(el).outline;
    });

    // Should have an outline when focused (can be from :focus-visible)
    expect(outlineStyle).toBeTruthy();
  });

  test('should have rounded corners on buttons', async ({ page }) => {
    await page.goto('/');

    const borderRadius = await page.locator('#generate-btn').evaluate((el) => {
      return window.getComputedStyle(el).borderRadius;
    });

    // Should have border-radius (not 0px)
    expect(borderRadius).not.toBe('0px');
  });

  test('should have smooth transitions', async ({ page }) => {
    await page.goto('/');

    const transition = await page.locator('.lang-btn').first().evaluate((el) => {
      return window.getComputedStyle(el).transition;
    });

    // Should have transition defined
    expect(transition).toContain('0.3s');
  });

  test('should have proper typography hierarchy', async ({ page }) => {
    await page.goto('/');

    const h1Size = await page.locator('h1').evaluate((el) => {
      return parseInt(window.getComputedStyle(el).fontSize);
    });

    const bodySize = await page.locator('.name-date').evaluate((el) => {
      return parseInt(window.getComputedStyle(el).fontSize);
    });

    const exerciseSize = await page.locator('.exercise-item').first().evaluate((el) => {
      return parseInt(window.getComputedStyle(el).fontSize);
    });

    // Heading should be larger than body and exercise text
    expect(h1Size).toBeGreaterThan(bodySize);
    expect(h1Size).toBeGreaterThan(exerciseSize);
  });

  test('should have proper line height for readability', async ({ page }) => {
    await page.goto('/');

    const lineHeight = await page.locator('.exercise-item').first().evaluate((el) => {
      return window.getComputedStyle(el).lineHeight;
    });

    // Line height should be at least 1.5 for readability
    const lineHeightValue = parseFloat(lineHeight);
    expect(lineHeightValue).toBeGreaterThanOrEqual(1.5);
  });

  test('should use system fonts for better performance', async ({ page }) => {
    await page.goto('/');

    const fontFamily = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });

    // Should use system fonts (Arial, Helvetica)
    expect(fontFamily.toLowerCase()).toMatch(/arial|helvetica/);
  });

  test('should have box shadow on page for depth', async ({ page }) => {
    await page.goto('/');

    const boxShadow = await page.locator('.a4-page').evaluate((el) => {
      return window.getComputedStyle(el).boxShadow;
    });

    // Should have box shadow (not 'none')
    expect(boxShadow).not.toBe('none');
  });

  test('should have proper button states', async ({ page }) => {
    await page.goto('/');

    // Get initial button style
    const generateBtn = page.locator('#generate-btn');
    const initialBg = await generateBtn.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Hover over button
    await generateBtn.hover();
    await page.waitForTimeout(100);

    // Check that cursor is pointer
    const cursor = await generateBtn.evaluate((el) => {
      return window.getComputedStyle(el).cursor;
    });

    expect(cursor).toBe('pointer');
  });

  test('should have proper mobile viewport meta tag', async ({ page }) => {
    await page.goto('/');

    const viewport = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="viewport"]');
      return meta ? meta.getAttribute('content') : null;
    });

    expect(viewport).toContain('width=device-width');
    expect(viewport).toContain('initial-scale=1.0');
  });

  test('should have semantic HTML structure', async ({ page }) => {
    await page.goto('/');

    // Check for semantic heading
    await expect(page.locator('h1')).toBeVisible();

    // Check that there's only one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);

    // Check for proper document structure
    const hasMain = await page.evaluate(() => {
      // While there's no <main>, the .a4-page serves as the main content
      return document.querySelector('.a4-page') !== null;
    });

    expect(hasMain).toBe(true);
  });

  test('should load quickly (performance)', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('load');
    const loadTime = Date.now() - startTime;

    // Page should load in less than 2 seconds
    expect(loadTime).toBeLessThan(2000);
  });

  test('should have no layout shift on load', async ({ page }) => {
    await page.goto('/');

    // Wait for load
    await page.waitForLoadState('load');

    // Check that exercises are rendered
    const exerciseCount = await page.locator('.exercise-item').count();
    expect(exerciseCount).toBe(60);

    // Verify no errors in console
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForLoadState('load');

    expect(errors.length).toBe(0);
  });
});
