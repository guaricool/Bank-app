import React from 'react';
import StrategyDashboard from './StrategyDashboard';
import styles from './page.module.css';

export default function StrategyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Estrategia de Deudas</h1>
        <p className={styles.subtitle}>Acelera tu camino hacia la libertad financiera</p>
      </div>
      <StrategyDashboard />
    </div>
  );
}
