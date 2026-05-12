import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Calculator } from './Calculator';

const { formatResultMock } = vi.hoisted(() => ({
  formatResultMock: vi.fn(() => ({
    value: 'Infinity',
    isInfinity: true,
  })),
}));

vi.mock('../utils/resultFormatter', async () => {
  const actual = await vi.importActual<typeof import('../utils/resultFormatter')>(
    '../utils/resultFormatter'
  );

  return {
    ...actual,
    formatResult: formatResultMock,
  };
});

describe('Calculator overflow chain', () => {
  it('renders Infinity when chained formatting overflows', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole('button', { name: '5' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '2' }));
    await user.click(screen.getByRole('button', { name: '×' }));

    expect(screen.getByRole('status')).toHaveTextContent('Infinity');
    expect(formatResultMock).toHaveBeenCalled();
  });
});
