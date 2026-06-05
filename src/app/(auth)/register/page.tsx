'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { TextureCard } from '@/components/ui/TextureCard';
import { GradientAnimation } from '@/components/ui/GradientAnimation';
import { useT } from '@/lib/i18n';
import styles from './register.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const t = useT();
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `${firstName} ${lastName}`, email, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setErrorMsg(data.error || t('register.errorRegFailed'));
        setIsLoading(false);
        return;
      }

      // Auto-login after registration
      const signInRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        setErrorMsg(t('register.errorLoginFailed'));
        setIsLoading(false);
      } else {
        router.push('/onboarding');
      }
    } catch (error) {
      setErrorMsg(t('register.errorGeneric'));
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.pageContainer} force-dark-theme`}>
      <GradientAnimation />
      
      <div className={styles.contentWrapper}>
        <div className={styles.branding}>
          <h1>{t('register.brand')}</h1>
          <p>{t('register.tagline')}</p>
        </div>

        <TextureCard className={styles.registerCard}>
          <div className={styles.cardHeader}>
            <h2>{t('register.title')}</h2>
            <p>{t('register.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {errorMsg && <div className={styles.errorMessage} style={{color: 'red', marginBottom: '1rem', fontSize: '0.875rem'}}>{errorMsg}</div>}
            <div className={styles.nameRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="firstName">{t('register.firstName')}</label>
                <input 
                  type="text" 
                  id="firstName" 
                  placeholder={t('register.firstNamePlaceholder')} 
                  required 
                  className="focus-ring"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="lastName">{t('register.lastName')}</label>
                <input 
                  type="text" 
                  id="lastName" 
                  placeholder={t('register.lastNamePlaceholder')} 
                  required 
                  className="focus-ring"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">{t('register.email')}</label>
              <input 
                type="email" 
                id="email" 
                placeholder={t('register.emailPlaceholder')} 
                required 
                className="focus-ring"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password">{t('register.password')}</label>
              <input 
                type="password" 
                id="password" 
                placeholder={t('register.passwordPlaceholder')} 
                required 
                className="focus-ring"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className={`${styles.submitButton} focus-ring`}
              disabled={isLoading}
            >
              {isLoading ? t('register.creating') : t('register.signUpBtn')}
            </button>
            
            <p className={styles.terms}>
              {t('register.termsPrefix')}<a href="#">{t('register.termsLink')}</a> and <a href="#">{t('register.privacyLink')}</a>.
            </p>
          </form>

          <div className={styles.cardFooter}>
            <p>
              {t('register.hasAccount')} <Link href="/login">{t('register.signInLink')}</Link>
            </p>
          </div>
        </TextureCard>
      </div>
    </div>
  );
}
