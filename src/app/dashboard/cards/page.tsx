'use client';

import React from 'react';
import { TextureCard } from '@/components/ui/TextureCard';
import { useT } from '@/lib/i18n';
import styles from './page.module.css';

export default function CardsPage() {
  const t = useT();
  
  return (
    <div className={styles.container}>
      <div className={styles.cardsGrid}>
        
        {/* Card 1 */}
        <div className={`${styles.creditCard} ${styles.primaryCard}`}>
          <div className={styles.cardHeader}>
            <div className={styles.bankName}>Family Finance</div>
            <div className={styles.chip}></div>
          </div>
          <div className={styles.cardNumber}>**** **** **** 4281</div>
          <div className={styles.cardFooter}>
            <div className={styles.cardInfo}>
              <div className={styles.cardLabel}>{t('cards.cardholder')}</div>
              <div className={styles.cardValue}>John Doe</div>
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.cardLabel}>{t('cards.expires')}</div>
              <div className={styles.cardValue}>12/28</div>
            </div>
            <div className={styles.cardLogo}>Visa</div>
          </div>
        </div>

        {/* Card 2 */}
        <div className={`${styles.creditCard} ${styles.secondaryCard}`}>
          <div className={styles.cardHeader}>
            <div className={styles.bankName}>Family Finance</div>
            <div className={styles.chip}></div>
          </div>
          <div className={styles.cardNumber}>**** **** **** 8832</div>
          <div className={styles.cardFooter}>
            <div className={styles.cardInfo}>
              <div className={styles.cardLabel}>{t('cards.cardholder')}</div>
              <div className={styles.cardValue}>Jane Doe</div>
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.cardLabel}>{t('cards.expires')}</div>
              <div className={styles.cardValue}>09/27</div>
            </div>
            <div className={styles.cardLogo}>Mastercard</div>
          </div>
        </div>

        {/* Add Card Button */}
        <div className={styles.addCard}>
          <div className={styles.addIcon}>+</div>
          <div>{t('cards.addNew')}</div>
        </div>

      </div>

      <TextureCard>
        <h2 className={styles.sectionTitle}>{t('cards.cardSettings')}</h2>
        <div className={styles.settingsList}>
          
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <div className={styles.settingIcon}>🔒</div>
              <div>
                <div className={styles.settingName}>{t('cards.freezeCard')}</div>
                <div className={styles.settingDesc}>{t('cards.freezeDesc')}</div>
              </div>
            </div>
            <div className={styles.toggle}>
              <div className={styles.toggleKnob}></div>
            </div>
          </div>

          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <div className={styles.settingIcon}>✈️</div>
              <div>
                <div className={styles.settingName}>{t('cards.internationalUsage')}</div>
                <div className={styles.settingDesc}>{t('cards.internationalDesc')}</div>
              </div>
            </div>
            <div className={`${styles.toggle} ${styles.toggleActive}`}>
              <div className={styles.toggleKnob}></div>
            </div>
          </div>

          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <div className={styles.settingIcon}>📱</div>
              <div>
                <div className={styles.settingName}>{t('cards.onlinePayments')}</div>
                <div className={styles.settingDesc}>{t('cards.onlineDesc')}</div>
              </div>
            </div>
            <div className={`${styles.toggle} ${styles.toggleActive}`}>
              <div className={styles.toggleKnob}></div>
            </div>
          </div>

        </div>
      </TextureCard>
    </div>
  );
}
