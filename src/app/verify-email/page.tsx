'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MailCheck, XCircle, Loader2 } from 'lucide-react';
import { TextureCard } from '@/components/ui/TextureCard';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token found in the URL.');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Your email has been successfully verified.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to verify email.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('An unexpected error occurred during verification.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md">
        <TextureCard className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            {status === 'loading' && <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />}
            {status === 'success' && <MailCheck className="w-16 h-16 text-green-500" />}
            {status === 'error' && <XCircle className="w-16 h-16 text-red-500" />}
          </div>

          <h1 className="text-2xl font-bold text-white">
            {status === 'loading' ? 'Verifying Email' : status === 'success' ? 'Verification Complete' : 'Verification Failed'}
          </h1>
          
          <p className="text-zinc-400">
            {message}
          </p>

          <div className="pt-4">
            {status === 'success' ? (
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                Continue to Login
              </button>
            ) : status === 'error' ? (
              <button
                onClick={() => router.push('/register')}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 px-4 rounded-xl transition-colors border border-zinc-700"
              >
                Back to Registration
              </button>
            ) : null}
          </div>
        </TextureCard>
      </div>
    </div>
  );
}
