import type { Language } from '../types';

interface Props {
  languages: Language[];
  onChangeLanguage: (language: Language['key']) => void;
}

export function LanguageSwitch({ languages, onChangeLanguage }: Props) {
  return (
    <div className="calculator-languages">
      {languages.map((language) => (
        <button
          key={language.key}
          type="button"
          className={[
            'calculator-language',
            language.active ? 'calculator-language-active' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => onChangeLanguage(language.key)}
        >
          {language.label}
        </button>
      ))}
    </div>
  );
}
