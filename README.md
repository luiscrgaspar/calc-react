# Calc React

Calc React is a React 19 + TypeScript calculator built with Vite. It includes memory controls, scientific operations, localized labels and messages, and automated unit, component, and visual tests.

## Features

- Basic arithmetic, repeated equals behavior, and chained operations
- Scientific helpers such as square, cube, square root, cube root, factorial, reciprocal, percentage, and constants
- Memory controls for store, recall, and clear
- Language switching for English, Spanish, and Portuguese
- Accessible result output with a responsive layout

## Tech Stack

- React 19
- TypeScript
- Vite
- ESLint
- Prettier
- Vitest
- Playwright
- React Testing Library

## Install Dependencies

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

## Preview

```bash
yarn preview
```

## Code Quality

Check code quality with lint:

```bash
yarn lint
```

Apply safe ESLint fixes:

```bash
yarn lint:fix
```

Format the repository with Prettier:

```bash
yarn format
```

Check formatting without writing changes:

```bash
yarn format:check
```

## Testing

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

## Project Structure

- `src/components/` contains presentational UI components
- `src/features/calculator/` contains the calculator hook, reducer, and state wiring
- `src/utils/` contains pure math and formatting helpers
- `src/App.tsx` and `src/main.tsx` wire the app into Vite and React
- `src/i18n.ts` stores localized messages
- `src/constants.ts` stores shared labels and operator symbols
- `tests/visual/` contains the Playwright visual regression suite and snapshots
- `eslint.config.js` and `.prettierrc.json` define linting and formatting rules

See [ARCHITECTURE.md](./ARCHITECTURE.md) for a deeper explanation of the design.

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before sending changes.
