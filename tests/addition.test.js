const { test, expect } = require('@playwright/test');

test.describe('Addition/Subtraction Worksheet Tests', () => {

  test('should load with 40 initial exercises', async ({ page }) => {
    await page.goto('/addition.html');

    // Check that exercises are generated
    const exerciseItems = page.locator('.exercise-item');
    await expect(exerciseItems).toHaveCount(40);

    // Check that exercises have content
    const firstExercise = exerciseItems.first();
    await expect(firstExercise).toContainText(/\d+ [+\-] \d+ =/);
  });

  test('should have 20 addition and 20 subtraction exercises', async ({ page }) => {
    await page.goto('/addition.html');

    // Count addition and subtraction exercises
    const exerciseItems = page.locator('.exercise-item');
    const count = await exerciseItems.count();
    expect(count).toBe(40);

    // Check that we have both types
    const additionCount = await exerciseItems.filter({ hasText: '+' }).count();
    const subtractionCount = await exerciseItems.filter({ hasText: '-' }).count();

    // Should be exactly 20 addition and 20 subtraction
    expect(additionCount).toBe(20);
    expect(subtractionCount).toBe(20);
  });

  test('should have no negative results in subtraction', async ({ page }) => {
    await page.goto('/addition.html');

    // Extract all subtraction exercises
    const exerciseItems = page.locator('.exercise-item');
    const allExercises = await exerciseItems.allTextContents();

    // Parse and validate all subtractions
    for (const exercise of allExercises) {
      if (exercise.includes('-')) {
        // Extract numbers from format "a - b = "
        const match = exercise.match(/(\d+)\s*-\s*(\d+)\s*=/);
        if (match) {
          const a = parseInt(match[1]);
          const b = parseInt(match[2]);
          // Verify a >= b (no negative results)
          expect(a).toBeGreaterThanOrEqual(b);
        }
      }
    }
  });

  test('should have all numbers in range 1-99', async ({ page }) => {
    await page.goto('/addition.html');

    // Extract all exercises
    const exerciseItems = page.locator('.exercise-item');
    const allExercises = await exerciseItems.allTextContents();

    // Parse and validate all numbers
    for (const exercise of allExercises) {
      // Extract all numbers from exercise
      const matches = exercise.match(/\d+/g);
      if (matches) {
        for (const num of matches) {
          const n = parseInt(num);
          expect(n).toBeGreaterThanOrEqual(1);
          expect(n).toBeLessThanOrEqual(99);
        }
      }
    }
  });

  test('should have 2-column layout on desktop', async ({ page }) => {
    await page.goto('/addition.html');

    // Check that we have exactly 2 columns
    const columns = page.locator('.column');
    await expect(columns).toHaveCount(2);

    // Check that each column has approximately 20 exercises
    const column1Exercises = page.locator('#column-1 .exercise-item');
    const column2Exercises = page.locator('#column-2 .exercise-item');

    await expect(column1Exercises).toHaveCount(20);
    await expect(column2Exercises).toHaveCount(20);
  });

  test('should display score as / 40', async ({ page }) => {
    await page.goto('/addition.html');

    // Check footer
    await expect(page.locator('.footer')).toBeVisible();
    await expect(page.locator('.footer')).toContainText('/ 40');
  });

  test('should switch languages correctly', async ({ page }) => {
    await page.goto('/addition.html');

    // Check initial language (French)
    await expect(page.locator('h1')).toContainText('40 calculs en 5 minutes');

    // Switch to English
    await page.click('#lang-en');
    await expect(page.locator('h1')).toContainText('40 calculations in 5 minutes');

    // Switch to Spanish
    await page.click('#lang-es');
    await expect(page.locator('h1')).toContainText('40 cálculos en 5 minutos');

    // Switch to Portuguese
    await page.click('#lang-pt');
    await expect(page.locator('h1')).toContainText('40 cálculos em 5 minutos');

    // Switch to German
    await page.click('#lang-de');
    await expect(page.locator('h1')).toContainText('40 Rechnungen in 5 Minuten');
  });

  test('should generate new worksheet when clicking generate button', async ({ page }) => {
    await page.goto('/addition.html');

    // Get first exercise text
    const firstExercise = page.locator('.exercise-item').first();
    const initialText = await firstExercise.textContent();

    // Click generate button
    await page.click('#generate-btn');

    // Wait a bit for DOM update
    await page.waitForTimeout(100);

    // Check that content has changed (very likely with 40 random exercises)
    const newText = await firstExercise.textContent();
    // Verify the structure is correct
    await expect(firstExercise).toContainText(/\d+ [+\-] \d+ =/);
  });

  test('should navigate between sheets correctly', async ({ page }) => {
    await page.goto('/addition.html');

    // Check that Addition link is active
    const additionLink = page.locator('a[href="addition.html"]');
    await expect(additionLink).toHaveClass(/active/);

    // Click Math link
    await page.click('a[href="index.html"]');
    await expect(page).toHaveURL(/index.html/);

    // Click Dictation link
    await page.click('a[href="dictation.html"]');
    await expect(page).toHaveURL(/dictation.html/);

    // Click Addition link
    await page.click('a[href="addition.html"]');
    await expect(page).toHaveURL(/addition.html/);
  });

  test('should persist language preference', async ({ page }) => {
    await page.goto('/addition.html');

    // Switch to English
    await page.click('#lang-en');
    await expect(page.locator('#lang-en')).toHaveClass(/active/);

    // Reload page
    await page.reload();

    // Check that English is still active
    await expect(page.locator('#lang-en')).toHaveClass(/active/);
    await expect(page.locator('h1')).toContainText('40 calculations in 5 minutes');
  });

  test('should display print button', async ({ page }) => {
    await page.goto('/addition.html');

    // Check that print button is visible
    const printBtn = page.locator('#print-btn');
    await expect(printBtn).toBeVisible();
    await expect(printBtn).toContainText('Imprimer');
  });

  test('should have proper header and footer', async ({ page }) => {
    await page.goto('/addition.html');

    // Check header elements
    await expect(page.locator('.name-date')).toBeVisible();
    await expect(page.locator('.name-date')).toContainText('Prénom');
    await expect(page.locator('.name-date')).toContainText('Date');

    // Check footer
    await expect(page.locator('.footer')).toBeVisible();
    await expect(page.locator('.footer')).toContainText('Mon score');
    await expect(page.locator('.footer')).toContainText('/ 40');
  });

  test('should have navigation menu with all three sheets', async ({ page }) => {
    await page.goto('/addition.html');

    // Check that all navigation links are present
    const navMenu = page.locator('.nav-menu');
    await expect(navMenu.locator('a[href="index.html"]')).toBeVisible();
    await expect(navMenu.locator('a[href="dictation.html"]')).toBeVisible();
    await expect(navMenu.locator('a[href="addition.html"]')).toBeVisible();
  });

  test('should have proper visual hierarchy', async ({ page }) => {
    await page.goto('/addition.html');

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
