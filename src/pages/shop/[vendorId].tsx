// ============================================================
// FILE: src/pages/shop/[vendorId].tsx
// Vendor Specific Page — No footer, shared BottomNav
// ============================================================

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  MapPin,
  Star,
  Phone,
  Mail,
  Clock,
  ArrowLeft,
  Loader,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
  Package,
  TrendingUp,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';
import { outletService } from '@/lib/api';
import { Outlet, Product, ProductCategory } from '@/lib/types';
import toast from 'react-hot-toast';

interface ProductWithOutlet extends Omit<Product, 'category'> {
  outlet_id?: string;
  category?: ProductCategory | string | null;
}

export default function VendorPage() {
  const router = useRouter();
  const { vendorId } = router.query;
  const [outlet, setOutlet] = useState<Outlet | null>(null);
  const [products, setProducts] = useState<ProductWithOutlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (vendorId) fetchVendorData();
  }, [vendorId, categoryFilter, currentPage]);

  const getCategoryName = (
    category: ProductCategory | string | null | undefined
  ): string | null => {
    if (!category) return null;
    if (typeof category === 'string') return category;
    if (typeof category === 'object')
      return (category as ProductCategory).category_name || null;
    return null;
  };

  const fetchVendorData = async () => {
    try {
      setLoading(true);
      const outletResponse = await outletService.getOutlet(vendorId as string);
      const outletData = outletResponse.data;
      if (!outletData) { setOutlet(null); setLoading(false); return; }
      setOutlet(outletData);

      const params: any = { page: currentPage, limit: 20 };
      if (categoryFilter !== 'All') params.category = categoryFilter;

      const productsResponse = await outletService.getOutletProducts(vendorId as string, params);
      const productsData = productsResponse.data ?? [];
      setProducts(productsData);
      setTotalPages(productsResponse.pagination?.pages ?? 1);

      const uniqueCategories = new Set<string>();
      productsData.forEach((p) => {
        const name = getCategoryName(p.category);
        if (name) uniqueCategories.add(name);
      });
      setCategories(['All', ...Array.from(uniqueCategories).sort()]);
    } catch (error: any) {
      console.error('Error fetching vendor data:', error);
      toast.error(error?.message || 'Failed to load vendor information');
      setOutlet(null);
    } finally {
      setLoading(false);
    }
  };

  /* ─── Loading ─── */
  if (loading) {
    return (
      <>
        <Head><title>Loading... — AquaGas</title></Head>
        <div style={styles.loadingScreen}>
          <div style={styles.loadingCard}>
            <div style={styles.loadingSpinner}>
              <Loader size={28} style={{ animation: 'spin 1s linear infinite', color: '#10b981' }} />
            </div>
            <p style={styles.loadingText}>Fetching vendor details…</p>
            <p style={styles.loadingSubtext}>Just a moment</p>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </>
    );
  }

  /* ─── Not Found ─── */
  if (!outlet) {
    return (
      <>
        <Head><title>Outlet Not Found — AquaGas</title></Head>
        <div style={styles.notFoundScreen}>
          <div style={styles.notFoundCard}>
            <div style={styles.notFoundIcon}><MapPin size={36} color="#10b981" /></div>
            <h2 style={styles.notFoundTitle}>Outlet Not Found</h2>
            <p style={styles.notFoundText}>
              This outlet doesn't exist or is no longer available.
            </p>
            <Link href="/shop" style={styles.notFoundBtn}>
              <ArrowLeft size={16} />
              Back to Shop
            </Link>
          </div>
        </div>
      </>
    );
  }

  const ratingStars = Math.round(outlet.rating);

  return (
    <>
      <Head>
        <title>{outlet.name} — AquaGas</title>
        <meta name="description" content={`Shop products from ${outlet.name}`} />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div style={styles.page}>
        {/* ── Sticky Nav ── */}
        <nav style={styles.stickyNav}>
          <div style={styles.navInner}>
            <Link href="/shop" style={styles.backLink}>
              <ArrowLeft size={16} />
              All Vendors
            </Link>
            <span style={styles.navBrand}>AquaGas</span>
          </div>
        </nav>

        {/* ── Hero ── */}
        <header style={styles.hero}>
          <div style={styles.heroBg} />
          <div style={styles.heroGrid} />

          <div style={styles.heroContent}>
            {/* Left column */}
            <div style={styles.heroLeft}>
              {outlet.featured && (
                <div style={styles.featuredBadge}>
                  <Star size={12} fill="#fbbf24" color="#fbbf24" />
                  Featured Vendor
                </div>
              )}

              <h1 style={styles.heroTitle}>{outlet.name}</h1>
              <p style={styles.heroVendor}>{outlet.vendor}</p>

              {/* Rating Row */}
              <div style={styles.ratingRow}>
                <div style={styles.starsRow}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i < ratingStars ? '#fbbf24' : 'transparent'}
                      color={i < ratingStars ? '#fbbf24' : 'rgba(255,255,255,0.3)'}
                    />
                  ))}
                </div>
                <span style={styles.ratingNum}>{outlet.rating.toFixed(1)}</span>
                <span style={styles.ratingCount}>({outlet.reviews} reviews)</span>
              </div>

              {/* CTA buttons */}
              <div style={styles.heroCtas}>
                <a href={`tel:${outlet.phone}`} style={styles.ctaPrimary}>
                  <Phone size={16} />
                  Call Now
                </a>
                {outlet.latitude && outlet.longitude && (
                  <a
                    href={`https://www.google.com/maps?q=${outlet.latitude},${outlet.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.ctaSecondary}
                  >
                    <MapPin size={16} />
                    Directions
                  </a>
                )}
              </div>
            </div>

            {/* Right column — stat cards */}
            <div style={styles.heroRight}>
              <div style={styles.statGrid}>
                <div style={styles.statCard}>
                  <TrendingUp size={20} color="#10b981" />
                  <span style={styles.statVal}>{outlet.rating.toFixed(1)}</span>
                  <span style={styles.statLabel}>Rating</span>
                </div>
                <div style={styles.statCard}>
                  <Package size={20} color="#3b82f6" />
                  <span style={styles.statVal}>{products.length}</span>
                  <span style={styles.statLabel}>Products</span>
                </div>
                <div style={styles.statCard}>
                  <Zap size={20} color="#10b981" />
                  <span style={styles.statVal}>~30m</span>
                  <span style={styles.statLabel}>Response</span>
                </div>
                <div style={styles.statCard}>
                  <Shield size={20} color="#3b82f6" />
                  <span style={styles.statVal}>Verified</span>
                  <span style={styles.statLabel}>Status</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Info Cards Strip ── */}
        <section style={styles.infoStrip}>
          <div style={styles.infoGrid}>
            <InfoCard
              icon={<MapPin size={18} color="#10b981" />}
              color="#10b981"
              label="Location"
              value={outlet.address}
              sub={outlet.distance ? `${outlet.distance} km away` : undefined}
            />
            <InfoCard
              icon={<Phone size={18} color="#3b82f6" />}
              color="#3b82f6"
              label="Phone"
              value={outlet.phone}
              href={`tel:${outlet.phone}`}
            />
            {outlet.email && (
              <InfoCard
                icon={<Mail size={18} color="#10b981" />}
                color="#10b981"
                label="Email"
                value={outlet.email}
                href={`mailto:${outlet.email}`}
              />
            )}
            {outlet.opening_hours && (
              <InfoCard
                icon={<Clock size={18} color="#3b82f6" />}
                color="#3b82f6"
                label="Open Hours"
                value={outlet.opening_hours}
              />
            )}
          </div>
        </section>

        {/* ── Products Section ── */}
        {/* Extra bottom padding to clear the BottomNav */}
        <section style={{ ...styles.productsSection, paddingBottom: 120 }}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Products</h2>
              <p style={styles.sectionSub}>
                {products.length} item{products.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>

          {/* Category pills */}
          {categories.length > 1 && (
            <div style={styles.pillScroll}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategoryFilter(cat); setCurrentPage(1); }}
                  style={categoryFilter === cat ? styles.pillActive : styles.pill}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Grid or empty */}
          {products.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <Package size={36} color="#10b981" />
              </div>
              <h3 style={styles.emptyTitle}>
                {categoryFilter === 'All' ? 'No products yet' : `No products in "${categoryFilter}"`}
              </h3>
              <p style={styles.emptyText}>Check back soon for new arrivals</p>
              {categoryFilter !== 'All' && (
                <button
                  onClick={() => { setCategoryFilter('All'); setCurrentPage(1); }}
                  style={styles.emptyBtn}
                >
                  View All Products
                </button>
              )}
            </div>
          ) : (
            <>
              <div style={styles.productGrid}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product as Product} outlet={outlet} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={styles.pagination}>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={currentPage === 1 ? styles.pageNavDisabled : styles.pageNav}
                  >
                    <ChevronLeft size={16} />
                    Prev
                  </button>

                  <div style={styles.pageNumbers}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        style={currentPage === page ? styles.pageNumActive : styles.pageNum}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={currentPage === totalPages ? styles.pageNavDisabled : styles.pageNav}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* ── Shared Bottom Navigation (no footer) ── */}
        <BottomNav />
      </div>
    </>
  );
}

/* ─── InfoCard sub-component ─── */
function InfoCard({
  icon, label, value, sub, href, color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  href?: string;
  color: string;
}) {
  return (
    <div style={styles.infoCard}>
      <div style={{ ...styles.infoIconWrap, background: `${color}18` }}>{icon}</div>
      <div style={styles.infoText}>
        <p style={styles.infoLabel}>{label}</p>
        {href ? (
          <a href={href} style={styles.infoValueLink}>{value}</a>
        ) : (
          <p style={styles.infoValue}>{value}</p>
        )}
        {sub && <p style={styles.infoSub}>{sub}</p>}
      </div>
    </div>
  );
}

/* ─── Styles ─── */
const font       = '"DM Sans", system-ui, sans-serif';
const fontSerif  = '"DM Serif Display", Georgia, serif';

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#f0f4f8',
    fontFamily: font,
    color: '#0f172a',
  },

  loadingScreen: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#0a1628 0%,#0d2137 50%,#0a2e1a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingCard: {
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 24,
    padding: '48px 56px',
    textAlign: 'center',
  },
  loadingSpinner: {
    width: 64,
    height: 64,
    background: 'rgba(16,185,129,0.12)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  loadingText: {
    color: '#e2e8f0',
    fontWeight: 600,
    fontSize: 18,
    margin: 0,
    fontFamily: font,
  },
  loadingSubtext: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 6,
    fontFamily: font,
  },

  notFoundScreen: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#0a1628,#0a2e1a)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 16px',
  },
  notFoundCard: {
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 24,
    padding: '56px 48px',
    textAlign: 'center',
    maxWidth: 400,
  },
  notFoundIcon: {
    width: 80,
    height: 80,
    background: 'rgba(16,185,129,0.12)',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  notFoundTitle: {
    color: '#f1f5f9',
    fontSize: 28,
    fontWeight: 700,
    fontFamily: fontSerif,
    margin: '0 0 12px',
  },
  notFoundText: {
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 1.6,
    margin: '0 0 32px',
    fontFamily: font,
  },
  notFoundBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'linear-gradient(135deg,#10b981,#059669)',
    color: '#fff',
    padding: '12px 28px',
    borderRadius: 12,
    fontWeight: 600,
    fontSize: 15,
    textDecoration: 'none',
    fontFamily: font,
  },

  stickyNav: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'rgba(10,22,40,0.9)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(16,185,129,0.15)',
  },
  navInner: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '14px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: 500,
    textDecoration: 'none',
    fontFamily: font,
  },
  navBrand: {
    color: '#10b981',
    fontWeight: 700,
    fontSize: 18,
    letterSpacing: '-0.02em',
    fontFamily: fontSerif,
  },

  hero: {
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #061020 0%, #0b1f36 40%, #042010 100%)',
    color: '#fff',
  },
  heroBg: {
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(ellipse 60% 80% at 80% 20%, rgba(16,185,129,0.18) 0%, transparent 60%),' +
      'radial-gradient(ellipse 50% 60% at 15% 70%, rgba(59,130,246,0.15) 0%, transparent 55%)',
    pointerEvents: 'none',
  },
  heroGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px),' +
      'linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)',
    backgroundSize: '48px 48px',
    pointerEvents: 'none',
  },
  heroContent: {
    position: 'relative',
    maxWidth: 1280,
    margin: '0 auto',
    padding: '64px 24px 72px',
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: 48,
    alignItems: 'center',
  },
  heroLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  featuredBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(251,191,36,0.12)',
    border: '1px solid rgba(251,191,36,0.3)',
    color: '#fbbf24',
    padding: '5px 14px',
    borderRadius: 100,
    fontSize: 12,
    fontWeight: 600,
    width: 'fit-content',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    fontFamily: font,
  },
  heroTitle: {
    fontSize: 'clamp(36px, 5vw, 64px)',
    fontWeight: 400,
    fontFamily: fontSerif,
    lineHeight: 1.1,
    margin: 0,
    color: '#f1f5f9',
    letterSpacing: '-0.02em',
  },
  heroVendor: {
    fontSize: 18,
    color: '#10b981',
    fontWeight: 500,
    margin: 0,
    letterSpacing: '0.01em',
    fontFamily: font,
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  starsRow: { display: 'flex', gap: 3 },
  ratingNum: {
    fontSize: 22,
    fontWeight: 700,
    color: '#fbbf24',
    fontFamily: font,
  },
  ratingCount: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: font,
  },
  heroCtas: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },
  ctaPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: '#fff',
    padding: '13px 28px',
    borderRadius: 12,
    fontWeight: 600,
    fontSize: 15,
    textDecoration: 'none',
    boxShadow: '0 4px 24px rgba(16,185,129,0.35)',
    fontFamily: font,
    letterSpacing: '-0.01em',
  },
  ctaSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(59,130,246,0.15)',
    border: '1px solid rgba(59,130,246,0.3)',
    color: '#93c5fd',
    padding: '13px 28px',
    borderRadius: 12,
    fontWeight: 600,
    fontSize: 15,
    textDecoration: 'none',
    fontFamily: font,
    letterSpacing: '-0.01em',
  },
  heroRight: { flexShrink: 0 },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    minWidth: 260,
  },
  statCard: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    textAlign: 'center',
  },
  statVal: {
    fontSize: 22,
    fontWeight: 700,
    color: '#f1f5f9',
    fontFamily: font,
    lineHeight: 1,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontFamily: font,
  },

  infoStrip: {
    background: '#fff',
    borderBottom: '1px solid #e2e8f0',
  },
  infoGrid: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '0 24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 0,
  },
  infoCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    padding: '28px 24px',
    borderRight: '1px solid #f1f5f9',
  },
  infoIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoText: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    margin: 0,
    fontFamily: font,
  },
  infoValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: 500,
    margin: 0,
    fontFamily: font,
    lineHeight: 1.4,
  },
  infoValueLink: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: 500,
    margin: 0,
    fontFamily: font,
    textDecoration: 'none',
  },
  infoSub: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: 500,
    margin: 0,
    fontFamily: font,
  },

  productsSection: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '48px 24px 80px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 400,
    fontFamily: fontSerif,
    color: '#0f172a',
    margin: '0 0 4px',
    letterSpacing: '-0.02em',
  },
  sectionSub: {
    fontSize: 14,
    color: '#64748b',
    margin: 0,
    fontFamily: font,
  },

  pillScroll: {
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    paddingBottom: 4,
    marginBottom: 32,
  },
  pill: {
    padding: '8px 20px',
    borderRadius: 100,
    border: '1.5px solid #e2e8f0',
    background: '#fff',
    color: '#475569',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontFamily: font,
  },
  pillActive: {
    padding: '8px 20px',
    borderRadius: 100,
    border: '1.5px solid #10b981',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontFamily: font,
    boxShadow: '0 2px 16px rgba(16,185,129,0.3)',
  },

  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 24,
    marginBottom: 48,
  },

  emptyState: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 24,
    padding: '80px 40px',
    textAlign: 'center',
  },
  emptyIcon: {
    width: 80,
    height: 80,
    background: 'rgba(16,185,129,0.08)',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#1e293b',
    margin: '0 0 8px',
    fontFamily: fontSerif,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    margin: '0 0 28px',
    fontFamily: font,
  },
  emptyBtn: {
    background: 'linear-gradient(135deg,#10b981,#059669)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '12px 28px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: font,
  },

  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 48,
  },
  pageNav: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 20px',
    border: '1.5px solid #e2e8f0',
    borderRadius: 10,
    background: '#fff',
    color: '#475569',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: font,
  },
  pageNavDisabled: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 20px',
    border: '1.5px solid #f1f5f9',
    borderRadius: 10,
    background: '#f8fafc',
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'not-allowed',
    fontFamily: font,
  },
  pageNumbers: { display: 'flex', gap: 6 },
  pageNum: {
    width: 40,
    height: 40,
    borderRadius: 10,
    border: '1.5px solid #e2e8f0',
    background: '#fff',
    color: '#475569',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: font,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNumActive: {
    width: 40,
    height: 40,
    borderRadius: 10,
    border: '1.5px solid #10b981',
    background: 'linear-gradient(135deg,#10b981,#059669)',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: font,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 12px rgba(16,185,129,0.3)',
  },
};
