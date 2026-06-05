import React from 'react';
import { TextureCard } from '@/components/ui/TextureCard';
import AccountsList from '@/components/AccountsList';
import styles from './page.module.css';

export default function DashboardPage() {
  return (
    <div>
      <div className={styles.dashboardGrid}>
        <TextureCard className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <h3 className={styles.metricLabel}>Total Balance</h3>
            <div className={styles.metricIcon}>💰</div>
          </div>
          <div className={styles.metricValue}>$24,500.00</div>
          <div className={`${styles.metricChange} ${styles.positive}`}>
            <span>↑</span> +2.4% from last month
          </div>
        </TextureCard>
        
        <TextureCard className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <h3 className={styles.metricLabel}>Monthly Expenses</h3>
            <div className={styles.metricIcon}>📉</div>
          </div>
          <div className={styles.metricValue}>$3,240.50</div>
          <div className={`${styles.metricChange} ${styles.positive}`}>
            <span>↓</span> -1.2% from last month
          </div>
        </TextureCard>

        <TextureCard className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <h3 className={styles.metricLabel}>Savings Goal</h3>
            <div className={styles.metricIcon}>🎯</div>
          </div>
          <div className={styles.metricValue}>$10,000.00</div>
          <div className={styles.metricChange}>
            65% achieved
          </div>
        </TextureCard>
      </div>

      <AccountsList />

      <div className={styles.dashboardMainGrid}>
        <div>
          <h2 className={styles.sectionTitle}>Recent Transactions</h2>
          <TextureCard>
            <div className={styles.transactionList}>
              <div className={styles.transactionItem}>
                <div className={styles.txInfo}>
                  <div className={styles.txIcon}>🛒</div>
                  <div className={styles.txDetails}>
                    <div className={styles.txName}>Whole Foods Market</div>
                    <div className={styles.txDate}>Today, 2:45 PM</div>
                  </div>
                </div>
                <div className={`${styles.txAmount} ${styles.negative}`}>-$124.50</div>
              </div>
              <div className={styles.transactionItem}>
                <div className={styles.txInfo}>
                  <div className={styles.txIcon}>☕</div>
                  <div className={styles.txDetails}>
                    <div className={styles.txName}>Starbucks</div>
                    <div className={styles.txDate}>Yesterday, 9:20 AM</div>
                  </div>
                </div>
                <div className={`${styles.txAmount} ${styles.negative}`}>-$5.40</div>
              </div>
              <div className={styles.transactionItem}>
                <div className={styles.txInfo}>
                  <div className={styles.txIcon}>💼</div>
                  <div className={styles.txDetails}>
                    <div className={styles.txName}>Salary Deposit</div>
                    <div className={styles.txDate}>Mon, 1:00 AM</div>
                  </div>
                </div>
                <div className={`${styles.txAmount} ${styles.positive}`}>+$4,250.00</div>
              </div>
              <div className={styles.transactionItem}>
                <div className={styles.txInfo}>
                  <div className={styles.txIcon}>🎬</div>
                  <div className={styles.txDetails}>
                    <div className={styles.txName}>Netflix Subscription</div>
                    <div className={styles.txDate}>Sun, 10:00 AM</div>
                  </div>
                </div>
                <div className={`${styles.txAmount} ${styles.negative}`}>-$15.99</div>
              </div>
            </div>
          </TextureCard>
        </div>
        
        <div>
          <h2 className={styles.sectionTitle}>Quick Transfer</h2>
          <TextureCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div className={styles.txIcon}>👨</div>
                <div className={styles.txIcon}>👩</div>
                <div className={styles.txIcon}>👦</div>
                <div className={styles.txIcon} style={{ background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }}>+</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Amount</span>
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2rem' }}>$0.00</span>
              </div>
              <button style={{ background: '#fff', color: '#000', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255, 255, 255, 0.15)' }}>
                Send Money
              </button>
            </div>
          </TextureCard>
        </div>
      </div>
    </div>
  );
}
