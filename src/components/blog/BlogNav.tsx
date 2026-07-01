import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, Search, X } from 'lucide-react';
import { CATEGORIES } from '@/lib/blogData';

const ag = {
  forestDk: '#072A1E',
  gold: '#C9A44A',
  flame: '#E8621A',
  border: 'rgba(255,255,255,0.1)',
};

interface Props {
  onSearchClick?: () => void;
}

export default function BlogNav({ onSearchClick }: Props) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: scrolled ? 'rgba(7,42,30,0.92)' : ag.forestDk,
        backdropFilter: scrolled ? 'blur(10px)' : undefined,
        borderBottom: `1px solid ${ag.border}`,
        transition: 'background 0.25s ease',
      }}
    >
      <div className="container mx-auto px-6">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
          {/* Wordmark */}
          <Link
            href="/blog"
            className="ag-display"
            style={{
              display: 'flex', alignItems: 'baseline', gap: '8px',
              textDecoration: 'none', fontSize: '1.5rem', fontWeight: 600,
            }}
          >
            <span style={{ color: '#fff' }}>Aqua</span>
            <span style={{ color: ag.gold }}>Journal</span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden lg:flex">
            {CATEGORIES.slice(0, 5).map((cat) => (
              <Link
                key={cat}
                href={`/blog?category=${encodeURIComponent(cat)}`}
                style={{
                  color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', fontWeight: 500,
                  textDecoration: 'none', letterSpacing: '0.01em',
                }}
              >
                {cat}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {onSearchClick && (
              <button
                onClick={onSearchClick}
                aria-label="Search articles"
                style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.06)', border: `1px solid ${ag.border}`,
                  color: '#fff', cursor: 'pointer',
                }}
              >
                <Search size={16} />
              </button>
            )}

            <Link
              href="/"
              className="hidden md:inline-flex"
              style={{
                alignItems: 'center', gap: '6px',
                padding: '9px 16px', borderRadius: '100px',
                border: `1px solid rgba(201,164,74,0.4)`,
                color: ag.gold, fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none',
              }}
            >
              aquagas.co.ke <ArrowUpRight size={14} />
            </Link>

            <Link
              href="/shop"
              className="hidden sm:inline-flex"
              style={{
                alignItems: 'center', gap: '6px',
                padding: '9px 18px', borderRadius: '100px',
                background: ag.flame, color: '#fff', fontSize: '0.82rem', fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Order Gas
            </Link>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden"
              aria-label="Toggle menu"
              style={{
                width: '38px', height: '38px', borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.06)', border: `1px solid ${ag.border}`,
                color: '#fff', cursor: 'pointer',
              }}
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden" style={{ borderTop: `1px solid ${ag.border}`, padding: '1rem 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/blog?category=${encodeURIComponent(cat)}`}
                onClick={() => setMobileOpen(false)}
                style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', textDecoration: 'none' }}
              >
                {cat}
              </Link>
            ))}
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              style={{ color: ag.gold, fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', marginTop: '0.5rem' }}
            >
              ← Back to aquagas.co.ke
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
