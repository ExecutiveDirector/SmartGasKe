import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, Clock, Search } from 'lucide-react';
import {
  CATEGORIES,
  formatDate,
  getAllPosts,
  getFeaturedPost,
  type BlogCategory,
} from '@/lib/blogData';

const ag = {
  forest: '#0A3D2B',
  forestDk: '#072A1E',
  flame: '#E8621A',
  gold: '#C9A44A',
  cream: '#FAFAF7',
  text: '#0F1A14',
  mid: '#3D5246',
  border: '#D9E8DF',
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  .ag-display { font-family: 'Cormorant Garamond', serif; }
  .ag-body   { font-family: 'Outfit', sans-serif; }
  .ag-fade-up { animation: fadeUp 0.7s ease forwards; opacity: 0; transform: translateY(24px); }
  @keyframes fadeUp { to { opacity:1; transform:translateY(0); } }
  .ag-card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(10,61,43,0.12); }
  .ag-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .ag-chip { transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease; }
`;

export default function BlogIndex() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | 'All'>('All');
  const [query, setQuery] = useState('');

  const allPosts = getAllPosts();
  const featured = getFeaturedPost();

  const filtered = useMemo(() => {
    return allPosts.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesQuery =
        query.trim() === '' ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [allPosts, activeCategory, query]);

  const restPosts = filtered.filter((p) => p.slug !== featured.slug);

  return (
    <>
      <Head>
        <title>Blog — AquaGas | Gas Delivery Tips, Safety & News</title>
        <meta
          name="description"
          content="Practical guides on LPG safety, cylinder sizing, M-Pesa payments and delivery technology from the AquaGas team — Kenya's smart gas delivery platform."
        />
      </Head>
      <style>{styles}</style>

      <div className="ag-body" style={{ background: ag.cream, color: ag.text }}>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section style={{ background: ag.forestDk, position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute', top: '-80px', right: '-80px',
              width: '500px', height: '500px', borderRadius: '50%',
              border: '1px solid rgba(201,164,74,0.15)', pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
              background: `linear-gradient(90deg, transparent, ${ag.gold}, transparent)`,
            }}
          />

          <div className="container mx-auto px-6 py-20 relative">
            <span
              className="ag-body"
              style={{
                display: 'inline-block', marginBottom: '1.25rem',
                padding: '6px 18px', borderRadius: '100px',
                border: '1px solid rgba(201,164,74,0.4)',
                color: ag.gold, fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase',
              }}
            >
              The AquaGas Journal
            </span>

            <h1
              className="ag-display"
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 600,
                color: '#fff', lineHeight: 1.12, maxWidth: '640px', marginBottom: '1rem',
              }}
            >
              Straight talk on <em style={{ color: ag.gold }}>gas, safety & delivery</em>
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.65)', maxWidth: '520px', lineHeight: 1.75 }}>
              Practical guides from the people building Kenya's smart LPG delivery platform —
              no fluff, just what actually helps you cook safer and order smarter.
            </p>
          </div>
        </section>

        {/* ── SEARCH + FILTERS ─────────────────────────────────── */}
        <section style={{ background: '#fff', borderBottom: `1px solid ${ag.border}` }}>
          <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(['All', ...CATEGORIES] as const).map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="ag-chip"
                    style={{
                      padding: '8px 16px', borderRadius: '100px', fontSize: '0.85rem',
                      fontWeight: 500, cursor: 'pointer',
                      border: `1px solid ${active ? ag.forest : ag.border}`,
                      background: active ? ag.forest : '#fff',
                      color: active ? '#fff' : ag.mid,
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                border: `1px solid ${ag.border}`, borderRadius: '10px',
                padding: '8px 14px', minWidth: '240px', background: ag.cream,
              }}
            >
              <Search size={16} color={ag.mid} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles..."
                style={{
                  border: 'none', outline: 'none', background: 'transparent',
                  fontSize: '0.9rem', color: ag.text, width: '100%',
                }}
              />
            </div>
          </div>
        </section>

        {/* ── FEATURED POST ────────────────────────────────────── */}
        {activeCategory === 'All' && query.trim() === '' && (
          <section style={{ padding: '3.5rem 0 1rem' }}>
            <div className="container mx-auto px-6">
              <Link
                href={`/blog/${featured.slug}`}
                className="ag-card"
                style={{
                  display: 'grid', gridTemplateColumns: '1fr', gap: 0,
                  borderRadius: '20px', overflow: 'hidden', textDecoration: 'none',
                  border: `1px solid ${ag.border}`, background: '#fff',
                }}
              >
                <div className="grid md:grid-cols-2">
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${featured.coverGradient[0]}, ${featured.coverGradient[1]})`,
                      minHeight: '280px', display: 'flex', alignItems: 'flex-end', padding: '2rem',
                      position: 'relative',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute', top: '1.5rem', left: '1.5rem',
                        padding: '5px 14px', borderRadius: '100px', fontSize: '0.75rem',
                        fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                        background: 'rgba(255,255,255,0.15)', color: ag.gold,
                        border: '1px solid rgba(201,164,74,0.4)',
                      }}
                    >
                      Featured
                    </span>
                    <span
                      className="ag-display"
                      style={{ color: 'rgba(255,255,255,0.25)', fontSize: '5rem', fontWeight: 600, lineHeight: 1 }}
                    >
                      AG
                    </span>
                  </div>

                  <div style={{ padding: '2.5rem' }}>
                    <span
                      style={{
                        display: 'inline-block', padding: '4px 14px',
                        background: `${ag.forest}12`, borderRadius: '100px',
                        color: ag.forest, fontSize: '0.75rem', fontWeight: 600,
                        letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1rem',
                      }}
                    >
                      {featured.category}
                    </span>

                    <h2
                      className="ag-display"
                      style={{
                        fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 600,
                        color: ag.text, lineHeight: 1.2, marginBottom: '0.85rem',
                      }}
                    >
                      {featured.title}
                    </h2>

                    <p style={{ color: ag.mid, lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.98rem' }}>
                      {featured.excerpt}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: ag.mid }}>
                      <span>{formatDate(featured.date)}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} /> {featured.readTime}
                      </span>
                      <span
                        style={{
                          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px',
                          color: ag.flame, fontWeight: 600,
                        }}
                      >
                        Read article <ArrowRight size={15} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* ── POST GRID ────────────────────────────────────────── */}
        <section style={{ padding: '3rem 0 6rem' }}>
          <div className="container mx-auto px-6">
            {restPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: ag.mid }}>
                No articles match your search yet — try a different keyword or category.
              </div>
            ) : (
              <div
                style={{
                  display: 'grid', gap: '1.75rem',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                }}
              >
                {restPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="ag-card"
                    style={{
                      display: 'flex', flexDirection: 'column',
                      borderRadius: '16px', overflow: 'hidden', textDecoration: 'none',
                      border: `1px solid ${ag.border}`, background: '#fff',
                    }}
                  >
                    <div
                      style={{
                        height: '150px',
                        background: `linear-gradient(135deg, ${post.coverGradient[0]}, ${post.coverGradient[1]})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <span
                        className="ag-display"
                        style={{ color: 'rgba(255,255,255,0.22)', fontSize: '2.75rem', fontWeight: 600 }}
                      >
                        AG
                      </span>
                    </div>

                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span
                        style={{
                          display: 'inline-block', padding: '3px 12px',
                          background: `${ag.forest}12`, borderRadius: '100px',
                          color: ag.forest, fontSize: '0.7rem', fontWeight: 600,
                          letterSpacing: '0.06em', textTransform: 'uppercase',
                          marginBottom: '0.85rem', alignSelf: 'flex-start',
                        }}
                      >
                        {post.category}
                      </span>

                      <h3
                        className="ag-display"
                        style={{
                          fontSize: '1.3rem', fontWeight: 600, color: ag.text,
                          lineHeight: 1.3, marginBottom: '0.6rem',
                        }}
                      >
                        {post.title}
                      </h3>

                      <p style={{ color: ag.mid, fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                        {post.excerpt}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.78rem', color: ag.mid }}>
                        <span>{formatDate(post.date)}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {post.readTime}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── NEWSLETTER STRIP ─────────────────────────────────── */}
        <section style={{ background: ag.forestDk, padding: '3.5rem 0' }}>
          <div
            className="container mx-auto px-6"
            style={{
              display: 'flex', flexWrap: 'wrap', gap: '1.5rem',
              alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <div style={{ maxWidth: '480px' }}>
              <h3 className="ag-display" style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Never run low again
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Order your next refill in under two minutes and track it live, door to door.
              </p>
            </div>
            <Link
              href="/shop"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: ag.flame, color: '#fff', padding: '14px 28px',
                borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none',
              }}
            >
              Order Gas Now <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
