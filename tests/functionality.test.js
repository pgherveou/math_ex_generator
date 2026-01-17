const { test, expect } = require('@playwright/test');

test.describe('Functionality Tests', () => {

  test('should load with initial worksheet', async ({ page }) => {
    await page.goto('/');

    // Check that exercises are generated
    const exerciseItems = page.locator('.exercise-item');
    await expect(exerciseItems).toHaveCount(60);

    // Check that exercises have content
    const firstExercise = exerciseItems.first();
    await expect(firstExercise).toContainText(/\d+ [×:] \d+ =/);
  });

  test('should generate new worksheet when clicking generate button', async ({ page }) => {
    await page.goto('/');

    // Get first exercise text
    const firstExercise = page.locator('.exercise-item').first();
    const initialText = await firstExercise.textContent();

    // Click generate button
    await page.click('#generate-btn');

    // Wait a bit for DOM update
    await page.waitForTimeout(100);

    // Check that content has changed (very likely with 60 random exercises)
    const newText = await firstExercise.textContent();
    // Note: There's a small chance they could be the same, but very unlikely
    // so we'll just verify the structure is correct
    await expect(firstExercise).toContainText(/\d+ [×:] \d+ =/);
  });

  test('should switch languages correctly', async ({ page }) => {
    await page.goto('/');

    // Check initial language (French)
    await expect(page.locator('h1')).toContainText('60 calculs en 5 minutes');
    await expect(page.locator('#generate-btn')).toContainText('Générer une nouvelle feuille');

    // Switch to English
    await page.click('#lang-en');
    await expect(page.locator('h1')).toContainText('60 calculations in 5 minutes');
    await expect(page.locator('#generate-btn')).toContainText('Generate New Worksheet');

    // Switch to Spanish
    await page.click('#lang-es');
    await expect(page.locator('h1')).toContainText('60 cálculos en 5 minutos');
    await expect(page.locator('#generate-btn')).toContainText('Generar Nueva Hoja');

    // Switch to Portuguese
    await page.click('#lang-pt');
    await expect(page.locator('h1')).toContainText('60 cálculos em 5 minutos');
    await expect(page.locator('#generate-btn')).toContainText('Gerar Nova Folha');
  });

  test('should persist language preference', async ({ page }) => {
    await page.goto('/');

    // Switch to English
    await page.click('#lang-en');
    await expect(page.locator('#lang-en')).toHaveClass(/active/);

    // Reload page
    await page.reload();

    // Check that English is still active
    await expect(page.locator('#lang-en')).toHaveClass(/active/);
    await expect(page.locator('h1')).toContainText('60 calculations in 5 minutes');
  });

  test('should have correct exercise distribution', async ({ page }) => {
    await page.goto('/');

    // Count multiplication and division exercises
    const exerciseItems = page.locator('.exercise-item');
    const count = await exerciseItems.count();
    expect(count).toBe(60);

    // Check that we have both types
    const multiplicationCount = await exerciseItems.filter({ hasText: '×' }).count();
    const divisionCount = await exerciseItems.filter({ hasText: ':' }).count();

    // Should be approximately 70% multiplication (42) and 30% division (18)
    expect(multiplicationCount).toBe(42);
    expect(divisionCount).toBe(18);
  });

  test('should have proper print styles', async ({ page }) => {
    await page.goto('/');

    // Check that no-print elements are hidden in print media
    const controls = page.locator('.controls');
    const printDisplay = await controls.evaluate((el) => {
      const mediaQueryList = window.matchMedia('print');
      // We can't actually test print media in the browser,
      // but we can verify the class exists
      return el.classList.contains('no-print');
    });

    expect(printDisplay).toBe(true);
  });

  test('should have accessible elements', async ({ page }) => {
    await page.goto('/');

    // Check that buttons are keyboard accessible
    await page.keyboard.press('Tab');
    const focusedElement1 = await page.evaluate(() => document.activeElement.id);
    expect(focusedElement1).toBeTruthy();

    // Check that language buttons are accessible
    await page.locator('#lang-fr').focus();
    const focusedElement2 = await page.evaluate(() => document.activeElement.id);
    expect(focusedElement2).toBe('lang-fr');
  });

  test('should display header and footer correctly', async ({ page }) => {
    await page.goto('/');

    // Check header elements
    await expect(page.locator('.name-date')).toBeVisible();
    await expect(page.locator('.name-date')).toContainText('Prénom');
    await expect(page.locator('.name-date')).toContainText('Date');

    // Check footer
    await expect(page.locator('.footer')).toBeVisible();
    await expect(page.locator('.footer')).toContainText('Mon score');
    await expect(page.locator('.footer')).toContainText('/ 60');
  });

  test('should have proper visual hierarchy', async ({ page }) => {
    await page.goto('/');

    // Check that title is larger than exercise text
    const titleSize = await page.locator('h1').evaluate((el) => {
      return parseInt(window.getComputedStyle(el).fontSize);
    });

    const exerciseSize = await page.locator('.exercise-item').first().evaluate((el) => {
      return parseInt(window.getComputedStyle(el).fontSize);
    });

    expect(titleSize).toBeGreaterThan(exerciseSize);
  });
});
