"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useT } from '@/lib/i18n';

interface PlaidLinkButtonProps {
  userId: string;
  onSuccessCallback?: () => void;
  className?: string;
}

export default function PlaidLinkButton({ userId, onSuccessCallback, className }: PlaidLinkButtonProps) {
  const t = useT();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const createToken = async () => {
      try {
        const response = await fetch('/api/plaid/create-link-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
        const data = await response.json();
        setToken(data.link_token);
      } catch (error) {
        console.error('Error creating Plaid link token:', error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      createToken();
    }
  }, [userId]);

  const onSuccess = useCallback(async (public_token: string, metadata: any) => {
    try {
      const response = await fetch('/api/plaid/set-access-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicToken: public_token, userId }),
      });
      const data = await response.json();
      
      if (data.success) {
        console.log('Successfully linked bank account:', metadata.institution.name);
        if (onSuccessCallback) {
          onSuccessCallback();
        }
      } else {
        console.error('Failed to set access token:', data.error);
      }
    } catch (error) {
      console.error('Error in onSuccess handler:', error);
    }
  }, [userId, onSuccessCallback]);

  const { open, ready } = usePlaidLink({
    token: token!,
    onSuccess,
  });

  const isReady = ready && token && !loading;

  return (
    <button
      onClick={() => open()}
      disabled={!isReady}
      className={className || "plaid-button"}
      style={!className ? {
        background: 'var(--accent-primary, #0071e3)',
        color: '#fff',
        border: 'none',
        borderRadius: '24px',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: isReady ? 'pointer' : 'not-allowed',
        opacity: isReady ? 1 : 0.6,
        transition: 'var(--transition-fast)',
        boxShadow: 'var(--shadow-md)'
      } : undefined}
    >
      {loading ? t('plaid.preparing') : t('plaid.linkBank')}
    </button>
  );
}
