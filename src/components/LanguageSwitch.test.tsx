import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { LanguageSwitch } from './LanguageSwitch';

describe('LanguageSwitch', () => {
  it('highlights the active language and emits selections', async () => {
    const user = userEvent.setup();
    const onChangeLanguage = vi.fn();

    render(
      <LanguageSwitch
        languages={[
          { key: 'en-US', label: 'EN', active: true },
          { key: 'es-ES', label: 'ES', active: false },
        ]}
        onChangeLanguage={onChangeLanguage}
      />
    );

    expect(screen.getByRole('button', { name: 'EN' })).toHaveClass(
      'calculator-language-active'
    );
    expect(screen.getByRole('button', { name: 'ES' })).not.toHaveClass(
      'calculator-language-active'
    );

    await user.click(screen.getByRole('button', { name: 'ES' }));

    expect(onChangeLanguage).toHaveBeenCalledWith('es-ES');
  });
});
