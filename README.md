# Calc React

Calc React is a React 19 + TypeScript calculator built with Vite. It includes memory buttons, scientific operations, localized labels/messages, and a lightweight test suite.

## Features

- Basic arithmetic and repeated equals behavior
- Scientific helpers such as square, cube, square root, cube root, factorial, reciprocal, percentage, and constants
- Memory controls for store, recall, and clear
- Language switching for English, Spanish, and Portuguese
- Accessible result output with a clean responsive layout

## Tech Stack

- React 19
- TypeScript
- Vite
- ESLint
- Prettier
- Vitest
- Playwright
- React Testing Library

## Getting Started

```bash
yarn install
```

## Development

```bash
yarn dev
```

## Build

```bash
yarn build
```

## Test

```bash
yarn test
```

Run the test watcher while developing:

```bash
yarn test:watch
```

Generate the coverage report:

```bash
yarn test:coverage
```

Run the Playwright visual regression suite:

```bash
yarn test:visual
```

If the UI changes intentionally, refresh the snapshots with:

```bash
yarn test:visual:update
```

Check code quality with lint:

```bash
yarn lint
```

Format the repository with Prettier:

```bash
yarn format
```

## Project Structure

- `src/components/` contains presentational UI components
- `src/features/calculator/` contains the calculator hook and state wiring
- `src/utils/` contains pure math and formatting helpers
- `src/i18n.ts` stores localized messages
- `src/constants.ts` stores shared labels and operator symbols
- `tests/visual/` contains the Playwright visual regression suite and snapshots
- `eslint.config.js` and `.prettierrc.json` define linting and formatting rules

See [ARQUITECTURE.md](./ARQUITECTURE.md) for a deeper explanation of the design.

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before sending changes.
