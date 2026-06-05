'use client';

import React, { useEffect, useState } from 'react';
import { TextureCard } from '@/components/ui/TextureCard';
import { useT } from '@/lib/i18n';
import styles from './page.module.css';

export default function TransactionsPage() {
  const t = useT();
  const [groupedTransactions, setGroupedTransactions] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/transactions')
      .then(res => res.json())
      .then(data => {
        if (data.grouped) {
          setGroupedTransactions(data.grouped);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <button className={`${styles.filterBtn} ${styles.active}`}>{t('transactions.all')}</button>
        <button className={styles.filterBtn}>{t('transactions.income')}</button>
        <button className={styles.filterBtn}>{t('transactions.expenses')}</button>
      </div>

      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        Object.keys(groupedTransactions).length === 0 ? (
          <TextureCard>
            <p style={{ padding: '2rem', textAlign: 'center' }}>No transactions found.</p>
          </TextureCard>
        ) : (
          Object.entries(groupedTransactions).map(([category, txs]) => (
            <div key={category} style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: 'rgba(255,255,255,0.8)' }}>
                {category} ({txs.length})
              </h3>
              <TextureCard>
                <div className={styles.transactionList}>
                  {txs.map((tx) => (
                    <div key={tx.id} className={styles.transactionItem}>
                      <div className={styles.txInfo}>
                        <div className={styles.txIcon}>
                          {category === 'Grocery' ? '🛒' : 
                           category === 'Dining' ? '🍽️' : 
                           category === 'Gas' ? '⛽' : 
                           category === 'Housing' ? '🏠' : '💳'}
                        </div>
                        <div className={styles.txDetails}>
                          <div className={styles.txName}>{tx.merchantName || tx.name}</div>
                          <div className={styles.txDate}>{new Date(tx.date).toLocaleDateString()}</div>
                          <div><span className={styles.txCategory}>{category}</span></div>
                        </div>
                      </div>
                      <div className={styles.txRight}>
                        <div className={`${styles.txAmount} ${tx.amount < 0 ? styles.positive : styles.negative}`}>
                          {tx.amount < 0 ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                        </div>
                        <div className={styles.txStatus}>{tx.pending ? t('transactions.pending') : t('transactions.completed')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </TextureCard>
            </div>
          ))
        )
      )}
    </div>
  );
}

