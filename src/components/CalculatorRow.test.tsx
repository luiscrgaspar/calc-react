import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { CalculatorRow } from './CalculatorRow';

describe('CalculatorRow', () => {
  it('renders each button and forwards clicks', () => {
    const firstClick = vi.fn();
    const secondClick = vi.fn();

    render(
      <CalculatorRow
        buttons={[
          {
            id: 'first',
            label: 'First',
            onClick: firstClick,
            className: 'calculator-button calculator-button--special',
          },
          {
            id: 'second',
            label: 'Second',
            onClick: secondClick,
            disabled: true,
          },
        ]}
      />
    );

    const firstButton = screen.getByRole('button', { name: 'First' });
    const secondButton = screen.getByRole('button', { name: 'Second' });

    expect(firstButton).toHaveClass('calculator-button--special');
    expect(secondButton).toHaveClass('calculator-button');
    expect(secondButton).toBeDisabled();

    fireEvent.click(firstButton);
    fireEvent.click(secondButton);

    expect(firstClick).toHaveBeenCalledTimes(1);
    expect(secondClick).not.toHaveBeenCalled();
  });
});
