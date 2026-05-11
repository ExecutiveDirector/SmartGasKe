/* // ============================================================
// FILE: src/pages/account/register.tsx
// FIX: phone OTP flows now call refreshUser() after writing
//      the token so AuthContext.user is populated before
//      router.push('/account') is called.
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
  (process.env.NEXT_PUBLIC_API_URL || 'https://aquagas-backend.onrender.com/api/v1')
    .replace(/\/$/, '') + '/auth';

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

// ── Validators ───────────────────────────────────────────────────────
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

// ── OTP Input ────────────────────────────────────────────────────────
const OTPBox: React.FC<{ value: string; onChange: (v: string) => void; error: boolean }> = ({ value, onChange, error }) => {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, ' ').split('').slice(0, 6);

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
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
          style={{
            width: 48, height: 56, textAlign: 'center', fontSize: 20, fontWeight: 700,
            borderRadius: 12, outline: 'none', transition: 'all 0.15s', fontFamily: 'inherit',
            border: d.trim() ? '2px solid #f59e0b' : error ? '2px solid #fca5a5' : '2px solid #e5e7eb',
            background: d.trim() ? '#fffbeb' : error ? '#fef2f2' : '#fff',
            color: d.trim() ? '#92400e' : error ? '#b91c1c' : '#1c1917',
            boxShadow: d.trim() ? '0 0 0 3px rgba(245,158,11,0.12)' : 'none',
          }}
        />
      ))}
    </div>
  );
};

// ── Input Field ──────────────────────────────────────────────────────
const FormInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string; error?: string; hint?: string;
    icon: React.ReactNode; suffix?: React.ReactNode;
  }
> = ({ label, error, hint, icon, suffix, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#a8a29e' }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#a8a29e', pointerEvents: 'none', display: 'flex' }}>
        {icon}
      </span>
      <input
        {...props}
        style={{
          width: '100%', boxSizing: 'border-box',
          background: error ? '#fef2f2' : '#f9f8f7',
          border: `2px solid ${error ? '#fca5a5' : '#e8e5e1'}`,
          borderRadius: 12, paddingLeft: 44, paddingRight: suffix ? 48 : 16,
          paddingTop: 14, paddingBottom: 14, fontSize: 15, fontWeight: 500,
          color: '#1c1917', outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit',
        }}
        onFocus={e => {
          e.currentTarget.style.background = '#fff';
          e.currentTarget.style.borderColor = error ? '#f87171' : '#f59e0b';
          e.currentTarget.style.boxShadow = `0 0 0 3px ${error ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.1)'}`;
        }}
        onBlur={e => {
          e.currentTarget.style.background = error ? '#fef2f2' : '#f9f8f7';
          e.currentTarget.style.borderColor = error ? '#fca5a5' : '#e8e5e1';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      {suffix && (
        <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
          {suffix}
        </span>
      )}
    </div>
    {error && (
      <p style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: '#ef4444', margin: 0 }}>
        <XCircle size={11} />{error}
      </p>
    )}
    {hint && !error && (
      <p style={{ fontSize: 11, color: '#a8a29e', margin: 0, lineHeight: 1.4 }}>{hint}</p>
    )}
  </div>
);

// ── Left panel ───────────────────────────────────────────────────────
const LeftPanel = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', height: '100%',
    background: 'linear-gradient(160deg, #0c0500 0%, #1e0900 25%, #4a1600 55%, #922800 80%, #c2410c 100%)',
  }}>
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `radial-gradient(ellipse 80% 60% at 15% 60%, rgba(251,146,60,0.22) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 85% 15%, rgba(234,88,12,0.18) 0%, transparent 60%)` }} />
    <div style={{ position: 'absolute', top: '10%', left: '5%', width: 280, height: 280, borderRadius: '50%', opacity: 0.25, filter: 'blur(90px)', pointerEvents: 'none', background: 'radial-gradient(circle, #fb923c 0%, #ea580c 50%, transparent 100%)' }} />
    <div style={{ position: 'absolute', bottom: '12%', right: '5%', width: 200, height: 200, borderRadius: '50%', opacity: 0.18, filter: 'blur(70px)', pointerEvents: 'none', background: 'radial-gradient(circle, #fbbf24 0%, #f97316 60%, transparent 100%)' }} />

    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: '48px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'auto' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8 7 6 10 6 14a6 6 0 0 0 12 0c0-4-2-7-6-12z" fill="#fb923c" />
            <path d="M12 8c-1.5 3-2 5-2 6a2 2 0 0 0 4 0c0-1-.5-3-2-6z" fill="#fef3c7" />
          </svg>
        </div>
        <span style={{ color: '#fff', fontWeight: 700, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.3rem' }}>AquaGas</span>
      </div>

      <div style={{ marginTop: 56, marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ height: 1, width: 28, background: 'rgba(251,146,60,0.7)' }} />
          <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.24em', color: '#fb923c', margin: 0 }}>Kenya's #1 LPG delivery</p>
        </div>
        <h2 style={{ color: '#fff', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.2rem, 3vw, 3rem)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.02em', margin: '0 0 16px' }}>
          Gas at your door<br /><em style={{ color: '#fb923c', fontStyle: 'italic' }}>within 45 minutes.</em>
        </h2>
        <p style={{ color: 'rgba(253,186,132,0.65)', fontSize: 14, lineHeight: 1.65, maxWidth: '28ch', margin: 0 }}>
          Over 50,000 homes and businesses across Nairobi trust AquaGas for safe, reliable LPG.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
        {[
          { icon: <Zap size={13} />, text: '45-minute delivery guarantee' },
          { icon: <ShieldCheck size={13} />, text: 'Safety-certified cylinders' },
          { icon: <Package size={13} />, text: '6 kg · 13 kg · 35 kg sizes' },
        ].map(({ icon, text }) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.2)' }}>
              <span style={{ color: '#fb923c', display: 'flex' }}>{icon}</span>
            </div>
            <span style={{ color: 'rgba(254,215,170,0.7)', fontSize: 13, fontWeight: 500 }}>{text}</span>
          </div>
        ))}
      </div>

      <div style={{ borderRadius: 18, padding: '20px 22px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
          {[...Array(5)].map((_, i) => (
            <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          ))}
        </div>
        <p style={{ color: 'rgba(254,215,170,0.65)', fontSize: 12.5, lineHeight: 1.6, margin: '0 0 10px' }}>
          "Order at 8am, gas at my door by 9am. Every single time. AquaGas is simply the best."
        </p>
        <p style={{ color: '#fb923c', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
          — Wanjiku M., Westlands
        </p>
      </div>
    </div>
  </div>
);

// ── Progress dots ─────────────────────────────────────────────────────
const Dots: React.FC<{ n: number; active: number }> = ({ n, active }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>
    {Array.from({ length: n }).map((_, i) => (
      <div key={i} style={{
        borderRadius: 99, transition: 'all 0.3s',
        width: i === active ? 28 : 8, height: 7,
        background: i === active ? 'linear-gradient(90deg, #ea580c, #f97316)' : i < active ? '#fdba74' : '#e7e5e4',
      }} />
    ))}
  </div>
);

// ── Password strength ─────────────────────────────────────────────────
const PwStrength: React.FC<{ pw: string }> = ({ pw }) => {
  if (!pw) return null;
  const { pct, label, color } = pwStrength(pw);
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ height: 4, width: '100%', borderRadius: 99, background: '#f0ede9', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 99, transition: 'all 0.5s', width: `${pct}%`, background: color }} />
      </div>
      <p style={{ fontSize: 11, fontWeight: 700, color, margin: '4px 0 0' }}>{label}</p>
    </div>
  );
};

// ── Spinner ────────────────────────────────────────────────────────────
const Spinner = () => (
  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} className="aq-spin" />
);

// ── PrimaryBtn ─────────────────────────────────────────────────────────
const PrimaryBtn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }> = ({
  children, loading, disabled, type = 'button', ...props
}) => (
  <button
    {...props}
    type={type}
    disabled={disabled || loading}
    style={{
      width: '100%', padding: '15px 24px', borderRadius: 12, fontWeight: 700, fontSize: 14.5,
      color: '#fff', border: 'none', cursor: disabled || loading ? 'not-allowed' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      background: disabled || loading ? '#d6d3d1' : 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
      boxShadow: disabled || loading ? 'none' : '0 4px 18px rgba(194,65,12,0.3), inset 0 1px 0 rgba(255,255,255,0.12)',
      transition: 'all 0.2s', opacity: disabled || loading ? 0.7 : 1, fontFamily: 'inherit',
    }}
  >
    {loading ? <><Spinner />{children}</> : children}
  </button>
);

// ── GhostBtn ───────────────────────────────────────────────────────────
const GhostBtn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
  <button
    {...props}
    style={{
      width: '100%', padding: '13px 24px', borderRadius: 12, fontWeight: 600, fontSize: 13.5,
      color: '#57534e', background: '#fff', cursor: 'pointer', border: '1.5px solid #e7e5e4',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      transition: 'all 0.18s', fontFamily: 'inherit',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = '#ea580c'; e.currentTarget.style.color = '#ea580c'; e.currentTarget.style.background = '#fff7ed'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e7e5e4'; e.currentTarget.style.color = '#57534e'; e.currentTarget.style.background = '#fff'; }}
  >
    {children}
  </button>
);

// ── BackBtn ────────────────────────────────────────────────────────────
const BackBtn: React.FC<{ onClick: () => void; label?: string }> = ({ onClick, label = 'Back' }) => (
  <button onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800,
    textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a8a29e',
    background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 28, fontFamily: 'inherit',
  }}>
    <ArrowLeft size={12} /> {label}
  </button>
);

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
    <div style={{ height: 1, width: 22, background: '#ea580c' }} />
    <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#ea580c', margin: 0 }}>{children}</p>
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();

  // ── FIX: also pull refreshUser so phone flows can hydrate context ──
  const { register, refreshUser, isAuthenticated, loading } = useAuth();

  const [step, setStep]           = useState<Step>('method');
  const [busy, setBusy]           = useState(false);

  const [phone, setPhone]         = useState('');
  const [otp, setOtp]             = useState('');
  const [otpErr, setOtpErr]       = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef                  = useRef<NodeJS.Timeout>();

  const [prof, setProf] = useState({ fn: '', ln: '', email: '', pw: '', cpw: '', setPw: false });
  const [showPw, setShowPw] = useState(false);

  const [ef, setEf]     = useState({ name: '', email: '', phone: '', pw: '', cpw: '' });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [showEPw, setShowEPw] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) router.replace('/account');
  }, [isAuthenticated, loading]);

  const startTimer = useCallback(() => {
    setCountdown(60);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() =>
      setCountdown(c => { if (c <= 1) { clearInterval(timerRef.current); return 0; } return c - 1; }), 1000);
  }, []);
  useEffect(() => () => clearInterval(timerRef.current), []);

  // ── SEND OTP ────────────────────────────────────────────────────────
  const sendOTP = async () => {
    if (!isValidPhone(phone.trim())) {
      toast.error('Enter a valid Kenyan number (07xx or +254 7xx)');
      return;
    }
    setBusy(true);
    try {
      await apiPost('/send-otp', { phone: formatPhone(phone.trim()) });
      startTimer();
      setStep('phone-otp');
      toast.success('Verification code sent!');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  // ── VERIFY OTP ──────────────────────────────────────────────────────
  // FIX: when the user already exists, the backend returns a token but
  // the old code only wrote it to localStorage — AuthContext.user was
  // never updated, so isAuthenticated stayed false on /account.
  // Now we call refreshUser() so the context is fully hydrated first.
  const verifyOTP = async () => {
    if (otp.replace(/\s/g, '').length !== 6) { setOtpErr(true); return; }
    setBusy(true); setOtpErr(false);
    try {
      const data = await apiPost<{
        verified: boolean;
        token?: string;
        needsRegistration?: boolean;
        accountExists?: boolean;
      }>('/verify-otp', { phone: formatPhone(phone.trim()), otp: otp.replace(/\s/g, '') });

      if (data.token && !data.needsRegistration) {
        // ── FIX: existing user login via OTP ──────────────────────────
        // 1. Store token so getProfile() can read it
        localStorage.setItem('authToken', data.token);
        // 2. Hydrate AuthContext (calls getProfile internally)
        await refreshUser();
        toast.success('Welcome back!');
        router.push('/account');
        return;
      }

      // New user — complete profile
      setStep('phone-profile');
    } catch (e: any) {
      setOtpErr(true);
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  // ── PHONE REGISTER ──────────────────────────────────────────────────
  // FIX: after a successful phone registration the old code wrote the
  // token to localStorage but never updated AuthContext.user, so the
  // /account page saw isAuthenticated === false and redirected to login.
  // Now we call refreshUser() to populate the context before navigating.
  const phoneRegister = async () => {
    const e: Record<string, string> = {};
    if (prof.fn.trim().length < 2) e.fn = 'Required (min 2 chars)';
    if (prof.ln.trim().length < 2) e.ln = 'Required (min 2 chars)';
    if (prof.email && !isValidEmail(prof.email)) e.email = 'Invalid email';
    if (prof.setPw) {
      if (prof.pw.length < 8)
        e.pw = 'Min 8 characters';
      else if (!/[A-Z]/.test(prof.pw) || !/[a-z]/.test(prof.pw) || !/\d/.test(prof.pw))
        e.pw = 'Needs uppercase, lowercase & number';
      if (prof.pw !== prof.cpw) e.cpw = 'Passwords do not match';
    }
    setErrs(e);
    if (Object.keys(e).length) return;

    setBusy(true);
    try {
      const body: Record<string, any> = {
        phone:     formatPhone(phone.trim()),
        firstName: prof.fn.trim(),
        lastName:  prof.ln.trim(),
      };
      if (prof.email)            body.email    = normalizeEmail(prof.email);
      if (prof.setPw && prof.pw) body.password = prof.pw;

      const data = await apiPost<{ token?: string }>('/register/phone', body);

      // ── FIX: store token then hydrate context ─────────────────────
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        await refreshUser();
      }

      toast.success('Welcome to AquaGas! 🎉');
      router.push('/account');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  // ── EMAIL REGISTER ──────────────────────────────────────────────────
  // Uses AuthContext.register() which already calls setUser() — no change needed.
  const emailRegister = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (ef.name.trim().length < 2)   e.name  = 'Full name required (min 2 chars)';
    if (!ef.email.trim())             e.email = 'Email is required';
    else if (!isValidEmail(ef.email)) e.email = 'Invalid email address';
    if (!ef.phone.trim())             e.phone = 'Phone number is required';
    else if (!isValidPhone(ef.phone)) e.phone = 'Use: +254712345678 or 0712345678';
    if (!ef.pw)                       e.pw    = 'Password is required';
    else if (ef.pw.length < 8)        e.pw    = 'Min 8 characters';
    else if (!/[A-Z]/.test(ef.pw) || !/[a-z]/.test(ef.pw) || !/\d/.test(ef.pw))
      e.pw = 'Needs uppercase, lowercase & number';
    if (ef.pw !== ef.cpw)             e.cpw   = 'Passwords do not match';
    setErrs(e);
    if (Object.keys(e).length) return;

    setBusy(true);
    try {
      await register({
        fullName: ef.name.trim(),
        email:    normalizeEmail(ef.email),
        phone:    formatPhone(ef.phone.trim()),
        password: ef.pw,
      });
      toast.success('Welcome to AquaGas! 🎉');
      router.push('/account');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err?.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f7f5' }}>
      <Loader size={26} style={{ color: '#ea580c', animation: 'aq-spin 1s linear infinite' }} />
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
        body { margin: 0; background: #f8f7f5; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }

        @keyframes aq-fadein {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes aq-spin { to { transform: rotate(360deg); } }
        @keyframes aq-pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.35); }
          100% { box-shadow: 0 0 0 14px rgba(34,197,94,0); }
        }

        .aq-step    { animation: aq-fadein 0.35s cubic-bezier(0.22,1,0.36,1) both; }
        .aq-spin    { animation: aq-spin 0.7s linear infinite; }
        .aq-verified{ animation: aq-pulse-ring 0.9s ease-out; }

        .aq-layout {
          display: grid;
          min-height: 100vh;
          grid-template-columns: 1fr 1fr;
          grid-template-areas: "left right";
        }
        .aq-left  { grid-area: left; }
        .aq-right { grid-area: right; display: flex; flex-direction: column; background: #f8f7f5; overflow-y: auto; }

        @media (max-width: 1023px) {
          .aq-layout {
            grid-template-columns: 1fr;
            grid-template-areas: "right";
          }
          .aq-left { display: none !important; }
        }

        .aq-method-card {
          width: 100%; text-align: left; background: #fff;
          border: 1.5px solid #f0ede9; border-radius: 16px;
          padding: 18px 20px; cursor: pointer;
          display: flex; align-items: center; gap: 16px;
          transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
          font-family: inherit;
        }
        .aq-method-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.06);
          border-color: #fed7aa;
        }
        .aq-method-card:active { transform: translateY(0); }
      `}</style>

      <div className="aq-layout">

        {/* ── LEFT: brand panel ── *//*}
        <div className="aq-left">
          <LeftPanel />
        </div>

     //   {/* ── RIGHT: form ── *//*}
        <div className="aq-right">

         // {/* Mobile logo bar *//*}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8 7 6 10 6 14a6 6 0 0 0 12 0c0-4-2-7-6-12z" fill="white" />
                </svg>
              </div>
              <span style={{ fontWeight: 700, color: '#1c1917', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem' }}>AquaGas</span>
            </div>
            <Link href="/account/login" style={{ fontSize: 12, fontWeight: 700, color: '#a8a29e', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
              <ArrowLeft size={11} /> Login
            </Link>
          </div>

       //   {/* ── Centered form wrapper ── *//*}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
            <div style={{ width: '100%', maxWidth: 400 }}>

          //    {/* METHOD SELECTION                        }
              {step === 'method' && (
                <div className="aq-step">
                  <div style={{ marginBottom: 36 }}>
                    <SectionLabel>New account</SectionLabel>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 2.6rem)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.02em', color: '#1c1917', margin: '0 0 12px' }}>
                      Join AquaGas
                    </h1>
                    <p style={{ color: '#78716c', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                      Choose how you'd like to create your account.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                    <button className="aq-method-card" onClick={() => setStep('phone-entry')}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'linear-gradient(145deg, #fff7ed, #fed7aa)' }}>
                        <Smartphone size={22} style={{ color: '#ea580c' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <p style={{ fontWeight: 700, color: '#1c1917', fontSize: 14, margin: 0 }}>Phone + OTP</p>
                          <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', background: '#fff7ed', color: '#ea580c', padding: '2px 7px', borderRadius: 99, border: '1px solid #fed7aa' }}>Fastest</span>
                        </div>
                        <p style={{ fontSize: 12.5, color: '#a8a29e', lineHeight: 1.5, margin: 0 }}>Verify with a 6-digit code — no password needed.</p>
                      </div>
                      <ChevronRight size={14} style={{ color: '#d6d3d1', flexShrink: 0 }} />
                    </button>

                    <button className="aq-method-card" onClick={() => setStep('email-form')}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'linear-gradient(145deg, #f0fdf4, #bbf7d0)' }}>
                        <Mail size={22} style={{ color: '#16a34a' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, color: '#1c1917', fontSize: 14, margin: '0 0 4px' }}>Email & Password</p>
                        <p style={{ fontSize: 12.5, color: '#a8a29e', lineHeight: 1.5, margin: 0 }}>Full account with email, phone & password.</p>
                      </div>
                      <ChevronRight size={14} style={{ color: '#d6d3d1', flexShrink: 0 }} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
                    {[
                      { icon: <ShieldCheck size={12} />, label: 'SSL secured' },
                      { icon: <CheckCircle size={12} />, label: 'GDPR ready' },
                      { icon: <Zap size={12} />, label: 'Instant access' },
                    ].map(({ icon, label }) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 500, color: '#a8a29e' }}>
                        <span style={{ color: '#fb923c', display: 'flex' }}>{icon}</span>{label}
                      </div>
                    ))}
                  </div>

                  <p style={{ textAlign: 'center', fontSize: 13, color: '#a8a29e', margin: 0 }}>
                    Already have an account?{' '}
                    <Link href="/account/login" style={{ fontWeight: 700, color: '#ea580c', textDecoration: 'none' }}>Log in</Link>
                  </p>
                </div>
              )}

//              {/* PHONE ENTRY    

              {step === 'phone-entry' && (
                <div className="aq-step">
                  <Dots n={3} active={0} />
                  <BackBtn onClick={() => setStep('method')} />

                  <div style={{ marginBottom: 32 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, background: 'linear-gradient(145deg, #fff7ed, #fed7aa)' }}>
                      <Smartphone size={22} style={{ color: '#ea580c' }} />
                    </div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#1c1917', margin: '0 0 8px' }}>
                      Your phone number
                    </h2>
                    <p style={{ color: '#78716c', fontSize: 14, margin: 0 }}>We'll send a 6-digit code to verify it's you.</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <FormInput
                      label="Phone Number" hint="Format: +254712345678 or 0712345678"
                      icon={<Phone size={15} />} type="tel"
                      value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="0712 345 678"
                      onKeyDown={e => e.key === 'Enter' && sendOTP()}
                    />
                    <PrimaryBtn onClick={sendOTP} loading={busy}>
                      {busy ? 'Sending…' : 'Send verification code'}
                    </PrimaryBtn>
                  </div>
                </div>
              )}

            //  {/* OTP VERIFICATION                        
              {step === 'phone-otp' && (
                <div className="aq-step">
                  <Dots n={3} active={1} />
                  <BackBtn onClick={() => setStep('phone-entry')} label="Change number" />

                  <div style={{ marginBottom: 32 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, background: 'linear-gradient(145deg, #f0fdf4, #bbf7d0)', border: '1.5px solid #86efac' }}>
                      <ShieldCheck size={22} style={{ color: '#16a34a' }} />
                    </div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#1c1917', margin: '0 0 8px' }}>
                      Enter the code
                    </h2>
                    <p style={{ color: '#78716c', fontSize: 14, margin: 0 }}>
                      Sent to <strong style={{ color: '#1c1917' }}>{formatPhone(phone.trim())}</strong>
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <OTPBox value={otp} onChange={v => { setOtp(v); setOtpErr(false); }} error={otpErr} />

                    {otpErr && (
                      <p style={{ textAlign: 'center', fontSize: 12.5, fontWeight: 600, color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, margin: 0 }}>
                        <XCircle size={12} /> Incorrect or expired code
                      </p>
                    )}

                    <PrimaryBtn onClick={verifyOTP} loading={busy} disabled={otp.replace(/\s/g, '').length !== 6}>
                      {busy ? 'Verifying…' : 'Verify code'}
                    </PrimaryBtn>

                    <div style={{ textAlign: 'center' }}>
                      {countdown > 0 ? (
                        <p style={{ fontSize: 12.5, color: '#a8a29e', margin: 0 }}>
                          Resend in <span style={{ fontWeight: 700, color: '#ea580c' }}>{countdown}s</span>
                        </p>
                      ) : (
                        <button onClick={sendOTP} disabled={busy} style={{
                          fontSize: 12.5, fontWeight: 700, color: '#ea580c',
                          background: 'none', border: 'none', cursor: 'pointer',
                          display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'inherit',
                        }}>
                          <RefreshCw size={12} /> Resend code
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

             //{/* ═══════════════════════════════════════ 
             // {/* PHONE PROFILE COMPLETION                
             // {/* ═══════════════════════════════════════ 
              {step === 'phone-profile' && (
                <div className="aq-step">
                  <Dots n={3} active={2} />

                  <div style={{ marginBottom: 20 }}>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#1c1917', margin: '0 0 8px' }}>
                      Complete your profile
                    </h2>
                    <p style={{ color: '#78716c', fontSize: 14, margin: 0 }}>Almost there — just a few details.</p>
                  </div>

                  <div className="aq-verified" style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 12, padding: '12px 16px', marginBottom: 20, background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#dcfce7' }}>
                      <CheckCircle size={16} style={{ color: '#16a34a' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#15803d', margin: '0 0 2px' }}>Phone verified</p>
                      <p style={{ fontSize: 13.5, fontWeight: 600, color: '#1c1917', margin: 0 }}>{formatPhone(phone.trim())}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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

                    <div>
                      <div
                        onClick={() => setProf(p => ({ ...p, setPw: !p.setPw }))}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderRadius: 12, padding: '14px 16px', cursor: 'pointer', border: `1.5px solid ${prof.setPw ? '#fed7aa' : '#f0ede9'}`, transition: 'border-color 0.2s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: prof.setPw ? '#fff7ed' : '#f5f5f4' }}>
                            <Lock size={14} style={{ color: prof.setPw ? '#ea580c' : '#a8a29e' }} />
                          </div>
                          <div>
                            <p style={{ fontSize: 12.5, fontWeight: 700, color: prof.setPw ? '#c2410c' : '#57534e', margin: '0 0 2px' }}>
                              {prof.setPw ? 'Password enabled' : 'Set a password (optional)'}
                            </p>
                            <p style={{ fontSize: 11, color: '#a8a29e', margin: 0 }}>
                              {prof.setPw ? 'Login with phone/email + password' : 'You can add one later in settings'}
                            </p>
                          </div>
                        </div>
                        <div style={{ position: 'relative', width: 36, height: 20, borderRadius: 99, background: prof.setPw ? '#ea580c' : '#e7e5e4', transition: 'background 0.25s', flexShrink: 0 }}>
                          <div style={{ position: 'absolute', top: 2, width: 16, height: 16, background: '#fff', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.25s', left: prof.setPw ? 18 : 2 }} />
                        </div>
                      </div>

                      {prof.setPw && (
                        <div className="aq-step" style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <div>
                            <FormInput label="Password" error={errs.pw} icon={<Lock size={14} />}
                              type={showPw ? 'text' : 'password'} value={prof.pw} placeholder="••••••••"
                              onChange={e => { setProf(p => ({ ...p, pw: e.target.value })); setErrs(r => ({ ...r, pw: '' })); }}
                              suffix={
                                <button type="button" onClick={() => setShowPw(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a8a29e', display: 'flex', padding: 4 }}>
                                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                              } />
                            <PwStrength pw={prof.pw} />
                          </div>
                          <FormInput label="Confirm Password" error={errs.cpw} icon={<Lock size={14} />}
                            type={showPw ? 'text' : 'password'} value={prof.cpw} placeholder="••••••••"
                            onChange={e => { setProf(p => ({ ...p, cpw: e.target.value })); setErrs(r => ({ ...r, cpw: '' })); }}
                            suffix={profPwOk ? <CheckCircle size={14} style={{ color: '#16a34a' }} /> : undefined} />
                        </div>
                      )}
                    </div>

                    <PrimaryBtn onClick={phoneRegister} loading={busy}>
                      {busy ? 'Creating account…' : <>Create account <ChevronRight size={14} /></>}
                    </PrimaryBtn>

                    <p style={{ textAlign: 'center', fontSize: 11.5, color: '#a8a29e', margin: 0 }}>
                      By registering you agree to our{' '}
                      <a href="/terms" style={{ fontWeight: 700, color: '#ea580c', textDecoration: 'none' }}>Terms</a>
                      {' '}&{' '}
                      <a href="/privacy" style={{ fontWeight: 700, color: '#ea580c', textDecoration: 'none' }}>Privacy Policy</a>
                    </p>
                  </div>
                </div>
              )}

             // {/* ═══════════════════════════════════════ 
             // {/* EMAIL + PASSWORD FORM                  
            //  {/* ═══════════════════════════════════════ 
              {step === 'email-form' && (
                <div className="aq-step">
                  <BackBtn onClick={() => setStep('method')} label="Choose another method" />

                  <div style={{ marginBottom: 28 }}>
                    <SectionLabel>Email registration</SectionLabel>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#1c1917', margin: '0 0 8px' }}>
                      Create your account
                    </h2>
                    <p style={{ color: '#78716c', fontSize: 14, margin: 0 }}>Fast LPG delivery across Nairobi.</p>
                  </div>

                  <form onSubmit={emailRegister} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                          <button type="button" onClick={() => setShowEPw(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a8a29e', display: 'flex', padding: 4 }}>
                            {showEPw ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        } />
                      <PwStrength pw={ef.pw} />
                    </div>

                    <FormInput label="Confirm Password" error={errs.cpw} icon={<Lock size={14} />}
                      type={showEPw ? 'text' : 'password'} autoComplete="new-password" placeholder="••••••••"
                      value={ef.cpw}
                      onChange={e => { setEf(f => ({ ...f, cpw: e.target.value })); setErrs(r => ({ ...r, cpw: '' })); }}
                      suffix={efPwOk ? <CheckCircle size={14} style={{ color: '#16a34a' }} /> : undefined} />

                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                      <input type="checkbox" required style={{ marginTop: 2, width: 15, height: 15, accentColor: '#ea580c', flexShrink: 0 }} />
                      <span style={{ fontSize: 12.5, color: '#78716c', lineHeight: 1.5 }}>
                        I agree to the{' '}
                        <a href="/terms" style={{ fontWeight: 700, color: '#ea580c', textDecoration: 'none' }}>Terms of Service</a>
                        {' '}and{' '}
                        <a href="/privacy" style={{ fontWeight: 700, color: '#ea580c', textDecoration: 'none' }}>Privacy Policy</a>
                      </span>
                    </label>

                    <PrimaryBtn type="submit" loading={busy}>
                      {busy ? 'Creating account…' : <>Create account <ChevronRight size={14} /></>}
                    </PrimaryBtn>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1, height: 1, background: '#e8e5e1' }} />
                      <span style={{ fontSize: 11, color: '#a8a29e', fontWeight: 500 }}>or</span>
                      <div style={{ flex: 1, height: 1, background: '#e8e5e1' }} />
                    </div>

                    <GhostBtn type="button" onClick={() => setStep('phone-entry')}>
                      <Smartphone size={15} /> Sign up with phone instead
                    </GhostBtn>
                  </form>

                  <p style={{ textAlign: 'center', fontSize: 13, color: '#a8a29e', marginTop: 20, marginBottom: 0 }}>
                    Already have an account?{' '}
                    <Link href="/account/login" style={{ fontWeight: 700, color: '#ea580c', textDecoration: 'none' }}>Log in</Link>
                  </p>
                </div>
              )}

            </div>
          </div>

         // {/* Footer 
          <div style={{ textAlign: 'center', padding: '4px 16px 20px' }}>
            <p style={{ fontSize: 10.5, color: '#d6d3d1', margin: 0 }}>
              © {new Date().getFullYear()} AquaGas Kenya · Nairobi · Secure payments
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
 */

   // ============================================================
// FILE: src/pages/account/register.tsx
//
// CHANGE SUMMARY (Firebase migration):
//   • Removed: apiPost('/send-otp', ...) and apiPost('/verify-otp', ...)
//   • Added:   Firebase SDK phone auth (signInWithPhoneNumber)
//   • sendOTP  → Firebase sends SMS directly from client
//   • verifyOTP → Firebase confirms code → we get an ID token
//                → POST to /auth/firebase/verify-phone with that token
//   • registerWithPhone → same endpoint, now sends Firebase ID token
//     in X-Firebase-Token header instead of trusting a bare phone string
//   • Everything else (UI, AuthContext, email registration) is unchanged.
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

// ── Firebase ──────────────────────────────────────────────────────────────────
// Install: npm install firebase
import { initializeApp, getApps }         from 'firebase/app';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';

// Your Firebase project config (from Firebase console → Project Settings → Web app)
// Move these to NEXT_PUBLIC_* env vars in production.
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY            || 'YOUR_API_KEY',
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN        || 'YOUR_PROJECT.firebaseapp.com',
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID         || 'YOUR_PROJECT_ID',
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET     || 'YOUR_PROJECT.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID             || 'YOUR_APP_ID',
};

// Initialise Firebase once (Next.js hot-reload guard)
const firebaseApp  = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

// ── API ───────────────────────────────────────────────────────────────────────
const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL || 'https://aquagas-backend.onrender.com/api/v1')
    .replace(/\/$/, '') + '/auth';

/**
 * POST to our backend.
 * If a Firebase ID token is supplied it is attached as X-Firebase-Token.
 */
async function apiPost<T = any>(
  path: string,
  body: object,
  firebaseIdToken?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type':  'application/json',
    'Accept':        'application/json',
  };
  if (firebaseIdToken) headers['X-Firebase-Token'] = firebaseIdToken;

  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const ct = res.headers.get('content-type') ?? '';
  if (!ct.includes('application/json'))
    throw new Error(`Server error (${res.status}) — check NEXT_PUBLIC_API_URL`);

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
  return data as T;
}

// ── Validators ────────────────────────────────────────────────────────────────
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

// ── OTP Input ─────────────────────────────────────────────────────────────────
const OTPBox: React.FC<{ value: string; onChange: (v: string) => void; error: boolean }> = ({ value, onChange, error }) => {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, ' ').split('').slice(0, 6);

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
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
          style={{
            width: 48, height: 56, textAlign: 'center', fontSize: 20, fontWeight: 700,
            borderRadius: 12, outline: 'none', transition: 'all 0.15s', fontFamily: 'inherit',
            border: d.trim() ? '2px solid #f59e0b' : error ? '2px solid #fca5a5' : '2px solid #e5e7eb',
            background: d.trim() ? '#fffbeb' : error ? '#fef2f2' : '#fff',
            color: d.trim() ? '#92400e' : error ? '#b91c1c' : '#1c1917',
            boxShadow: d.trim() ? '0 0 0 3px rgba(245,158,11,0.12)' : 'none',
          }}
        />
      ))}
    </div>
  );
};

// ── Form Input ────────────────────────────────────────────────────────────────
const FormInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string; error?: string; hint?: string;
    icon: React.ReactNode; suffix?: React.ReactNode;
  }
> = ({ label, error, hint, icon, suffix, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#a8a29e' }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#a8a29e', pointerEvents: 'none', display: 'flex' }}>
        {icon}
      </span>
      <input
        {...props}
        style={{
          width: '100%', boxSizing: 'border-box',
          background: error ? '#fef2f2' : '#f9f8f7',
          border: `2px solid ${error ? '#fca5a5' : '#e8e5e1'}`,
          borderRadius: 12, paddingLeft: 44, paddingRight: suffix ? 48 : 16,
          paddingTop: 14, paddingBottom: 14, fontSize: 15, fontWeight: 500,
          color: '#1c1917', outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit',
        }}
        onFocus={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = error ? '#f87171' : '#f59e0b'; e.currentTarget.style.boxShadow = `0 0 0 3px ${error ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.1)'}`; }}
        onBlur={e => { e.currentTarget.style.background = error ? '#fef2f2' : '#f9f8f7'; e.currentTarget.style.borderColor = error ? '#fca5a5' : '#e8e5e1'; e.currentTarget.style.boxShadow = 'none'; }}
      />
      {suffix && <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>{suffix}</span>}
    </div>
    {error && <p style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: '#ef4444', margin: 0 }}><XCircle size={11} />{error}</p>}
    {hint && !error && <p style={{ fontSize: 11, color: '#a8a29e', margin: 0, lineHeight: 1.4 }}>{hint}</p>}
  </div>
);

// ── Left Panel ────────────────────────────────────────────────────────────────
const LeftPanel = () => (
  <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', height: '100%', background: 'linear-gradient(160deg, #0c0500 0%, #1e0900 25%, #4a1600 55%, #922800 80%, #c2410c 100%)' }}>
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `radial-gradient(ellipse 80% 60% at 15% 60%, rgba(251,146,60,0.22) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 85% 15%, rgba(234,88,12,0.18) 0%, transparent 60%)` }} />
    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: '48px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'auto' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C8 7 6 10 6 14a6 6 0 0 0 12 0c0-4-2-7-6-12z" fill="#fb923c" /><path d="M12 8c-1.5 3-2 5-2 6a2 2 0 0 0 4 0c0-1-.5-3-2-6z" fill="#fef3c7" /></svg>
        </div>
        <span style={{ color: '#fff', fontWeight: 700, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.3rem' }}>AquaGas</span>
      </div>
      <div style={{ marginTop: 56, marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ height: 1, width: 28, background: 'rgba(251,146,60,0.7)' }} />
          <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.24em', color: '#fb923c', margin: 0 }}>Kenya's #1 LPG delivery</p>
        </div>
        <h2 style={{ color: '#fff', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.2rem, 3vw, 3rem)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.02em', margin: '0 0 16px' }}>
          Gas at your door<br /><em style={{ color: '#fb923c', fontStyle: 'italic' }}>within 45 minutes.</em>
        </h2>
        <p style={{ color: 'rgba(253,186,132,0.65)', fontSize: 14, lineHeight: 1.65, maxWidth: '28ch', margin: 0 }}>Over 50,000 homes and businesses across Nairobi trust AquaGas for safe, reliable LPG.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
        {[{ icon: <Zap size={13} />, text: '45-minute delivery guarantee' }, { icon: <ShieldCheck size={13} />, text: 'Safety-certified cylinders' }, { icon: <Package size={13} />, text: '6 kg · 13 kg · 35 kg sizes' }].map(({ icon, text }) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.2)' }}><span style={{ color: '#fb923c', display: 'flex' }}>{icon}</span></div>
            <span style={{ color: 'rgba(254,215,170,0.7)', fontSize: 13, fontWeight: 500 }}>{text}</span>
          </div>
        ))}
      </div>
      <div style={{ borderRadius: 18, padding: '20px 22px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>{[...Array(5)].map((_, i) => (<svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>))}</div>
        <p style={{ color: 'rgba(254,215,170,0.65)', fontSize: 12.5, lineHeight: 1.6, margin: '0 0 10px' }}>"Order at 8am, gas at my door by 9am. Every single time. AquaGas is simply the best."</p>
        <p style={{ color: '#fb923c', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>— Wanjiku M., Westlands</p>
      </div>
    </div>
  </div>
);

const Dots: React.FC<{ n: number; active: number }> = ({ n, active }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>
    {Array.from({ length: n }).map((_, i) => (
      <div key={i} style={{ borderRadius: 99, transition: 'all 0.3s', width: i === active ? 28 : 8, height: 7, background: i === active ? 'linear-gradient(90deg, #ea580c, #f97316)' : i < active ? '#fdba74' : '#e7e5e4' }} />
    ))}
  </div>
);

const PwStrength: React.FC<{ pw: string }> = ({ pw }) => {
  if (!pw) return null;
  const { pct, label, color } = pwStrength(pw);
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ height: 4, width: '100%', borderRadius: 99, background: '#f0ede9', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 99, transition: 'all 0.5s', width: `${pct}%`, background: color }} />
      </div>
      <p style={{ fontSize: 11, fontWeight: 700, color, margin: '4px 0 0' }}>{label}</p>
    </div>
  );
};

const Spinner = () => <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} className="aq-spin" />;

const PrimaryBtn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }> = ({ children, loading, disabled, type = 'button', ...props }) => (
  <button {...props} type={type} disabled={disabled || loading} style={{ width: '100%', padding: '15px 24px', borderRadius: 12, fontWeight: 700, fontSize: 14.5, color: '#fff', border: 'none', cursor: disabled || loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: disabled || loading ? '#d6d3d1' : 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)', boxShadow: disabled || loading ? 'none' : '0 4px 18px rgba(194,65,12,0.3), inset 0 1px 0 rgba(255,255,255,0.12)', transition: 'all 0.2s', opacity: disabled || loading ? 0.7 : 1, fontFamily: 'inherit' }}>
    {loading ? <><Spinner />{children}</> : children}
  </button>
);

const GhostBtn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
  <button {...props} style={{ width: '100%', padding: '13px 24px', borderRadius: 12, fontWeight: 600, fontSize: 13.5, color: '#57534e', background: '#fff', cursor: 'pointer', border: '1.5px solid #e7e5e4', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.18s', fontFamily: 'inherit' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#ea580c'; e.currentTarget.style.color = '#ea580c'; e.currentTarget.style.background = '#fff7ed'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#e7e5e4'; e.currentTarget.style.color = '#57534e'; e.currentTarget.style.background = '#fff'; }}>
    {children}
  </button>
);

const BackBtn: React.FC<{ onClick: () => void; label?: string }> = ({ onClick, label = 'Back' }) => (
  <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a8a29e', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 28, fontFamily: 'inherit' }}>
    <ArrowLeft size={12} /> {label}
  </button>
);

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
    <div style={{ height: 1, width: 22, background: '#ea580c' }} />
    <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#ea580c', margin: 0 }}>{children}</p>
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();
  const { register, refreshUser, isAuthenticated, loading } = useAuth();

  const [step, setStep]   = useState<Step>('method');
  const [busy, setBusy]   = useState(false);

  // Firebase state
  const [phone, setPhone]                           = useState('');
  const [otp, setOtp]                               = useState('');
  const [otpErr, setOtpErr]                         = useState(false);
  const [countdown, setCountdown]                   = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [firebaseIdToken, setFirebaseIdToken]       = useState<string | null>(null); // stored after OTP confirm
  const recaptchaVerifierRef                        = useRef<RecaptchaVerifier | null>(null);
  const timerRef                                    = useRef<NodeJS.Timeout>();

  const [prof, setProf] = useState({ fn: '', ln: '', email: '', pw: '', cpw: '', setPw: false });
  const [showPw, setShowPw] = useState(false);
  const [ef, setEf]     = useState({ name: '', email: '', phone: '', pw: '', cpw: '' });
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

  // ── Initialise invisible reCAPTCHA for Firebase ──────────────────────────
  const initRecaptcha = () => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        firebaseAuth,
        'recaptcha-container',  // invisible div rendered below
        { size: 'invisible', callback: () => {} }
      );
    }
    return recaptchaVerifierRef.current;
  };

  // ── SEND OTP via Firebase ─────────────────────────────────────────────────
  const sendOTP = async () => {
    const formatted = formatPhone(phone.trim());
    if (!isValidPhone(phone.trim())) {
      toast.error('Enter a valid Kenyan number (07xx or +254 7xx)');
      return;
    }
    setBusy(true);
    try {
      const appVerifier = initRecaptcha();
      const result = await signInWithPhoneNumber(firebaseAuth, formatted, appVerifier);
      setConfirmationResult(result);
      startTimer();
      setStep('phone-otp');
      toast.success('Verification code sent!');
    } catch (e: any) {
      console.error('Firebase sendOTP error:', e);
      toast.error(e.message || 'Failed to send verification code. Try again.');
      // Reset reCAPTCHA on error so the user can retry
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
    } finally {
      setBusy(false);
    }
  };

  // ── VERIFY OTP via Firebase ───────────────────────────────────────────────
  const verifyOTP = async () => {
    if (otp.replace(/\s/g, '').length !== 6) { setOtpErr(true); return; }
    if (!confirmationResult) { toast.error('Please request a new code.'); setStep('phone-entry'); return; }

    setBusy(true); setOtpErr(false);
    try {
      // 1. Confirm OTP with Firebase — this gives us a FirebaseUser
      const userCredential = await confirmationResult.confirm(otp.replace(/\s/g, ''));
      // 2. Get the ID token to send to our backend
      const idToken = await userCredential.user.getIdToken();
      setFirebaseIdToken(idToken);

      // 3. Tell our backend — it will log the user in or tell us they're new
      const data = await apiPost<{
        token?:            string;
        accountExists?:    boolean;
        needsRegistration?: boolean;
        user?:             any;
      }>('/firebase/verify-phone', {}, idToken);

      if (data.token && data.accountExists) {
        // Existing user — same fix as original: hydrate context then navigate
        localStorage.setItem('authToken', data.token);
        await refreshUser();
        toast.success('Welcome back!');
        router.push('/account');
        return;
      }

      // New user — proceed to profile completion
      setStep('phone-profile');
    } catch (e: any) {
      console.error('Firebase verifyOTP error:', e);
      setOtpErr(true);
      toast.error(e.message || 'Incorrect or expired code');
    } finally {
      setBusy(false);
    }
  };

  // ── PHONE REGISTER ────────────────────────────────────────────────────────
  const phoneRegister = async () => {
    if (!firebaseIdToken) { toast.error('Phone verification lost. Please start again.'); setStep('phone-entry'); return; }

    const e: Record<string, string> = {};
    if (prof.fn.trim().length < 2) e.fn = 'Required (min 2 chars)';
    if (prof.ln.trim().length < 2) e.ln = 'Required (min 2 chars)';
    if (prof.email && !isValidEmail(prof.email)) e.email = 'Invalid email';
    if (prof.setPw) {
      if (prof.pw.length < 8) e.pw = 'Min 8 characters';
      else if (!/[A-Z]/.test(prof.pw) || !/[a-z]/.test(prof.pw) || !/\d/.test(prof.pw)) e.pw = 'Needs uppercase, lowercase & number';
      if (prof.pw !== prof.cpw) e.cpw = 'Passwords do not match';
    }
    setErrs(e);
    if (Object.keys(e).length) return;

    setBusy(true);
    try {
      // Send the Firebase ID token in the header; backend reads phone from the token
      const data = await apiPost<{ token?: string }>(
        '/register/phone',
        {
          firstName: prof.fn.trim(),
          lastName:  prof.ln.trim(),
          ...(prof.email            && { email:    normalizeEmail(prof.email) }),
          ...(prof.setPw && prof.pw && { password: prof.pw }),
        },
        firebaseIdToken   // ← X-Firebase-Token header
      );

      if (data.token) {
        localStorage.setItem('authToken', data.token);
        await refreshUser();
      }

      toast.success('Welcome to AquaGas! 🎉');
      router.push('/account');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  // ── EMAIL REGISTER (unchanged) ────────────────────────────────────────────
  const emailRegister = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (ef.name.trim().length < 2)   e.name  = 'Full name required (min 2 chars)';
    if (!ef.email.trim())             e.email = 'Email is required';
    else if (!isValidEmail(ef.email)) e.email = 'Invalid email address';
    if (!ef.phone.trim())             e.phone = 'Phone number is required';
    else if (!isValidPhone(ef.phone)) e.phone = 'Use: +254712345678 or 0712345678';
    if (!ef.pw)                       e.pw    = 'Password is required';
    else if (ef.pw.length < 8)        e.pw    = 'Min 8 characters';
    else if (!/[A-Z]/.test(ef.pw) || !/[a-z]/.test(ef.pw) || !/\d/.test(ef.pw)) e.pw = 'Needs uppercase, lowercase & number';
    if (ef.pw !== ef.cpw)             e.cpw   = 'Passwords do not match';
    setErrs(e);
    if (Object.keys(e).length) return;

    setBusy(true);
    try {
      await register({ fullName: ef.name.trim(), email: normalizeEmail(ef.email), phone: formatPhone(ef.phone.trim()), password: ef.pw });
      toast.success('Welcome to AquaGas! 🎉');
      router.push('/account');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err?.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f7f5' }}>
      <Loader size={26} style={{ color: '#ea580c', animation: 'aq-spin 1s linear infinite' }} />
    </div>
  );

  const profPwOk = prof.cpw && prof.pw === prof.cpw;
  const efPwOk   = ef.cpw  && ef.pw  === ef.cpw;

  return (
    <>
      <Head>
        <title>Create Account — AquaGas</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Invisible reCAPTCHA container — required by Firebase phone auth */}
      <div id="recaptcha-container" />

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: #f8f7f5; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        @keyframes aq-fadein { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes aq-spin { to { transform: rotate(360deg); } }
        @keyframes aq-pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.35); } 100% { box-shadow: 0 0 0 14px rgba(34,197,94,0); } }
        .aq-step { animation: aq-fadein 0.35s cubic-bezier(0.22,1,0.36,1) both; }
        .aq-spin { animation: aq-spin 0.7s linear infinite; }
        .aq-verified { animation: aq-pulse-ring 0.9s ease-out; }
        .aq-layout { display: grid; min-height: 100vh; grid-template-columns: 1fr 1fr; grid-template-areas: "left right"; }
        .aq-left  { grid-area: left; }
        .aq-right { grid-area: right; display: flex; flex-direction: column; background: #f8f7f5; overflow-y: auto; }
        @media (max-width: 1023px) { .aq-layout { grid-template-columns: 1fr; grid-template-areas: "right"; } .aq-left { display: none !important; } }
        .aq-method-card { width: 100%; text-align: left; background: #fff; border: 1.5px solid #f0ede9; border-radius: 16px; padding: 18px 20px; cursor: pointer; display: flex; align-items: center; gap: 16px; transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s; font-family: inherit; }
        .aq-method-card:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.06); border-color: #fed7aa; }
        .aq-method-card:active { transform: translateY(0); }
      `}</style>

      <div className="aq-layout">
        <div className="aq-left"><LeftPanel /></div>

        <div className="aq-right">
          {/* Mobile logo bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C8 7 6 10 6 14a6 6 0 0 0 12 0c0-4-2-7-6-12z" fill="white" /></svg>
              </div>
              <span style={{ fontWeight: 700, color: '#1c1917', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem' }}>AquaGas</span>
            </div>
            <Link href="/account/login" style={{ fontSize: 12, fontWeight: 700, color: '#a8a29e', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
              <ArrowLeft size={11} /> Login
            </Link>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
            <div style={{ width: '100%', maxWidth: 400 }}>

              {/* METHOD */}
              {step === 'method' && (
                <div className="aq-step">
                  <div style={{ marginBottom: 36 }}>
                    <SectionLabel>New account</SectionLabel>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 2.6rem)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.02em', color: '#1c1917', margin: '0 0 12px' }}>Join AquaGas</h1>
                    <p style={{ color: '#78716c', fontSize: 14, lineHeight: 1.6, margin: 0 }}>Choose how you'd like to create your account.</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                    <button className="aq-method-card" onClick={() => setStep('phone-entry')}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'linear-gradient(145deg, #fff7ed, #fed7aa)' }}><Smartphone size={22} style={{ color: '#ea580c' }} /></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <p style={{ fontWeight: 700, color: '#1c1917', fontSize: 14, margin: 0 }}>Phone + OTP</p>
                          <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', background: '#fff7ed', color: '#ea580c', padding: '2px 7px', borderRadius: 99, border: '1px solid #fed7aa' }}>Fastest</span>
                        </div>
                        <p style={{ fontSize: 12.5, color: '#a8a29e', lineHeight: 1.5, margin: 0 }}>Verify with a 6-digit code — no password needed.</p>
                      </div>
                      <ChevronRight size={14} style={{ color: '#d6d3d1', flexShrink: 0 }} />
                    </button>
                    <button className="aq-method-card" onClick={() => setStep('email-form')}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'linear-gradient(145deg, #f0fdf4, #bbf7d0)' }}><Mail size={22} style={{ color: '#16a34a' }} /></div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 700, color: '#1c1917', fontSize: 14, margin: '0 0 4px' }}>Email & Password</p>
                        <p style={{ fontSize: 12.5, color: '#a8a29e', lineHeight: 1.5, margin: 0 }}>Full account with email, phone & password.</p>
                      </div>
                      <ChevronRight size={14} style={{ color: '#d6d3d1', flexShrink: 0 }} />
                    </button>
                  </div>
                  <p style={{ textAlign: 'center', fontSize: 13, color: '#a8a29e', margin: 0 }}>
                    Already have an account?{' '}<Link href="/account/login" style={{ fontWeight: 700, color: '#ea580c', textDecoration: 'none' }}>Log in</Link>
                  </p>
                </div>
              )}

              {/* PHONE ENTRY */}
              {step === 'phone-entry' && (
                <div className="aq-step">
                  <Dots n={3} active={0} />
                  <BackBtn onClick={() => setStep('method')} />
                  <div style={{ marginBottom: 32 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, background: 'linear-gradient(145deg, #fff7ed, #fed7aa)' }}><Smartphone size={22} style={{ color: '#ea580c' }} /></div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#1c1917', margin: '0 0 8px' }}>Your phone number</h2>
                    <p style={{ color: '#78716c', fontSize: 14, margin: 0 }}>Firebase will send a 6-digit code via SMS to verify it's you.</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <FormInput label="Phone Number" hint="Format: +254712345678 or 0712345678" icon={<Phone size={15} />} type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0712 345 678" onKeyDown={e => e.key === 'Enter' && sendOTP()} />
                    <PrimaryBtn onClick={sendOTP} loading={busy}>{busy ? 'Sending…' : 'Send verification code'}</PrimaryBtn>
                  </div>
                </div>
              )}

              {/* OTP */}
              {step === 'phone-otp' && (
                <div className="aq-step">
                  <Dots n={3} active={1} />
                  <BackBtn onClick={() => setStep('phone-entry')} label="Change number" />
                  <div style={{ marginBottom: 32 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, background: 'linear-gradient(145deg, #f0fdf4, #bbf7d0)', border: '1.5px solid #86efac' }}><ShieldCheck size={22} style={{ color: '#16a34a' }} /></div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#1c1917', margin: '0 0 8px' }}>Enter the code</h2>
                    <p style={{ color: '#78716c', fontSize: 14, margin: 0 }}>Sent to <strong style={{ color: '#1c1917' }}>{formatPhone(phone.trim())}</strong></p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <OTPBox value={otp} onChange={v => { setOtp(v); setOtpErr(false); }} error={otpErr} />
                    {otpErr && <p style={{ textAlign: 'center', fontSize: 12.5, fontWeight: 600, color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, margin: 0 }}><XCircle size={12} /> Incorrect or expired code</p>}
                    <PrimaryBtn onClick={verifyOTP} loading={busy} disabled={otp.replace(/\s/g, '').length !== 6}>{busy ? 'Verifying…' : 'Verify code'}</PrimaryBtn>
                    <div style={{ textAlign: 'center' }}>
                      {countdown > 0 ? (
                        <p style={{ fontSize: 12.5, color: '#a8a29e', margin: 0 }}>Resend in <span style={{ fontWeight: 700, color: '#ea580c' }}>{countdown}s</span></p>
                      ) : (
                        <button onClick={sendOTP} disabled={busy} style={{ fontSize: 12.5, fontWeight: 700, color: '#ea580c', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}>
                          <RefreshCw size={12} /> Resend code
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* PROFILE COMPLETION */}
              {step === 'phone-profile' && (
                <div className="aq-step">
                  <Dots n={3} active={2} />
                  <div style={{ marginBottom: 20 }}>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#1c1917', margin: '0 0 8px' }}>Complete your profile</h2>
                    <p style={{ color: '#78716c', fontSize: 14, margin: 0 }}>Almost there — just a few details.</p>
                  </div>
                  <div className="aq-verified" style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 12, padding: '12px 16px', marginBottom: 20, background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#dcfce7' }}><CheckCircle size={16} style={{ color: '#16a34a' }} /></div>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#15803d', margin: '0 0 2px' }}>Phone verified by Firebase</p>
                      <p style={{ fontSize: 13.5, fontWeight: 600, color: '#1c1917', margin: 0 }}>{formatPhone(phone.trim())}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <FormInput label="First Name" error={errs.fn} icon={<User size={14} />} value={prof.fn} placeholder="Jane" onChange={e => { setProf(p => ({ ...p, fn: e.target.value })); setErrs(r => ({ ...r, fn: '' })); }} />
                      <FormInput label="Last Name" error={errs.ln} icon={<User size={14} />} value={prof.ln} placeholder="Kamau" onChange={e => { setProf(p => ({ ...p, ln: e.target.value })); setErrs(r => ({ ...r, ln: '' })); }} />
                    </div>
                    <FormInput label="Email Address" error={errs.email} hint="Optional — for receipts & updates" icon={<Mail size={14} />} type="email" value={prof.email} placeholder="you@example.com" onChange={e => { setProf(p => ({ ...p, email: e.target.value })); setErrs(r => ({ ...r, email: '' })); }} />
                    <div>
                      <div onClick={() => setProf(p => ({ ...p, setPw: !p.setPw }))} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderRadius: 12, padding: '14px 16px', cursor: 'pointer', border: `1.5px solid ${prof.setPw ? '#fed7aa' : '#f0ede9'}`, transition: 'border-color 0.2s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: prof.setPw ? '#fff7ed' : '#f5f5f4' }}><Lock size={14} style={{ color: prof.setPw ? '#ea580c' : '#a8a29e' }} /></div>
                          <div>
                            <p style={{ fontSize: 12.5, fontWeight: 700, color: prof.setPw ? '#c2410c' : '#57534e', margin: '0 0 2px' }}>{prof.setPw ? 'Password enabled' : 'Set a password (optional)'}</p>
                            <p style={{ fontSize: 11, color: '#a8a29e', margin: 0 }}>{prof.setPw ? 'Login with phone/email + password' : 'You can add one later in settings'}</p>
                          </div>
                        </div>
                        <div style={{ position: 'relative', width: 36, height: 20, borderRadius: 99, background: prof.setPw ? '#ea580c' : '#e7e5e4', transition: 'background 0.25s', flexShrink: 0 }}>
                          <div style={{ position: 'absolute', top: 2, width: 16, height: 16, background: '#fff', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.25s', left: prof.setPw ? 18 : 2 }} />
                        </div>
                      </div>
                      {prof.setPw && (
                        <div className="aq-step" style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <div>
                            <FormInput label="Password" error={errs.pw} icon={<Lock size={14} />} type={showPw ? 'text' : 'password'} value={prof.pw} placeholder="••••••••" onChange={e => { setProf(p => ({ ...p, pw: e.target.value })); setErrs(r => ({ ...r, pw: '' })); }} suffix={<button type="button" onClick={() => setShowPw(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a8a29e', display: 'flex', padding: 4 }}>{showPw ? <EyeOff size={14} /> : <Eye size={14} />}</button>} />
                            <PwStrength pw={prof.pw} />
                          </div>
                          <FormInput label="Confirm Password" error={errs.cpw} icon={<Lock size={14} />} type={showPw ? 'text' : 'password'} value={prof.cpw} placeholder="••••••••" onChange={e => { setProf(p => ({ ...p, cpw: e.target.value })); setErrs(r => ({ ...r, cpw: '' })); }} suffix={profPwOk ? <CheckCircle size={14} style={{ color: '#16a34a' }} /> : undefined} />
                        </div>
                      )}
                    </div>
                    <PrimaryBtn onClick={phoneRegister} loading={busy}>{busy ? 'Creating account…' : <>Create account <ChevronRight size={14} /></>}</PrimaryBtn>
                    <p style={{ textAlign: 'center', fontSize: 11.5, color: '#a8a29e', margin: 0 }}>By registering you agree to our <a href="/terms" style={{ fontWeight: 700, color: '#ea580c', textDecoration: 'none' }}>Terms</a> & <a href="/privacy" style={{ fontWeight: 700, color: '#ea580c', textDecoration: 'none' }}>Privacy Policy</a></p>
                  </div>
                </div>
              )}

              {/* EMAIL FORM */}
              {step === 'email-form' && (
                <div className="aq-step">
                  <BackBtn onClick={() => setStep('method')} label="Choose another method" />
                  <div style={{ marginBottom: 28 }}>
                    <SectionLabel>Email registration</SectionLabel>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#1c1917', margin: '0 0 8px' }}>Create your account</h2>
                    <p style={{ color: '#78716c', fontSize: 14, margin: 0 }}>Fast LPG delivery across Nairobi.</p>
                  </div>
                  <form onSubmit={emailRegister} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <FormInput label="Full Name" error={errs.name} icon={<User size={14} />} type="text" autoComplete="name" placeholder="Jane Kamau" value={ef.name} onChange={e => { setEf(f => ({ ...f, name: e.target.value })); setErrs(r => ({ ...r, name: '' })); }} />
                    <FormInput label="Email Address" error={errs.email} icon={<Mail size={14} />} type="email" autoComplete="email" placeholder="you@example.com" value={ef.email} onChange={e => { setEf(f => ({ ...f, email: e.target.value })); setErrs(r => ({ ...r, email: '' })); }} />
                    <FormInput label="Phone Number" error={errs.phone} hint="+254712345678 or 0712345678" icon={<Phone size={14} />} type="tel" autoComplete="tel" placeholder="0712 345 678" value={ef.phone} onChange={e => { setEf(f => ({ ...f, phone: e.target.value })); setErrs(r => ({ ...r, phone: '' })); }} />
                    <div>
                      <FormInput label="Password" error={errs.pw} icon={<Lock size={14} />} type={showEPw ? 'text' : 'password'} autoComplete="new-password" placeholder="••••••••" value={ef.pw} onChange={e => { setEf(f => ({ ...f, pw: e.target.value })); setErrs(r => ({ ...r, pw: '' })); }} suffix={<button type="button" onClick={() => setShowEPw(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a8a29e', display: 'flex', padding: 4 }}>{showEPw ? <EyeOff size={14} /> : <Eye size={14} />}</button>} />
                      <PwStrength pw={ef.pw} />
                    </div>
                    <FormInput label="Confirm Password" error={errs.cpw} icon={<Lock size={14} />} type={showEPw ? 'text' : 'password'} autoComplete="new-password" placeholder="••••••••" value={ef.cpw} onChange={e => { setEf(f => ({ ...f, cpw: e.target.value })); setErrs(r => ({ ...r, cpw: '' })); }} suffix={efPwOk ? <CheckCircle size={14} style={{ color: '#16a34a' }} /> : undefined} />
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                      <input type="checkbox" required style={{ marginTop: 2, width: 15, height: 15, accentColor: '#ea580c', flexShrink: 0 }} />
                      <span style={{ fontSize: 12.5, color: '#78716c', lineHeight: 1.5 }}>I agree to the <a href="/terms" style={{ fontWeight: 700, color: '#ea580c', textDecoration: 'none' }}>Terms of Service</a> and <a href="/privacy" style={{ fontWeight: 700, color: '#ea580c', textDecoration: 'none' }}>Privacy Policy</a></span>
                    </label>
                    <PrimaryBtn type="submit" loading={busy}>{busy ? 'Creating account…' : <>Create account <ChevronRight size={14} /></>}</PrimaryBtn>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1, height: 1, background: '#e8e5e1' }} />
                      <span style={{ fontSize: 11, color: '#a8a29e', fontWeight: 500 }}>or</span>
                      <div style={{ flex: 1, height: 1, background: '#e8e5e1' }} />
                    </div>
                    <GhostBtn type="button" onClick={() => setStep('phone-entry')}><Smartphone size={15} /> Sign up with phone instead</GhostBtn>
                  </form>
                  <p style={{ textAlign: 'center', fontSize: 13, color: '#a8a29e', marginTop: 20, marginBottom: 0 }}>Already have an account?{' '}<Link href="/account/login" style={{ fontWeight: 700, color: '#ea580c', textDecoration: 'none' }}>Log in</Link></p>
                </div>
              )}

            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '4px 16px 20px' }}>
            <p style={{ fontSize: 10.5, color: '#d6d3d1', margin: 0 }}>© {new Date().getFullYear()} AquaGas Kenya · Nairobi · Secure payments</p>
          </div>
        </div>
      </div>
    </>
  );
}
