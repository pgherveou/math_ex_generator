# Testing Documentation

## Overview

This project uses [Playwright](https://playwright.dev/) for comprehensive UI browser testing across multiple devices and browsers.

## Test Coverage

All 140 tests passed across:
- **3 Desktop browsers**: Chromium, Firefox, WebKit
- **5 Mobile/Tablet devices**: iPad Pro, iPad Pro Landscape, iPhone 14 Pro, Pixel 7, iPhone SE

## Test Suites

### 1. Responsive Design Tests (`tests/ui-responsive.test.js`)
- Desktop layout verification (3-column grid)
- Tablet layout verification
- Mobile layout verification (single column)
- Touch target size validation (minimum 44x44px for iOS, 48x48px for buttons)
- Horizontal scroll prevention across all devices

### 2. Functionality Tests (`tests/functionality.test.js`)
- Initial worksheet generation
- New worksheet generation
- Multi-language switching (FR, EN, ES, PT)
- Language preference persistence
- Exercise distribution (70% multiplication, 30% division)
- Print styles
- Keyboard accessibility
- Header and footer display
- Visual hierarchy

### 3. Design Best Practices (`tests/design-best-practices.test.js`)
- Color contrast for accessibility
- Consistent spacing using CSS custom properties
- Focus indicators for keyboard navigation
- Border radius on interactive elements
- Smooth transitions
- Typography hierarchy
- Proper line height (1.5+)
- System fonts for performance
- Box shadows for depth
- Button states (hover, focus)
- Mobile viewport meta tag
- Semantic HTML structure
- Load performance (< 2 seconds)
- No layout shift on load

## Running Tests

### Install Dependencies
```bash
npm install
npx playwright install
```

### Run All Tests
```bash
npm test
```

### Run Tests with UI Mode (Interactive)
```bash
npm run test:ui
```

### Run Tests in Headed Mode (See Browser)
```bash
npm run test:headed
```

### Run Tests with Debugger
```bash
npm run test:debug
```

### View Test Report
```bash
npm run test:report
```

### Run Specific Test File
```bash
npx playwright test tests/ui-responsive.test.js
```

### Run Tests for Specific Browser/Device
```bash
# Desktop browsers
npx playwright test --project=chromium-desktop
npx playwright test --project=firefox-desktop
npx playwright test --project=webkit-desktop

# Mobile/Tablet devices
npx playwright test --project=tablet-ipad
npx playwright test --project=mobile-iphone
npx playwright test --project=mobile-pixel
npx playwright test --project=mobile-small
```

## Device Configurations

| Project Name | Device | Viewport Size |
|--------------|--------|---------------|
| chromium-desktop | Desktop Chrome | 1280×720 |
| firefox-desktop | Desktop Firefox | 1280×720 |
| webkit-desktop | Desktop Safari | 1280×720 |
| tablet-ipad | iPad Pro | 1024×1366 |
| tablet-landscape | iPad Pro Landscape | 1366×1024 |
| mobile-iphone | iPhone 14 Pro | 393×852 |
| mobile-pixel | Pixel 7 | 412×915 |
| mobile-small | iPhone SE | 375×667 |

## Test Structure

Each test suite follows this structure:
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Test Suite Name', () => {
  test('should do something specific', async ({ page }) => {
    await page.goto('/');
    // Test assertions...
  });
});
```

## Continuous Integration

The test configuration is CI-ready:
- Retries failed tests 2 times in CI
- Runs tests serially in CI for stability
- Captures traces on first retry
- Takes screenshots on failure
- Generates HTML reports

## Best Practices Verified

- ✓ Mobile-first responsive design
- ✓ Touch targets ≥ 48×48px
- ✓ No horizontal scrolling on any device
- ✓ Accessible keyboard navigation
- ✓ Color contrast compliance
- ✓ Semantic HTML structure
- ✓ Fast load times (< 2s)
- ✓ No layout shifts
- ✓ Proper viewport configuration
- ✓ System fonts for performance

## Troubleshooting

### Browser Dependencies Missing

If you see a warning about missing system dependencies, install them:

```bash
sudo npx playwright install-deps
```

Or manually install required packages:
```bash
sudo apt-get install libicu74 libxml2 libvpx9 libflite1
```

### Port Already in Use

If port 8080 is already in use, kill the process:
```bash
lsof -ti:8080 | xargs kill -9
```

Or change the port in `playwright.config.js`:
```javascript
webServer: {
  command: 'python3 -m http.server 8081',
  url: 'http://localhost:8081',
  // ...
}
```

## Adding New Tests

1. Create a new test file in the `tests/` directory
2. Follow the existing test structure
3. Run tests to verify they pass
4. Update this documentation if needed

Example:
```javascript
// tests/my-new-test.test.js
const { test, expect } = require('@playwright/test');

test.describe('My New Feature', () => {
  test('should work correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.my-element')).toBeVisible();
  });
});
```
