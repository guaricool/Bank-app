'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { GradientAnimation } from '@/components/ui/GradientAnimation';
import { useT } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import styles from './layout.module.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const t = useT();

  return (
    <div className={`${styles.dashboardWrapper} force-dark-theme`}>
      <GradientAnimation />
      <aside className={`${styles.sidebar} glass-panel`}>
        <nav className={styles.nav}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>🏦</span>
            {t('nav.brand').replace('💰 ', '')}
          </div>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <a href="/dashboard" className={`${styles.navLink} ${pathname === '/dashboard' ? styles.active : ''}`}>{t('nav.overview')}</a>
            </li>
            <li className={styles.navItem}>
              <a href="/dashboard/transactions" className={`${styles.navLink} ${pathname === '/dashboard/transactions' ? styles.active : ''}`}>{t('nav.transactions')}</a>
            </li>
            <li className={styles.navItem}>
              <a href="/dashboard/cards" className={`${styles.navLink} ${pathname === '/dashboard/cards' ? styles.active : ''}`}>{t('nav.cards')}</a>
            </li>
            <li className={styles.navItem}>
              <a href="/dashboard/settings" className={`${styles.navLink} ${pathname === '/dashboard/settings' ? styles.active : ''}`}>{t('nav.settings')}</a>
            </li>
          </ul>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <div className={styles.userProfile}>
            <div className={styles.userAvatar}>JD</div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>John Doe</div>
              <div className={styles.userPlan}>{t('nav.premium')}</div>
            </div>
          </div>
        </div>
      </aside>
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>{t('nav.dashboard')}</h1>
          <div className={styles.headerActions} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <LanguageSwitcher />
            <button className={styles.iconButton}>🔔</button>
            <button className={styles.primaryButton}>{t('nav.sendMoney')}</button>
          </div>
        </header>
        <div className={styles.contentContainer}>
          {children}
        </div>
      </main>
    </div>
  );
}
