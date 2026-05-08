// ============================================================
// FILE: src/pages/account/register.tsx
// Unified Registration Page — Web + Phone OTP flow merged
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Mail, Lock, User, Phone, Eye, EyeOff, Loader,
  CheckCircle, XCircle, ArrowLeft, ArrowRight,
  Flame, Shield, Smartphone, KeyRound, Sparkles,
  RefreshCw, ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import toast from 'react-hot-toast';

// ── Helpers ────────────────────────────────────────────────────────
const isValidEmail   = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidPhone   = (v: string) => /^(\+254|0)[17]\d{8}$/.test(v);
const formatPhone    = (v: string) => v.startsWith('0') ? '+254' + v.slice(1) : v;
const normalizeEmail = (v: string) => v.trim().toLowerCase();

const passwordStrength = (pw: string) => {
  const checks = [pw.length >= 8, /[A-Z]/.test(pw), /[a-z]/.test(pw), /\d/.test(pw), /[^A-Za-z0-9]/.test(pw)];
  const score  = checks.filter(Boolean).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const colors = ['', '#ef4444', '#f97316', '#eab308', '#14b8a6', '#0d9488'];
  return { score, label: labels[score], color: colors[score] };
};

// ── Step definitions ────────────────────────────────────────────────
type Step = 'method' | 'phone-entry' | 'phone-otp' | 'phone-profile' | 'email-form';

// ── Reusable Field ─────────────────────────────────────────────────
const Field: React.FC<{ label: string; error?: string; hint?: string; children: React.ReactNode }> = ({ label, error, hint, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</label>
    {children}
    {error && <p className="flex items-center gap-1 text-xs text-red-400"><XCircle size={11} />{error}</p>}
    {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
  </div>
);

// ── Styled Input ───────────────────────────────────────────────────
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean; icon?: React.ReactNode; suffix?: React.ReactNode }> = ({
  hasError, icon, suffix, className = '', ...props
}) => (
  <div className="relative">
    {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">{icon}</span>}
    <input
      {...props}
      className={`
        w-full bg-slate-800/60 border rounded-xl py-3.5 text-sm text-white placeholder-slate-500
        focus:outline-none focus:ring-2 transition-all duration-200
        ${icon ? 'pl-11' : 'pl-4'}
        ${suffix ? 'pr-12' : 'pr-4'}
        ${hasError
          ? 'border-red-500/60 focus:ring-red-500/30 bg-red-900/10'
          : 'border-slate-700/60 focus:ring-teal-500/40 focus:border-teal-500/50'
        }
        ${className}
      `}
    />
    {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</span>}
  </div>
);

// ── OTP Digit Input ────────────────────────────────────────────────
const OTPInput: React.FC<{ value: string; onChange: (v: string) => void; error?: boolean }> = ({ value, onChange, error }) => {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.split('').concat(Array(6).fill('')).slice(0, 6);

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const next  = [...digits];
    next[i]     = char;
    const joined = next.join('');
    onChange(joined);
    if (char && i < 5) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) onChange(pasted);
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
          className={`
            w-11 h-14 text-center text-xl font-bold rounded-xl border transition-all duration-200
            bg-slate-800/60 text-white caret-teal-400
            focus:outline-none focus:ring-2
            ${d ? 'border-teal-500/70 bg-teal-900/20' : error ? 'border-red-500/60' : 'border-slate-700/60'}
            focus:ring-teal-500/40 focus:border-teal-500
          `}
        />
      ))}
    </div>
  );
};

// ── Progress Stepper ───────────────────────────────────────────────
const StepDots: React.FC<{ total: number; current: number }> = ({ total, current }) => (
  <div className="flex items-center gap-1.5 justify-center mb-8">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`rounded-full transition-all duration-300 ${
          i === current ? 'w-6 h-2 bg-teal-400' : i < current ? 'w-2 h-2 bg-teal-600' : 'w-2 h-2 bg-slate-700'
        }`}
      />
    ))}
  </div>
);

// ── Main Page ──────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, loading } = useAuth();

  const [step, setStep]           = useState<Step>('method');
  const [submitting, setSubmitting] = useState(false);

  // Phone OTP state
  const [phone, setPhone]         = useState('');
  const [otp, setOtp]             = useState('');
  const [otpError, setOtpError]   = useState(false);
  const [resend, setResend]       = useState(0);
  const resendTimer               = useRef<NodeJS.Timeout>();

  // Profile (phone flow)
  const [profile, setProfile]     = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', setPassword: false });

  // Email flow
  const [emailForm, setEmailForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [showPw, setShowPw]       = useState(false);
  const [strength, setStrength]   = useState({ score: 0, label: '', color: '' });

  useEffect(() => { if (!loading && isAuthenticated) router.replace('/account'); }, [isAuthenticated, loading]);
  useEffect(() => { if (emailForm.password) setStrength(passwordStrength(emailForm.password)); else setStrength({ score: 0, label: '', color: '' }); }, [emailForm.password]);
  useEffect(() => { if (profile.password) setStrength(passwordStrength(profile.password)); }, [profile.password]);

  // Resend countdown
  const startResend = useCallback(() => {
    setResend(60);
    clearInterval(resendTimer.current);
    resendTimer.current = setInterval(() => {
      setResend(s => { if (s <= 1) { clearInterval(resendTimer.current); return 0; } return s - 1; });
    }, 1000);
  }, []);
  useEffect(() => () => clearInterval(resendTimer.current), []);

  // ── Handlers ──────────────────────────────────────────────────────
  const handleSendOTP = async () => {
    const formatted = formatPhone(phone.trim());
    if (!isValidPhone(phone.trim())) { toast.error('Enter a valid Kenyan number'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/auth/send-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formatted }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to send OTP');
      startResend();
      setStep('phone-otp');
      toast.success('OTP sent!');
    } catch (e: any) { toast.error(e.message); }
    finally { setSubmitting(false); }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) { setOtpError(true); return; }
    setOtpError(false);
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/auth/verify-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formatPhone(phone.trim()), otp }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Invalid OTP');
      setStep('phone-profile');
    } catch (e: any) { setOtpError(true); toast.error(e.message); }
    finally { setSubmitting(false); }
  };

  const handlePhoneRegister = async () => {
    const e: Record<string, string> = {};
    if (!profile.firstName.trim() || profile.firstName.trim().length < 2) e.firstName = 'Required (min 2 chars)';
    if (!profile.lastName.trim() || profile.lastName.trim().length < 2)   e.lastName  = 'Required (min 2 chars)';
    if (profile.email && !isValidEmail(profile.email)) e.email = 'Invalid email';
    if (profile.setPassword) {
      if (profile.password.length < 8) e.password = 'Min 8 characters';
      else if (!/[A-Z]/.test(profile.password) || !/[a-z]/.test(profile.password) || !/\d/.test(profile.password)) e.password = 'Add uppercase, lowercase & number';
      if (profile.password !== profile.confirmPassword) e.confirmPassword = 'Passwords do not match';
    }
    setErrors(e);
    if (Object.keys(e).length) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/auth/register/phone', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formatPhone(phone.trim()),
          firstName: profile.firstName.trim(),
          lastName:  profile.lastName.trim(),
          email:     profile.email ? normalizeEmail(profile.email) : undefined,
          password:  profile.setPassword ? profile.password : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      if (data.token) localStorage.setItem('authToken', data.token);
      toast.success('Welcome to AquaGas! 🔥');
      router.push('/account');
    } catch (e: any) { toast.error(e.message); }
    finally { setSubmitting(false); }
  };

  const validateEmailForm = () => {
    const e: Record<string, string> = {};
    if (!emailForm.name.trim() || emailForm.name.trim().length < 2) e.name = 'Full name required (min 2 chars)';
    if (!emailForm.email.trim()) e.email = 'Email required';
    else if (!isValidEmail(emailForm.email.trim())) e.email = 'Invalid email address';
    if (!emailForm.phone.trim()) e.phone = 'Phone number required';
    else if (!isValidPhone(emailForm.phone.trim())) e.phone = 'Use: +254712345678 or 0712345678';
    if (!emailForm.password) e.password = 'Password required';
    else if (emailForm.password.length < 8) e.password = 'Min 8 characters';
    else if (!/[A-Z]/.test(emailForm.password) || !/[a-z]/.test(emailForm.password) || !/\d/.test(emailForm.password)) e.password = 'Needs uppercase, lowercase & number';
    if (emailForm.password !== emailForm.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleEmailRegister = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validateEmailForm()) return;
    setSubmitting(true);
    try {
      await register({
        fullName: emailForm.name.trim(),
        email:    normalizeEmail(emailForm.email),
        phone:    formatPhone(emailForm.phone.trim()),
        password: emailForm.password,
      });
      toast.success('Welcome to AquaGas! 🔥');
      router.push('/account');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err?.message || 'Registration failed');
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
      <Loader className="animate-spin text-teal-400" size={32} />
    </div>
  );

  // ── Computed helpers ──────────────────────────────────────────────
  const stepIndex: Record<Step, number> = { 'method': 0, 'phone-entry': 1, 'phone-otp': 2, 'phone-profile': 3, 'email-form': 1 };
  const pwMatch = emailForm.confirmPassword && emailForm.password === emailForm.confirmPassword;
  const profilePwMatch = profile.confirmPassword && profile.password === profile.confirmPassword;

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <>
      <Head>
        <title>Create Account — AquaGas</title>
        <meta name="description" content="Create your AquaGas account. Fast LPG delivery across Nairobi." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        body { background: #080c14; }
        .font-display { font-family: 'Syne', sans-serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }
        @keyframes float-slow { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(3deg); } }
        @keyframes float-fast { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes gradient-x { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes slide-up   { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in    { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: .6; } 100% { transform: scale(1.4); opacity: 0; } }
        .anim-slide-up { animation: slide-up 0.45s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-fade-in  { animation: fade-in  0.3s ease both; }
        .anim-float-a  { animation: float-slow 8s ease-in-out infinite; }
        .anim-float-b  { animation: float-fast 6s ease-in-out infinite; }
        .gradient-text {
          background: linear-gradient(135deg, #2dd4bf 0%, #0ea5e9 50%, #6366f1 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: gradient-x 4s ease infinite;
        }
        .glow-teal { box-shadow: 0 0 40px rgba(20,184,166,.15), 0 0 80px rgba(20,184,166,.07); }
        .card-glass {
          background: rgba(15,23,42,0.85);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .btn-primary {
          background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%);
          transition: all 0.2s;
        }
        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #0f766e 0%, #0369a1 100%);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(13,148,136,.35);
        }
        .btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; box-shadow: none; }
        .method-card {
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(15,23,42,0.6);
          transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
        }
        .method-card:hover {
          border-color: rgba(20,184,166,0.4);
          background: rgba(13,148,136,0.08);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(13,148,136,.15);
        }
        .otp-sent-ring::after {
          content: ''; position: absolute; inset: -6px; border-radius: 9999px;
          border: 2px solid rgba(20,184,166,0.5);
          animation: pulse-ring 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>

      <div className="font-body min-h-screen bg-[#080c14] text-white relative overflow-hidden flex flex-col">

        {/* ── Background atmosphere ── */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-teal-600/5 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-sky-600/5 blur-[120px]" />
          <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full bg-indigo-600/5 blur-[100px]" />
          {/* Decorative floating orbs */}
          <div className="anim-float-a absolute top-[15%] right-[8%] w-16 h-16 rounded-full border border-teal-500/10 bg-teal-500/5" />
          <div className="anim-float-b absolute top-[55%] left-[5%] w-10 h-10 rounded-full border border-sky-500/10 bg-sky-500/5" />
          <div className="anim-float-a absolute bottom-[20%] right-[18%] w-8 h-8 rounded-full border border-indigo-500/10 bg-indigo-500/5" style={{ animationDelay: '3s' }} />
          {/* Grid texture */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        {/* ── Top nav ── */}
        <nav className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-lg shadow-teal-500/30">
                <Flame size={16} className="text-white" />
              </div>
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight">AquaGas</span>
          </Link>
          <Link href="/account/login" className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-teal-400 transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to login
          </Link>
        </nav>

        {/* ── Main content ── */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-[440px]">

            {/* ─────────────────────────────────────────── */}
            {/* STEP: Method Selection                      */}
            {/* ─────────────────────────────────────────── */}
            {step === 'method' && (
              <div className="anim-slide-up">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-1.5 text-xs font-medium text-teal-400 mb-6">
                    <Sparkles size={12} />
                    Fast delivery across Nairobi
                  </div>
                  <h1 className="font-display text-4xl font-bold mb-3">
                    <span className="gradient-text">Create Account</span>
                  </h1>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Join thousands ordering LPG gas with ease.<br />Choose how you'd like to sign up.
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  {/* Phone OTP method */}
                  <button
                    onClick={() => setStep('phone-entry')}
                    className="method-card w-full rounded-2xl p-5 text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500/20 transition-colors">
                        <Smartphone size={22} className="text-teal-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-display font-semibold text-white text-sm">Phone Number</p>
                          <span className="text-[10px] font-semibold uppercase tracking-wide bg-teal-500/15 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full">Recommended</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">Verify with a 6-digit OTP. No password needed to get started.</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-600 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </div>
                  </button>

                  {/* Email method */}
                  <button
                    onClick={() => setStep('email-form')}
                    className="method-card w-full rounded-2xl p-5 text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-500/20 transition-colors">
                        <Mail size={22} className="text-sky-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-display font-semibold text-white text-sm mb-1">Email & Password</p>
                        <p className="text-xs text-slate-500 leading-relaxed">Full account with email, phone, and a secure password.</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-600 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </div>
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-slate-800" />
                  <span className="text-xs text-slate-600">secure & encrypted</span>
                  <div className="flex-1 h-px bg-slate-800" />
                </div>

                <div className="flex items-center justify-center gap-6 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5"><Shield size={11} className="text-teal-600" />256-bit SSL</span>
                  <span className="flex items-center gap-1.5"><CheckCircle size={11} className="text-teal-600" />GDPR Compliant</span>
                  <span className="flex items-center gap-1.5"><KeyRound size={11} className="text-teal-600" />End-to-end</span>
                </div>

                <p className="text-center text-xs text-slate-600 mt-8">
                  Already have an account?{' '}
                  <Link href="/account/login" className="text-teal-400 hover:text-teal-300 font-semibold transition-colors">Log in</Link>
                </p>
              </div>
            )}

            {/* ─────────────────────────────────────────── */}
            {/* STEP: Phone Entry                           */}
            {/* ─────────────────────────────────────────── */}
            {step === 'phone-entry' && (
              <div className="anim-slide-up">
                <StepDots total={3} current={0} />
                <button onClick={() => setStep('method')} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-400 transition-colors mb-6">
                  <ArrowLeft size={13} /> Back
                </button>

                <div className="text-center mb-8">
                  <div className="inline-flex w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 items-center justify-center mb-5">
                    <Smartphone size={28} className="text-teal-400" />
                  </div>
                  <h2 className="font-display text-2xl font-bold mb-2">Your phone number</h2>
                  <p className="text-slate-400 text-sm">We'll send a verification code to confirm it's you.</p>
                </div>

                <div className="card-glass rounded-2xl p-6 glow-teal space-y-5">
                  <Field label="Phone Number" hint="Kenyan numbers: +254 or 07xx">
                    <Input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+254 712 345 678"
                      icon={<Phone size={16} />}
                      onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                    />
                  </Field>

                  <button onClick={handleSendOTP} disabled={submitting} className="btn-primary w-full py-3.5 rounded-xl font-display font-semibold text-sm text-white flex items-center justify-center gap-2">
                    {submitting ? <><Loader size={16} className="animate-spin" />Sending…</> : <>Send OTP <ArrowRight size={15} /></>}
                  </button>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────── */}
            {/* STEP: Phone OTP Verification                */}
            {/* ─────────────────────────────────────────── */}
            {step === 'phone-otp' && (
              <div className="anim-slide-up">
                <StepDots total={3} current={1} />
                <button onClick={() => setStep('phone-entry')} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-400 transition-colors mb-6">
                  <ArrowLeft size={13} /> Change number
                </button>

                <div className="text-center mb-8">
                  <div className="inline-flex relative w-16 h-16 rounded-full bg-teal-500/15 border border-teal-500/30 items-center justify-center mb-5 otp-sent-ring">
                    <Shield size={26} className="text-teal-400" />
                  </div>
                  <h2 className="font-display text-2xl font-bold mb-2">Enter your code</h2>
                  <p className="text-slate-400 text-sm">
                    Sent to <span className="text-teal-400 font-medium">{formatPhone(phone.trim())}</span>
                  </p>
                </div>

                <div className="card-glass rounded-2xl p-6 glow-teal space-y-6">
                  <div className="space-y-2">
                    <OTPInput value={otp} onChange={v => { setOtp(v); setOtpError(false); }} error={otpError} />
                    {otpError && <p className="text-center text-xs text-red-400 flex items-center justify-center gap-1"><XCircle size={11} />Invalid or expired code</p>}
                  </div>

                  <button onClick={handleVerifyOTP} disabled={submitting || otp.length !== 6} className="btn-primary w-full py-3.5 rounded-xl font-display font-semibold text-sm text-white flex items-center justify-center gap-2">
                    {submitting ? <><Loader size={16} className="animate-spin" />Verifying…</> : <>Verify Code <CheckCircle size={15} /></>}
                  </button>

                  <div className="text-center">
                    {resend > 0 ? (
                      <p className="text-xs text-slate-500">Resend code in <span className="text-teal-400 font-semibold tabular-nums">{resend}s</span></p>
                    ) : (
                      <button onClick={handleSendOTP} disabled={submitting} className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 mx-auto transition-colors">
                        <RefreshCw size={12} />Resend code
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────── */}
            {/* STEP: Phone Profile Completion              */}
            {/* ─────────────────────────────────────────── */}
            {step === 'phone-profile' && (
              <div className="anim-slide-up">
                <StepDots total={3} current={2} />

                <div className="text-center mb-8">
                  <div className="inline-flex w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 items-center justify-center mb-5">
                    <User size={28} className="text-teal-400" />
                  </div>
                  <h2 className="font-display text-2xl font-bold mb-2">Complete your profile</h2>
                  <p className="text-slate-400 text-sm">A few more details and you're ready to order.</p>
                </div>

                {/* Verified badge */}
                <div className="flex items-center gap-3 bg-teal-500/8 border border-teal-500/20 rounded-xl px-4 py-3 mb-5">
                  <CheckCircle size={16} className="text-teal-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-teal-300">Phone Verified</p>
                    <p className="text-xs text-slate-500">{formatPhone(phone.trim())}</p>
                  </div>
                </div>

                <div className="card-glass rounded-2xl p-6 glow-teal space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="First Name" error={errors.firstName}>
                      <Input value={profile.firstName} onChange={e => { setProfile(p => ({ ...p, firstName: e.target.value })); setErrors(er => ({ ...er, firstName: '' })); }} placeholder="Jane" hasError={!!errors.firstName} icon={<User size={14} />} />
                    </Field>
                    <Field label="Last Name" error={errors.lastName}>
                      <Input value={profile.lastName} onChange={e => { setProfile(p => ({ ...p, lastName: e.target.value })); setErrors(er => ({ ...er, lastName: '' })); }} placeholder="Kamau" hasError={!!errors.lastName} icon={<User size={14} />} />
                    </Field>
                  </div>

                  <Field label="Email Address" hint="Optional — for receipts & updates" error={errors.email}>
                    <Input type="email" value={profile.email} onChange={e => { setProfile(p => ({ ...p, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }} placeholder="you@example.com" hasError={!!errors.email} icon={<Mail size={14} />} />
                  </Field>

                  {/* Password toggle */}
                  <div className="border-t border-slate-800/80 pt-4">
                    <button
                      type="button"
                      onClick={() => setProfile(p => ({ ...p, setPassword: !p.setPassword }))}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 ${
                        profile.setPassword
                          ? 'border-teal-500/30 bg-teal-500/8'
                          : 'border-slate-700/60 bg-slate-800/30 hover:border-slate-600'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${profile.setPassword ? 'bg-teal-500/20' : 'bg-slate-700/60'}`}>
                        <Lock size={15} className={profile.setPassword ? 'text-teal-400' : 'text-slate-500'} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-semibold ${profile.setPassword ? 'text-teal-300' : 'text-slate-300'}`}>
                          {profile.setPassword ? 'Password enabled' : 'Set a password (optional)'}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {profile.setPassword ? 'Login with phone/email + password' : 'You can add one later in settings'}
                        </p>
                      </div>
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${profile.setPassword ? 'border-teal-400 bg-teal-400' : 'border-slate-600'}`}>
                        {profile.setPassword && <CheckCircle size={10} className="text-slate-900" />}
                      </div>
                    </button>

                    {profile.setPassword && (
                      <div className="mt-4 space-y-3 anim-slide-up">
                        <Field label="Password" error={errors.password}>
                          <Input type={showPw ? 'text' : 'password'} value={profile.password} onChange={e => { setProfile(p => ({ ...p, password: e.target.value })); setErrors(er => ({ ...er, password: '' })); }} placeholder="••••••••" hasError={!!errors.password} icon={<Lock size={14} />} suffix={
                            <button type="button" onClick={() => setShowPw(!showPw)} className="text-slate-500 hover:text-slate-300 transition-colors p-1">
                              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                          } />
                          {profile.password && (
                            <div className="mt-2 space-y-1">
                              <div className="flex gap-1">
                                {[1,2,3,4,5].map(n => (
                                  <div key={n} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ backgroundColor: n <= passwordStrength(profile.password).score ? passwordStrength(profile.password).color : '#1e293b' }} />
                                ))}
                              </div>
                              <p className="text-[11px]" style={{ color: passwordStrength(profile.password).color }}>{passwordStrength(profile.password).label}</p>
                            </div>
                          )}
                        </Field>
                        <Field label="Confirm Password" error={errors.confirmPassword}>
                          <Input type={showPw ? 'text' : 'password'} value={profile.confirmPassword} onChange={e => { setProfile(p => ({ ...p, confirmPassword: e.target.value })); setErrors(er => ({ ...er, confirmPassword: '' })); }} placeholder="••••••••" hasError={!!errors.confirmPassword} icon={<Lock size={14} />} suffix={profilePwMatch ? <CheckCircle size={15} className="text-teal-400" /> : undefined} />
                        </Field>
                      </div>
                    )}
                  </div>

                  <button onClick={handlePhoneRegister} disabled={submitting} className="btn-primary w-full py-3.5 rounded-xl font-display font-semibold text-sm text-white flex items-center justify-center gap-2 mt-2">
                    {submitting ? <><Loader size={16} className="animate-spin" />Creating account…</> : <>Create Account <Sparkles size={14} /></>}
                  </button>

                  <p className="text-center text-[11px] text-slate-600 leading-relaxed">
                    By registering you agree to our{' '}
                    <a href="/terms" className="text-teal-500 hover:text-teal-400">Terms</a> &{' '}
                    <a href="/privacy" className="text-teal-500 hover:text-teal-400">Privacy Policy</a>
                  </p>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────── */}
            {/* STEP: Email + Password Form                 */}
            {/* ─────────────────────────────────────────── */}
            {step === 'email-form' && (
              <div className="anim-slide-up">
                <button onClick={() => setStep('method')} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-400 transition-colors mb-6">
                  <ArrowLeft size={13} /> Choose another method
                </button>

                <div className="text-center mb-8">
                  <div className="inline-flex w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 items-center justify-center mb-5">
                    <Mail size={28} className="text-sky-400" />
                  </div>
                  <h2 className="font-display text-2xl font-bold mb-2">Create your account</h2>
                  <p className="text-slate-400 text-sm">Fast LPG delivery across Nairobi.</p>
                </div>

                <form onSubmit={handleEmailRegister} noValidate>
                  <div className="card-glass rounded-2xl p-6 glow-teal space-y-4">

                    <Field label="Full Name" error={errors.name}>
                      <Input type="text" value={emailForm.name} onChange={e => { setEmailForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: '' })); }} autoComplete="name" placeholder="Jane Kamau" hasError={!!errors.name} icon={<User size={14} />} />
                    </Field>

                    <Field label="Email Address" error={errors.email}>
                      <Input type="email" value={emailForm.email} onChange={e => { setEmailForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }} autoComplete="email" placeholder="you@example.com" hasError={!!errors.email} icon={<Mail size={14} />} />
                    </Field>

                    <Field label="Phone Number" error={errors.phone} hint="Format: +254712345678 or 0712345678">
                      <Input type="tel" value={emailForm.phone} onChange={e => { setEmailForm(f => ({ ...f, phone: e.target.value })); setErrors(er => ({ ...er, phone: '' })); }} autoComplete="tel" placeholder="0712 345 678" hasError={!!errors.phone} icon={<Phone size={14} />} />
                    </Field>

                    <Field label="Password" error={errors.password}>
                      <Input type={showPw ? 'text' : 'password'} value={emailForm.password} onChange={e => { setEmailForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })); }} autoComplete="new-password" placeholder="••••••••" hasError={!!errors.password} icon={<Lock size={14} />} suffix={
                        <button type="button" onClick={() => setShowPw(!showPw)} className="text-slate-500 hover:text-slate-300 transition-colors p-1">
                          {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      } />
                      {emailForm.password && (
                        <div className="mt-2 space-y-1">
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(n => (
                              <div key={n} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ backgroundColor: n <= strength.score ? strength.color : '#1e293b' }} />
                            ))}
                          </div>
                          <p className="text-[11px]" style={{ color: strength.color }}>{strength.label}</p>
                        </div>
                      )}
                    </Field>

                    <Field label="Confirm Password" error={errors.confirmPassword}>
                      <Input type={showPw ? 'text' : 'password'} value={emailForm.confirmPassword} onChange={e => { setEmailForm(f => ({ ...f, confirmPassword: e.target.value })); setErrors(er => ({ ...er, confirmPassword: '' })); }} autoComplete="new-password" placeholder="••••••••" hasError={!!errors.confirmPassword} icon={<Lock size={14} />} suffix={pwMatch ? <CheckCircle size={15} className="text-teal-400" /> : undefined} />
                    </Field>

                    {/* Terms checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input type="checkbox" required className="mt-0.5 w-4 h-4 accent-teal-500 rounded flex-shrink-0" />
                      <span className="text-xs text-slate-500 leading-relaxed">
                        I agree to the{' '}
                        <a href="/terms" className="text-teal-400 hover:text-teal-300 font-semibold">Terms of Service</a>{' '}
                        and{' '}
                        <a href="/privacy" className="text-teal-400 hover:text-teal-300 font-semibold">Privacy Policy</a>
                      </span>
                    </label>

                    <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5 rounded-xl font-display font-semibold text-sm text-white flex items-center justify-center gap-2">
                      {submitting ? <><Loader size={16} className="animate-spin" />Creating account…</> : <>Create Account <Sparkles size={14} /></>}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-slate-800" />
                      <span className="text-xs text-slate-600">or</span>
                      <div className="flex-1 h-px bg-slate-800" />
                    </div>

                    <button type="button" onClick={() => setStep('phone-entry')} className="w-full py-3 rounded-xl border border-slate-700/60 bg-slate-800/40 hover:border-teal-500/30 hover:bg-teal-500/5 text-sm font-medium text-slate-300 hover:text-teal-300 flex items-center justify-center gap-2 transition-all duration-200">
                      <Smartphone size={15} />
                      Sign up with phone instead
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── Footer login link ── */}
            {step !== 'method' && step !== 'email-form' && (
              <p className="text-center text-xs text-slate-600 mt-6">
                Already have an account?{' '}
                <Link href="/account/login" className="text-teal-400 hover:text-teal-300 font-semibold transition-colors">Log in</Link>
              </p>
            )}
          </div>
        </div>

        {/* ── Bottom brand strip ── */}
        <div className="relative z-10 text-center pb-6 pt-2">
          <p className="text-xs text-slate-700">© {new Date().getFullYear()} AquaGas Kenya · Secure payments · 24/7 support</p>
        </div>
      </div>
    </>
  );
}
