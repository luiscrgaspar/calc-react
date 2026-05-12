import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'tests/visual/**'],
  },
  coverage: {
    provider: 'v8',
    all: false,
    include: ['src/**/*.{ts,tsx}'],
    exclude: [
      'playwright.config.js',
      '**/playwright.config.js',
      'src/**/*.test.ts',
      'src/**/*.test.tsx',
      'src/test/**',
      '**/src/types.d.ts',
      'src/vite-env.d.ts',
      'src/components/Calculator.visual.test.tsx',
    ],
    reporter: ['text', 'html', 'lcov'],
  },
});
