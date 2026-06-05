'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token.');
      return;
    }

    fetch(`/api/auth/verify?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus('success');
          setMessage('Your email has been verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('An unexpected error occurred.');
      });
  }, [token]);

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(20px)',
      padding: '3rem',
      borderRadius: '24px',
      width: '100%',
      maxWidth: '480px',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '1rem' }}>
        Email Verification
      </h1>
      
      <p style={{
        color: status === 'error' ? '#ff453a' : status === 'success' ? '#32d74b' : '#86868b',
        fontSize: '1.1rem',
        marginBottom: '2rem'
      }}>
        {message}
      </p>

      {status !== 'loading' && (
        <Link href="/login" style={{
          display: 'inline-block',
          padding: '1rem',
          width: '100%',
          background: '#0071e3',
          color: '#fff',
          borderRadius: '12px',
          textDecoration: 'none',
          fontWeight: 600,
          transition: 'background 0.2s',
        }}>
          Go to Login
        </Link>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(145deg, #000000 0%, #0a0a1a 50%, #0d0d2b 100%)',
      color: '#f5f5f7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
    }}>
      <Suspense fallback={<div>Loading verification...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
