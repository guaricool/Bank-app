"use client";

import React, { useState, useEffect } from 'react';
import { TextureCard } from '@/components/ui/TextureCard';
import PlaidLinkButton from '@/components/PlaidLinkButton';
import { useSession } from 'next-auth/react';
import { useT } from '@/lib/i18n';
import styles from './page.module.css';

export default function SettingsPage() {
  const t = useT();
  const { data: session } = useSession();
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

  const [profileName, setProfileName] = useState(session?.user?.name || '');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setProfileName(session.user.name);
    }
  }, [session]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profileName })
      });
      if (res.ok) {
        // Force session refresh or reload page
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingProfile(false);
    }
  };

  return (
      
      <div className={styles.settingsGrid}>
        
        {/* Profile Settings */}
        <TextureCard>
          <h2 className={styles.sectionTitle}>{t('settings.profileDetails')}</h2>
          <div className={styles.profileSection}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatarLarge}>
                {session?.user?.name ? session.user.name.substring(0, 2).toUpperCase() : 'U'}
              </div>
              <button className={styles.changeAvatarBtn}>{t('settings.changePhoto')}</button>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>{t('settings.fullName')}</label>
              <input type="text" className={styles.input} value={profileName} onChange={(e) => setProfileName(e.target.value)} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>{t('settings.emailAddress')}</label>
              <input type="email" className={styles.input} defaultValue={session?.user?.email || ''} readOnly style={{ opacity: 0.7 }} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>{t('settings.phoneNumber')}</label>
              <input type="tel" className={styles.input} defaultValue="+1 (555) 123-4567" />
            </div>

            <button className={styles.primaryBtn} onClick={handleSaveProfile} disabled={savingProfile}>
              {savingProfile ? t('settings.saving') || 'Saving...' : t('settings.saveChanges')}
            </button>
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
                <PlaidLinkButton userId={(session?.user as any)?.id || ''} />
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
