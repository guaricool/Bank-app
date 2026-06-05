"use client";

import React from 'react';
import { TextureCard } from '@/components/ui/TextureCard';
import PlaidLinkButton from '@/components/PlaidLinkButton';
import { useT } from '@/lib/i18n';
import styles from './page.module.css';

export default function SettingsPage() {
  const t = useT();
  return (
    <div className={styles.container}>
      
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
                  <div className={styles.notificationName}>{t('settings.emailAlerts')}</div>
                  <div className={styles.notificationDesc}>{t('settings.emailAlertsDesc')}</div>
                </div>
                <div className={`${styles.toggle} ${styles.toggleActive}`}>
                  <div className={styles.toggleKnob}></div>
                </div>
              </div>

              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <div className={styles.notificationName}>{t('settings.pushNotifications')}</div>
                  <div className={styles.notificationDesc}>{t('settings.pushNotificationsDesc')}</div>
                </div>
                <div className={`${styles.toggle} ${styles.toggleActive}`}>
                  <div className={styles.toggleKnob}></div>
                </div>
              </div>

            </div>
          </TextureCard>

        </div>
      </div>
    </div>
  );
}
