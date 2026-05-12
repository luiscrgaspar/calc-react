import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen } from '@testing-library/react';
import { Calculator } from './Calculator';

async function clickSequence(
  user: ReturnType<typeof userEvent.setup>,
  labels: string[]
) {
  for (const label of labels) {
    await user.click(screen.getByRole('button', { name: label, exact: true }));
  }
}

describe('Calculator', () => {
  it('renders the calculator shell and its controls', () => {
    render(<Calculator />);

    expect(screen.getByText('Calculator')).toBeVisible();
    expect(screen.getByRole('button', { name: 'EN' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'ES' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'PT' })).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('0');
  });

  it('performs a simple addition flow', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await clickSequence(user, ['2', '+', '3', '=']);

    expect(screen.getByRole('status')).toHaveTextContent('5');
  });

  it('switches language and shows localized errors', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole('button', { name: 'ES' }));
    await clickSequence(user, ['1', '÷', '0', '=']);

    expect(screen.getByText('Calculadora')).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('No se puede dividir por cero');
  });

  it('supports memory store, recall, and clear', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await clickSequence(user, ['7', 'MS']);
    await user.click(screen.getByRole('button', { name: 'C' }));

    expect(screen.getByRole('status')).toHaveTextContent('0');

    await user.click(screen.getByRole('button', { name: 'MR' }));
    expect(screen.getByRole('status')).toHaveTextContent('7');

    await user.click(screen.getByRole('button', { name: 'MC' }));
    expect(screen.getByRole('button', { name: 'MR' })).toBeDisabled();
  });

  it('supports CE for normal and error states', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await clickSequence(user, ['1', '+', '2', 'CE']);
    expect(screen.getByRole('status')).toHaveTextContent('0');

    await clickSequence(user, ['1', '÷', '0', '=']);
    expect(screen.getByRole('status')).toHaveTextContent('Cannot divide by zero');

    await user.click(screen.getByRole('button', { name: 'CE' }));
    expect(screen.getByRole('status')).toHaveTextContent('0');
  });

  it('supports clear entry, backspace, and decimal input', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await clickSequence(user, ['1', '2', '3']);
    await user.click(screen.getByRole('button', { name: '⌫' }));
    expect(screen.getByRole('status')).toHaveTextContent('12');

    await user.click(screen.getByRole('button', { name: '.' }));
    await user.click(screen.getByRole('button', { name: '.' }));
    expect(screen.getByRole('status')).toHaveTextContent('12.');

    await user.click(screen.getByRole('button', { name: 'C' }));
    expect(screen.getByRole('status')).toHaveTextContent('0');
  });

  it('resets a single positive digit when backspacing', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await clickSequence(user, ['5', '⌫']);

    expect(screen.getByRole('status')).toHaveTextContent('0');
  });

  it('resets a negative single-digit value when backspacing', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await clickSequence(user, ['5', '±', '⌫']);

    expect(screen.getByRole('status')).toHaveTextContent('0');
  });

  it('supports percentage calculations with and without an operator', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await clickSequence(user, ['5', '0', '%']);
    expect(screen.getByRole('status')).toHaveTextContent('0');

    await clickSequence(user, ['5', '0', '+', '1', '0', '%', '=']);
    expect(screen.getByRole('status')).toHaveTextContent('50.1');
  });

  it('supports square, cube, roots, reciprocal, constants, and factorial', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await clickSequence(user, ['9', 'x²']);
    expect(screen.getByRole('status')).toHaveTextContent('81');

    await user.click(screen.getByRole('button', { name: 'C' }));
    await clickSequence(user, ['3', 'x³']);
    expect(screen.getByRole('status')).toHaveTextContent('27');

    await user.click(screen.getByRole('button', { name: 'C' }));
    await clickSequence(user, ['2', '7', '³√x']);
    expect(screen.getByRole('status')).toHaveTextContent('3');

    await user.click(screen.getByRole('button', { name: 'C' }));
    await clickSequence(user, ['4', '1/x']);
    expect(screen.getByRole('status')).toHaveTextContent('0.25');

    await user.click(screen.getByRole('button', { name: 'C' }));
    await clickSequence(user, ['0', '1/x']);
    expect(screen.getByRole('status')).toHaveTextContent('Cannot divide by zero');

    await user.click(screen.getByRole('button', { name: 'C' }));
    await clickSequence(user, ['π']);
    expect(screen.getByRole('status')).toHaveTextContent('3.14159265359');

    await user.click(screen.getByRole('button', { name: 'C' }));
    await clickSequence(user, ['e']);
    expect(screen.getByRole('status')).toHaveTextContent('2.71828182846');

    await user.click(screen.getByRole('button', { name: 'C' }));
    await clickSequence(user, ['5', 'n!']);
    expect(screen.getByRole('status')).toHaveTextContent('120');
  });

  it('shows invalid root and factorial states', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await clickSequence(user, ['9', '±', '²√x']);
    expect(screen.getByRole('status')).toHaveTextContent(
      'Invalid number for square root'
    );

    await user.click(screen.getByRole('button', { name: 'C' }));
    await clickSequence(user, ['5', '±', 'n!']);
    expect(screen.getByRole('status')).toHaveTextContent(
      'Invalid number for factorial'
    );

    await user.click(screen.getByRole('button', { name: 'C' }));
    await clickSequence(user, ['1', '7', '1', 'n!']);
    expect(screen.getByRole('status')).toHaveTextContent(
      'Invalid number for factorial'
    );
  });

  it('supports repeated equals and operator chaining', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole('button', { name: '=' }));
    expect(screen.getByRole('status')).toHaveTextContent('0');

    await clickSequence(user, ['5', '-', '2', '=']);
    expect(screen.getByRole('status')).toHaveTextContent('3');

    await user.click(screen.getByRole('button', { name: '4' }));
    expect(screen.getByRole('status')).toHaveTextContent('4');

    await clickSequence(user, ['+', '6', '=']);
    expect(screen.getByRole('status')).toHaveTextContent('10');

    await clickSequence(user, ['=', '=']);
    expect(screen.getByRole('status')).toHaveTextContent('22');

    await clickSequence(user, ['5', '+', '2', '×']);
    expect(screen.getByRole('status')).toHaveTextContent('7');

    await clickSequence(user, ['4', '=']);
    expect(screen.getByRole('status')).toHaveTextContent('28');
  });

  it('shows divide by zero when chaining from an intermediate result', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await clickSequence(user, ['5', '÷', '0', '+']);

    expect(screen.getByRole('status')).toHaveTextContent('Cannot divide by zero');
  });

  it('switches to the infinity state for very large results', async () => {
    render(<Calculator />);

    const nineButton = screen.getByRole('button', { name: '9', exact: true });

    for (let index = 0; index < 104; index += 1) {
      fireEvent.click(nineButton);
    }

    fireEvent.click(screen.getByRole('button', { name: 'x³' }));

    expect(screen.getByRole('status')).toHaveTextContent('Infinity');
  });

  it('shows negative infinity for large negative cubic results', async () => {
    render(<Calculator />);

    const nineButton = screen.getByRole('button', { name: '9', exact: true });

    for (let index = 0; index < 104; index += 1) {
      fireEvent.click(nineButton);
    }

    fireEvent.click(screen.getByRole('button', { name: '±' }));
    fireEvent.click(screen.getByRole('button', { name: 'x³' }));

    expect(screen.getByRole('status')).toHaveTextContent('-Infinity');
  });
});
