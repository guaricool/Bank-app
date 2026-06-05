import React, { ReactNode } from 'react';
import styles from './TextureCard.module.css';

interface TextureCardProps {
  children: ReactNode;
  className?: string;
}

export function TextureCard({ children, className = '' }: TextureCardProps) {
  return (
    <div className={`${styles.card} ${className} glass-panel`}>
      <div className={styles.textureOverlay}></div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
