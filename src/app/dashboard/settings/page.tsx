import React from 'react';
import { TextureCard } from '@/components/ui/TextureCard';
import PlaidLinkButton from '@/components/PlaidLinkButton';
import styles from './page.module.css';

export default function SettingsPage() {
  return (
    <div className={styles.container}>
      
      <div className={styles.settingsGrid}>
        
        {/* Profile Settings */}
        <TextureCard>
          <h2 className={styles.sectionTitle}>Profile Details</h2>
          <div className={styles.profileSection}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatarLarge}>JD</div>
              <button className={styles.changeAvatarBtn}>Change Photo</button>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input type="text" className={styles.input} defaultValue="John Doe" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input type="email" className={styles.input} defaultValue="john.doe@example.com" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number</label>
              <input type="tel" className={styles.input} defaultValue="+1 (555) 123-4567" />
            </div>

            <button className={styles.primaryBtn}>Save Changes</button>
          </div>
        </TextureCard>

        {/* Security & Preferences */}
        <div className={styles.rightColumn}>
          
          <TextureCard>
            <h2 className={styles.sectionTitle}>Security</h2>
            <div className={styles.securityList}>
              <div className={styles.securityItem}>
                <div className={styles.securityInfo}>
                  <div className={styles.securityName}>Password</div>
                  <div className={styles.securityDesc}>Last changed 3 months ago</div>
                </div>
                <button className={styles.outlineBtn}>Update</button>
              </div>
              
              <div className={styles.securityItem}>
                <div className={styles.securityInfo}>
                  <div className={styles.securityName}>Two-Factor Authentication</div>
                  <div className={styles.securityDesc}>Protect your account with 2FA</div>
                </div>
                <div className={styles.toggle}>
                  <div className={styles.toggleKnob}></div>
                </div>
              </div>
            </div>
          </TextureCard>

          {/* Linked Bank Accounts */}
          <TextureCard>
            <h2 className={styles.sectionTitle}>Linked Accounts</h2>
            <div className={styles.securityList}>
              <div className={styles.securityItem} style={{ borderBottom: 'none', paddingBottom: 0 }}>
                <div className={styles.securityInfo}>
                  <div className={styles.securityName}>Bank Connections</div>
                  <div className={styles.securityDesc}>Link your accounts to track expenses securely.</div>
                </div>
                <PlaidLinkButton userId="mock_user_123" />
              </div>
            </div>
          </TextureCard>

          <TextureCard>
            <h2 className={styles.sectionTitle}>Notifications</h2>
            <div className={styles.notificationList}>
              
              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <div className={styles.notificationName}>Email Alerts</div>
                  <div className={styles.notificationDesc}>Receive daily summary emails</div>
                </div>
                <div className={`${styles.toggle} ${styles.toggleActive}`}>
                  <div className={styles.toggleKnob}></div>
                </div>
              </div>

              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <div className={styles.notificationName}>Push Notifications</div>
                  <div className={styles.notificationDesc}>Get alerts for large transactions</div>
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
