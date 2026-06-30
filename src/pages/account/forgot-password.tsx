// ============================================================
// FILE: src/pages/account/forgot-password.tsx
// Was linked from login.tsx ("Forgot password?") but never built —
// the link 404'd. Mirrors login.tsx's styling.
// ============================================================
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Mail, XCircle, CheckCircle, Flame, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import authService from '@/lib/services/authService';

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setError('Email is required');
      return;
    }
    if (!isValidEmail(trimmed)) {
      setError('Invalid email address');
      return;
    }

    setSubmitting(true);
    try {
      await authService.forgotPassword(trimmed);
      // Backend always returns the same message regardless of whether the
      // account exists, to avoid leaking which emails are registered.
      setSubmitted(true);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || err?.message || 'Something went wrong. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Reset Password — AquaGas</title>
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
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              {submitted ? (
                <div className="text-center space-y-4">
                  <div className="w-14 h-14 mx-auto bg-teal-50 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-teal-600" size={28} />
                  </div>
                  <h1 className="text-xl font-bold text-slate-900">Check your inbox</h1>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    If an account exists for <span className="font-semibold text-slate-800">{email}</span>,
                    a reset link is on its way. It expires in 1 hour.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-sm font-medium text-teal-600 hover:text-teal-700"
                  >
                    Try a different email
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-7">
                    <h1 className="text-2xl font-bold text-slate-900">Reset your password</h1>
                    <p className="text-sm text-slate-500 mt-1">
                      Enter your email and we'll send you a reset link.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (error) setError('');
                          }}
                          autoComplete="email"
                          placeholder="you@example.com"
                          className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition ${
                            error ? 'border-red-400 bg-red-50' : 'border-slate-200'
                          }`}
                        />
                      </div>
                      {error && (
                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                          <XCircle size={12} /> {error}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-60"
                    >
                      {submitting ? 'Sending…' : 'Send Reset Link'}
                    </button>
                  </form>
                </>
              )}

              <Link
                href="/account/login"
                className="mt-6 flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-teal-600"
              >
                <ArrowLeft size={14} /> Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
