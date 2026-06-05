"use client";

import React, { useEffect, useState } from 'react';
import { TextureCard } from '@/components/ui/TextureCard';

type Account = {
  id: string;
  name: string;
  officialName: string | null;
  mask: string | null;
  type: string;
  subtype: string | null;
  currentBalance: number | null;
  availableBalance: number | null;
  isoCurrencyCode: string | null;
  item: {
    institutionName: string;
  };
};

export default function AccountsList() {
  const [assets, setAssets] = useState<Account[]>([]);
  const [liabilities, setLiabilities] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const res = await fetch('/api/plaid/accounts');
        const json = await res.json();
        if (json.success && json.data) {
          setAssets(json.data.assets);
          setLiabilities(json.data.liabilities);
        }
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAccounts();
  }, []);

  if (loading) {
    return <div style={{ color: 'rgba(255,255,255,0.7)', padding: '20px' }}>Loading accounts...</div>;
  }

  if (assets.length === 0 && liabilities.length === 0) {
    return null;
  }

  const formatCurrency = (amount: number | null, currency: string | null) => {
    if (amount === null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '32px' }}>
      
      {/* ASSETS SECTION */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>
          Assets (Checking, Savings)
        </h2>
        {assets.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>No bank accounts linked.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {assets.map(acc => (
              <TextureCard key={acc.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#fff', margin: '0 0 4px 0' }}>{acc.name}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                      {acc.item.institutionName} ••••{acc.mask}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#fff' }}>
                      {formatCurrency(acc.currentBalance, acc.isoCurrencyCode)}
                    </div>
                    {acc.availableBalance !== null && acc.availableBalance !== acc.currentBalance && (
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                        Available: {formatCurrency(acc.availableBalance, acc.isoCurrencyCode)}
                      </div>
                    )}
                  </div>
                </div>
              </TextureCard>
            ))}
          </div>
        )}
      </div>

      {/* LIABILITIES SECTION */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>
          Liabilities (Credit Cards, Loans)
        </h2>
        {liabilities.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>No credit cards linked.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {liabilities.map(acc => (
              <TextureCard key={acc.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#fff', margin: '0 0 4px 0' }}>{acc.name}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                      {acc.item.institutionName} ••••{acc.mask}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#ff4d4d' }}>
                      {formatCurrency(acc.currentBalance, acc.isoCurrencyCode)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                      Current Balance
                    </div>
                  </div>
                </div>
              </TextureCard>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
