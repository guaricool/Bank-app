'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { TextureCard } from '@/components/ui/TextureCard';
import { GradientAnimation } from '@/components/ui/GradientAnimation';
import styles from './register.module.css';

export default function RegisterPage() {
  const router = useRouter();
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
        setErrorMsg(data.error || 'Registration failed');
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
        setErrorMsg('Registered, but login failed. Please sign in manually.');
        setIsLoading(false);
      } else {
        router.push('/onboarding');
      }
    } catch (error) {
      setErrorMsg('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.pageContainer} force-dark-theme`}>
      <GradientAnimation />
      
      <div className={styles.contentWrapper}>
        <div className={styles.branding}>
          <h1>Family Finance</h1>
          <p>Join us to take control of your future.</p>
        </div>

        <TextureCard className={styles.registerCard}>
          <div className={styles.cardHeader}>
            <h2>Create Account</h2>
            <p>Set up your family workspace</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {errorMsg && <div className={styles.errorMessage} style={{color: 'red', marginBottom: '1rem', fontSize: '0.875rem'}}>{errorMsg}</div>}
            <div className={styles.nameRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="firstName">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  placeholder="John" 
                  required 
                  className="focus-ring"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="lastName">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  placeholder="Doe" 
                  required 
                  className="focus-ring"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

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
                placeholder="Create a strong password" 
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
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
            
            <p className={styles.terms}>
              By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </p>
          </form>

          <div className={styles.cardFooter}>
            <p>
              Already have an account? <Link href="/login">Sign in</Link>
            </p>
          </div>
        </TextureCard>
      </div>
    </div>
  );
}
