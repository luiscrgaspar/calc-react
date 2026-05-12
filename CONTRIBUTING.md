# Contributing

## Setup

```bash
yarn install
```

## Common Scripts

- `yarn dev` starts the local Vite dev server
- `yarn build` type-checks and creates a production build
- `yarn lint` checks the repo with ESLint
- `yarn lint:fix` applies safe ESLint fixes
- `yarn format:check` checks formatting with Prettier
- `yarn format` writes the Prettier formatting
- `yarn test` runs the Vitest suite once
- `yarn test:watch` keeps the test runner open while you iterate
- `yarn test:coverage` reports source coverage for the unit suite
- `yarn test:visual` runs the Playwright visual regression suite
- `yarn test:visual:update` refreshes the screenshot snapshots when the UI changes intentionally

## Code Style

- Keep view components presentational and push behavior into the calculator hook or utility modules
- Prefer pure functions for math and formatting
- Use stable `id` values for interactive elements when a list is rendered
- Keep translations and shared labels in the dedicated constants and i18n files
- Match the existing TypeScript strictness instead of relaxing compiler settings
- Keep Markdown wording aligned with the actual scripts and repository layout

## Testing Expectations

- Add or update unit tests when changing calculator math or formatting
- Add or update component tests when changing the UI flow or accessibility behavior
- Keep the visual regression suite aligned with the rendered structure and intentional visual states
- Prefer snapshot updates only after confirming the change is expected

## Pull Request Checklist

- `yarn build` passes
- `yarn lint` passes
- `yarn format:check` passes
- `yarn test` passes
- `yarn test:coverage` passes with the expected source coverage
- `yarn test:visual` passes, and snapshots are updated only when needed
- Updated documentation if the public behavior or repository structure changed
- No unrelated files were modified
