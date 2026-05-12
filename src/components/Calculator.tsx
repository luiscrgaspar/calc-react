import { Header } from './Header';
import { LanguageSwitch } from './LanguageSwitch';
import { CalculatorRow } from './CalculatorRow';
import { translate } from '../i18n';
import { useCalculator } from '../features/calculator/useCalculator';

export function Calculator() {
  const calculator = useCalculator();

  return (
    <section className="calculator">
      <LanguageSwitch
        languages={calculator.languages}
        onChangeLanguage={calculator.handleLanguageChange}
      />
      <div className="calculator-shell">
        <Header
          title={translate(calculator.currentLanguage, 'calculator')}
          displayValue={calculator.displayValue}
          error={calculator.error}
        />
        {calculator.buttonRows.map((buttons) => (
          <CalculatorRow key={buttons[0].id} buttons={buttons} />
        ))}
      </div>
    </section>
  );
}
