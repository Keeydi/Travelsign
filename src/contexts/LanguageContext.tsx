import React, { createContext, useContext, useEffect, useState } from 'react';
import { getTranslationLanguage, setTranslationLanguage, type TranslationLanguageCode } from '../services/preferences';
import { getStrings, type StringKeys } from '../i18n/strings';

type LanguageContextValue = {
  language: TranslationLanguageCode;
  setLanguage: (code: TranslationLanguageCode) => void;
  t: Record<StringKeys, string>;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<TranslationLanguageCode>('en');

  useEffect(() => {
    getTranslationLanguage().then(setLanguageState);
  }, []);

  const setLanguage = (code: TranslationLanguageCode) => {
    setLanguageState(code);
    setTranslationLanguage(code).catch(() => {});
  };

  const t = getStrings(language);
  const value: LanguageContextValue = { language, setLanguage, t };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    const { getStrings } = require('../i18n/strings');
    return {
      language: 'en',
      setLanguage: () => {},
      t: getStrings('en'),
    };
  }
  return ctx;
}
