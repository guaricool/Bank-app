import React, { ReactNode } from 'react';
import styles from './GradientAnimation.module.css';

interface GradientAnimationProps {
  children?: ReactNode;
  className?: string;
}

export function GradientAnimation({ children, className = '' }: GradientAnimationProps) {
  return (
    <div className={`${styles.gradientContainer} ${className}`}>
      <div className={styles.gradientOrb1}></div>
      <div className={styles.gradientOrb2}></div>
      <div className={styles.gradientOrb3}></div>
      {children && <div className={styles.content}>{children}</div>}
    </div>
  );
}
