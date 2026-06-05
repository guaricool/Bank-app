'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { TextureCard } from '@/components/ui/TextureCard';
import { GradientAnimation } from '@/components/ui/GradientAnimation';
import { useT } from '@/lib/i18n';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const t = useT();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg(t('login.errorInvalid'));
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setErrorMsg(t('login.errorGeneric'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.pageContainer} force-dark-theme`}>
      <GradientAnimation />
      
      <div className={styles.contentWrapper}>
        <div className={styles.branding}>
          <h1>{t('login.brand')}</h1>
          <p>{t('login.tagline')}</p>
        </div>

        <TextureCard className={styles.loginCard}>
          <div className={styles.cardHeader}>
            <h2>{t('login.welcome')}</h2>
            <p>{t('login.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {errorMsg && <div className={styles.errorMessage} style={{color: 'red', marginBottom: '1rem', fontSize: '0.875rem'}}>{errorMsg}</div>}
            <div className={styles.inputGroup}>
              <label htmlFor="email">{t('login.email')}</label>
              <input 
                type="email" 
                id="email" 
                placeholder={t('login.emailPlaceholder')} 
                required 
                className="focus-ring"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password">{t('login.password')}</label>
              <input 
                type="password" 
                id="password" 
                placeholder={t('login.passwordPlaceholder')} 
                required 
                className="focus-ring"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className={styles.forgotPassword}>
              <Link href="/forgot-password">{t('login.forgotPassword')}</Link>
            </div>

            <button 
              type="submit" 
              className={`${styles.submitButton} focus-ring`}
              disabled={isLoading}
            >
              {isLoading ? t('login.signingIn') : t('login.signInBtn')}
            </button>
          </form>

          <div className={styles.cardFooter}>
            <p>
              {t('login.noAccount')} <Link href="/register">{t('login.signUpLink')}</Link>
            </p>
          </div>
        </TextureCard>
      </div>
    </div>
  );
}
