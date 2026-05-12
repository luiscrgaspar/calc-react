import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Calculator } from './Calculator';

const { calculateBinaryOperationMock } = vi.hoisted(() => ({
  calculateBinaryOperationMock: vi.fn(() => Number.NaN),
}));

vi.mock('../utils/calculatorEngine', async () => {
  const actual = await vi.importActual<typeof import('../utils/calculatorEngine')>(
    '../utils/calculatorEngine'
  );

  return {
    ...actual,
    calculateBinaryOperation: calculateBinaryOperationMock,
  };
});

describe('Calculator pending operation edge case', () => {
  it('ignores chained operators once the current value stops being numeric', async () => {
    const user = userEvent.setup();

    render(<Calculator />);

    await user.click(screen.getByRole('button', { name: '2' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '3' }));
    await user.click(screen.getByRole('button', { name: '×' }));

    expect(screen.getByRole('status')).toHaveTextContent('NaN');
    expect(calculateBinaryOperationMock).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: '+' }));

    expect(calculateBinaryOperationMock).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent('NaN');
  });
});
