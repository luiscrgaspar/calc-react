import { translate } from './i18n';

describe('i18n', () => {
  it('returns an empty string for an empty translation key', () => {
    expect(translate('en-US', '')).toBe('');
  });

  it('returns localized messages', () => {
    expect(translate('es-ES', 'calculator')).toBe('Calculadora');
    expect(translate('pt-PT', 'divided_by_zero')).toBe(
      'Não é possível dividir por zero'
    );
  });
});
