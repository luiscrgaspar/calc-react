import js from '@eslint/js';
import globals from 'globals';
import jestDom from 'eslint-plugin-jest-dom';
import playwright from 'eslint-plugin-playwright';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import testingLibrary from 'eslint-plugin-testing-library';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

const sharedTestGlobals = {
  ...globals.browser,
  ...globals.node,
  ...globals.vitest,
};

export default tseslint.config(
  {
    ignores: [
      'coverage/**',
      'dist/**',
      'playwright-report/**',
      'test-results/**',
      'tests/visual/**/*-snapshots/**',
      'src/**/*.d.ts',
      'vite.config.d.ts',
      'vite.config.js',
      'tsconfig*.tsbuildinfo',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    files: ['src/**/*.{test,spec}.{ts,tsx}'],
    languageOptions: {
      globals: sharedTestGlobals,
    },
    plugins: {
      'testing-library': testingLibrary,
      'jest-dom': jestDom,
    },
    rules: {
      ...testingLibrary.configs['flat/react'].rules,
      ...jestDom.configs['flat/recommended'].rules,
    },
  },
  {
    files: ['tests/visual/**/*.{js,cjs,mjs,ts,tsx}'],
    ...playwright.configs['flat/recommended'],
  }
);
