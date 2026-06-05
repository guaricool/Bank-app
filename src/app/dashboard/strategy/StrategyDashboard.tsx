"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { calculatePayoff, Debt } from '@/lib/financialMath';
import { TextureCard } from '@/components/ui/TextureCard';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import styles from './page.module.css';

// Mock Debts for demonstration
const mockDebts: Debt[] = [
  { id: '1', name: 'Tarjeta de Crédito A', balance: 5000, apr: 0.22, minimumPayment: 150 },
  { id: '2', name: 'Préstamo Auto', balance: 15000, apr: 0.07, minimumPayment: 300 },
  { id: '3', name: 'Tarjeta de Crédito B', balance: 2000, apr: 0.25, minimumPayment: 80 },
];

export default function StrategyDashboard() {
  const [strategy, setStrategy] = useState<'SNOWBALL' | 'AVALANCHE'>('AVALANCHE');
  const [extraCash, setExtraCash] = useState<number>(200);
  const [reconciliationMatches, setReconciliationMatches] = useState<any[]>([]);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  // Calculate projections
  const projection = useMemo(() => {
    return calculatePayoff(mockDebts, extraCash, strategy);
  }, [strategy, extraCash]);

  // Fetch automatic reconciliation status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/strategy/reconciliation-status');
        const data = await res.json();
        if (data.success) {
          setReconciliationMatches(data.matches);
        }
      } catch (error) {
        console.error("Failed to fetch reconciliation status:", error);
      } finally {
        setIsLoadingStatus(false);
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className={styles.dashboardLayout}>
      
      {/* Configuration Panel */}
      <div className={styles.configColumn}>
        <TextureCard>
          <h2 className={styles.sectionTitle}>Elige tu Estrategia</h2>
          <div className={styles.strategyToggles}>
            <button 
              className={`${styles.toggleBtn} ${strategy === 'AVALANCHE' ? styles.activeToggle : ''}`}
              onClick={() => setStrategy('AVALANCHE')}
            >
              Avalancha
              <span className={styles.toggleDesc}>Ahorra más dinero (Interés alto primero)</span>
            </button>
            <button 
              className={`${styles.toggleBtn} ${strategy === 'SNOWBALL' ? styles.activeToggle : ''}`}
              onClick={() => setStrategy('SNOWBALL')}
            >
              Bola de Nieve
              <span className={styles.toggleDesc}>Motivación rápida (Saldo menor primero)</span>
            </button>
          </div>
        </TextureCard>

        <TextureCard>
          <h2 className={styles.sectionTitle}>Aporte Extra Mensual</h2>
          <p className={styles.cashDesc}>
            Usa tu flujo de caja libre para acelerar el pago. Este dinero se suma a los pagos mínimos.
          </p>
          <div className={styles.sliderContainer}>
            <input 
              type="range" 
              min="0" 
              max="2000" 
              step="50" 
              value={extraCash} 
              onChange={(e) => setExtraCash(Number(e.target.value))}
              className={styles.slider}
            />
            <div className={styles.sliderValue}>
              ${extraCash.toLocaleString()} / mes
            </div>
          </div>
        </TextureCard>

        <TextureCard>
          <h2 className={styles.sectionTitle}>Estado de Cierre (Automático)</h2>
          <p className={styles.cashDesc}>
            El sistema detecta automáticamente los pagos hacia tus deudas desde tus cuentas corrientes.
          </p>
          
          <div style={{ marginTop: '1rem' }}>
            {isLoadingStatus ? (
              <p>Comprobando pagos...</p>
            ) : reconciliationMatches.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {reconciliationMatches.map(match => (
                  <div key={match.id} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, color: '#10b981' }}>Pago Detectado</span>
                      <span style={{ fontWeight: 600 }}>${match.amount.toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>
                      {new Date(match.matchDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.2)' }}>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Esperando a detectar tu pago mensual de ${extraCash} extra.</p>
              </div>
            )}
          </div>
        </TextureCard>
      </div>

      {/* Projection Panel */}
      <div className={styles.projectionColumn}>
        <TextureCard>
          <h2 className={styles.sectionTitle}>Impacto de tu Estrategia</h2>
          
          <div className={styles.impactGrid}>
            <div className={styles.impactStat}>
              <div className={styles.statLabel}>Libre de deudas en</div>
              <div className={styles.statValueHighlight}>
                {Math.floor(projection.monthsToPayoff / 12)}a {projection.monthsToPayoff % 12}m
              </div>
            </div>
            <div className={styles.impactStat}>
              <div className={styles.statLabel}>Total Intereses a Pagar</div>
              <div className={styles.statValue}>
                ${Math.round(projection.totalInterestPaid).toLocaleString()}
              </div>
            </div>
          </div>

          <div className={styles.chartPlaceholder} style={{ height: '300px', width: '100%', marginTop: '2rem' }}>
            {projection.timeline.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projection.timeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="rgba(255,255,255,0.5)" 
                    tickFormatter={(val) => `Mes ${val}`} 
                    tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.5)" 
                    tickFormatter={(val) => `$${val.toLocaleString()}`}
                    tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}}
                    tickLine={false}
                    axisLine={false}
                    width={80}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#10b981' }}
                    labelStyle={{ color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Deuda Restante']}
                    labelFormatter={(label) => `Mes ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="totalBalance" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorBalance)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p>No tienes deudas activas.</p>
            )}
          </div>

        </TextureCard>
      </div>

    </div>
  );
}
