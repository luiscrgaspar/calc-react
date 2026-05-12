import { render, screen } from '@testing-library/react';
import { Calculator } from './Calculator';

describe('Calculator visual smoke test', () => {
  it('keeps the calculator layout intact', () => {
    const { container } = render(<Calculator />);

    expect(container.querySelector('.calculator')).toBeInTheDocument();
    expect(container.querySelector('.calculator-shell')).toBeInTheDocument();
    expect(container.querySelectorAll('.calculator-row')).toHaveLength(8);
    expect(container.querySelector('.calculator-header-result')).toBeVisible();
    expect(screen.getByRole('button', { name: '=' })).toHaveClass(
      'calculator-button--equal'
    );
  });
});
