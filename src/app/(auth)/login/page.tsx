'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { TextureCard } from '@/components/ui/TextureCard';
import { GradientAnimation } from '@/components/ui/GradientAnimation';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
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
        setErrorMsg('Invalid email or password');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.pageContainer} force-dark-theme`}>
      <GradientAnimation />
      
      <div className={styles.contentWrapper}>
        <div className={styles.branding}>
          <h1>Family Finance</h1>
          <p>Your journey to financial freedom starts here.</p>
        </div>

        <TextureCard className={styles.loginCard}>
          <div className={styles.cardHeader}>
            <h2>Welcome Back</h2>
            <p>Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {errorMsg && <div className={styles.errorMessage} style={{color: 'red', marginBottom: '1rem', fontSize: '0.875rem'}}>{errorMsg}</div>}
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="you@example.com" 
                required 
                className="focus-ring"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••" 
                required 
                className="focus-ring"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className={styles.forgotPassword}>
              <Link href="/forgot-password">Forgot password?</Link>
            </div>

            <button 
              type="submit" 
              className={`${styles.submitButton} focus-ring`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className={styles.cardFooter}>
            <p>
              Don't have an account? <Link href="/register">Sign up</Link>
            </p>
          </div>
        </TextureCard>
      </div>
    </div>
  );
}
