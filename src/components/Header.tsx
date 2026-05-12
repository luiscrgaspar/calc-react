interface Props {
  title: string;
  displayValue: string;
  error: string;
}

export function Header({ title, displayValue, error }: Props) {
  return (
    <div className="calculator-header">
      <span className="calculator-header-title">{title}</span>
      <div className="calculator-header-result">
        <span
          data-testid="result"
          role="status"
          aria-live={error ? 'assertive' : 'polite'}
          aria-atomic="true"
          className={[
            'calculator-header-result-text',
            error ? 'calculator-header-result-text--error' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {displayValue}
        </span>
      </div>
    </div>
  );
}
