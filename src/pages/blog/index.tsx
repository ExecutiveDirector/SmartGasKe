import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Clock, Search, X } from 'lucide-react';
import {
  CATEGORIES,
  formatDate,
  getAllPosts,
  getFeaturedPost,
  type BlogCategory,
} from '@/lib/blogData';
import BlogNav from '@/components/blog/BlogNav';
import BlogFooter from '@/components/blog/BlogFooter';

const ag = {
  forest: '#0A3D2B',
  forestDk: '#072A1E',
  flame: '#E8621A',
  gold: '#C9A44A',
  paper: '#F6F3EC',
  text: '#151512',
  mid: '#5C5A50',
  border: '#E6E1D3',
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Outfit:wght@300;400;500;600;700&display=swap');
  .ag-display { font-family: 'Fraunces', serif; }
  .ag-body   { font-family: 'Outfit', sans-serif; }
  .ag-hover-card { transition: transform 0.35s cubic-bezier(.2,.7,.3,1), box-shadow 0.35s ease; }
  .ag-hover-card:hover { transform: translateY(-6px); box-shadow: 0 24px 50px rgba(10,20,10,0.14); }
  .ag-underline { position: relative; }
  .ag-underline::after {
    content: ''; position: absolute; left: 0; bottom: -3px; height: 1px; width: 0%;
    background: currentColor; transition: width 0.3s ease;
  }
  .ag-underline:hover::after { width: 100%; }
  .ag-search-overlay { animation: agFadeIn 0.18s ease; }
  @keyframes agFadeIn { from { opacity: 0; } to { opacity: 1; } }
`;

export default function BlogIndex() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<BlogCategory | 'All'>('All');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const cat = router.query.category;
    if (typeof cat === 'string' && (CATEGORIES as string[]).includes(cat)) {
      setActiveCategory(cat as BlogCategory);
      window.scrollTo({ top: 0 });
    }
  }, [router.query.category]);

  const allPosts = getAllPosts();
  const featured = getFeaturedPost();
  const editorsPicks = allPosts.filter((p) => p.slug !== featured.slug).slice(0, 3);

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

  const isDefaultView = activeCategory === 'All' && query.trim() === '';
  const gridPosts = isDefaultView ? filtered.filter((p) => p.slug !== featured.slug) : filtered;

  return (
    <>
      <Head>
        <title>The AquaJournal — Gas Delivery Tips, Safety & News</title>
        <meta
          name="description"
          content="Practical guides on LPG safety, cylinder sizing, M-Pesa payments and delivery technology from the AquaGas team — Kenya's smart gas delivery platform."
        />
      </Head>
      <style>{styles}</style>

      <div className="ag-body" style={{ background: ag.paper, color: ag.text, minHeight: '100vh' }}>
        <BlogNav onSearchClick={() => setSearchOpen(true)} />

        {/* ── SEARCH OVERLAY ───────────────────────────────────── */}
        {searchOpen && (
          <div
            className="ag-search-overlay"
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'rgba(7,42,30,0.97)', display: 'flex',
              flexDirection: 'column', alignItems: 'center',
              padding: '14vh 1.5rem 0',
            }}
          >
            <button
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              style={{
                position: 'absolute', top: '1.75rem', right: '1.75rem',
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.08)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
            <div style={{ width: '100%', maxWidth: '640px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: `2px solid ${ag.gold}`, paddingBottom: '1rem' }}>
                <Search size={26} color={ag.gold} />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search the journal..."
                  className="ag-display"
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    color: '#fff', fontSize: '1.8rem', fontStyle: 'italic',
                  }}
                />
              </div>
              {query.trim() !== '' && (
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {filtered.slice(0, 5).map((p) => (
                    <Link
                      key={p.slug}
                      href={`/blog/${p.slug}`}
                      onClick={() => setSearchOpen(false)}
                      style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', padding: '0.5rem 0', textDecoration: 'none' }}
                    >
                      {p.title}
                    </Link>
                  ))}
                  {filtered.length === 0 && (
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>No articles found.</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── MASTHEAD ─────────────────────────────────────────── */}
        <section style={{ borderBottom: `1px solid ${ag.border}` }}>
          <div className="container mx-auto px-6 py-14 text-center">
            <span
              style={{
                display: 'inline-block', marginBottom: '1rem',
                fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: ag.flame,
              }}
            >
              Est. 2024 · Nairobi
            </span>
            <h1
              className="ag-display"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)', fontWeight: 600, lineHeight: 1.05, marginBottom: '0.85rem' }}
            >
              The Aqua<em style={{ color: ag.forest }}>Journal</em>
            </h1>
            <p style={{ color: ag.mid, fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto' }}>
              Notes on gas safety, delivery technology and honest pricing — written by the people building AquaGas.
            </p>
          </div>
        </section>

        {/* ── CATEGORY RAIL ────────────────────────────────────── */}
        <section style={{ position: 'sticky', top: '68px', zIndex: 30, background: ag.paper, borderBottom: `1px solid ${ag.border}` }}>
          <div className="container mx-auto px-6">
            <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto', padding: '1rem 0' }}>
              {(['All', ...CATEGORIES] as const).map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); router.replace('/blog', undefined, { shallow: true }); }}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      whiteSpace: 'nowrap', paddingBottom: '4px',
                      fontSize: '0.88rem', fontWeight: active ? 600 : 500,
                      color: active ? ag.text : ag.mid,
                      borderBottom: active ? `2px solid ${ag.flame}` : '2px solid transparent',
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FEATURED + EDITOR'S PICKS ────────────────────────── */}
        {isDefaultView && (
          <section style={{ padding: '3.5rem 0' }}>
            <div className="container mx-auto px-6">
              <div style={{ display: 'grid', gap: '3rem' }} className="lg:grid-cols-[1.6fr_1fr]">
                {/* Featured */}
                <Link href={`/blog/${featured.slug}`} className="ag-hover-card" style={{ textDecoration: 'none', display: 'block' }}>
                  <div
                    style={{
                      borderRadius: '4px', overflow: 'hidden',
                      background: `linear-gradient(135deg, ${featured.coverGradient[0]}, ${featured.coverGradient[1]})`,
                      minHeight: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                      padding: '2.5rem', position: 'relative',
                    }}
                  >
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55))' }} />
                    <div style={{ position: 'relative' }}>
                      <span
                        style={{
                          display: 'inline-block', marginBottom: '1rem',
                          padding: '5px 14px', borderRadius: '100px',
                          background: 'rgba(255,255,255,0.15)', border: `1px solid rgba(201,164,74,0.5)`,
                          color: ag.gold, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                        }}
                      >
                        {featured.category}
                      </span>
                      <h2 className="ag-display" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.6rem)', fontWeight: 600, color: '#fff', lineHeight: 1.15, marginBottom: '0.85rem' }}>
                        {featured.title}
                      </h2>
                      <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.98rem', lineHeight: 1.65, maxWidth: '520px', marginBottom: '1rem' }}>
                        {featured.excerpt}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                        <span>{formatDate(featured.date)}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={13} /> {featured.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Editor's picks */}
                <div>
                  <h3
                    style={{
                      fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: ag.flame, marginBottom: '1.5rem',
                      paddingBottom: '0.75rem', borderBottom: `1px solid ${ag.border}`,
                    }}
                  >
                    Editor's Picks
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {editorsPicks.map((p, i) => (
                      <Link
                        key={p.slug}
                        href={`/blog/${p.slug}`}
                        style={{ display: 'flex', gap: '1rem', textDecoration: 'none', alignItems: 'flex-start' }}
                      >
                        <span
                          className="ag-display"
                          style={{ fontSize: '2rem', fontWeight: 600, color: `${ag.text}20`, lineHeight: 1, minWidth: '2rem' }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: ag.forest, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {p.category}
                          </span>
                          <h4 className="ag-underline" style={{ fontSize: '1.05rem', fontWeight: 600, color: ag.text, lineHeight: 1.35, margin: '0.3rem 0' }}>
                            {p.title}
                          </h4>
                          <span style={{ fontSize: '0.78rem', color: ag.mid }}>{p.readTime}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── ARTICLE GRID ─────────────────────────────────────── */}
        <section style={{ padding: isDefaultView ? '1rem 0 6rem' : '3rem 0 6rem' }}>
          <div className="container mx-auto px-6">
            {!isDefaultView && (
              <h3 className="ag-display" style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: '2rem' }}>
                {query.trim() !== '' ? `Results for "${query}"` : activeCategory}
                <span style={{ fontSize: '1rem', color: ag.mid, fontFamily: "'Outfit', sans-serif", marginLeft: '0.75rem' }}>
                  ({gridPosts.length})
                </span>
              </h3>
            )}

            {gridPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: ag.mid }}>
                No articles match yet — try a different category.
              </div>
            ) : (
              <>
                {isDefaultView && (
                  <h3 style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: ag.flame, marginBottom: '1.75rem' }}>
                    Latest Articles
                  </h3>
                )}
                <div style={{ display: 'grid', gap: '2.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                  {gridPosts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="ag-hover-card" style={{ textDecoration: 'none', display: 'block' }}>
                      <div
                        style={{
                          height: '190px', borderRadius: '4px', marginBottom: '1.1rem',
                          background: `linear-gradient(135deg, ${post.coverGradient[0]}, ${post.coverGradient[1]})`,
                          display: 'flex', alignItems: 'flex-end', padding: '1.25rem',
                        }}
                      >
                        <span
                          style={{
                            padding: '4px 12px', borderRadius: '100px', background: 'rgba(255,255,255,0.15)',
                            border: `1px solid rgba(201,164,74,0.5)`, color: ag.gold,
                            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                          }}
                        >
                          {post.category}
                        </span>
                      </div>
                      <h3 className="ag-display ag-underline" style={{ fontSize: '1.3rem', fontWeight: 600, color: ag.text, lineHeight: 1.3, marginBottom: '0.6rem' }}>
                        {post.title}
                      </h3>
                      <p style={{ color: ag.mid, fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '0.9rem' }}>
                        {post.excerpt}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.78rem', color: ag.mid }}>
                        <span>{formatDate(post.date)}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {post.readTime}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* ── CTA BAND ─────────────────────────────────────────── */}
        <section style={{ background: ag.forestDk, padding: '4rem 0' }}>
          <div className="container mx-auto px-6 flex flex-wrap items-center justify-between gap-6">
            <div style={{ maxWidth: '480px' }}>
              <h3 className="ag-display" style={{ color: '#fff', fontSize: '1.7rem', fontWeight: 600, marginBottom: '0.5rem' }}>
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
                borderRadius: '4px', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none',
              }}
            >
              Order Gas Now <ArrowUpRight size={18} />
            </Link>
          </div>
        </section>

        <BlogFooter />
      </div>
    </>
  );
}
