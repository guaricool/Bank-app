'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  ShoppingCart, UtensilsCrossed, Fuel, Home, CreditCard,
  ArrowDownLeft, ArrowUpRight, Wifi, Car, Briefcase, MoreHorizontal,
} from 'lucide-react';
import { TextureCard } from '@/components/ui/TextureCard';
import { useT } from '@/lib/i18n';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import styles from './page.module.css';

type FilterType = 'all' | 'income' | 'expenses';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Grocery:       <ShoppingCart size={20} strokeWidth={1.8} />,
  Dining:        <UtensilsCrossed size={20} strokeWidth={1.8} />,
  Gas:           <Fuel size={20} strokeWidth={1.8} />,
  Housing:       <Home size={20} strokeWidth={1.8} />,
  Transport:     <Car size={20} strokeWidth={1.8} />,
  Internet:      <Wifi size={20} strokeWidth={1.8} />,
  Income:        <Briefcase size={20} strokeWidth={1.8} />,
  Other:         <MoreHorizontal size={20} strokeWidth={1.8} />,
};

const CHART_COLORS = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b',
  '#ef4444', '#06b6d4', '#84cc16', '#f97316',
];

function getCategoryIcon(category: string) {
  return CATEGORY_ICONS[category] ?? <CreditCard size={20} strokeWidth={1.8} />;
}

export default function TransactionsPage() {
  const t = useT();
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [grouped, setGrouped] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    fetch('/api/transactions')
      .then(res => res.json())
      .then(data => {
        if (data.transactions) setAllTransactions(data.transactions);
        if (data.grouped) setGrouped(data.grouped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filter the full transaction list
  const filteredTransactions = useMemo(() => {
    if (filter === 'income') return allTransactions.filter(tx => tx.amount < 0);
    if (filter === 'expenses') return allTransactions.filter(tx => tx.amount > 0);
    return allTransactions;
  }, [allTransactions, filter]);

  // Re-group filtered transactions
  const filteredGrouped = useMemo(() => {
    if (filter === 'all') return grouped;
    const result: Record<string, any[]> = {};
    filteredTransactions.forEach(tx => {
      const cat = tx.personalFinanceCategoryPrimary || tx.personalFinanceCategory || 'Other';
      if (!result[cat]) result[cat] = [];
      result[cat].push(tx);
    });
    return result;
  }, [filter, filteredTransactions, grouped]);

  // Spending breakdown for chart — expenses only
  const chartData = useMemo(() => {
    const expensesByCategory: Record<string, number> = {};
    allTransactions.forEach(tx => {
      if (tx.amount > 0) {
        const cat = tx.personalFinanceCategoryPrimary || tx.personalFinanceCategory || 'Other';
        expensesByCategory[cat] = (expensesByCategory[cat] ?? 0) + tx.amount;
      }
    });
    return Object.entries(expensesByCategory)
      .map(([name, total]) => ({ name, total: Math.round(total) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [allTransactions]);

  const totalExpenses = useMemo(
    () => allTransactions.filter(tx => tx.amount > 0).reduce((s, tx) => s + tx.amount, 0),
    [allTransactions]
  );
  const totalIncome = useMemo(
    () => allTransactions.filter(tx => tx.amount < 0).reduce((s, tx) => s + Math.abs(tx.amount), 0),
    [allTransactions]
  );

  return (
    <div className={styles.container}>

      {/* Summary chips */}
      {!loading && allTransactions.length > 0 && (
        <div className={styles.summaryRow}>
          <div className={styles.summaryChip}>
            <ArrowDownLeft size={14} strokeWidth={2} style={{ color: '#4ade80' }} />
            <span>Income</span>
            <strong style={{ color: '#4ade80' }}>${totalIncome.toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong>
          </div>
          <div className={styles.summaryChip}>
            <ArrowUpRight size={14} strokeWidth={2} style={{ color: '#f87171' }} />
            <span>Expenses</span>
            <strong style={{ color: '#f87171' }}>${totalExpenses.toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong>
          </div>
          <div className={styles.summaryChip}>
            <span>Net</span>
            <strong style={{ color: totalIncome - totalExpenses >= 0 ? '#4ade80' : '#f87171' }}>
              ${Math.abs(totalIncome - totalExpenses).toLocaleString('en-US', { maximumFractionDigits: 0 })}
              {totalIncome - totalExpenses < 0 ? ' deficit' : ' surplus'}
            </strong>
          </div>
        </div>
      )}

      {/* Spending chart */}
      {!loading && chartData.length > 0 && (
        <TextureCard className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Spending by Category</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                <XAxis
                  type="number"
                  tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }}
                  tickFormatter={v => `$${v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v}`}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: 'rgba(255,255,255,0.65)', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={90}
                />
                <Tooltip
                  contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                  formatter={(v: any) => [`$${Number(v).toLocaleString()}`, 'Spent']}
                />
                <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TextureCard>
      )}

      {/* Filter tabs */}
      <div className={styles.filters}>
        {(['all', 'income', 'expenses'] as FilterType[]).map(f => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? t('transactions.all') : f === 'income' ? t('transactions.income') : t('transactions.expenses')}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: 'rgba(255,255,255,0.5)', padding: '1rem 0' }}>Loading transactions...</p>
      ) : filteredTransactions.length === 0 ? (
        <TextureCard>
          <p style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
            No transactions found.
          </p>
        </TextureCard>
      ) : (
        Object.entries(filteredGrouped).map(([category, txs]) => (
          <div key={category}>
            <h3 className={styles.categoryHeader}>
              {category}
              <span className={styles.categoryCount}>{txs.length}</span>
            </h3>
            <TextureCard>
              <div className={styles.transactionList}>
                {txs.map((tx) => (
                  <div key={tx.id} className={styles.transactionItem}>
                    <div className={styles.txInfo}>
                      <div className={styles.txIcon}>
                        {tx.amount < 0
                          ? <ArrowDownLeft size={20} strokeWidth={1.8} color="#4ade80" />
                          : getCategoryIcon(category)
                        }
                      </div>
                      <div className={styles.txDetails}>
                        <div className={styles.txName}>{tx.merchantName || tx.name}</div>
                        <div className={styles.txDate}>{new Date(tx.date).toLocaleDateString()}</div>
                        <span className={styles.txCategory}>{category}</span>
                      </div>
                    </div>
                    <div className={styles.txRight}>
                      <div
                        className={styles.txAmount}
                        style={{ color: tx.amount < 0 ? '#4ade80' : '#ffffff' }}
                      >
                        {tx.amount < 0 ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                      </div>
                      <div className={styles.txStatus}>
                        {tx.pending ? t('transactions.pending') : t('transactions.completed')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TextureCard>
          </div>
        ))
      )}
    </div>
  );
}
