import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { ArrowLeft, ArrowRight, Clock, Facebook, Linkedin, Quote, Twitter } from 'lucide-react';
import {
  type BlogBlock,
  type BlogPost,
  formatDate,
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
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
  .ag-card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(10,61,43,0.12); }
  .ag-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .ag-prose p { color: #3D5246; font-size: 1.08rem; line-height: 1.85; margin-bottom: 1.4rem; }
  .ag-prose h2 { font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 1.9rem; color: #0F1A14; margin: 2.4rem 0 1.1rem; }
  .ag-prose ul { margin: 0 0 1.6rem; padding-left: 0; list-style: none; }
  .ag-prose li { color: #3D5246; font-size: 1.02rem; line-height: 1.75; margin-bottom: 0.75rem; padding-left: 1.6rem; position: relative; }
  .ag-prose li::before { content: ''; position: absolute; left: 0; top: 0.6rem; width: 8px; height: 8px; border-radius: 50%; background: #E8621A; }
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
            display: 'flex', gap: '1rem', alignItems: 'flex-start',
            background: ag.cream, border: `1px solid ${ag.border}`,
            borderLeft: `4px solid ${ag.flame}`, borderRadius: '10px',
            padding: '1.5rem 1.75rem', margin: '2rem 0',
          }}
        >
          <Quote size={22} color={ag.flame} style={{ flexShrink: 0, marginTop: '2px' }} />
          <p
            className="ag-display"
            style={{ fontStyle: 'italic', fontSize: '1.25rem', color: ag.text, lineHeight: 1.6, margin: 0 }}
          >
            {block.text}
          </p>
        </div>
      );
    case 'callout':
      return (
        <div
          key={i}
          style={{
            background: `${ag.forest}0A`, border: `1px solid ${ag.forest}30`,
            borderRadius: '12px', padding: '1.5rem 1.75rem', margin: '2rem 0',
          }}
        >
          <h4 style={{ color: ag.forest, fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
            {block.title}
          </h4>
          <p style={{ color: ag.mid, fontSize: '0.97rem', lineHeight: 1.7, margin: 0 }}>{block.text}</p>
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
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: ag.mid }}>
        Loading article...
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '4rem 1rem', textAlign: 'center' }}>
        <h1 className="ag-display" style={{ fontSize: '2rem', color: ag.text }}>Article not found</h1>
        <p style={{ color: ag.mid }}>This post may have been moved or doesn't exist yet.</p>
        <Link href="/blog" style={{ color: ag.forest, fontWeight: 600, textDecoration: 'underline' }}>
          Back to the blog
        </Link>
      </div>
    );
  }

  const related = getRelatedPosts(post.slug, 3);
  const shareUrl = `https://www.aquagas.co.ke/blog/${post.slug}`;

  return (
    <>
      <Head>
        <title>{post.title} | AquaGas Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="article:published_time" content={post.date} />
      </Head>
      <style>{styles}</style>

      <article className="ag-body" style={{ background: ag.cream, color: ag.text }}>
        {/* ── HEADER ───────────────────────────────────────────── */}
        <header style={{ background: ag.forestDk, position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
              background: `linear-gradient(90deg, transparent, ${ag.gold}, transparent)`,
            }}
          />
          <div className="container mx-auto px-6 py-16 relative" style={{ maxWidth: '780px' }}>
            <Link
              href="/blog"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.75rem', textDecoration: 'none',
              }}
            >
              <ArrowLeft size={16} /> All articles
            </Link>

            <span
              style={{
                display: 'inline-block', marginBottom: '1.25rem',
                padding: '5px 16px', borderRadius: '100px',
                border: '1px solid rgba(201,164,74,0.4)',
                color: ag.gold, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}
            >
              {post.category}
            </span>

            <h1
              className="ag-display"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 600, color: '#fff', lineHeight: 1.18, marginBottom: '1.5rem' }}
            >
              {post.title}
            </h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.25rem', color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>
              <span>
                By <strong style={{ color: 'rgba(255,255,255,0.85)' }}>{post.author}</strong> · {post.authorRole}
              </span>
              <span>{formatDate(post.date)}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} /> {post.readTime}
              </span>
            </div>
          </div>
        </header>

        {/* ── BODY ─────────────────────────────────────────────── */}
        <section style={{ padding: '3.5rem 0 2rem' }}>
          <div className="container mx-auto px-6" style={{ maxWidth: '780px' }}>
            <div className="ag-prose">
              {post.content.map((block, i) => renderBlock(block, i))}
            </div>

            {/* Share */}
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                marginTop: '3rem', paddingTop: '2rem', borderTop: `1px solid ${ag.border}`,
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: ag.mid, marginRight: '0.25rem' }}>
                Share this article
              </span>
              {[
                { Icon: Twitter, href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}` },
                { Icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
                { Icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: ag.cream, border: `1px solid ${ag.border}`, color: ag.mid,
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            {/* CTA */}
            <div
              style={{
                marginTop: '2.5rem', borderRadius: '16px', padding: '2rem',
                background: ag.forestDk, display: 'flex', flexWrap: 'wrap',
                alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
              }}
            >
              <div>
                <h3 className="ag-display" style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Ready for your next refill?
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                  Order from a verified vendor and track it live to your door.
                </p>
              </div>
              <Link
                href="/shop"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: ag.flame, color: '#fff', padding: '12px 24px',
                  borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', whiteSpace: 'nowrap',
                }}
              >
                Order Gas <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── RELATED ──────────────────────────────────────────── */}
        {related.length > 0 && (
          <section style={{ padding: '2rem 0 6rem', background: '#fff', borderTop: `1px solid ${ag.border}` }}>
            <div className="container mx-auto px-6" style={{ maxWidth: '1000px', paddingTop: '3rem' }}>
              <h3 className="ag-display" style={{ fontSize: '1.7rem', fontWeight: 600, color: ag.text, marginBottom: '1.75rem' }}>
                More from the journal
              </h3>
              <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="ag-card"
                    style={{
                      display: 'flex', flexDirection: 'column', borderRadius: '14px',
                      overflow: 'hidden', textDecoration: 'none', border: `1px solid ${ag.border}`,
                    }}
                  >
                    <div
                      style={{
                        height: '110px',
                        background: `linear-gradient(135deg, ${r.coverGradient[0]}, ${r.coverGradient[1]})`,
                      }}
                    />
                    <div style={{ padding: '1.25rem' }}>
                      <span style={{ color: ag.forest, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {r.category}
                      </span>
                      <h4 className="ag-display" style={{ fontSize: '1.1rem', fontWeight: 600, color: ag.text, margin: '0.5rem 0', lineHeight: 1.3 }}>
                        {r.title}
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: ag.mid }}>{r.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
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

  if (!post) {
    return { notFound: true };
  }

  return { props: { post } };
};
