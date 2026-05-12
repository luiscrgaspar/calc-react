import type { CalculatorButton } from '../types';

interface Props {
  buttons: CalculatorButton[];
}

export function CalculatorRow({ buttons }: Props) {
  return (
    <div className="calculator-row">
      {buttons.map((button) => (
        <button
          key={button.id}
          type="button"
          className={button.className ?? 'calculator-button'}
          disabled={button.disabled ?? false}
          onClick={button.onClick}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}
