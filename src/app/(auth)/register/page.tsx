'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TextureCard } from '@/components/ui/TextureCard';
import { GradientAnimation } from '@/components/ui/GradientAnimation';
import styles from './register.module.css';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className={styles.pageContainer}>
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
            <div className={styles.nameRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="firstName">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  placeholder="John" 
                  required 
                  className="focus-ring"
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
