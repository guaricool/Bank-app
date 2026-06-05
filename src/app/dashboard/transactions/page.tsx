import React from 'react';
import { TextureCard } from '@/components/ui/TextureCard';
import styles from './page.module.css';

export default function TransactionsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <button className={`${styles.filterBtn} ${styles.active}`}>All</button>
        <button className={styles.filterBtn}>Income</button>
        <button className={styles.filterBtn}>Expenses</button>
      </div>

      <TextureCard>
        <div className={styles.transactionList}>
          {/* Item 1 */}
          <div className={styles.transactionItem}>
            <div className={styles.txInfo}>
              <div className={styles.txIcon}>🛒</div>
              <div className={styles.txDetails}>
                <div className={styles.txName}>Whole Foods Market</div>
                <div className={styles.txDate}>Today, 2:45 PM</div>
                <div><span className={styles.txCategory}>Groceries</span></div>
              </div>
            </div>
            <div className={styles.txRight}>
              <div className={`${styles.txAmount} ${styles.negative}`}>-$124.50</div>
              <div className={styles.txStatus}>Completed</div>
            </div>
          </div>

          {/* Item 2 */}
          <div className={styles.transactionItem}>
            <div className={styles.txInfo}>
              <div className={styles.txIcon}>☕</div>
              <div className={styles.txDetails}>
                <div className={styles.txName}>Starbucks</div>
                <div className={styles.txDate}>Yesterday, 9:20 AM</div>
                <div><span className={styles.txCategory}>Coffee</span></div>
              </div>
            </div>
            <div className={styles.txRight}>
              <div className={`${styles.txAmount} ${styles.negative}`}>-$5.40</div>
              <div className={styles.txStatus}>Completed</div>
            </div>
          </div>

          {/* Item 3 */}
          <div className={styles.transactionItem}>
            <div className={styles.txInfo}>
              <div className={styles.txIcon}>💼</div>
              <div className={styles.txDetails}>
                <div className={styles.txName}>Salary Deposit</div>
                <div className={styles.txDate}>Mon, 1:00 AM</div>
                <div><span className={styles.txCategory}>Income</span></div>
              </div>
            </div>
            <div className={styles.txRight}>
              <div className={`${styles.txAmount} ${styles.positive}`}>+$4,250.00</div>
              <div className={styles.txStatus}>Completed</div>
            </div>
          </div>

          {/* Item 4 */}
          <div className={styles.transactionItem}>
            <div className={styles.txInfo}>
              <div className={styles.txIcon}>🎬</div>
              <div className={styles.txDetails}>
                <div className={styles.txName}>Netflix Subscription</div>
                <div className={styles.txDate}>Sun, 10:00 AM</div>
                <div><span className={styles.txCategory}>Entertainment</span></div>
              </div>
            </div>
            <div className={styles.txRight}>
              <div className={`${styles.txAmount} ${styles.negative}`}>-$15.99</div>
              <div className={styles.txStatus}>Completed</div>
            </div>
          </div>

          {/* Item 5 */}
          <div className={styles.transactionItem}>
            <div className={styles.txInfo}>
              <div className={styles.txIcon}>📱</div>
              <div className={styles.txDetails}>
                <div className={styles.txName}>Apple Store</div>
                <div className={styles.txDate}>Sat, 3:30 PM</div>
                <div><span className={styles.txCategory}>Electronics</span></div>
              </div>
            </div>
            <div className={styles.txRight}>
              <div className={`${styles.txAmount} ${styles.negative}`}>-$89.00</div>
              <div className={styles.txStatus}>Pending</div>
            </div>
          </div>

        </div>
      </TextureCard>
    </div>
  );
}
