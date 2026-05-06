// ============================================================
// FILE: src/pages/account/login.tsx
// Login only — registration is at /account/register
// ============================================================

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Mail, Lock, Eye, EyeOff, Loader, XCircle, Flame } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import toast from 'react-hot-toast';

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading } = useAuth();

  const [form, setForm]             = useState({ email: '', password: '' });
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [showPw, setShowPw]         = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) router.replace('/account');
  }, [isAuthenticated, loading, router]);

  const set = (field: 'email' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.email.trim())
      e.email = 'Email is required';
    else if (!isValidEmail(form.email.trim()))
      e.email = 'Invalid email address';
    if (!form.password)
      e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(form.email.trim().toLowerCase(), form.password);
      toast.success('Welcome back!');

      // Honour ?redirect= query param (e.g. from protected pages)
      const redirect = router.query.redirect as string | undefined;
      router.push(redirect && redirect.startsWith('/') ? redirect : '/account');
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        'Login failed. Please check your credentials.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader className="animate-spin text-teal-600" size={36} />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Login — AquaGas</title>
        <meta name="description" content="Login to your AquaGas account" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/40 to-sky-50 flex flex-col">

        {/* Top bar */}
        <div className="flex items-center px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-teal-700 font-bold text-lg">
            <Flame size={20} className="text-teal-600" />
            AquaGas
          </Link>
        </div>

        {/* Card */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-sm">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">

              {/* Header */}
              <div className="mb-7">
                <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Log in to manage your orders and wallet.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                      type="email"
                      value={form.email}
                      onChange={set('email')}
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition ${
                        errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <XCircle size={12} /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-semibold text-slate-700">Password</label>
                    <Link
                      href="/account/forgot-password"
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={form.password}
                      onChange={set('password')}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition ${
                        errors.password ? 'border-red-400 bg-red-50' : 'border-slate-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      tabIndex={-1}
                    >
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <XCircle size={12} /> {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 shadow-sm mt-2"
                >
                  {submitting ? (
                    <><Loader className="animate-spin" size={18} /> Logging in...</>
                  ) : (
                    'Log In'
                  )}
                </button>
              </form>

              {/* Footer link */}
              <p className="text-center text-sm text-slate-500 mt-6">
                Don&apos;t have an account?{' '}
                <Link href="/account/register" className="text-teal-600 hover:text-teal-700 font-semibold">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
