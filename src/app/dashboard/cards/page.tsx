'use client';

import React, { useEffect, useState } from 'react';
import { Lock, Plane, Globe, Plus } from 'lucide-react';
import { TextureCard } from '@/components/ui/TextureCard';
import { useT } from '@/lib/i18n';
import styles from './page.module.css';

export default function CardsPage() {
  const t = useT();
  const [cards, setCards] = useState<any[]>([]);
  const [cardSettings, setCardSettings] = useState({
    freeze: false,
    international: true,
    onlinePayments: true,
  });

  useEffect(() => {
    fetch('/api/plaid/accounts')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data && data.data.liabilities) {
          setCards(data.data.liabilities);
        }
      })
      .catch(console.error);
  }, []);

  const creditCards = cards.filter(c => c.type === 'credit' || c.subtype === 'credit card');
  const loans = cards.filter(c => c.type !== 'credit' && c.subtype !== 'credit card');

  const toggleSetting = (key: keyof typeof cardSettings) => {
    setCardSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const CARD_SETTINGS = [
    {
      key: 'freeze' as const,
      Icon: Lock,
      name: t('cards.freezeCard'),
      desc: t('cards.freezeDesc'),
    },
    {
      key: 'international' as const,
      Icon: Plane,
      name: t('cards.internationalUsage'),
      desc: t('cards.internationalDesc'),
    },
    {
      key: 'onlinePayments' as const,
      Icon: Globe,
      name: t('cards.onlinePayments'),
      desc: t('cards.onlineDesc'),
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Credit Cards</h2>
      <div className={styles.cardsGrid}>
        {creditCards.length > 0 ? (
          creditCards.map(card => (
            <div key={card.id} className={`${styles.creditCard} ${styles.primaryCard}`}>
              <div className={styles.cardHeader}>
                <div className={styles.bankName}>{card.item?.institutionName || 'Credit Card'}</div>
                <div className={styles.chip}></div>
              </div>
              <div className={styles.cardNumber}>
                **** **** **** {card.mask || '0000'}
              </div>
              <div className={styles.cardDetails}>
                <div>
                  <div className={styles.cardLabel}>Name</div>
                  <div className={styles.cardValue}>{card.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className={styles.cardLabel}>Balance</div>
                  <div className={styles.cardValue}>${(card.currentBalance || 0).toFixed(0)}</div>
                </div>
              </div>
              {/* Credit utilization bar */}
              {card.availableBalance != null && card.currentBalance != null && (
                (() => {
                  const limit = card.currentBalance + card.availableBalance;
                  const pct = limit > 0 ? Math.min(100, (card.currentBalance / limit) * 100) : 0;
                  const color = pct > 75 ? '#f87171' : pct > 50 ? '#fbbf24' : '#4ade80';
                  return (
                    <div className={styles.utilizationRow}>
                      <div className={styles.utilizationBar}>
                        <div className={styles.utilizationFill} style={{ width: `${pct}%`, background: color }} />
                      </div>
                      <span className={styles.utilizationLabel} style={{ color }}>{pct.toFixed(0)}% used</span>
                    </div>
                  );
                })()
              )}
            </div>
          ))
        ) : (
          <div style={{ padding: '2rem', color: 'rgba(255,255,255,0.5)' }}>
            No credit cards found.
          </div>
        )}

        <div className={styles.addCard}>
          <div className={styles.addIcon}>
            <Plus size={22} strokeWidth={2} />
          </div>
          <div>{t('cards.addNew')}</div>
        </div>
      </div>

      {loans.length > 0 && (
        <>
          <h2 className={styles.sectionTitle} style={{ marginTop: '16px' }}>Loans & Mortgages</h2>
          <div className={styles.cardsGrid}>
            {loans.map(loan => (
              <div key={loan.id} className={styles.loanCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.bankName}>{loan.item?.institutionName || 'Loan Provider'}</div>
                </div>
                <div className={styles.cardNumber} style={{ fontSize: '1.1rem', letterSpacing: '0px', margin: '8px 0 16px 0' }}>
                  {loan.name}
                </div>
                <div className={styles.cardDetails}>
                  <div>
                    <div className={styles.cardLabel}>Acct Ending In</div>
                    <div className={styles.cardValue}>**{loan.mask || '0000'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className={styles.cardLabel}>Balance</div>
                    <div className={styles.cardValue}>${loan.currentBalance?.toFixed(2) || '0.00'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <TextureCard>
        <h2 className={styles.sectionTitle}>{t('cards.cardSettings')}</h2>
        <div className={styles.settingsList}>
          {CARD_SETTINGS.map(({ key, Icon, name, desc }) => (
            <div key={key} className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <div className={styles.settingIcon}>
                  <Icon size={18} strokeWidth={1.8} />
                </div>
                <div>
                  <div className={styles.settingName}>{name}</div>
                  <div className={styles.settingDesc}>{desc}</div>
                </div>
              </div>
              <div
                className={`${styles.toggle} ${cardSettings[key] ? styles.toggleActive : ''}`}
                onClick={() => toggleSetting(key)}
                role="switch"
                aria-checked={cardSettings[key]}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' || e.key === ' ' ? toggleSetting(key) : null}
              >
                <div className={styles.toggleKnob}></div>
              </div>
            </div>
          ))}
        </div>
      </TextureCard>
    </div>
  );
}
