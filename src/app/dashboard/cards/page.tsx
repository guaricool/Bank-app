import React from 'react';
import { TextureCard } from '@/components/ui/TextureCard';
import styles from './page.module.css';

export default function CardsPage() {
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
              <div className={styles.cardLabel}>Cardholder</div>
              <div className={styles.cardValue}>John Doe</div>
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.cardLabel}>Expires</div>
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
              <div className={styles.cardLabel}>Cardholder</div>
              <div className={styles.cardValue}>Jane Doe</div>
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.cardLabel}>Expires</div>
              <div className={styles.cardValue}>09/27</div>
            </div>
            <div className={styles.cardLogo}>Mastercard</div>
          </div>
        </div>

        {/* Add Card Button */}
        <div className={styles.addCard}>
          <div className={styles.addIcon}>+</div>
          <div>Add New Card</div>
        </div>

      </div>

      <TextureCard>
        <h2 className={styles.sectionTitle}>Card Settings</h2>
        <div className={styles.settingsList}>
          
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <div className={styles.settingIcon}>🔒</div>
              <div>
                <div className={styles.settingName}>Freeze Card</div>
                <div className={styles.settingDesc}>Temporarily disable your card if lost or stolen</div>
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
                <div className={styles.settingName}>International Usage</div>
                <div className={styles.settingDesc}>Allow transactions outside your home country</div>
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
                <div className={styles.settingName}>Online Payments</div>
                <div className={styles.settingDesc}>Enable internet and mail order transactions</div>
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
