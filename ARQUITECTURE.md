# Architecture

## Overview

This app is intentionally small, but the code is organized into three main layers so the UI stays simple and the calculator logic remains testable:

- `src/components/` for presentational React components
- `src/features/calculator/` for calculator state, event wiring, and UI model assembly
- `src/utils/` for pure calculation and formatting helpers

The goal is to keep business rules out of the view layer and make future changes easier to test.

## Data Flow

1. `Calculator` renders the screen and reads the view model from `useCalculator()`.
2. `useCalculator()` owns the reducer, event handlers, and button layout.
3. The hook delegates math and formatting work to `src/utils/`.
4. `Header`, `LanguageSwitch`, and `CalculatorRow` only render props and raise callbacks.

## Key Decisions

- The calculator state lives in a reducer so the behavior stays explicit and easy to extend.
- Math and formatting are kept pure so they can be unit tested without React.
- Buttons carry stable `id` values instead of using labels as React keys.
- Language strings live in one place to avoid hard-coded translated text in components.
- The result display is a single accessible status region, which makes the UI easier to test.

## File Map

- `src/features/calculator/useCalculator.ts` - state machine, event handlers, and button model
- `src/utils/calculatorEngine.ts` - calculator math
- `src/utils/resultFormatter.ts` - output formatting and display helpers
- `src/components/Calculator.tsx` - calculator composition
- `src/components/Header.tsx` - result display
- `src/components/LanguageSwitch.tsx` - locale selector
- `src/components/CalculatorRow.tsx` - button row renderer

## Testing Strategy

- Unit tests cover the pure math and formatting helpers.
- Component tests cover calculator interactions and language switching.
- Visual tests cover the calculator shell and common interaction states.

## Future Improvements

- Split the calculator hook into smaller domain helpers if the feature set grows.
- Add keyboard support if the app needs desktop-first accessibility.
- Expand the visual test suite if more screens or calculator states are added.
