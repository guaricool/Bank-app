'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  CreditCard,
  Settings,
  TrendingDown,
  Bell,
  LogOut,
  Building2,
  SendHorizonal,
} from 'lucide-react';
import { GradientAnimation } from '@/components/ui/GradientAnimation';
import { useT } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n/en';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import styles from './layout.module.css';

const NAV_ITEMS: { href: string; label: TranslationKey; Icon: React.FC<{ size?: number; strokeWidth?: number; className?: string }> }[] = [
  { href: '/dashboard', label: 'nav.overview', Icon: LayoutDashboard },
  { href: '/dashboard/transactions', label: 'nav.transactions', Icon: ArrowLeftRight },
  { href: '/dashboard/cards', label: 'nav.cards', Icon: CreditCard },
  { href: '/dashboard/debts', label: 'nav.debts', Icon: TrendingDown },
  { href: '/dashboard/settings', label: 'nav.settings', Icon: Settings },
];

const PAGE_TITLES: Record<string, TranslationKey> = {
  '/dashboard': 'nav.overview',
  '/dashboard/transactions': 'nav.transactions',
  '/dashboard/cards': 'nav.cards',
  '/dashboard/debts': 'nav.debts',
  '/dashboard/settings': 'nav.settings',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const t = useT();

  const userName = session?.user?.name || session?.user?.email || 'User';
  const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const titleKey: TranslationKey = PAGE_TITLES[pathname] ?? 'nav.dashboard';

  return (
    <div className={`${styles.dashboardWrapper} force-dark-theme`}>
      <GradientAnimation />
      <aside className={`${styles.sidebar} glass-panel`}>
        <nav className={styles.nav}>
          <div className={styles.brand}>
            <Building2 size={22} strokeWidth={2} />
            {t('nav.brand').replace('💰 ', '')}
          </div>
          <ul className={styles.navList}>
            {NAV_ITEMS.map(({ href, label, Icon }) => (
              <li key={href} className={styles.navItem}>
                <a
                  href={href}
                  className={`${styles.navLink} ${pathname === href ? styles.active : ''}`}
                >
                  <Icon size={18} strokeWidth={1.8} className={styles.navIcon} />
                  {t(label)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userProfile}>
            <div className={styles.userAvatar}>{initials}</div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{userName}</div>
              <div className={styles.userPlan}>{t('nav.premium')}</div>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className={styles.logoutBtn}
          >
            <LogOut size={16} strokeWidth={1.8} />
            Logout
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>{t(titleKey)}</h1>
          <div className={styles.headerActions}>
            <LanguageSwitcher />
            <button className={styles.iconButton} aria-label="Notifications">
              <Bell size={18} strokeWidth={1.8} />
            </button>
            <button className={styles.primaryButton}>
              <SendHorizonal size={15} strokeWidth={2} />
              {t('nav.sendMoney')}
            </button>
          </div>
        </header>
        <div className={styles.contentContainer}>
          {children}
        </div>
      </main>
    </div>
  );
}
