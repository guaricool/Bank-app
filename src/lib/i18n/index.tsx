"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en, { TranslationKey } from './en';
import es from './es';

type Language = 'en' | 'es';

const dictionaries: Record<Language, Record<TranslationKey, string>> = { en, es };

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Language | null;
    if (saved && (saved === 'en' || saved === 'es')) {
      setLangState(saved);
    }
    setMounted(true);
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('lang', newLang);
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    return dictionaries[lang][key] || dictionaries['en'][key] || key;
  }, [lang]);

  // Prevent hydration mismatch by rendering with default lang until mounted
  const contextValue: LanguageContextType = {
    lang: mounted ? lang : 'en',
    setLang,
    t: mounted ? t : (key: TranslationKey) => dictionaries['en'][key] || key,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}

export function useT() {
  const { t } = useLanguage();
  return t;
}
