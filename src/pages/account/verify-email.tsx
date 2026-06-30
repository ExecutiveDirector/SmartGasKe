// ============================================================
// FILE: src/pages/account/verify-email.tsx
// Lands here from the verification link in the welcome email
// (POST /v1/auth/verify-email). Did not previously exist — the
// email_verification_token column was being written by the backend
// but nothing ever consumed it.
// ============================================================
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CheckCircle, XCircle, Loader, Flame } from 'lucide-react';
import authService from '@/lib/services/authService';

type Status = 'verifying' | 'success' | 'error';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!router.isReady) return;
    const token = typeof router.query.token === 'string' ? router.query.token : '';

    if (!token) {
      setStatus('error');
      setMessage('This link is missing its verification token.');
      return;
    }

    authService
      .verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err: any) => {
        setStatus('error');
        setMessage(
          err?.response?.data?.error || err?.message || 'This link is invalid or has expired.'
        );
      });
  }, [router.isReady, router.query.token]);

  return (
    <>
      <Head>
        <title>Verify Email — AquaGas</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/40 to-sky-50 flex flex-col">
        <div className="flex items-center px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-teal-700 font-bold text-lg">
            <Flame size={20} className="text-teal-600" />
            AquaGas
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-sm">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center space-y-4">
              {status === 'verifying' && (
                <>
                  <Loader className="animate-spin text-teal-600 mx-auto" size={32} />
                  <p className="text-sm text-slate-500">Verifying your email…</p>
                </>
              )}

              {status === 'success' && (
                <>
                  <div className="w-14 h-14 mx-auto bg-teal-50 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-teal-600" size={28} />
                  </div>
                  <h1 className="text-xl font-bold text-slate-900">Email verified!</h1>
                  <p className="text-sm text-slate-500">Your account is now fully active.</p>
                  <Link
                    href="/account"
                    className="inline-block mt-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition"
                  >
                    Go to my account
                  </Link>
                </>
              )}

              {status === 'error' && (
                <>
                  <div className="w-14 h-14 mx-auto bg-red-50 rounded-full flex items-center justify-center">
                    <XCircle className="text-red-500" size={28} />
                  </div>
                  <h1 className="text-xl font-bold text-slate-900">Verification failed</h1>
                  <p className="text-sm text-slate-500">{message}</p>
                  <Link
                    href="/account"
                    className="inline-block mt-2 text-sm font-medium text-teal-600 hover:text-teal-700"
                  >
                    Go to my account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
