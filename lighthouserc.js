module.exports = {
  ci: {
    collect: {
      // Start a local server for testing Next.js app
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'Ready on',
      startServerReadyTimeout: 30000,
      // URL patterns to test
      url: [
        'http://localhost:3000',
      ],
      // Number of runs for more reliable results
      numberOfRuns: 1, // Reduced for faster CI
    },
    assert: {
      // Performance thresholds for emergency-ready app
      assertions: {
        'categories:performance': ['warn', { minScore: 0.7 }], // Relaxed for CI environment
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        // Core Web Vitals for emergency use (relaxed for CI)
        'first-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.15 }],
      },
    },
    upload: {
      // Store results temporarily
      target: 'temporary-public-storage',
    },
  },
};