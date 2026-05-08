// ============================================================
// FILE: src/pages/account/register.tsx
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Mail, Lock, User, Phone, Eye, EyeOff, Loader,
  CheckCircle, XCircle, ArrowLeft, Smartphone,
  RefreshCw, ChevronRight, ShieldCheck, Zap, Package,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import toast from 'react-hot-toast';

// ── API ─────────────────────────────────────────────────────────────
const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL ?? 'https://aquagas-backend.onrender.com') +
  '/api/v1/auth';

async function apiPost<T = any>(path: string, body: object): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  const ct = res.headers.get('content-type') ?? '';
  if (!ct.includes('application/json'))
    throw new Error(`Server error (${res.status}) — check NEXT_PUBLIC_API_URL`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
  return data as T;
}

// ── Validators ──────────────────────────────────────────────────────
const isValidEmail   = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidPhone   = (v: string) => /^(\+254|0)[17]\d{8}$/.test(v);
const formatPhone    = (v: string) => v.startsWith('0') ? '+254' + v.slice(1) : v;
const normalizeEmail = (v: string) => v.trim().toLowerCase();

const pwStrength = (pw: string) => {
  const s = [pw.length >= 8, /[A-Z]/.test(pw), /[a-z]/.test(pw), /\d/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;
  return {
    score: s,
    label: ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][s],
    pct:   (s / 5) * 100,
    color: ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'][s],
  };
};

type Step = 'method' | 'phone-entry' | 'phone-otp' | 'phone-profile' | 'email-form';

// ── OTP Input ───────────────────────────────────────────────────────
const OTPBox: React.FC<{ value: string; onChange: (v: string) => void; error: boolean }> = ({ value, onChange, error }) => {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, ' ').split('').slice(0, 6);

  return (
    <div className="flex gap-2.5 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el; }}
          type="text" inputMode="numeric" maxLength={1}
          value={d.trim()}
          onPaste={e => {
            const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
            if (p.length === 6) { onChange(p); e.preventDefault(); }
          }}
          onChange={e => {
            const ch = e.target.value.replace(/\D/g, '').slice(-1);
            const next = [...digits]; next[i] = ch || ' ';
            onChange(next.join('').trimEnd());
            if (ch && i < 5) refs.current[i + 1]?.focus();
          }}
          onKeyDown={e => {
            if (e.key === 'Backspace' && !d.trim() && i > 0) refs.current[i - 1]?.focus();
          }}
          className={`otp-digit w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-150
            ${d.trim()
              ? 'border-amber-500 bg-amber-50 text-amber-800 shadow-amber-100 shadow-md'
              : error
                ? 'border-red-300 bg-red-50 text-red-700'
                : 'border-stone-200 bg-white text-stone-800'
            }`}
        />
      ))}
    </div>
  );
};

// ── Input Field ─────────────────────────────────────────────────────
const FormInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string; error?: string; hint?: string;
    icon: React.ReactNode; suffix?: React.ReactNode;
  }
> = ({ label, error, hint, icon, suffix, ...props }) => (
  <div className="field-group space-y-1.5">
    <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-stone-400">{label}</label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">{icon}</span>
      <input
        {...props}
        className={`w-full bg-stone-50 border-2 rounded-xl pl-11 py-3.5 text-[15px] font-medium text-stone-800
          placeholder:text-stone-300 outline-none transition-all duration-200
          focus:bg-white
          ${suffix ? 'pr-12' : 'pr-4'}
          ${error
            ? 'border-red-300 bg-red-50/60 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]'
            : 'border-stone-200 focus:border-amber-400 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)]'
          }`}
      />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</span>}
    </div>
    {error && <p className="flex items-center gap-1.5 text-[11px] font-semibold text-red-500"><XCircle size={11} />{error}</p>}
    {hint && !error && <p className="text-[11px] text-stone-400 leading-relaxed">{hint}</p>}
  </div>
);

// ── Left panel ──────────────────────────────────────────────────────
const LeftPanel = () => (
  <div className="hidden lg:flex flex-col relative overflow-hidden" style={{
    background: 'linear-gradient(160deg, #0c0500 0%, #1e0900 25%, #4a1600 55%, #922800 80%, #c2410c 100%)',
  }}>
    {/* Atmospheric layers */}
    <div className="absolute inset-0 pointer-events-none">
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          radial-gradient(ellipse 80% 60% at 15% 60%, rgba(251,146,60,0.22) 0%, transparent 65%),
          radial-gradient(ellipse 50% 40% at 85% 15%, rgba(234,88,12,0.18) 0%, transparent 60%),
          radial-gradient(ellipse 40% 30% at 70% 85%, rgba(251,191,36,0.1) 0%, transparent 55%)
        `
      }} />
      {/* Noise grain */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.035,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: '160px 160px',
      }} />
    </div>

    {/* Flame orbs */}
    <div className="absolute top-[12%] left-[8%] w-72 h-72 rounded-full opacity-25 blur-[90px] pointer-events-none"
      style={{ background: 'radial-gradient(circle, #fb923c 0%, #ea580c 50%, transparent 100%)' }} />
    <div className="absolute bottom-[15%] right-[5%] w-56 h-56 rounded-full opacity-18 blur-[70px] pointer-events-none"
      style={{ background: 'radial-gradient(circle, #fbbf24 0%, #f97316 60%, transparent 100%)' }} />
    <div className="absolute top-[55%] left-[55%] w-36 h-36 rounded-full opacity-12 blur-[50px] pointer-events-none"
      style={{ background: 'radial-gradient(circle, #fed7aa, transparent)' }} />

    {/* Content */}
    <div className="relative z-10 flex flex-col h-full px-10 py-12">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-auto">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8 7 6 10 6 14a6 6 0 0 0 12 0c0-4-2-7-6-12z" fill="#fb923c" />
            <path d="M12 8c-1.5 3-2 5-2 6a2 2 0 0 0 4 0c0-1-.5-3-2-6z" fill="#fef3c7" />
          </svg>
        </div>
        <span className="text-white font-bold text-lg tracking-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.35rem', letterSpacing: '-0.01em' }}>
          AquaGas
        </span>
      </div>

      {/* Main headline */}
      <div className="mt-14 mb-10">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-px w-8" style={{ background: 'rgba(251,146,60,0.6)' }} />
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-400">Kenya's #1 LPG delivery</p>
        </div>
        <h2 className="text-white mb-5" style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(2.4rem, 3.2vw, 3.2rem)',
          fontWeight: 700,
          lineHeight: 1.08,
          letterSpacing: '-0.02em',
        }}>
          Gas at your door<br />
          <em style={{ color: '#fb923c', fontStyle: 'italic' }}>within 45 minutes.</em>
        </h2>
        <p className="text-orange-200/60 text-[14px] leading-relaxed" style={{ maxWidth: '26ch' }}>
          Over 50,000 homes and businesses across Nairobi trust AquaGas for safe, reliable LPG.
        </p>
      </div>

      {/* Feature pills */}
      <div className="space-y-2.5 mb-10">
        {[
          { icon: <Zap size={13} />,        text: '45-minute delivery guarantee' },
          { icon: <ShieldCheck size={13} />, text: 'Safety-certified cylinders' },
          { icon: <Package size={13} />,     text: '6 kg · 13 kg · 35 kg sizes' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-3 group">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110" style={{
              background: 'rgba(251,146,60,0.12)',
              border: '1px solid rgba(251,146,60,0.2)',
            }}>
              <span className="text-orange-400">{icon}</span>
            </div>
            <span className="text-orange-100/70 text-[13px] font-medium">{text}</span>
          </div>
        ))}
      </div>

      {/* Testimonial */}
      <div className="rounded-2xl p-5" style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
      }}>
        <div className="flex gap-0.5 mb-2.5">
          {[...Array(5)].map((_, i) => (
            <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          ))}
        </div>
        <p className="text-orange-100/65 text-[12.5px] leading-relaxed mb-2.5">
          "Order at 8am, gas at my door by 9am. Every single time. AquaGas is simply the best."
        </p>
        <p className="text-orange-400 text-[11px] font-bold uppercase tracking-wide">— Wanjiku M., Westlands</p>
      </div>

      {/* Bottom decoration */}
      <div className="mt-8 flex items-center gap-2 opacity-20">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(251,146,60,0.8), transparent)' }} />
      </div>
    </div>
  </div>
);

// ── Progress dots ────────────────────────────────────────────────────
const Dots: React.FC<{ n: number; active: number }> = ({ n, active }) => (
  <div className="flex items-center gap-1.5 mb-8">
    {Array.from({ length: n }).map((_, i) => (
      <div key={i} className="rounded-full transition-all duration-400"
        style={{
          width: i === active ? 28 : 8,
          height: 7,
          background: i === active
            ? 'linear-gradient(90deg, #ea580c, #f97316)'
            : i < active
              ? '#fdba74'
              : '#e7e5e4',
        }} />
    ))}
  </div>
);

// ── Password strength ────────────────────────────────────────────────
const PwStrength: React.FC<{ pw: string }> = ({ pw }) => {
  if (!pw) return null;
  const { pct, label, color } = pwStrength(pw);
  return (
    <div className="space-y-1.5 mt-2">
      <div className="h-1 w-full rounded-full bg-stone-100 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <p className="text-[11px] font-bold" style={{ color }}>{label}</p>
    </div>
  );
};

// ── Page ─────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, loading } = useAuth();

  const [step, setStep]             = useState<Step>('method');
  const [busy, setBusy]             = useState(false);

  // phone flow
  const [phone, setPhone]           = useState('');
  const [otp, setOtp]               = useState('');
  const [otpErr, setOtpErr]         = useState(false);
  const [countdown, setCountdown]   = useState(0);
  const timerRef                    = useRef<NodeJS.Timeout>();

  // phone profile
  const [prof, setProf] = useState({ fn: '', ln: '', email: '', pw: '', cpw: '', setPw: false });
  const [showPw, setShowPw] = useState(false);

  // email form
  const [ef, setEf]   = useState({ name: '', email: '', phone: '', pw: '', cpw: '' });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [showEPw, setShowEPw] = useState(false);

  useEffect(() => { if (!loading && isAuthenticated) router.replace('/account'); }, [isAuthenticated, loading]);

  const startTimer = useCallback(() => {
    setCountdown(60);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() =>
      setCountdown(c => { if (c <= 1) { clearInterval(timerRef.current); return 0; } return c - 1; }), 1000);
  }, []);
  useEffect(() => () => clearInterval(timerRef.current), []);

  // ── Handlers ──────────────────────────────────────────────────────
  const sendOTP = async () => {
    if (!isValidPhone(phone.trim())) { toast.error('Enter a valid Kenyan number (07xx or +254)'); return; }
    setBusy(true);
    try {
      await apiPost('/send-otp', { phone: formatPhone(phone.trim()) });
      startTimer(); setStep('phone-otp'); toast.success('Code sent!');
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  const verifyOTP = async () => {
    if (otp.replace(/\s/g, '').length !== 6) { setOtpErr(true); return; }
    setBusy(true); setOtpErr(false);
    try {
      await apiPost('/verify-otp', { phone: formatPhone(phone.trim()), otp: otp.replace(/\s/g, '') });
      setStep('phone-profile');
    } catch (e: any) { setOtpErr(true); toast.error(e.message); }
    finally { setBusy(false); }
  };

  const phoneRegister = async () => {
    const e: Record<string, string> = {};
    if (prof.fn.trim().length < 2) e.fn = 'Required (min 2 chars)';
    if (prof.ln.trim().length < 2) e.ln = 'Required (min 2 chars)';
    if (prof.email && !isValidEmail(prof.email)) e.email = 'Invalid email';
    if (prof.setPw) {
      if (prof.pw.length < 8) e.pw = 'Min 8 characters';
      else if (!/[A-Z]/.test(prof.pw) || !/[a-z]/.test(prof.pw) || !/\d/.test(prof.pw)) e.pw = 'Needs uppercase, lowercase & number';
      if (prof.pw !== prof.cpw) e.cpw = 'Passwords do not match';
    }
    setErrs(e); if (Object.keys(e).length) return;
    setBusy(true);
    try {
      const data = await apiPost<{ token?: string }>('/register/phone', {
        phone: formatPhone(phone.trim()), firstName: prof.fn.trim(), lastName: prof.ln.trim(),
        email: prof.email ? normalizeEmail(prof.email) : undefined,
        password: prof.setPw ? prof.pw : undefined,
      });
      if (data.token) localStorage.setItem('authToken', data.token);
      toast.success('Welcome to AquaGas!');
      router.push('/account');
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  const emailRegister = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (ef.name.trim().length < 2)     e.name  = 'Full name required (min 2 chars)';
    if (!ef.email.trim())               e.email = 'Email is required';
    else if (!isValidEmail(ef.email))   e.email = 'Invalid email address';
    if (!ef.phone.trim())               e.phone = 'Phone number is required';
    else if (!isValidPhone(ef.phone))   e.phone = 'Use: +254712345678 or 0712345678';
    if (!ef.pw)                         e.pw    = 'Password is required';
    else if (ef.pw.length < 8)          e.pw    = 'Min 8 characters';
    else if (!/[A-Z]/.test(ef.pw) || !/[a-z]/.test(ef.pw) || !/\d/.test(ef.pw)) e.pw = 'Needs uppercase, lowercase & number';
    if (ef.pw !== ef.cpw)               e.cpw   = 'Passwords do not match';
    setErrs(e); if (Object.keys(e).length) return;
    setBusy(true);
    try {
      await register({ fullName: ef.name.trim(), email: normalizeEmail(ef.email), phone: formatPhone(ef.phone.trim()), password: ef.pw });
      toast.success('Welcome to AquaGas!');
      router.push('/account');
    } catch (err: any) { toast.error(err?.response?.data?.error || err?.message || 'Registration failed'); }
    finally { setBusy(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <Loader className="animate-spin text-orange-500" size={26} />
    </div>
  );

  const profPwOk = prof.cpw && prof.pw === prof.cpw;
  const efPwOk   = ef.cpw && ef.pw === ef.cpw;

  return (
    <>
      <Head>
        <title>Create Account — AquaGas</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; }
        body {
          margin: 0;
          background: #f8f7f5;
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.35); }
          100% { box-shadow: 0 0 0 14px rgba(34,197,94,0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .step-enter { animation: fadeUp 0.35s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .verified-ring { animation: pulse-ring 0.9s ease-out; }

        .otp-digit:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245,158,11,0.12);
        }

        .method-card {
          transition: transform 0.18s cubic-bezier(0.22,1,0.36,1), box-shadow 0.18s ease, border-color 0.18s ease;
          cursor: pointer;
        }
        .method-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.07);
        }
        .method-card:active { transform: translateY(0); }

        .btn-primary {
          background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
          box-shadow: 0 3px 16px rgba(194,65,12,0.28), inset 0 1px 0 rgba(255,255,255,0.12);
          transition: all 0.2s;
          border: none;
          cursor: pointer;
        }
        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #dc4e08 0%, #b83a0b 100%);
          box-shadow: 0 6px 24px rgba(194,65,12,0.38), inset 0 1px 0 rgba(255,255,255,0.15);
          transform: translateY(-1px);
        }
        .btn-primary:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(194,65,12,0.3);
        }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

        .btn-ghost {
          border: 1.5px solid #e7e5e4;
          background: white;
          cursor: pointer;
          transition: all 0.18s;
        }
        .btn-ghost:hover {
          border-color: #ea580c;
          color: #ea580c;
          background: #fff7ed;
        }

        .field-group input:focus { background: white; }

        .right-panel::-webkit-scrollbar { width: 0; }

        .trust-badge {
          transition: color 0.15s;
        }
        .trust-badge:hover { color: #ea580c; }
      `}</style>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100vh',
      }}>

        {/* ── LEFT: Brand panel ── */}
        <LeftPanel />

        {/* ── RIGHT: Form panel ── */}
        <div className="right-panel flex flex-col bg-[#f8f7f5] overflow-y-auto"
          style={{ gridColumn: 'span 1' }}>

          {/* Mobile header */}
          <div className="lg:hidden flex items-center justify-between px-5 pt-5 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8 7 6 10 6 14a6 6 0 0 0 12 0c0-4-2-7-6-12z" fill="white" />
                </svg>
              </div>
              <span className="font-bold text-stone-800" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem' }}>
                AquaGas
              </span>
            </div>
            <Link href="/account/login" className="text-xs font-semibold text-stone-400 hover:text-orange-600 flex items-center gap-1 transition-colors">
              <ArrowLeft size={11} /> Login
            </Link>
          </div>

          {/* Form area */}
          <div className="flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-12 py-10">
            <div className="w-full max-w-[400px]">

              {/* ═══════════════════════════════════════ */}
              {/* METHOD SELECTION                        */}
              {/* ═══════════════════════════════════════ */}
              {step === 'method' && (
                <div className="step-enter">
                  <Link href="/account/login" className="hidden lg:inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-stone-400 hover:text-orange-600 transition-colors mb-10">
                    <ArrowLeft size={12} /> Back to login
                  </Link>

                  <div className="mb-9">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-px w-6" style={{ background: '#ea580c' }} />
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-500">New account</p>
                    </div>
                    <h1 className="text-stone-900 mb-3" style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '2.6rem',
                      fontWeight: 700,
                      lineHeight: 1.05,
                      letterSpacing: '-0.02em',
                    }}>
                      Join AquaGas
                    </h1>
                    <p className="text-stone-500 text-[14px] leading-relaxed">
                      Choose how you'd like to create your account.
                    </p>
                  </div>

                  {/* Method cards */}
                  <div className="space-y-3 mb-8">
                    {/* Phone OTP */}
                    <button onClick={() => setStep('phone-entry')}
                      className="method-card w-full rounded-2xl p-4.5 text-left bg-white border border-stone-150"
                      style={{ padding: '18px 20px', border: '1.5px solid #f0ede9' }}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                          background: 'linear-gradient(145deg, #fff7ed, #fed7aa)',
                        }}>
                          <Smartphone size={22} className="text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-stone-800 text-[14px]">Phone + OTP</p>
                            <span style={{
                              fontSize: '9px', fontWeight: 800, letterSpacing: '0.08em',
                              textTransform: 'uppercase', background: '#fff7ed', color: '#ea580c',
                              padding: '2px 7px', borderRadius: '99px', border: '1px solid #fed7aa',
                            }}>Fastest</span>
                          </div>
                          <p className="text-[12.5px] text-stone-400 leading-relaxed">Verify with a 6-digit code — no password needed to start.</p>
                        </div>
                        <ChevronRight size={14} className="text-stone-300 flex-shrink-0" />
                      </div>
                    </button>

                    {/* Email */}
                    <button onClick={() => setStep('email-form')}
                      className="method-card w-full rounded-2xl text-left bg-white"
                      style={{ padding: '18px 20px', border: '1.5px solid #f0ede9' }}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                          background: 'linear-gradient(145deg, #f0fdf4, #bbf7d0)',
                        }}>
                          <Mail size={22} className="text-emerald-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-stone-800 text-[14px] mb-1">Email & Password</p>
                          <p className="text-[12.5px] text-stone-400 leading-relaxed">Full account with email, phone & password.</p>
                        </div>
                        <ChevronRight size={14} className="text-stone-300 flex-shrink-0" />
                      </div>
                    </button>
                  </div>

                  {/* Trust indicators */}
                  <div className="flex items-center justify-center gap-5 mb-8">
                    {[
                      { icon: <ShieldCheck size={12} />, label: 'SSL secured' },
                      { icon: <CheckCircle size={12} />,  label: 'GDPR ready' },
                      { icon: <Zap size={12} />,          label: 'Instant access' },
                    ].map(({ icon, label }) => (
                      <div key={label} className="trust-badge flex items-center gap-1.5 text-[11.5px] font-medium text-stone-400">
                        <span className="text-orange-400">{icon}</span>{label}
                      </div>
                    ))}
                  </div>

                  <p className="text-center text-[13px] text-stone-400">
                    Already have an account?{' '}
                    <Link href="/account/login" className="font-bold text-orange-600 hover:text-orange-700">Log in</Link>
                  </p>
                </div>
              )}

              {/* ═══════════════════════════════════════ */}
              {/* PHONE ENTRY                             */}
              {/* ═══════════════════════════════════════ */}
              {step === 'phone-entry' && (
                <div className="step-enter">
                  <Dots n={3} active={0} />
                  <button onClick={() => setStep('method')} className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-stone-400 hover:text-orange-600 mb-7 transition-colors">
                    <ArrowLeft size={12} /> Back
                  </button>

                  <div className="mb-8">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{
                      background: 'linear-gradient(145deg, #fff7ed, #fed7aa)',
                    }}>
                      <Smartphone size={22} className="text-orange-500" />
                    </div>
                    <h2 className="text-stone-900 mb-2" style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '2.1rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em',
                    }}>
                      Your phone number
                    </h2>
                    <p className="text-stone-500 text-[14px] leading-relaxed">
                      We'll send a verification code to confirm it's you.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <FormInput
                      label="Phone Number" hint="Format: +254712345678 or 0712345678"
                      icon={<Phone size={15} />} type="tel"
                      value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="0712 345 678"
                      onKeyDown={e => e.key === 'Enter' && sendOTP()}
                    />
                    <button onClick={sendOTP} disabled={busy}
                      className="btn-primary w-full py-4 rounded-xl font-semibold text-white text-[14.5px] flex items-center justify-center gap-2">
                      {busy
                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin 0.7s linear infinite' }} />Sending…</>
                        : 'Send verification code'
                      }
                    </button>
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════ */}
              {/* OTP VERIFICATION                        */}
              {/* ═══════════════════════════════════════ */}
              {step === 'phone-otp' && (
                <div className="step-enter">
                  <Dots n={3} active={1} />
                  <button onClick={() => setStep('phone-entry')} className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-stone-400 hover:text-orange-600 mb-7 transition-colors">
                    <ArrowLeft size={12} /> Change number
                  </button>

                  <div className="mb-8">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{
                      background: 'linear-gradient(145deg, #f0fdf4, #bbf7d0)',
                      border: '1.5px solid #86efac',
                    }}>
                      <ShieldCheck size={22} className="text-emerald-600" />
                    </div>
                    <h2 className="text-stone-900 mb-2" style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '2.1rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em',
                    }}>
                      Enter the code
                    </h2>
                    <p className="text-stone-500 text-[14px]">
                      Sent to <span className="font-bold text-stone-700">{formatPhone(phone.trim())}</span>
                    </p>
                  </div>

                  <div className="space-y-6">
                    <OTPBox value={otp} onChange={v => { setOtp(v); setOtpErr(false); }} error={otpErr} />
                    {otpErr && (
                      <p className="text-center text-[12.5px] font-semibold text-red-500 flex items-center justify-center gap-1.5">
                        <XCircle size={12} /> Incorrect or expired code
                      </p>
                    )}

                    <button onClick={verifyOTP} disabled={busy || otp.replace(/\s/g, '').length !== 6}
                      className="btn-primary w-full py-4 rounded-xl font-semibold text-white text-[14.5px] flex items-center justify-center gap-2">
                      {busy
                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin 0.7s linear infinite' }} />Verifying…</>
                        : 'Verify code'
                      }
                    </button>

                    <div className="text-center">
                      {countdown > 0
                        ? <p className="text-[12.5px] text-stone-400">Resend in <span className="font-bold text-orange-600 tabular-nums">{countdown}s</span></p>
                        : <button onClick={sendOTP} disabled={busy}
                            className="text-[12.5px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 mx-auto transition-colors"
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            <RefreshCw size={12} /> Resend code
                          </button>
                      }
                    </div>
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════ */}
              {/* PHONE PROFILE COMPLETION                */}
              {/* ═══════════════════════════════════════ */}
              {step === 'phone-profile' && (
                <div className="step-enter">
                  <Dots n={3} active={2} />

                  <div className="mb-7">
                    <h2 className="text-stone-900 mb-2" style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '2.1rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em',
                    }}>
                      Complete your profile
                    </h2>
                    <p className="text-stone-500 text-[14px]">Almost there — just a few details.</p>
                  </div>

                  {/* Verified badge */}
                  <div className="verified-ring flex items-center gap-3 rounded-xl px-4 py-3 mb-5" style={{
                    background: '#f0fdf4',
                    border: '1.5px solid #bbf7d0',
                  }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                      background: '#dcfce7',
                    }}>
                      <CheckCircle size={16} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700">Phone verified</p>
                      <p className="text-[13.5px] font-semibold text-stone-700">{formatPhone(phone.trim())}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <FormInput label="First Name" error={errs.fn} icon={<User size={14} />}
                        value={prof.fn} placeholder="Jane"
                        onChange={e => { setProf(p => ({ ...p, fn: e.target.value })); setErrs(r => ({ ...r, fn: '' })); }} />
                      <FormInput label="Last Name" error={errs.ln} icon={<User size={14} />}
                        value={prof.ln} placeholder="Kamau"
                        onChange={e => { setProf(p => ({ ...p, ln: e.target.value })); setErrs(r => ({ ...r, ln: '' })); }} />
                    </div>

                    <FormInput label="Email Address" error={errs.email} hint="Optional — for receipts & updates"
                      icon={<Mail size={14} />} type="email"
                      value={prof.email} placeholder="you@example.com"
                      onChange={e => { setProf(p => ({ ...p, email: e.target.value })); setErrs(r => ({ ...r, email: '' })); }} />

                    {/* Password toggle */}
                    <div className="pt-0.5">
                      <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3.5 cursor-pointer hover:border-orange-200 transition-all duration-200"
                        style={{ border: `1.5px solid ${prof.setPw ? '#fed7aa' : '#f0ede9'}` }}
                        onClick={() => setProf(p => ({ ...p, setPw: !p.setPw }))}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200" style={{
                            background: prof.setPw ? '#fff7ed' : '#f5f5f4',
                          }}>
                            <Lock size={14} className={prof.setPw ? 'text-orange-500' : 'text-stone-400'} />
                          </div>
                          <div>
                            <p className={`text-[12.5px] font-semibold ${prof.setPw ? 'text-orange-700' : 'text-stone-600'}`}>
                              {prof.setPw ? 'Password enabled' : 'Set a password (optional)'}
                            </p>
                            <p className="text-[11px] text-stone-400">{prof.setPw ? 'Login with phone/email + password' : 'Set one later in settings'}</p>
                          </div>
                        </div>
                        {/* Toggle */}
                        <div className="relative w-9 h-5 rounded-full transition-all duration-250 flex-shrink-0" style={{
                          background: prof.setPw ? '#ea580c' : '#e7e5e4',
                        }}>
                          <div className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-250" style={{
                            left: prof.setPw ? 'calc(100% - 18px)' : '2px',
                          }} />
                        </div>
                      </div>

                      {prof.setPw && (
                        <div className="mt-3 space-y-3 step-enter">
                          <FormInput label="Password" error={errs.pw} icon={<Lock size={14} />}
                            type={showPw ? 'text' : 'password'} value={prof.pw} placeholder="••••••••"
                            onChange={e => { setProf(p => ({ ...p, pw: e.target.value })); setErrs(r => ({ ...r, pw: '' })); }}
                            suffix={
                              <button type="button" onClick={() => setShowPw(s => !s)} className="text-stone-400 hover:text-stone-600 p-1" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                            } />
                          <PwStrength pw={prof.pw} />
                          <FormInput label="Confirm Password" error={errs.cpw} icon={<Lock size={14} />}
                            type={showPw ? 'text' : 'password'} value={prof.cpw} placeholder="••••••••"
                            onChange={e => { setProf(p => ({ ...p, cpw: e.target.value })); setErrs(r => ({ ...r, cpw: '' })); }}
                            suffix={profPwOk ? <CheckCircle size={14} className="text-emerald-500" /> : undefined} />
                        </div>
                      )}
                    </div>

                    <button onClick={phoneRegister} disabled={busy}
                      className="btn-primary w-full py-4 rounded-xl font-semibold text-white text-[14.5px] flex items-center justify-center gap-2 mt-1">
                      {busy
                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin 0.7s linear infinite' }} />Creating account…</>
                        : <>Create account <ChevronRight size={15} /></>
                      }
                    </button>

                    <p className="text-center text-[11.5px] text-stone-400">
                      By registering you agree to our{' '}
                      <a href="/terms" className="font-semibold text-orange-600 hover:underline">Terms</a>{' '}
                      &{' '}
                      <a href="/privacy" className="font-semibold text-orange-600 hover:underline">Privacy Policy</a>
                    </p>
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════ */}
              {/* EMAIL + PASSWORD FORM                   */}
              {/* ═══════════════════════════════════════ */}
              {step === 'email-form' && (
                <div className="step-enter">
                  <button onClick={() => setStep('method')} className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-stone-400 hover:text-orange-600 mb-8 transition-colors"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <ArrowLeft size={12} /> Choose another method
                  </button>

                  <div className="mb-7">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-px w-6" style={{ background: '#ea580c' }} />
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-500">Email registration</p>
                    </div>
                    <h2 className="text-stone-900 mb-2" style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '2.1rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em',
                    }}>
                      Create your account
                    </h2>
                    <p className="text-stone-500 text-[14px]">Fast LPG delivery across Nairobi.</p>
                  </div>

                  <form onSubmit={emailRegister} noValidate className="space-y-4">
                    <FormInput label="Full Name" error={errs.name} icon={<User size={14} />}
                      type="text" autoComplete="name" placeholder="Jane Kamau"
                      value={ef.name}
                      onChange={e => { setEf(f => ({ ...f, name: e.target.value })); setErrs(r => ({ ...r, name: '' })); }} />

                    <FormInput label="Email Address" error={errs.email} icon={<Mail size={14} />}
                      type="email" autoComplete="email" placeholder="you@example.com"
                      value={ef.email}
                      onChange={e => { setEf(f => ({ ...f, email: e.target.value })); setErrs(r => ({ ...r, email: '' })); }} />

                    <FormInput label="Phone Number" error={errs.phone} hint="+254712345678 or 0712345678"
                      icon={<Phone size={14} />} type="tel" autoComplete="tel" placeholder="0712 345 678"
                      value={ef.phone}
                      onChange={e => { setEf(f => ({ ...f, phone: e.target.value })); setErrs(r => ({ ...r, phone: '' })); }} />

                    <div>
                      <FormInput label="Password" error={errs.pw} icon={<Lock size={14} />}
                        type={showEPw ? 'text' : 'password'} autoComplete="new-password" placeholder="••••••••"
                        value={ef.pw}
                        onChange={e => { setEf(f => ({ ...f, pw: e.target.value })); setErrs(r => ({ ...r, pw: '' })); }}
                        suffix={
                          <button type="button" onClick={() => setShowEPw(s => !s)} className="text-stone-400 hover:text-stone-600 p-1" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            {showEPw ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        } />
                      <PwStrength pw={ef.pw} />
                    </div>

                    <FormInput label="Confirm Password" error={errs.cpw} icon={<Lock size={14} />}
                      type={showEPw ? 'text' : 'password'} autoComplete="new-password" placeholder="••••••••"
                      value={ef.cpw}
                      onChange={e => { setEf(f => ({ ...f, cpw: e.target.value })); setErrs(r => ({ ...r, cpw: '' })); }}
                      suffix={efPwOk ? <CheckCircle size={14} className="text-emerald-500" /> : undefined} />

                    <label className="flex items-start gap-3 cursor-pointer pt-0.5">
                      <input type="checkbox" required className="mt-0.5 w-4 h-4 rounded flex-shrink-0" style={{ accentColor: '#ea580c' }} />
                      <span className="text-[12.5px] text-stone-500 leading-relaxed">
                        I agree to the{' '}
                        <a href="/terms" className="font-bold text-orange-600 hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="/privacy" className="font-bold text-orange-600 hover:underline">Privacy Policy</a>
                      </span>
                    </label>

                    <button type="submit" disabled={busy}
                      className="btn-primary w-full py-4 rounded-xl font-semibold text-white text-[14.5px] flex items-center justify-center gap-2">
                      {busy
                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin 0.7s linear infinite' }} />Creating account…</>
                        : <>Create account <ChevronRight size={15} /></>
                      }
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-stone-200" />
                      <span className="text-[11px] text-stone-400 font-medium">or</span>
                      <div className="flex-1 h-px bg-stone-200" />
                    </div>

                    <button type="button" onClick={() => setStep('phone-entry')}
                      className="btn-ghost w-full py-3.5 rounded-xl font-semibold text-stone-600 text-[13.5px] flex items-center justify-center gap-2">
                      <Smartphone size={15} /> Sign up with phone instead
                    </button>
                  </form>

                  <p className="text-center text-[12.5px] text-stone-400 mt-6">
                    Already have an account?{' '}
                    <Link href="/account/login" className="font-bold text-orange-600 hover:text-orange-700">Log in</Link>
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* Footer */}
          <div className="text-center pb-6 px-4">
            <p className="text-[10.5px] text-stone-300">© {new Date().getFullYear()} AquaGas Kenya · Nairobi · Secure payments</p>
          </div>
        </div>
      </div>
    </>
  );
}
