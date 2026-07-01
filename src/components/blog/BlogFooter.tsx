import Link from 'next/link';
import { ArrowRight, Facebook, Instagram, MessageCircle, Twitter } from 'lucide-react';
import { useState } from 'react';
import { CATEGORIES } from '@/lib/blogData';

const ag = {
  forestDk: '#072A1E',
  gold: '#C9A44A',
  flame: '#E8621A',
};

export default function BlogFooter() {
  const [email, setEmail] = useState('');
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: ag.forestDk, color: 'rgba(255,255,255,0.55)' }}>
      <div className="container mx-auto px-6 py-16">
        <div style={{ display: 'grid', gap: '3rem' }} className="md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="ag-display" style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: '1rem' }}>
              <span style={{ color: '#fff' }}>Aqua</span>
              <span style={{ color: ag.gold }}>Journal</span>
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.75, maxWidth: '340px', marginBottom: '1.5rem' }}>
              The editorial home of AquaGas — safety guides, delivery tech notes, and honest
              cost breakdowns for anyone who cooks with LPG in Kenya.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); setEmail(''); }}
              style={{ display: 'flex', gap: '0.5rem', maxWidth: '360px' }}
            >
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="Your email"
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff', fontSize: '0.88rem', outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: ag.flame, color: '#fff', padding: '10px 16px',
                  borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                }}
              >
                <ArrowRight size={15} />
              </button>
            </form>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.1rem' }}>
              Categories
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link href={`/blog?category=${encodeURIComponent(cat)}`} style={{ fontSize: '0.9rem', color: 'inherit', textDecoration: 'none' }}>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.1rem' }}>
              AquaGas
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {[
                { href: '/', label: 'Main Site' },
                { href: '/shop', label: 'Order Gas' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ fontSize: '0.9rem', color: 'inherit', textDecoration: 'none' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          style={{
            marginTop: '3.5rem', paddingTop: '1.75rem', borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <p style={{ fontSize: '0.78rem' }}>© {year} AquaGas Delivery. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                style={{
                  width: '34px', height: '34px', borderRadius: '9px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)',
                }}
              >
                <Icon size={15} />
              </a>
            ))}
            <a
              href="https://wa.me/254710820666"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '0 12px', height: '34px', borderRadius: '9px',
                background: 'rgba(16,185,129,0.15)', color: '#34d399', fontSize: '0.82rem', fontWeight: 600,
              }}
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
