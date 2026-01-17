# Math Exercise Generator

A browser-based worksheet generator for elementary math practice. Generate printable A4 worksheets with 60 multiplication and division exercises.

## Features

- **60 exercises per worksheet**: 70% multiplication (42) and 30% division (18)
- **Tables 1-11**: All exercises use multiplication/division tables from 1 to 11
- **Multi-language support**: French, English, Spanish, and Portuguese
- **Print-ready**: A4 format optimized for direct printing from browser
- **Fully responsive**: Mobile-first design that works on all devices
- **Randomized**: Each generation creates a unique mix of exercises
- **Accessibility**: Keyboard navigation, proper focus states, and touch-friendly buttons
- **No installation**: Works directly in any modern web browser
- **Static hosting**: Can be hosted on GitHub Pages or any static file server
- **Fully tested**: 140+ automated tests across multiple browsers and devices

## Usage

### Online (GitHub Pages)

1. Visit the hosted page at: `https://[your-username].github.io/math_ex_generator/`
2. A worksheet is automatically generated when you open the page
3. Click **"Générer une nouvelle feuille"** to generate a different worksheet
4. Click **"Imprimer"** or press `Ctrl+P` (Windows/Linux) or `Cmd+P` (Mac) to print
5. In the print dialog:
   - Ensure paper size is set to **A4**
   - Use default margins
   - (Optional) Enable "Background graphics" for better visuals
6. Print and distribute to students

### Local Usage

1. Clone or download this repository
2. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge)
3. Follow the same steps as online usage above

## File Structure

```
math_ex_generator/
├── index.html              # Main page structure
├── styles.css              # Responsive styles with CSS custom properties
├── generator.js            # Exercise generation logic and i18n
├── tests/                  # Playwright test suite
│   ├── ui-responsive.test.js
│   ├── functionality.test.js
│   └── design-best-practices.test.js
├── playwright.config.js    # Test configuration
├── package.json           # Dependencies
├── README.md              # This file
└── TESTING.md             # Testing documentation
```

## Worksheet Format

Each worksheet includes:
- **Header**: Name and date fields for the student
- **Title**: "60 calculs en 5 minutes"
- **3 columns**: 20 exercises per column (numbered 1-60)
- **Exercise types**:
  - Multiplication: `a × b = ` (70%)
  - Division: `a : b = ` (30%)

## Deploying to GitHub Pages

1. Create a new GitHub repository (e.g., `math_ex_generator`)
2. Push this code to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Math exercise generator"
   git branch -M main
   git remote add origin https://github.com/[your-username]/math_ex_generator.git
   git push -u origin main
   ```
3. Go to your repository settings on GitHub
4. Navigate to **Pages** (under "Code and automation")
5. Set **Source** to "Deploy from a branch"
6. Select **Branch**: `main` and **Folder**: `/ (root)`
7. Click **Save**
8. Wait a few minutes, then access your site at: `https://[your-username].github.io/math_ex_generator/`

## Technical Details

### Technology Stack
- **HTML5**: Page structure
- **CSS3**: A4 print layout and responsive design
- **Vanilla JavaScript**: Exercise generation (no dependencies)

### Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with ES6+ support

### Customization

To modify the exercise configuration, edit `generator.js`:

```javascript
const CONFIG = {
    TOTAL_EXERCISES: 60,    // Total number of exercises
    MULT_COUNT: 42,         // Number of multiplication exercises (70%)
    DIV_COUNT: 18,          // Number of division exercises (30%)
    TABLE_MIN: 1,           // Minimum table number
    TABLE_MAX: 11           // Maximum table number
};
```

## Recent Improvements

### Code Simplification
- Simplified JavaScript with modern ES6+ features (optional chaining, template literals)
- Event delegation for more efficient event handling
- Reduced code complexity and improved readability
- Cleaner DOM manipulation

### Enhanced Mobile Responsiveness
- Mobile-first CSS architecture
- CSS custom properties for consistent theming
- Proper touch targets (minimum 48×48px)
- Optimized breakpoints for tablets and mobile devices
- No horizontal scrolling on any device

### Design Best Practices
- Accessible keyboard navigation with visible focus states
- Proper color contrast for readability
- Smooth transitions and hover effects
- Consistent spacing system
- Typography hierarchy for better readability
- System fonts for optimal performance
- Semantic HTML structure

## Testing

This project includes comprehensive UI tests using Playwright. See [TESTING.md](TESTING.md) for details.

### Quick Start

```bash
# Install dependencies
npm install
npx playwright install

# Run all tests
npm test

# Run tests with UI mode
npm run test:ui
```

### Test Coverage

- 140+ tests across 8 device configurations
- Desktop browsers: Chromium, Firefox, WebKit
- Mobile/Tablet: iPad Pro, iPhone 14 Pro, Pixel 7, iPhone SE
- Tests cover: responsive design, functionality, accessibility, and design best practices

## License

This project is open source and available for educational use.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit a pull request.

## Future Enhancements

Potential features for future versions:
- Answer sheet generation
- Customizable settings (table range, ratio, exercise count)
- Multi-page worksheet generation
- PDF export functionality
- Addition and subtraction exercises
- Timed online quiz mode

---

**Made for elementary math teachers and parents to create unlimited practice worksheets.**
