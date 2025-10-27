# Todo App - TDD Practice Project

A modern, feature-rich todo application built with React, Vite, and Vitest following Test-Driven Development (TDD) principles.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Available Scripts
```bash
# Development
npm run dev          # Start dev server with hot reload

# Building
npm run build        # Build for production
npm run preview      # Preview production build locally

# Testing
npm test             # Run tests in watch mode
npm run test:ui      # Open Vitest UI for visual testing
npm run test:coverage # Generate test coverage report
```

## 🧪 Test-Driven Development (TDD)

This project follows strict TDD principles:

### Running Tests
```bash
# Watch mode (recommended for development)
npm test

# Single run (for CI/CD)
npm test -- --run

# With coverage
npm run test:coverage

# Visual UI
npm run test:ui
```

## 📁 Project Structure
```
todo-app-tdd/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD pipeline
├── src/
│   ├── App.jsx                 # Main application component
│   ├── App.test.jsx            # Test suite
│   ├── main.jsx                # React entry point
│   ├── index.css               # Global styles
│   └── setupTests.js           # Test configuration
├── public/                     # Static assets
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── vitest.config.js            # Vitest configuration
└── README.md                   # This file
```



## 🔧 Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Vitest** - Test framework
- **Testing Library** - React testing utilities
- **Tailwind CSS** - Utility-first CSS (via CDN)
- **Lucide React** - Icon library

## 🚀 CI/CD Pipeline

The project includes a GitHub Actions workflow that:

1. **Test** - Runs all tests with coverage
2. **Build** - Creates production build
3. **Deploy** - Deploys to GitHub Pages (on main branch)

### Setting Up CI/CD

1. Push to GitHub
2. Enable GitHub Actions in repository settings
3. Configure GitHub Pages to deploy from `gh-pages` branch
4. Pipeline runs automatically on push/PR

## 📝 Adding New Features (TDD Approach)

Example: Adding a "Priority" feature
```javascript
// 1. Write the test first (Red)
it('adds a task with priority level', async () => {
  // ... test code
  expect(screen.getByText('High Priority')).toBeInTheDocument();
});

// 2. Run test - it should fail
npm test

// 3. Implement the feature (Green)
// ... add priority state and UI

// 4. Test passes - refactor if needed (Refactor)
```

## 🐛 Troubleshooting

### Tests failing after changes?
```bash
# Make sure all dependencies are installed
npm install

# Clear any cached data
npm run test -- --clearCache
```

### Styles not loading?
- Ensure Tailwind CDN is in `index.html`
- Check browser console for errors
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Dark mode not persisting?
- Check browser console for localStorage errors
- Ensure cookies/storage are enabled
- Try a different browser

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests first (TDD!)
4. Implement the feature
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built as a learning project for Test-Driven Development
- Perfect for practicing CI/CD workflows
- Great starter template for React + TDD projects

## 📧 Contact

Questions or feedback? Open an issue on GitHub!

---

**Happy Testing! 🧪**