// ============================================================
// FILE: src/pages/account/login.tsx
// Login & Register Page — Fixed to match backend API contract
// ============================================================

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Mail, Lock, User, Phone, Eye, EyeOff,
  Loader, CheckCircle, XCircle, Flame,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import toast from 'react-hot-toast';

// ── Helpers ──────────────────────────────────────────────────

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Backend validator: isMobilePhone(phone, 'any') — Kenya numbers
const isValidPhone = (phone: string) =>
  /^(\+254|0)[17]\d{8}$/.test(phone);

// Convert 0712345678 → +254712345678 (E.164)
const formatPhone = (phone: string) =>
  phone.startsWith('0') ? '+254' + phone.slice(1) : phone;

const getPasswordStrength = (pw: string) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const colors = ['bg-red-500', 'bg-orange-400', 'bg-amber-400', 'bg-emerald-500', 'bg-emerald-600'];
  return { score, label: labels[score - 1] ?? 'Very Weak', color: colors[score - 1] ?? 'bg-red-500' };
};

// ── Component ─────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const { login, register, isAuthenticated, loading } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Login form ──────────────────────────────────────────
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // ── Register form ───────────────────────────────────────
  // Field names match what we send to the backend
  const [regForm, setRegForm] = useState({
    fullName: '',        // → backend: fullName
    email: '',           // → backend: email
    phone: '',           // → backend: phone  (formatted before send)
    password: '',        // → backend: password
    confirmPassword: '', // frontend-only, not sent
  });

  const pwStrength = getPasswordStrength(regForm.password);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !loading) router.push('/account');
  }, [isAuthenticated, loading, router]);

  // ── Validate login ──────────────────────────────────────
  const validateLogin = () => {
    const e: Record<string, string> = {};
    if (!loginForm.email.trim()) e.email = 'Email is required';
    else if (!isValidEmail(loginForm.email)) e.email = 'Invalid email format';
    if (!loginForm.password) e.password = 'Password is required';
    else if (loginForm.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Validate register ───────────────────────────────────
  const validateRegister = () => {
    const e: Record<string, string> = {};

    if (!regForm.fullName.trim()) e.fullName = 'Full name is required';
    else if (regForm.fullName.trim().length < 2) e.fullName = 'Name must be at least 2 characters';

    if (!regForm.email.trim()) e.email = 'Email is required';
    else if (!isValidEmail(regForm.email)) e.email = 'Invalid email format';

    if (!regForm.phone.trim()) e.phone = 'Phone number is required';
    else if (!isValidPhone(regForm.phone.trim())) e.phone = 'Use format: +254712345678 or 0712345678';

    if (!regForm.password) e.password = 'Password is required';
    else if (regForm.password.length < 8) e.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(regForm.password) || !/[a-z]/.test(regForm.password) || !/\d/.test(regForm.password))
      e.password = 'Must contain uppercase, lowercase, and a number';

    if (!regForm.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (regForm.password !== regForm.confirmPassword) e.confirmPassword = 'Passwords do not match';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit: login ───────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setSubmitting(true);
    try {
      await login(loginForm.email.trim().toLowerCase(), loginForm.password);
      toast.success('Welcome back!');
      router.push('/account');
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? err?.message ?? 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Submit: register ────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;

    setSubmitting(true);
    try {
      /**
       * PAYLOAD sent to POST /auth/register (registerUser controller):
       *   { fullName, email, phone, password }
       *
       * Backend expects:
       *   req.body.fullName  → splits into first_name / last_name
       *   req.body.email     → stored as cleanEmail (trim + toLowerCase)
       *   req.body.phone     → stored as phone_number (E.164)
       *   req.body.password  → hashed with bcrypt
       */
      await register({
        fullName: regForm.fullName.trim(),
        email: regForm.email.trim().toLowerCase(),
        phone: formatPhone(regForm.phone.trim()),
        password: regForm.password,
      });

      toast.success('Account created! Welcome to AquaGas 🎉');
      router.push('/account');
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? err?.message ?? 'Registration failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Toggle forms ────────────────────────────────────────
  const toggleForm = () => {
    setIsLogin((v) => !v);
    setErrors({});
    setLoginForm({ email: '', password: '' });
    setRegForm({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  };

  // ── Helpers for input classes ───────────────────────────
  const inputCls = (field: string) =>
    `w-full pl-10 pr-4 py-3 border rounded-xl text-sm
     focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500
     transition-colors placeholder-slate-400
     ${errors[field] ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'}`;

  const errMsg = (field: string) =>
    errors[field] ? (
      <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5 font-medium">
        <XCircle size={13} /> {errors[field]}
      </p>
    ) : null;

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
        <title>{isLogin ? 'Login' : 'Create Account'} — AquaGas</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-sky-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">

          {/* Brand */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-teal-500 to-sky-600 p-2.5 rounded-xl shadow-md">
                <Flame size={22} className="text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">
                <span className="text-teal-600">Aqua</span>
                <span className="text-slate-900">Gas</span>
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isLogin ? 'Sign in to continue to AquaGas' : 'Fast, reliable LPG delivery in Kenya'}
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">

            {/* Tab switcher */}
            <div className="flex bg-slate-100 rounded-xl p-1 mb-7">
              {['Login', 'Register'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setIsLogin(tab === 'Login'); setErrors({}); }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    isLogin === (tab === 'Login')
                      ? 'bg-white text-teal-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* ── LOGIN FORM ─────────────────────────────── */}
            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-4" noValidate>
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => { setLoginForm({ ...loginForm, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                      className={inputCls('email')}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>
                  {errMsg('email')}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={(e) => { setLoginForm({ ...loginForm, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                      className={`${inputCls('password')} pr-10`}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errMsg('password')}
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                    <span className="text-sm text-slate-600">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                    Forgot password?
                  </button>
                </div>

                {/* CTA */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700
                             text-white py-3 rounded-xl font-semibold text-sm
                             disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2
                             transition-all duration-200 shadow-md hover:shadow-teal-200 active:scale-[0.98]"
                >
                  {submitting ? <><Loader className="animate-spin" size={17} /> Signing in…</> : 'Sign In'}
                </button>
              </form>

            ) : (
              /* ── REGISTER FORM ────────────────────────── */
              <form onSubmit={handleRegister} className="space-y-4" noValidate>

                {/* Full name — maps to req.body.fullName */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={regForm.fullName}
                      onChange={(e) => { setRegForm({ ...regForm, fullName: e.target.value }); setErrors({ ...errors, fullName: '' }); }}
                      className={inputCls('fullName')}
                      placeholder="Jane Doe"
                      autoComplete="name"
                    />
                  </div>
                  {errMsg('fullName')}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="email"
                      value={regForm.email}
                      onChange={(e) => { setRegForm({ ...regForm, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                      className={inputCls('email')}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>
                  {errMsg('email')}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="tel"
                      value={regForm.phone}
                      onChange={(e) => { setRegForm({ ...regForm, phone: e.target.value }); setErrors({ ...errors, phone: '' }); }}
                      className={inputCls('phone')}
                      placeholder="+254712345678 or 0712345678"
                      autoComplete="tel"
                    />
                  </div>
                  {errMsg('phone')}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={regForm.password}
                      onChange={(e) => { setRegForm({ ...regForm, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                      className={`${inputCls('password')} pr-10`}
                      placeholder="Min. 8 characters"
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Strength meter */}
                  {regForm.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <div key={lvl}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              lvl <= pwStrength.score ? pwStrength.color : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-500">
                        Strength: <span className="font-semibold text-slate-700">{pwStrength.label}</span>
                      </p>
                    </div>
                  )}
                  {errMsg('password')}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={regForm.confirmPassword}
                      onChange={(e) => { setRegForm({ ...regForm, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: '' }); }}
                      className={`${inputCls('confirmPassword')} pr-10`}
                      placeholder="Re-enter password"
                      autoComplete="new-password"
                    />
                    {regForm.confirmPassword && regForm.password === regForm.confirmPassword && (
                      <CheckCircle size={16} className="absolute right-3 top-3.5 text-emerald-500" />
                    )}
                  </div>
                  {errMsg('confirmPassword')}
                </div>

                {/* Terms */}
                <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                  <input type="checkbox" required
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 flex-shrink-0" />
                  <span className="text-sm text-slate-600 leading-snug">
                    I agree to the{' '}
                    <button type="button" className="text-teal-600 hover:underline font-semibold">Terms</button>
                    {' '}and{' '}
                    <button type="button" className="text-teal-600 hover:underline font-semibold">Privacy Policy</button>
                  </span>
                </label>

                {/* CTA */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700
                             text-white py-3 rounded-xl font-semibold text-sm
                             disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2
                             transition-all duration-200 shadow-md hover:shadow-teal-200 active:scale-[0.98]"
                >
                  {submitting ? <><Loader className="animate-spin" size={17} /> Creating account…</> : 'Create Account'}
                </button>
              </form>
            )}

            {/* Bottom toggle */}
            <p className="text-center text-sm text-slate-500 mt-6">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button onClick={toggleForm} className="text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                {isLogin ? 'Register' : 'Sign in'}
              </button>
            </p>
          </div>

          <p className="text-center text-xs text-slate-400 mt-5">
            © {new Date().getFullYear()} AquaGas Delivery · Nairobi, Kenya
          </p>
        </div>
      </div>
    </>
  );
}