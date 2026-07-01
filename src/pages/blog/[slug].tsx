import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { ArrowRight, ArrowUpRight, Clock, Facebook, Linkedin, Quote, Twitter } from 'lucide-react';
import {
  type BlogBlock,
  type BlogPost,
  formatDate,
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
} from '@/lib/blogData';
import BlogNav from '@/components/blog/BlogNav';
import BlogFooter from '@/components/blog/BlogFooter';
import ReadingProgress from '@/components/blog/ReadingProgress';

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
  .ag-hover-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .ag-hover-card:hover { transform: translateY(-5px); box-shadow: 0 20px 44px rgba(10,20,10,0.12); }
  .ag-prose p { color: #423F35; font-size: 1.15rem; line-height: 1.9; margin-bottom: 1.5rem; font-family: 'Outfit', sans-serif; }
  .ag-prose > p:first-of-type::first-letter {
    font-family: 'Fraunces', serif; font-size: 4.2rem; font-weight: 600; float: left;
    line-height: 0.8; margin: 0.1rem 0.6rem 0 0; color: #0A3D2B;
  }
  .ag-prose h2 { font-family: 'Fraunces', serif; font-weight: 600; font-size: 2rem; color: #151512; margin: 2.75rem 0 1.2rem; line-height: 1.2; }
  .ag-prose ul { margin: 0 0 1.75rem; padding-left: 0; list-style: none; }
  .ag-prose li { color: #423F35; font-size: 1.05rem; line-height: 1.8; margin-bottom: 0.85rem; padding-left: 1.7rem; position: relative; }
  .ag-prose li::before { content: ''; position: absolute; left: 0; top: 0.65rem; width: 7px; height: 7px; border-radius: 50%; background: #E8621A; }
`;

interface Props {
  post: BlogPost | null;
}

function renderBlock(block: BlogBlock, i: number) {
  switch (block.type) {
    case 'p':
      return <p key={i}>{block.text}</p>;
    case 'h2':
      return <h2 key={i}>{block.text}</h2>;
    case 'list':
      return (
        <ul key={i}>
          {block.items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      );
    case 'quote':
      return (
        <div
          key={i}
          style={{
            display: 'flex', gap: '1.1rem', alignItems: 'flex-start',
            background: '#fff', border: `1px solid ${ag.border}`,
            borderLeft: `4px solid ${ag.flame}`, borderRadius: '6px',
            padding: '1.75rem 2rem', margin: '2.5rem 0',
          }}
        >
          <Quote size={24} color={ag.flame} style={{ flexShrink: 0, marginTop: '2px' }} />
          <p className="ag-display" style={{ fontStyle: 'italic', fontSize: '1.35rem', color: ag.text, lineHeight: 1.55, margin: 0 }}>
            {block.text}
          </p>
        </div>
      );
    case 'callout':
      return (
        <div
          key={i}
          style={{
            background: `${ag.forest}08`, border: `1px solid ${ag.forest}25`,
            borderRadius: '8px', padding: '1.6rem 1.9rem', margin: '2.5rem 0',
          }}
        >
          <h4 style={{ color: ag.forest, fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.55rem', fontFamily: "'Outfit', sans-serif" }}>
            {block.title}
          </h4>
          <p style={{ color: ag.mid, fontSize: '0.98rem', lineHeight: 1.75, margin: 0, fontFamily: "'Outfit', sans-serif" }}>{block.text}</p>
        </div>
      );
    default:
      return null;
  }
}

export default function BlogPostPage({ post }: Props) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: ag.mid, background: ag.paper }}>
        Loading article...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="ag-body" style={{ background: ag.paper, minHeight: '100vh' }}>
        <BlogNav />
        <div style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '4rem 1rem', textAlign: 'center' }}>
          <h1 className="ag-display" style={{ fontSize: '2rem', color: ag.text }}>Article not found</h1>
          <p style={{ color: ag.mid }}>This post may have been moved or doesn't exist yet.</p>
          <Link href="/blog" style={{ color: ag.forest, fontWeight: 600, textDecoration: 'underline' }}>Back to the journal</Link>
        </div>
        <BlogFooter />
      </div>
    );
  }

  const related = getRelatedPosts(post.slug, 3);
  const shareUrl = `https://www.aquagas.co.ke/blog/${post.slug}`;
  const initials = post.author.split(' ').map((w) => w[0]).slice(0, 2).join('');

  return (
    <>
      <Head>
        <title>{post.title} | The AquaJournal</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="article:published_time" content={post.date} />
      </Head>
      <style>{styles}</style>

      <div className="ag-body" style={{ background: ag.paper, color: ag.text, minHeight: '100vh' }}>
        <BlogNav />
        <ReadingProgress />

        <article>
          {/* ── HERO ─────────────────────────────────────────── */}
          <header
            style={{
              background: `linear-gradient(160deg, ${post.coverGradient[0]}, ${post.coverGradient[1]})`,
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div className="container mx-auto px-6 py-20 relative" style={{ maxWidth: '840px' }}>
              <span
                style={{
                  display: 'inline-block', marginBottom: '1.5rem',
                  padding: '5px 16px', borderRadius: '100px',
                  border: '1px solid rgba(201,164,74,0.5)',
                  color: ag.gold, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                }}
              >
                {post.category}
              </span>

              <h1 className="ag-display" style={{ fontSize: 'clamp(2.1rem, 5vw, 3.4rem)', fontWeight: 600, color: '#fff', lineHeight: 1.15, marginBottom: '1.75rem' }}>
                {post.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                <div
                  style={{
                    width: '42px', height: '42px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(201,164,74,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: ag.gold, fontWeight: 700, fontSize: '0.9rem',
                  }}
                >
                  {initials}
                </div>
                <div style={{ fontSize: '0.88rem' }}>
                  <div style={{ color: '#fff', fontWeight: 600 }}>{post.author}</div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <span>{formatDate(post.date)}</span> · <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {post.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* ── BODY + SIDEBAR ───────────────────────────────── */}
          <section style={{ padding: '3.5rem 0 2rem' }}>
            <div className="container mx-auto px-6" style={{ maxWidth: '1040px' }}>
              <div style={{ display: 'grid', gap: '3.5rem' }} className="lg:grid-cols-[1fr_240px]">
                <div className="ag-prose">
                  {post.content.map((block, i) => renderBlock(block, i))}

                  {/* Share */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '3rem', paddingTop: '2rem', borderTop: `1px solid ${ag.border}` }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: ag.mid, marginRight: '0.25rem' }}>Share</span>
                    {[
                      { Icon: Twitter, href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}` },
                      { Icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
                      { Icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
                    ].map(({ Icon, href }, i) => (
                      <a
                        key={i} href={href} target="_blank" rel="noopener noreferrer"
                        style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: '#fff', border: `1px solid ${ag.border}`, color: ag.mid,
                        }}
                      >
                        <Icon size={15} />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Sticky sidebar */}
                <aside className="hidden lg:block" style={{ position: 'relative' }}>
                  <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ background: '#fff', border: `1px solid ${ag.border}`, borderRadius: '10px', padding: '1.5rem' }}>
                      <div
                        style={{
                          width: '48px', height: '48px', borderRadius: '50%', marginBottom: '0.85rem',
                          background: `${ag.forest}12`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: ag.forest, fontWeight: 700,
                        }}
                      >
                        {initials}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{post.author}</div>
                      <div style={{ fontSize: '0.8rem', color: ag.mid }}>{post.authorRole}</div>
                    </div>

                    <div style={{ background: ag.forestDk, borderRadius: '10px', padding: '1.5rem' }}>
                      <h4 className="ag-display" style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.6rem' }}>
                        Need gas today?
                      </h4>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                        Order from a verified vendor near you.
                      </p>
                      <Link
                        href="/shop"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                          background: ag.flame, color: '#fff', padding: '10px', borderRadius: '6px',
                          fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
                        }}
                      >
                        Order Now <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </section>

          {/* ── RELATED ──────────────────────────────────────── */}
          {related.length > 0 && (
            <section style={{ padding: '2rem 0 6rem' }}>
              <div className="container mx-auto px-6" style={{ maxWidth: '1040px', paddingTop: '2rem', borderTop: `1px solid ${ag.border}` }}>
                <h3 className="ag-display" style={{ fontSize: '1.7rem', fontWeight: 600, color: ag.text, marginBottom: '1.75rem' }}>
                  More from the journal
                </h3>
                <div style={{ display: 'grid', gap: '1.75rem', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                  {related.map((r) => (
                    <Link key={r.slug} href={`/blog/${r.slug}`} className="ag-hover-card" style={{ display: 'block', textDecoration: 'none' }}>
                      <div style={{ height: '120px', borderRadius: '4px', marginBottom: '0.9rem', background: `linear-gradient(135deg, ${r.coverGradient[0]}, ${r.coverGradient[1]})` }} />
                      <span style={{ color: ag.forest, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{r.category}</span>
                      <h4 className="ag-display" style={{ fontSize: '1.1rem', fontWeight: 600, color: ag.text, margin: '0.4rem 0', lineHeight: 1.3 }}>{r.title}</h4>
                      <span style={{ fontSize: '0.78rem', color: ag.mid }}>{r.readTime}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </article>

        <BlogFooter />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPosts().map((p) => ({ params: { slug: p.slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;
  const post = getPostBySlug(slug) ?? null;
  if (!post) return { notFound: true };
  return { props: { post } };
};
