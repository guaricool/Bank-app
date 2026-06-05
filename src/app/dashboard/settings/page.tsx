"use client";

import React, { useState, useEffect } from 'react';
import { TextureCard } from '@/components/ui/TextureCard';
import PlaidLinkButton from '@/components/PlaidLinkButton';
import { useT } from '@/lib/i18n';
import styles from './page.module.css';

export default function SettingsPage() {
  const t = useT();
  const [alerts, setAlerts] = useState({
    deposits: true,
    withdrawals: true,
    payments: true,
    closingDifference: true,
  });
  const [savingAlerts, setSavingAlerts] = useState(false);

  useEffect(() => {
    fetch('/api/settings/alerts')
      .then(res => res.json())
      .then(data => {
        if (data.preferences) {
          setAlerts(data.preferences);
        }
      });
  }, []);

  const toggleAlert = async (key: keyof typeof alerts) => {
    const newAlerts = { ...alerts, [key]: !alerts[key] };
    setAlerts(newAlerts);
    setSavingAlerts(true);
    try {
      await fetch('/api/settings/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAlerts)
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSavingAlerts(false);
    }
  };

  return (
      
      <div className={styles.settingsGrid}>
        
        {/* Profile Settings */}
        <TextureCard>
          <h2 className={styles.sectionTitle}>{t('settings.profileDetails')}</h2>
          <div className={styles.profileSection}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatarLarge}>JD</div>
              <button className={styles.changeAvatarBtn}>{t('settings.changePhoto')}</button>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>{t('settings.fullName')}</label>
              <input type="text" className={styles.input} defaultValue="John Doe" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>{t('settings.emailAddress')}</label>
              <input type="email" className={styles.input} defaultValue="john.doe@example.com" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>{t('settings.phoneNumber')}</label>
              <input type="tel" className={styles.input} defaultValue="+1 (555) 123-4567" />
            </div>

            <button className={styles.primaryBtn}>{t('settings.saveChanges')}</button>
          </div>
        </TextureCard>

        {/* Security & Preferences */}
        <div className={styles.rightColumn}>
          
          <TextureCard>
            <h2 className={styles.sectionTitle}>{t('settings.security')}</h2>
            <div className={styles.securityList}>
              <div className={styles.securityItem}>
                <div className={styles.securityInfo}>
                  <div className={styles.securityName}>{t('settings.password')}</div>
                  <div className={styles.securityDesc}>{t('settings.lastChanged')}</div>
                </div>
                <button className={styles.outlineBtn}>{t('settings.update')}</button>
              </div>
              
              <div className={styles.securityItem}>
                <div className={styles.securityInfo}>
                  <div className={styles.securityName}>{t('settings.twoFactor')}</div>
                  <div className={styles.securityDesc}>{t('settings.twoFactorDesc')}</div>
                </div>
                <div className={styles.toggle}>
                  <div className={styles.toggleKnob}></div>
                </div>
              </div>
            </div>
          </TextureCard>

          {/* Linked Bank Accounts */}
          <TextureCard>
            <h2 className={styles.sectionTitle}>{t('settings.linkedAccounts')}</h2>
            <div className={styles.securityList}>
              <div className={styles.securityItem} style={{ borderBottom: 'none', paddingBottom: 0 }}>
                <div className={styles.securityInfo}>
                  <div className={styles.securityName}>{t('settings.bankConnections')}</div>
                  <div className={styles.securityDesc}>{t('settings.bankConnectionsDesc')}</div>
                </div>
                <PlaidLinkButton userId="mock_user_123" />
              </div>
            </div>
          </TextureCard>

          <TextureCard>
            <h2 className={styles.sectionTitle}>{t('settings.notifications')}</h2>
            <div className={styles.notificationList}>
              
              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <div className={styles.notificationName}>{t('settings.alerts.deposits') || 'Deposits'}</div>
                  <div className={styles.notificationDesc}>Notify me on incoming deposits</div>
                </div>
                <div className={`${styles.toggle} ${alerts.deposits ? styles.toggleActive : ''}`} onClick={() => toggleAlert('deposits')}>
                  <div className={styles.toggleKnob}></div>
                </div>
              </div>

              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <div className={styles.notificationName}>{t('settings.alerts.withdrawals') || 'Withdrawals (Retiros)'}</div>
                  <div className={styles.notificationDesc}>Notify me on large withdrawals</div>
                </div>
                <div className={`${styles.toggle} ${alerts.withdrawals ? styles.toggleActive : ''}`} onClick={() => toggleAlert('withdrawals')}>
                  <div className={styles.toggleKnob}></div>
                </div>
              </div>

              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <div className={styles.notificationName}>{t('settings.alerts.payments') || 'Payments (Pagos)'}</div>
                  <div className={styles.notificationDesc}>Notify me of upcoming and completed payments</div>
                </div>
                <div className={`${styles.toggle} ${alerts.payments ? styles.toggleActive : ''}`} onClick={() => toggleAlert('payments')}>
                  <div className={styles.toggleKnob}></div>
                </div>
              </div>

              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <div className={styles.notificationName}>{t('settings.alerts.closing') || 'Closing Difference'}</div>
                  <div className={styles.notificationDesc}>Notify me if closing balance does not match expectations</div>
                </div>
                <div className={`${styles.toggle} ${alerts.closingDifference ? styles.toggleActive : ''}`} onClick={() => toggleAlert('closingDifference')}>
                  <div className={styles.toggleKnob}></div>
                </div>
              </div>

            </div>
          </TextureCard>

        </div>
      </div>
  );
}
