'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { GradientAnimation } from '@/components/ui/GradientAnimation';
import styles from './layout.module.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className={`${styles.dashboardWrapper} force-dark-theme`}>
      <GradientAnimation />
      <aside className={`${styles.sidebar} glass-panel`}>
        <nav className={styles.nav}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>🏦</span>
            Family Finance
          </div>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <a href="/dashboard" className={`${styles.navLink} ${pathname === '/dashboard' ? styles.active : ''}`}>Overview</a>
            </li>
            <li className={styles.navItem}>
              <a href="/dashboard/transactions" className={`${styles.navLink} ${pathname === '/dashboard/transactions' ? styles.active : ''}`}>Transactions</a>
            </li>
            <li className={styles.navItem}>
              <a href="/dashboard/cards" className={`${styles.navLink} ${pathname === '/dashboard/cards' ? styles.active : ''}`}>Cards</a>
            </li>
            <li className={styles.navItem}>
              <a href="/dashboard/settings" className={`${styles.navLink} ${pathname === '/dashboard/settings' ? styles.active : ''}`}>Settings</a>
            </li>
          </ul>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <div className={styles.userProfile}>
            <div className={styles.userAvatar}>JD</div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>John Doe</div>
              <div className={styles.userPlan}>Premium</div>
            </div>
          </div>
        </div>
      </aside>
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <div className={styles.headerActions}>
            <button className={styles.iconButton}>🔔</button>
            <button className={styles.primaryButton}>+ Send Money</button>
          </div>
        </header>
        <div className={styles.contentContainer}>
          {children}
        </div>
      </main>
    </div>
  );
}
