// ============================================================
// FILE: src/pages/account/reset-password.tsx
// Reads ?token= from the URL (sent in the forgot-password email) and
// submits it to the backend. Did not previously exist.
// ============================================================
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Lock, Eye, EyeOff, XCircle, CheckCircle, Flame } from 'lucide-react';
import toast from 'react-hot-toast';
import authService from '@/lib/services/authService';

export default function ResetPasswordPage() {
  const router = useRouter();
  const token = typeof router.query.token === 'string' ? router.query.token : '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (password.length < 8) errs.password = 'Min 8 characters';
    else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password))
      errs.password = 'Needs uppercase, lowercase & number';
    if (password !== confirm) errs.confirm = 'Passwords do not match';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
      toast.success('Password updated!');
      setTimeout(() => router.push('/account/login'), 2000);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        'Failed to reset password. The link may have expired.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Set New Password — AquaGas</title>
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
              {!token ? (
                <div className="text-center space-y-4">
                  <div className="w-14 h-14 mx-auto bg-red-50 rounded-full flex items-center justify-center">
                    <XCircle className="text-red-500" size={28} />
                  </div>
                  <h1 className="text-xl font-bold text-slate-900">Invalid reset link</h1>
                  <p className="text-sm text-slate-500">
                    This link is missing its token. Please request a new one.
                  </p>
                  <Link
                    href="/account/forgot-password"
                    className="inline-block text-sm font-medium text-teal-600 hover:text-teal-700"
                  >
                    Request a new link
                  </Link>
                </div>
              ) : success ? (
                <div className="text-center space-y-4">
                  <div className="w-14 h-14 mx-auto bg-teal-50 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-teal-600" size={28} />
                  </div>
                  <h1 className="text-xl font-bold text-slate-900">Password updated</h1>
                  <p className="text-sm text-slate-500">Redirecting you to login…</p>
                </div>
              ) : (
                <>
                  <div className="mb-7">
                    <h1 className="text-2xl font-bold text-slate-900">Set a new password</h1>
                    <p className="text-sm text-slate-500 mt-1">Make it something you'll remember.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input
                          type={showPw ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors((p) => ({ ...p, password: '' }));
                          }}
                          autoComplete="new-password"
                          placeholder="••••••••"
                          className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition ${
                            errors.password ? 'border-red-400 bg-red-50' : 'border-slate-200'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw(!showPw)}
                          className="absolute right-3 top-3 text-slate-400"
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

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input
                          type={showPw ? 'text' : 'password'}
                          value={confirm}
                          onChange={(e) => {
                            setConfirm(e.target.value);
                            if (errors.confirm) setErrors((p) => ({ ...p, confirm: '' }));
                          }}
                          autoComplete="new-password"
                          placeholder="••••••••"
                          className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition ${
                            errors.confirm ? 'border-red-400 bg-red-50' : 'border-slate-200'
                          }`}
                        />
                      </div>
                      {errors.confirm && (
                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                          <XCircle size={12} /> {errors.confirm}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-60"
                    >
                      {submitting ? 'Resetting…' : 'Reset Password'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
