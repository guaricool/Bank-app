"use client";

import { useLanguage } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div style={{
      display: 'flex',
      borderRadius: '980px',
      border: '1px solid rgba(255,255,255,0.15)',
      overflow: 'hidden',
      fontSize: '0.8rem',
      fontWeight: 500,
    }}>
      <button
        onClick={() => setLang('en')}
        style={{
          padding: '0.35rem 0.7rem',
          background: lang === 'en' ? 'rgba(0,113,227,0.8)' : 'transparent',
          color: lang === 'en' ? '#fff' : 'rgba(255,255,255,0.6)',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          letterSpacing: '0.02em',
        }}
      >
        EN
      </button>
      <button
        onClick={() => setLang('es')}
        style={{
          padding: '0.35rem 0.7rem',
          background: lang === 'es' ? 'rgba(0,113,227,0.8)' : 'transparent',
          color: lang === 'es' ? '#fff' : 'rgba(255,255,255,0.6)',
          border: 'none',
          borderLeft: '1px solid rgba(255,255,255,0.15)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          letterSpacing: '0.02em',
        }}
      >
        ES
      </button>
    </div>
  );
}
