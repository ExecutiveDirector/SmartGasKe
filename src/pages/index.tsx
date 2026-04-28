// ============================================================
// FILE: src/pages/index.tsx
// AquaGas — Premium Homepage
// ============================================================

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Outlet, Product } from '@/lib/types';
import Carousel from '@/components/Carousel';
import VendorCard from '@/components/VendorCard';
import ProductCard from '@/components/ProductCard';
import {
  ShoppingBag,
  MapPin,
  TrendingUp,
  Award,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  ChevronDown,
  Star,
  Flame,
} from 'lucide-react';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://aquagas-backend.onrender.com/api/v1';

interface Vendor {
  vendor_id: number;
  business_name: string;
  business_email: string;
  business_phone: string;
  is_active: boolean;
  is_featured: boolean;
  rating: number;
  total_reviews: number;
  vendor_outlets?: VendorOutlet[];
}

interface VendorOutlet {
  outlet_id: number;
  outlet_name: string;
  outlet_code: string;
  latitude: number;
  longitude: number;
  address_line_1: string;
  city: string;
  county: string;
}

export default function Home() {
  const [vendors, setVendors] = useState<Outlet[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const carouselImages = [
    '/images/banners/hero-banner.jpg',
    '/images/banners/promo-banner.jpg',
    '/images/banners/special-offer.jpg',
  ];

  useEffect(() => {
    // Trigger hero animation
    const t = setTimeout(() => setHeroVisible(true), 80);
    getUserLocation();
    fetchData();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (userLocation) fetchData();
  }, [userLocation]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: -1.2921, lng: 36.8219 })
      );
    } else {
      setUserLocation({ lat: -1.2921, lng: 36.8219 });
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [vRes, pRes] = await Promise.all([
        fetch(`${API_URL}/vendors?page=1&limit=20`),
        fetch(`${API_URL}/products/featured?limit=8`),
      ]);
      if (vRes.ok) {
        const vData: Vendor[] = await vRes.json();
        setVendors(transformVendors(vData));
      }
      if (pRes.ok) {
        const pData = await pRes.json();
        const prods = Array.isArray(pData) ? pData : pData.products || [];
        setFeaturedProducts(prods.slice(0, 8));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const transformVendors = (data: Vendor[]): Outlet[] =>
    data.flatMap((vendor) => {
      if (vendor.vendor_outlets?.length) {
        return vendor.vendor_outlets
          .map((outlet) => ({
            id: outlet.outlet_id.toString(),
            outlet_id: outlet.outlet_id,
            name: outlet.outlet_name,
            outlet_name: outlet.outlet_name,
            vendor: vendor.business_name,
            vendor_name: vendor.business_name,
            vendor_id: vendor.vendor_id,
            address: `${outlet.address_line_1}, ${outlet.city}`,
            distance: userLocation
              ? Math.round(
                  calculateDistance(userLocation.lat, userLocation.lng, outlet.latitude, outlet.longitude) * 10
                ) / 10
              : 0,
            rating: vendor.rating || 0,
            reviews: vendor.total_reviews || 0,
            phone: vendor.business_phone,
            contact_phone: vendor.business_phone,
            featured: vendor.is_featured,
            is_active: vendor.is_active,
            latitude: outlet.latitude,
            longitude: outlet.longitude,
            city: outlet.city,
            county: outlet.county,
          }))
          .sort((a, b) => a.distance - b.distance);
      }
      return [
        {
          id: vendor.vendor_id.toString(),
          vendor_id: vendor.vendor_id,
          name: vendor.business_name,
          vendor: vendor.business_name,
          vendor_name: vendor.business_name,
          address: 'Multiple locations',
          distance: 0,
          rating: vendor.rating || 0,
          reviews: vendor.total_reviews || 0,
          phone: vendor.business_phone,
          contact_phone: vendor.business_phone,
          featured: vendor.is_featured,
          is_active: vendor.is_active,
          latitude: 0,
          longitude: 0,
        },
      ];
    });

  const getOutletForProduct = (product: any): Outlet | null => {
    if (product.outlet_name || product.vendor_name) {
      return (
        vendors.find((v) => v.name === product.outlet_name || v.vendor === product.vendor_name) ||
        createFallbackOutlet(product)
      );
    }
    return vendors.length > 0 ? vendors[0] : createFallbackOutlet(product);
  };

  const createFallbackOutlet = (product: any): Outlet => ({
    id: product.outlet_id?.toString() || 'default',
    name: product.outlet_name || 'AquaGas Outlet',
    vendor: product.vendor_name || 'AquaGas',
    rating: 4.0,
    reviews: 0,
    address: 'Multiple locations',
    phone: '',
    featured: false,
    is_active: true,
  });

  return (
    <>
      <Head>
        <title>AquaGas — Fast Gas Delivery in Kenya</title>
        <meta
          name="description"
          content="AquaGas delivers cooking gas cylinders quickly and reliably across Nairobi and surrounding areas."
        />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="AquaGas — Fast Gas Delivery in Kenya" />
        <meta property="og:description" content="AquaGas delivers cooking gas cylinders quickly and reliably." />
        <meta property="og:image" content="/images/banners/hero-banner.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.aquagas.co.ke" />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* ─────────────────────────────────────────── */}
      {/* Global styles + animations                  */}
      {/* ─────────────────────────────────────────── */}
      <style>{`
        :root {
          --emerald: #10b981;
          --emerald-dark: #059669;
          --emerald-glow: rgba(16,185,129,0.25);
          --blue: #3b82f6;
          --blue-dark: #2563eb;
          --blue-glow: rgba(59,130,246,0.22);
          --ink: #020d18;
          --ink-2: #071524;
          --surface: #0b1e2e;
          --surface-2: #0f2133;
          --border: rgba(255,255,255,0.07);
          --text: #f0f6ff;
          --text-muted: #7a9ab8;
          --font-display: 'Playfair Display', Georgia, serif;
          --font-body: 'Outfit', system-ui, sans-serif;
        }

        * { box-sizing: border-box; }

        body {
          font-family: var(--font-body);
          background: var(--ink);
          color: var(--text);
          margin: 0;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.9); opacity: 0.8; }
          70%  { transform: scale(1.3); opacity: 0; }
          100% { transform: scale(0.9); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes orb-drift {
          0%, 100% { transform: translate(0,0) scale(1); }
          33%       { transform: translate(40px,-30px) scale(1.08); }
          66%       { transform: translate(-25px,20px) scale(0.95); }
        }
        @keyframes scroll-bounce {
          0%,100% { transform: translateY(0); opacity:1; }
          50%      { transform: translateY(6px); opacity:.4; }
        }

        .hero-visible .hero-line-1 { animation: fadeUp .7s ease both; }
        .hero-visible .hero-line-2 { animation: fadeUp .7s .15s ease both; }
        .hero-visible .hero-line-3 { animation: fadeUp .7s .3s ease both; }
        .hero-visible .hero-ctas   { animation: fadeUp .7s .45s ease both; }
        .hero-visible .hero-badge  { animation: fadeIn .6s .6s ease both; }

        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(0,0,0,.4); }
        .stat-card { transition: transform .25s ease, box-shadow .25s ease; }

        .vendor-card-wrap:hover { transform: translateY(-4px); }
        .vendor-card-wrap { transition: transform .2s ease; }

        .product-card-wrap:hover { transform: translateY(-4px); }
        .product-card-wrap { transition: transform .2s ease; }

        .btn-glow-green {
          background: linear-gradient(135deg,#10b981,#059669);
          box-shadow: 0 0 0 0 var(--emerald-glow);
          transition: box-shadow .25s ease, transform .2s ease;
        }
        .btn-glow-green:hover {
          box-shadow: 0 6px 32px var(--emerald-glow);
          transform: translateY(-2px);
        }

        .btn-glow-blue {
          background: linear-gradient(135deg,#3b82f6,#2563eb);
          box-shadow: 0 0 0 0 var(--blue-glow);
          transition: box-shadow .25s ease, transform .2s ease;
        }
        .btn-glow-blue:hover {
          box-shadow: 0 6px 32px var(--blue-glow);
          transform: translateY(-2px);
        }

        .pill-filter {
          transition: all .2s ease;
          cursor: pointer;
          border: none;
          font-family: var(--font-body);
        }

        .skeleton {
          background: linear-gradient(90deg, #0f2133 25%, #183044 50%, #0f2133 75%);
          background-size: 400px 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 12px;
        }

        .section-appear {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity .6s ease, transform .6s ease;
        }
        .section-appear.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .orb { animation: orb-drift 12s ease-in-out infinite; }
        .orb-2 { animation: orb-drift 16s ease-in-out infinite reverse; }
        .float-icon { animation: float 3s ease-in-out infinite; }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'var(--ink)', fontFamily: 'var(--font-body)' }}>

        {/* ═══════════════════════════════════════════════
            CINEMATIC HERO
        ═══════════════════════════════════════════════ */}
        <section
          ref={heroRef}
          className={heroVisible ? 'hero-visible' : ''}
          style={{
            position: 'relative',
            minHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            background: 'linear-gradient(160deg, #020d18 0%, #041a2e 45%, #031a0e 100%)',
          }}
        >
          {/* Ambient orbs */}
          <div className="orb" style={{
            position: 'absolute', top: '10%', right: '15%',
            width: 480, height: 480,
            background: 'radial-gradient(circle, rgba(16,185,129,0.13) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />
          <div className="orb-2" style={{
            position: 'absolute', bottom: '15%', left: '10%',
            width: 360, height: 360,
            background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />

          {/* Grid texture */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />

          {/* Diagonal accent line */}
          <div style={{
            position: 'absolute', top: 0, right: '30%', width: 1, height: '100%',
            background: 'linear-gradient(to bottom, transparent, rgba(16,185,129,0.15), transparent)',
            pointerEvents: 'none',
          }} />

          {/* Hero content */}
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, padding: '0 24px', textAlign: 'center' }}>

            {/* Eyebrow badge */}
            <div className="hero-badge" style={{ opacity: 0, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 100, padding: '6px 20px', marginBottom: 32 }}>
              <span style={{ width: 7, height: 7, background: '#10b981', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
              <span style={{ color: '#10b981', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Fast Delivery · Nairobi & Beyond</span>
            </div>

            {/* Main headline */}
            <h1 className="hero-line-1" style={{ opacity: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(42px, 7vw, 88px)', fontWeight: 900, lineHeight: 1.05, color: '#f0f6ff', margin: '0 0 8px', letterSpacing: '-0.03em' }}>
              Kenya's Fastest
            </h1>
            <h1 className="hero-line-2" style={{ opacity: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(42px, 7vw, 88px)', fontWeight: 900, lineHeight: 1.05, margin: '0 0 28px', letterSpacing: '-0.03em' }}>
              <span style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', backgroundImage: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' }}>
                Gas Delivery
              </span>
            </h1>

            <p className="hero-line-3" style={{ opacity: 0, fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 600, margin: '0 auto 48px', fontWeight: 400 }}>
              Order LPG cylinders from verified outlets near you. Safe, affordable, and at your doorstep in under 2 hours.
            </p>

            {/* CTAs */}
            <div className="hero-ctas" style={{ opacity: 0, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/shop" className="btn-glow-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: '#fff', padding: '16px 36px', borderRadius: 14, fontWeight: 700, fontSize: 16, textDecoration: 'none', letterSpacing: '-0.01em' }}>
                <Flame size={18} />
                Order Gas Now
                <ArrowRight size={16} />
              </Link>
              <Link href="/shop" className="btn-glow-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: '#fff', padding: '16px 36px', borderRadius: 14, fontWeight: 600, fontSize: 16, textDecoration: 'none', letterSpacing: '-0.01em' }}>
                <MapPin size={18} />
                Find Near Me
              </Link>
            </div>

            {/* Trust indicators */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, marginTop: 56, flexWrap: 'wrap' }}>
              {[
                { num: `${vendors.length || '20'}+`, label: 'Active Outlets' },
                { num: '2hrs', label: 'Avg Delivery' },
                { num: '4.8★', label: 'Customer Rating' },
              ].map((item) => (
                <div key={item.label} style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#f0f6ff', margin: 0, lineHeight: 1 }}>{item.num}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll cue */}
          <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scroll</span>
            <ChevronDown size={18} color="var(--text-muted)" style={{ animation: 'scroll-bounce 1.6s ease-in-out infinite' }} />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            CAROUSEL
        ═══════════════════════════════════════════════ */}
        <div style={{ position: 'relative' }}>
          <Carousel images={carouselImages} />
        </div>

        {/* ═══════════════════════════════════════════════
            STAT BANNER
        ═══════════════════════════════════════════════ */}
        <section style={{ background: 'var(--ink-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '48px 24px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>

            {/* Card 1 — Outlets */}
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))', border: '1px solid rgba(16,185,129,0.18)', borderRadius: 20, padding: '28px 28px', display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 56, height: 56, background: 'rgba(16,185,129,0.15)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShoppingBag size={26} color="#10b981" />
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 700, color: '#f0f6ff', margin: 0, lineHeight: 1 }}>{vendors.length || 0}+</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '5px 0 0', fontWeight: 500 }}>Active Outlets</p>
              </div>
            </div>

            {/* Card 2 — Delivery */}
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(59,130,246,0.02))', border: '1px solid rgba(59,130,246,0.18)', borderRadius: 20, padding: '28px 28px', display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 56, height: 56, background: 'rgba(59,130,246,0.15)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Zap size={26} color="#3b82f6" />
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 700, color: '#f0f6ff', margin: 0, lineHeight: 1 }}>{'< 2hrs'}</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '5px 0 0', fontWeight: 500 }}>Lightning Delivery</p>
              </div>
            </div>

            {/* Card 3 — Safe */}
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))', border: '1px solid rgba(16,185,129,0.18)', borderRadius: 20, padding: '28px 28px', display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 56, height: 56, background: 'rgba(16,185,129,0.15)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Shield size={26} color="#10b981" />
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 700, color: '#f0f6ff', margin: 0, lineHeight: 1 }}>100%</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '5px 0 0', fontWeight: 500 }}>Safe & Certified</p>
              </div>
            </div>

            {/* Card 4 — Support */}
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(59,130,246,0.02))', border: '1px solid rgba(59,130,246,0.18)', borderRadius: 20, padding: '28px 28px', display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 56, height: 56, background: 'rgba(59,130,246,0.15)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Clock size={26} color="#3b82f6" />
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 700, color: '#f0f6ff', margin: 0, lineHeight: 1 }}>24/7</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '5px 0 0', fontWeight: 500 }}>Customer Support</p>
              </div>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            MAIN CONTENT
        ═══════════════════════════════════════════════ */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 24px' }}>

          {/* Error */}
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 16, padding: '20px 24px', marginBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ color: '#fca5a5', fontWeight: 600, margin: 0, fontSize: 15 }}>Unable to load data</p>
                <p style={{ color: '#f87171', fontSize: 13, margin: '4px 0 0' }}>{error}</p>
              </div>
              <button
                onClick={fetchData}
                style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.35)', color: '#fca5a5', borderRadius: 10, padding: '8px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
              >
                Retry
              </button>
            </div>
          )}

          {/* ─────────────────────────────────────── */}
          {/* FEATURED PRODUCTS                        */}
          {/* ─────────────────────────────────────── */}
          {(loading || featuredProducts.length > 0) && (
            <section style={{ marginBottom: 88 }}>
              {/* Section header */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
                <div>
                  {/* Eyebrow */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 28, height: 2, background: 'linear-gradient(90deg,#10b981,#3b82f6)', borderRadius: 2 }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Handpicked for you</span>
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: '#f0f6ff', margin: 0, letterSpacing: '-0.025em', lineHeight: 1.1 }}>
                    Featured Products
                  </h2>
                  <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: 15, fontWeight: 400 }}>Popular cylinders & accessories</p>
                </div>
                <Link href="/shop" className="btn-glow-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#fff', padding: '13px 28px', borderRadius: 12, fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
                  View All <ArrowRight size={16} />
                </Link>
              </div>

              {/* Skeleton or grid */}
              {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 24 }}>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <div className="skeleton" style={{ height: 200 }} />
                      <div style={{ padding: 20 }}>
                        <div className="skeleton" style={{ height: 14, marginBottom: 10 }} />
                        <div className="skeleton" style={{ height: 14, width: '60%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 24 }}>
                  {featuredProducts.map((product) => {
                    const outlet = getOutletForProduct(product);
                    return outlet ? (
                      <div className="product-card-wrap" key={product.id || (product as any).product_id}>
                        <ProductCard product={product} outlet={outlet} compact />
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </section>
          )}

          {/* ─────────────────────────────────────── */}
          {/* VENDORS NEAR YOU                         */}
          {/* ─────────────────────────────────────── */}
          <section style={{ marginBottom: 88 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 28, height: 2, background: 'linear-gradient(90deg,#3b82f6,#10b981)', borderRadius: 2 }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {userLocation ? 'Based on your GPS' : 'Available now'}
                  </span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: '#f0f6ff', margin: 0, letterSpacing: '-0.025em', lineHeight: 1.1 }}>
                  Outlets Near You
                </h2>
                <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: 15, fontWeight: 400 }}>Verified vendors ready to deliver</p>
              </div>
              <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#3b82f6', textDecoration: 'none', fontWeight: 600, fontSize: 15, borderBottom: '1px solid rgba(59,130,246,0.3)', paddingBottom: 2 }}>
                View All <ArrowRight size={15} />
              </Link>
            </div>

            {/* Loading spinner */}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
                <div style={{ width: 48, height: 48, border: '3px solid rgba(16,185,129,0.15)', borderTop: '3px solid #10b981', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
              </div>
            )}

            {/* Vendor grid */}
            {!loading && vendors.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                {vendors.slice(0, 6).map((vendor) => (
                  <div className="vendor-card-wrap" key={vendor.id}>
                    <VendorCard outlet={vendor} />
                  </div>
                ))}
              </div>
            )}

            {/* Empty */}
            {!loading && !error && vendors.length === 0 && (
              <div style={{ textAlign: 'center', padding: '72px 24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24 }}>
                <div className="float-icon" style={{ width: 72, height: 72, background: 'rgba(59,130,246,0.1)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <MapPin size={32} color="#3b82f6" />
                </div>
                <p style={{ color: '#f0f6ff', fontSize: 18, fontWeight: 600, margin: '0 0 8px', fontFamily: 'var(--font-display)' }}>No outlets found</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>Please check back shortly</p>
              </div>
            )}
          </section>

          {/* ─────────────────────────────────────── */}
          {/* WHY AQUAGAS — Feature Trio              */}
          {/* ─────────────────────────────────────── */}
          <section style={{ marginBottom: 88 }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{ width: 28, height: 2, background: 'linear-gradient(90deg,#10b981,transparent)', borderRadius: 2 }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Why choose us</span>
                <div style={{ width: 28, height: 2, background: 'linear-gradient(270deg,#3b82f6,transparent)', borderRadius: 2 }} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 700, color: '#f0f6ff', margin: 0, letterSpacing: '-0.025em' }}>
                Built for Kenya
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {[
                { icon: <Zap size={28} color="#10b981" />, color: '#10b981', title: 'Same-Day Delivery', desc: 'Order before 4 PM and get your gas delivered the same day across Nairobi, Kiambu, Machakos, and more.' },
                { icon: <Shield size={28} color="#3b82f6" />, color: '#3b82f6', title: 'Safety First', desc: 'All our partner outlets are Kenya Energy Regulation Board certified. Your family\'s safety is non-negotiable.' },
                { icon: <Star size={28} color="#10b981" />, color: '#10b981', title: 'Trusted Vendors', desc: 'Every vendor is vetted, rated by real customers, and monitored for quality and reliability.' },
              ].map((feat) => (
                <div
                  key={feat.title}
                  className="stat-card"
                  style={{
                    background: `linear-gradient(145deg, ${feat.color}08, ${feat.color}02)`,
                    border: `1px solid ${feat.color}20`,
                    borderRadius: 22,
                    padding: '36px 32px',
                  }}
                >
                  <div style={{ width: 60, height: 60, background: `${feat.color}14`, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
                    {feat.icon}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: '#f0f6ff', margin: '0 0 12px', letterSpacing: '-0.02em' }}>{feat.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.65, margin: 0 }}>{feat.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ═══════════════════════════════════════════════
            CTA BANNER
        ═══════════════════════════════════════════════ */}
        <section style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #031a0e 0%, #041a2e 50%, #020d18 100%)', borderTop: '1px solid var(--border)', padding: '80px 24px' }}>
          {/* decorative orbs */}
          <div style={{ position: 'absolute', top: -80, right: '20%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -60, left: '10%', width: 250, height: 250, background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 100, padding: '5px 18px', marginBottom: 24 }}>
              <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Limited time — free delivery on first order</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, color: '#f0f6ff', margin: '0 0 18px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Ready to Order?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 18, lineHeight: 1.65, margin: '0 0 44px', fontWeight: 400 }}>
              Get cooking gas delivered safely and swiftly right to your doorstep — wherever you are in Nairobi.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/shop" className="btn-glow-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: '#fff', padding: '18px 40px', borderRadius: 14, fontWeight: 700, fontSize: 17, textDecoration: 'none', letterSpacing: '-0.01em' }}>
                <Flame size={20} />
                Shop Now
              </Link>
              <Link href="/about" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: '#94a3b8', padding: '18px 40px', borderRadius: 14, fontWeight: 600, fontSize: 17, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}>
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            FOOTER BAR
        ═══════════════════════════════════════════════ */}
        <div style={{ background: '#020a14', borderTop: '1px solid var(--border)', padding: '20px 24px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontFamily: 'var(--font-display)', color: '#10b981', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>AquaGas</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>© {new Date().getFullYear()} AquaGas Kenya. All rights reserved.</span>
            <div style={{ display: 'flex', gap: 24 }}>
              {['Privacy', 'Terms', 'Contact'].map((link) => (
                <a key={link} href="#" style={{ color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>{link}</a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}