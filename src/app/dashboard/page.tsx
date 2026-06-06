'use client';

import React, { useEffect, useState } from 'react';
import { Wallet, TrendingDown, Target, RefreshCw, ArrowUpRight, ArrowDownLeft, Users, Plus } from 'lucide-react';
import { TextureCard } from '@/components/ui/TextureCard';
import AccountsList from '@/components/AccountsList';
import { useT } from '@/lib/i18n';
import styles from './page.module.css';

export default function DashboardPage() {
  const t = useT();
  const [metrics, setMetrics] = useState({ balance: 0, expenses: 0, savingsGoal: 0 });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchDashboardData = () => {
    Promise.all([
      fetch('/api/plaid/accounts').then(r => r.json()),
      fetch('/api/transactions').then(r => r.json()),
    ]).then(([accountsData, txData]) => {
      let balance = 0;
      let totalLiabilities = 0;

      if (accountsData.success && accountsData.data) {
        const assets = accountsData.data.assets || [];
        balance = assets.reduce(
          (sum: number, acc: any) => sum + (acc.availableBalance || acc.currentBalance || 0),
          0
        );
        const liabilities = accountsData.data.liabilities || [];
        totalLiabilities = liabilities.reduce(
          (sum: number, acc: any) => sum + (acc.currentBalance || 0),
          0
        );
      }

      let expenses = 0;
      if (txData.transactions) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);

        expenses = txData.transactions.reduce((sum: number, tx: any) => {
          const txDate = new Date(tx.date);
          if (txDate >= cutoff && tx.amount > 0) return sum + tx.amount;
          return sum;
        }, 0);

        setRecentTransactions(txData.transactions.slice(0, 5));
      }

      // Net Worth = total assets − total liabilities
      setMetrics({ balance, expenses, savingsGoal: balance - totalLiabilities });
    }).catch(console.error);
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await fetch('/api/plaid/sync', { method: 'POST' });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div>
      <div className={styles.dashboardGrid}>
        <TextureCard className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <h3 className={styles.metricLabel}>{t('dashboard.totalBalance')}</h3>
            <div className={styles.metricIcon}>
              <Wallet size={18} strokeWidth={1.8} />
            </div>
          </div>
          <div className={styles.metricValue}>${metrics.balance.toFixed(2)}</div>
        </TextureCard>

        <TextureCard className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <h3 className={styles.metricLabel}>{t('dashboard.monthlyExpenses')}</h3>
            <div className={styles.metricIcon}>
              <TrendingDown size={18} strokeWidth={1.8} />
            </div>
          </div>
          <div className={styles.metricValue}>${metrics.expenses.toFixed(2)}</div>
        </TextureCard>

        <TextureCard className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <h3 className={styles.metricLabel}>Net Worth</h3>
            <div className={styles.metricIcon}>
              <Target size={18} strokeWidth={1.8} />
            </div>
          </div>
          <div
            className={styles.metricValue}
            style={{ color: metrics.savingsGoal < 0 ? '#f87171' : '#ffffff' }}
          >
            {metrics.savingsGoal < 0 ? '-' : ''}${Math.abs(metrics.savingsGoal).toFixed(0)}
          </div>
        </TextureCard>
      </div>

      <AccountsList />

      <div className={styles.dashboardMainGrid}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className={styles.sectionTitle}>{t('dashboard.recentTransactions')}</h2>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className={styles.syncButton}
            >
              <RefreshCw size={14} strokeWidth={2} className={isSyncing ? styles.spinning : ''} />
              {isSyncing ? 'Syncing...' : 'Sync'}
            </button>
          </div>
          <TextureCard>
            {recentTransactions.length > 0 ? (
              <div className={styles.transactionList}>
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className={styles.transactionItem}>
                    <div className={styles.txInfo}>
                      <div className={styles.txIcon}>
                        {tx.amount < 0
                          ? <ArrowDownLeft size={20} strokeWidth={1.8} color="#4ade80" />
                          : <ArrowUpRight size={20} strokeWidth={1.8} color="rgba(255,255,255,0.6)" />
                        }
                      </div>
                      <div className={styles.txDetails}>
                        <div className={styles.txName}>{tx.merchantName || tx.name}</div>
                        <div className={styles.txDate}>{new Date(tx.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className={styles.txRight}>
                      <div
                        className={styles.txAmount}
                        style={{ color: tx.amount < 0 ? '#4ade80' : '#ffffff' }}
                      >
                        {tx.amount < 0 ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                <p>No transactions yet.</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Link your bank account to see your activity here.
                </p>
              </div>
            )}
          </TextureCard>
        </div>

        <div>
          <h2 className={styles.sectionTitle}>{t('dashboard.quickTransfer')}</h2>
          <TextureCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {['J', 'M', 'L'].map((initial) => (
                  <div key={initial} className={styles.transferAvatar}>{initial}</div>
                ))}
                <div className={`${styles.transferAvatar} ${styles.transferAvatarAdd}`}>
                  <Plus size={16} strokeWidth={2} />
                </div>
              </div>
              <div className={styles.transferAmountRow}>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{t('dashboard.amount')}</span>
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2rem' }}>$0.00</span>
              </div>
              <button className={styles.sendMoneyBtn}>{t('dashboard.sendMoney')}</button>
            </div>
          </TextureCard>

          <h2 className={styles.sectionTitle} style={{ marginTop: '2rem' }}>Debt Payoff Plan</h2>
          <TextureCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                Get personalized recommendations to pay off your credit cards and loans faster.
              </p>
              <a href="/dashboard/debts" style={{ display: 'block', textDecoration: 'none' }}>
                <button className={styles.debtBtn}>View Debt Recommendations</button>
              </a>
            </div>
          </TextureCard>
        </div>
      </div>
    </div>
  );
}
