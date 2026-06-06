'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  CreditCard,
  LayoutList,
  AlertTriangle,
  TrendingDown,
  Zap,
  Clock,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { TextureCard } from '@/components/ui/TextureCard';
import styles from './page.module.css';
import {
  runProjection,
  runSensitivityTable,
  detectMinimumPaymentTrap,
  getMinimumOnlyBaseline,
} from '@/lib/debtCalculator';
import type { Debt, PayoffStrategy } from '@/lib/debtCalculator';

function fmtMoney(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmtMonths(n: number): string {
  if (n >= 1200) return '100+ yrs';
  const yrs = Math.floor(n / 12);
  const mos = n % 12;
  if (yrs === 0) return `${mos}mo`;
  if (mos === 0) return `${yrs}yr`;
  return `${yrs}yr ${mos}mo`;
}

export default function DebtsPage() {
  const [liabilities, setLiabilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [strategy, setStrategy] = useState<PayoffStrategy>('AVALANCHE');
  const [extraPayment, setExtraPayment] = useState(0);

  useEffect(() => {
    fetch('/api/plaid/accounts')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.liabilities) {
          setLiabilities(data.data.liabilities);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Map API accounts → Debt objects the calculator understands.
  // Plaid stores apr as a percentage (e.g. 18.99), financialMath expects decimal (0.1899).
  const debts: Debt[] = useMemo(() =>
    liabilities
      .filter(acc => (acc.currentBalance || 0) > 0)
      .map(acc => ({
        id: acc.id,
        name: acc.name,
        balance: acc.currentBalance || 0,
        apr: ((acc.apr ?? 18.99) / 100),
        minimumPayment: acc.minimumPayment || Math.max(25, (acc.currentBalance || 0) * 0.02),
      })),
    [liabilities]
  );

  const totalDebt = useMemo(
    () => liabilities.reduce((sum, acc) => sum + (acc.currentBalance || 0), 0),
    [liabilities]
  );

  // Baseline (minimum-only) — only recalculates when debts or strategy change.
  const baseline = useMemo(() =>
    debts.length > 0 ? getMinimumOnlyBaseline(debts, strategy) : null,
    [debts, strategy]
  );

  // Projection with extra payment — recalculates on slider change but reuses baseline.
  const projection = useMemo(() => {
    if (!debts.length || !baseline) return null;
    return runProjection(debts, extraPayment, strategy, baseline);
  }, [debts, extraPayment, strategy, baseline]);

  // Sensitivity table — only changes when debts or strategy change.
  const sensitivityTable = useMemo(() =>
    debts.length > 0 ? runSensitivityTable(debts, strategy) : [],
    [debts, strategy]
  );

  const traps = useMemo(() =>
    debts.length > 0 ? detectMinimumPaymentTrap(debts) : [],
    [debts]
  );

  const hasTrap = traps.some(t => t.isTrap);
  const trapNames = traps.filter(t => t.isTrap).map(t => t.debtName);

  const sortedDebts = useMemo(() =>
    [...debts].sort((a, b) =>
      strategy === 'AVALANCHE' ? b.apr - a.apr : a.balance - b.balance
    ),
    [debts, strategy]
  );

  // Sampled timeline for the chart (every 3 months to limit data points)
  const chartData = useMemo(() => {
    if (!projection?.timeline) return [];
    return projection.timeline.filter(p => p.month % 3 === 0 || p.month === 1);
  }, [projection]);

  if (loading) {
    return <div className={styles.loading}>Loading debt recommendations...</div>;
  }

  return (
    <div>
      {/* Metric Cards */}
      <div className={styles.metricsRow}>
        <TextureCard className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <h3 className={styles.metricLabel}>Total Debt</h3>
            <div className={styles.metricIcon}><CreditCard size={18} strokeWidth={1.8} /></div>
          </div>
          <div className={styles.metricValue}>{fmtMoney(totalDebt)}</div>
          {projection && (
            <div className={styles.metricSub}>
              Free in <strong>{fmtMonths(projection.monthsToPayoff)}</strong>
            </div>
          )}
        </TextureCard>

        <TextureCard className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <h3 className={styles.metricLabel}>Accounts</h3>
            <div className={styles.metricIcon}><LayoutList size={18} strokeWidth={1.8} /></div>
          </div>
          <div className={styles.metricValue}>{liabilities.length}</div>
          {hasTrap && (
            <div className={styles.metricWarn}>
              <AlertTriangle size={12} strokeWidth={2} />
              Minimum trap detected
            </div>
          )}
        </TextureCard>

        {projection && projection.interestSavedVsMinimum > 0 && (
          <TextureCard className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <h3 className={styles.metricLabel}>Interest Saved</h3>
              <div className={styles.metricIcon}><Zap size={18} strokeWidth={1.8} /></div>
            </div>
            <div className={`${styles.metricValue} ${styles.metricValueGreen}`}>
              {fmtMoney(projection.interestSavedVsMinimum)}
            </div>
            <div className={styles.metricSub}>vs. minimums only</div>
          </TextureCard>
        )}

        {projection && projection.monthsSavedVsMinimum > 0 && (
          <TextureCard className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <h3 className={styles.metricLabel}>Time Saved</h3>
              <div className={styles.metricIcon}><Clock size={18} strokeWidth={1.8} /></div>
            </div>
            <div className={`${styles.metricValue} ${styles.metricValueGreen}`}>
              {fmtMonths(projection.monthsSavedVsMinimum)}
            </div>
            <div className={styles.metricSub}>vs. minimums only</div>
          </TextureCard>
        )}
      </div>

      {debts.length === 0 ? (
        <TextureCard>
          <div className={styles.emptyState}>
            <TrendingDown size={40} strokeWidth={1.2} style={{ opacity: 0.35 }} />
            <p>No debt accounts found, or they all have a $0 balance.</p>
            <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>
              Link a credit card or loan account to unlock the payoff engine.
            </p>
          </div>
        </TextureCard>
      ) : (
        <>
          {/* Payoff Engine */}
          <TextureCard className={styles.engineCard}>
            <div className={styles.engineHeader}>
              <h2 className={styles.sectionTitle}>Payoff Engine</h2>
              <div className={styles.strategyToggle}>
                <button
                  onClick={() => setStrategy('AVALANCHE')}
                  className={`${styles.strategyBtn} ${strategy === 'AVALANCHE' ? styles.strategyBtnActive : ''}`}
                >
                  Avalanche
                </button>
                <button
                  onClick={() => setStrategy('SNOWBALL')}
                  className={`${styles.strategyBtn} ${strategy === 'SNOWBALL' ? styles.strategyBtnActive : ''}`}
                >
                  Snowball
                </button>
              </div>
            </div>

            <p className={styles.strategyDesc}>
              {strategy === 'AVALANCHE'
                ? 'Highest APR first — mathematically optimal. Minimizes total interest paid over the life of your debt.'
                : 'Lowest balance first — builds momentum with quick wins. Best when motivation is the barrier, not math.'}
            </p>

            {/* Extra Payment Slider */}
            <div className={styles.sliderSection}>
              <div className={styles.sliderLabel}>
                <span>Extra Monthly Payment</span>
                <strong className={styles.sliderValue}>${extraPayment}/mo</strong>
              </div>
              <input
                type="range"
                min={0}
                max={2000}
                step={25}
                value={extraPayment}
                onChange={e => setExtraPayment(Number(e.target.value))}
                className={styles.slider}
                aria-label="Extra monthly payment amount"
              />
              <div className={styles.sliderRange}>
                <span>$0</span>
                <span>$2,000</span>
              </div>
            </div>

            {/* Minimum Payment Trap Warning */}
            {hasTrap && (
              <div className={styles.trapWarning}>
                <AlertTriangle size={16} strokeWidth={2} className={styles.trapIcon} />
                <div>
                  <strong>Minimum Payment Trap Detected</strong>
                  <p>
                    {trapNames.join(', ')} — your minimum payment barely covers the monthly interest.
                    Without extra payments, this debt may grow instead of shrink.
                  </p>
                </div>
              </div>
            )}

            {/* Horror vs. Hero Comparison */}
            {baseline && projection && (
              <div className={styles.comparisonRow}>
                <div className={styles.horrorBox}>
                  <div className={styles.compBoxLabel}>Minimum Only</div>
                  <div className={styles.compBoxTime}>{fmtMonths(baseline.monthsToPayoff)}</div>
                  <div className={styles.compBoxInterest}>{fmtMoney(baseline.totalInterestPaid)} interest</div>
                </div>

                <div className={styles.compDivider}>
                  <div className={styles.compSavings}>
                    {extraPayment > 0
                      ? `Save ${fmtMoney(projection.interestSavedVsMinimum)}`
                      : 'Add extra to save'}
                  </div>
                  <div className={styles.compArrow}>→</div>
                </div>

                <div className={styles.heroBox}>
                  <div className={styles.compBoxLabel}>+${extraPayment}/mo Plan</div>
                  <div className={styles.compBoxTime}>{fmtMonths(projection.monthsToPayoff)}</div>
                  <div className={styles.compBoxInterest}>{fmtMoney(projection.totalInterestPaid)} interest</div>
                </div>
              </div>
            )}
          </TextureCard>

          {/* Sensitivity Table */}
          {sensitivityTable.length > 0 && (
            <TextureCard className={styles.tableCard}>
              <h2 className={styles.sectionTitle}>Extra Payment Sensitivity</h2>
              <p className={styles.tableDesc}>See what each extra dollar does to your timeline and total interest.</p>
              <div className={styles.tableWrapper}>
                <table className={styles.sensitivityTable}>
                  <thead>
                    <tr>
                      <th>Extra/mo</th>
                      <th>Payoff</th>
                      <th>Total Interest</th>
                      <th>You Save</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sensitivityTable.map(row => {
                      const isActive = row.extraPayment === extraPayment ||
                        (extraPayment > 0 && row.extraPayment === sensitivityTable
                          .map(r => r.extraPayment)
                          .filter(ep => ep <= extraPayment)
                          .pop());
                      return (
                        <tr
                          key={row.extraPayment}
                          className={row.extraPayment === extraPayment ? styles.sensitivityRowActive : ''}
                          onClick={() => setExtraPayment(row.extraPayment)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>${row.extraPayment}</td>
                          <td>{fmtMonths(row.monthsToPayoff)}</td>
                          <td>{fmtMoney(row.totalInterestPaid)}</td>
                          <td className={row.interestSaved > 0 ? styles.savedCell : ''}>
                            {row.interestSaved > 0 ? `+${fmtMoney(row.interestSaved)}` : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </TextureCard>
          )}

          {/* Debt Payoff Trajectory Chart */}
          {chartData.length > 1 && (
            <TextureCard className={styles.chartCard}>
              <h2 className={styles.sectionTitle}>Payoff Trajectory</h2>
              <p className={styles.tableDesc}>
                Debt balance over time with your current +${extraPayment}/mo plan.
              </p>
              <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="debtGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.07)" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                      tickFormatter={v => `Mo ${v}`}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                      tickFormatter={v => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
                      tickLine={false}
                      axisLine={false}
                      width={60}
                    />
                    <Tooltip
                      contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      labelStyle={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}
                      formatter={(v: any) => [`$${Number(v).toLocaleString()}`, 'Remaining Debt']}
                      labelFormatter={label => `Month ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="totalBalance"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#debtGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TextureCard>
          )}

          {/* Monthly Payment Plan */}
          <div className={styles.recommendationsSection}>
            <div className={styles.recommendationsHeader}>
              <h2 className={styles.sectionTitle}>Monthly Payment Plan</h2>
              <span className={styles.strategyTag}>
                {strategy === 'AVALANCHE' ? '↑ Highest APR first' : '↓ Lowest balance first'}
              </span>
            </div>

            <TextureCard className={styles.paymentPlanCard}>
              {/* Total row */}
              <div className={styles.planTotalRow}>
                <span className={styles.planTotalLabel}>Total you pay per month</span>
                <span className={styles.planTotalValue}>
                  {fmtMoney(sortedDebts.reduce((s, d) => s + d.minimumPayment, 0) + extraPayment)}/mo
                </span>
              </div>

              <ul className={styles.debtItems}>
                {sortedDebts.map((debt, index) => {
                  const isTarget = index === 0;
                  // Recommended payment for this month:
                  // - target card: minimum + all extra
                  // - others: just their minimum
                  const recommended = isTarget
                    ? debt.minimumPayment + extraPayment
                    : debt.minimumPayment;

                  // What this card will receive once all prior cards are paid off:
                  // = its own minimum + sum of freed minimums + extraPayment
                  const freedMinimums = sortedDebts
                    .slice(0, index)
                    .reduce((s, d) => s + d.minimumPayment, 0);
                  const futurePayment = debt.minimumPayment + freedMinimums + extraPayment;

                  return (
                    <li
                      key={debt.id}
                      className={`${styles.debtItem} ${isTarget ? styles.debtItemPrimary : ''}`}
                    >
                      <div className={styles.debtLeft}>
                        {/* Name row */}
                        <div className={styles.debtNameRow}>
                          <span className={styles.debtRank}>{index + 1}</span>
                          <span className={styles.debtName}>{debt.name}</span>
                          {isTarget && <span className={styles.targetBadge}>Pay extra here</span>}
                        </div>

                        {/* APR + balance meta */}
                        <div className={styles.debtMeta}>
                          <span>APR: <strong>{(debt.apr * 100).toFixed(2)}%</strong></span>
                          <span>Balance: <strong>{fmtMoney(debt.balance)}</strong></span>
                        </div>

                        {/* Payment breakdown */}
                        <div className={styles.paymentBreakdown}>
                          <div className={styles.paymentRow}>
                            <span className={styles.paymentRowLabel}>Minimum required</span>
                            <span className={styles.paymentRowValue}>
                              ${debt.minimumPayment.toFixed(0)}/mo
                            </span>
                          </div>

                          <div className={`${styles.paymentRow} ${isTarget ? styles.paymentRowHighlight : ''}`}>
                            <span className={styles.paymentRowLabel}>
                              {isTarget ? '⬆ Pay this amount' : 'Pay this month'}
                            </span>
                            <span className={`${styles.paymentRowValue} ${isTarget ? styles.paymentValueBig : ''}`}>
                              ${recommended.toFixed(0)}/mo
                            </span>
                          </div>

                          {isTarget && extraPayment > 0 && (
                            <div className={styles.paymentExtraNote}>
                              ${debt.minimumPayment.toFixed(0)} min + ${extraPayment} extra = ${recommended.toFixed(0)}/mo
                            </div>
                          )}

                          {!isTarget && index > 0 && (
                            <div className={styles.paymentFutureNote}>
                              After #{index} is paid off → you'll pay ${futurePayment.toFixed(0)}/mo here
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {extraPayment === 0 && (
                <div className={styles.planNudge}>
                  💡 Add an extra monthly payment above to see exactly how much to send to each card.
                </div>
              )}
            </TextureCard>
          </div>
        </>
      )}
    </div>
  );
}
