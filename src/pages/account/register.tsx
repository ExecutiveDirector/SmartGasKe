// ============================================================
// FILE: src/pages/account/register.tsx
// Standalone registration page — separated from login
// ============================================================

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Loader,
  CheckCircle,
  XCircle,
  Flame,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import toast from 'react-hot-toast';

// ── Validation helpers ────────────────────────────────────────
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone: string) => /^(\+254|0)[17]\d{8}$/.test(phone);
const formatPhone  = (phone: string) =>
  phone.startsWith('0') ? '+254' + phone.slice(1) : phone;

const getPasswordStrength = (pw: string) => {
  let s = 0;
  if (pw.length >= 8)           s++;
  if (/[A-Z]/.test(pw))         s++;
  if (/[a-z]/.test(pw))         s++;
  if (/\d/.test(pw))            s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const colors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-teal-500', 'bg-teal-600'];
  return { strength: s, label: labels[s - 1] ?? 'Weak', color: colors[s - 1] ?? 'bg-red-500' };
};

// ── Field component ───────────────────────────────────────────
interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}
const Field: React.FC<FieldProps> = ({ label, error, children }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
    {children}
    {error && (
      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
        <XCircle size={12} /> {error}
      </p>
    )}
  </div>
);

// ── Page ──────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, loading } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [showPw, setShowPw]         = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [strength, setStrength]     = useState({ strength: 0, label: '', color: '' });

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated) router.replace('/account');
  }, [isAuthenticated, loading, router]);

  // Live password strength
  useEffect(() => {
    if (form.password) setStrength(getPasswordStrength(form.password));
    else setStrength({ strength: 0, label: '', color: '' });
  }, [form.password]);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // ── Validation ────────────────────────────────────────────
  const validate = (): boolean => {
    const e: Record<string, string> = {};

    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = 'Full name must be at least 2 characters';

    if (!form.email.trim())
      e.email = 'Email is required';
    else if (!isValidEmail(form.email.trim()))
      e.email = 'Invalid email address';

    if (!form.phone.trim())
      e.phone = 'Phone number is required';
    else if (!isValidPhone(form.phone.trim()))
      e.phone = 'Use format: +254712345678 or 0712345678';

    if (!form.password)
      e.password = 'Password is required';
    else if (form.password.length < 8)
      e.password = 'At least 8 characters required';
    else if (!/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password) || !/\d/.test(form.password))
      e.password = 'Must include uppercase, lowercase, and a number';

    if (!form.confirmPassword)
      e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register({
        fullName: form.name.trim(),
        email:    form.email.trim().toLowerCase(),
        phone:    formatPhone(form.phone.trim()),
        password: form.password,
      });
      toast.success('Account created — welcome to AquaGas!');
      router.push('/account');
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        'Registration failed. Please try again.';
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

  const pwMatch = form.confirmPassword && form.password === form.confirmPassword;

  return (
    <>
      <Head>
        <title>Create Account — AquaGas</title>
        <meta name="description" content="Create your AquaGas account and start ordering LPG gas." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/40 to-sky-50 flex flex-col">

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-teal-700 font-bold text-lg">
            <Flame size={20} className="text-teal-600" />
            AquaGas
          </Link>
          <Link
            href="/account/login"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-700 transition"
          >
            <ArrowLeft size={15} />
            Back to login
          </Link>
        </div>

        {/* Card */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">

              {/* Header */}
              <div className="mb-7">
                <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Fast LPG delivery across Nairobi — join thousands of happy customers.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>

                {/* Full Name */}
                <Field label="Full Name" error={errors.name}>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={form.name}
                      onChange={set('name')}
                      autoComplete="name"
                      placeholder="Jane Kamau"
                      className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition ${
                        errors.name ? 'border-red-400 bg-red-50' : 'border-slate-200'
                      }`}
                    />
                  </div>
                </Field>

                {/* Email */}
                <Field label="Email Address" error={errors.email}>
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
                </Field>

                {/* Phone */}
                <Field label="Phone Number" error={errors.phone}>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={set('phone')}
                      autoComplete="tel"
                      placeholder="0712 345 678"
                      className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition ${
                        errors.phone ? 'border-red-400 bg-red-50' : 'border-slate-200'
                      }`}
                    />
                  </div>
                </Field>

                {/* Password */}
                <Field label="Password" error={errors.password}>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={form.password}
                      onChange={set('password')}
                      autoComplete="new-password"
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

                  {/* Strength bar */}
                  {form.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1,2,3,4,5].map(n => (
                          <div
                            key={n}
                            className={`h-1 flex-1 rounded-full transition-all ${
                              n <= strength.strength ? strength.color : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-500">
                        Strength: <span className="font-medium text-slate-700">{strength.label}</span>
                      </p>
                    </div>
                  )}
                </Field>

                {/* Confirm Password */}
                <Field label="Confirm Password" error={errors.confirmPassword}>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={set('confirmPassword')}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition ${
                        errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-slate-200'
                      }`}
                    />
                    {pwMatch && (
                      <CheckCircle className="absolute right-3 top-3 text-teal-500" size={18} />
                    )}
                  </div>
                </Field>

                {/* Terms */}
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="mt-0.5 w-4 h-4 accent-teal-600 rounded"
                  />
                  <span className="text-xs text-slate-500 leading-relaxed">
                    I agree to the{' '}
                    <a href="/terms" className="text-teal-600 hover:underline font-medium">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-teal-600 hover:underline font-medium">Privacy Policy</a>
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 shadow-sm mt-2"
                >
                  {submitting ? (
                    <><Loader className="animate-spin" size={18} /> Creating account...</>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Footer link */}
              <p className="text-center text-sm text-slate-500 mt-6">
                Already have an account?{' '}
                <Link href="/account/login" className="text-teal-600 hover:text-teal-700 font-semibold">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
