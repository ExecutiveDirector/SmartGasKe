import Head from 'next/head';
import Link from 'next/link';
import { Code, Database, Smartphone, Server, Lock, Zap, Globe, Cpu, ArrowRight, CheckCircle, Shield, TrendingUp } from 'lucide-react';

const ag = {
  forest: '#0A3D2B', forestDk: '#072A1E',
  flame: '#E8621A', gold: '#C9A44A',
  cream: '#FAFAF7', text: '#0F1A14',
  mid: '#3D5246', border: '#D9E8DF',
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  .ag-display { font-family: 'Cormorant Garamond', serif; }
  .ag-body   { font-family: 'Outfit', sans-serif; }
  .tech-item:hover { background: #0A3D2B08 !important; }
  .tech-item { transition: background 0.2s; }
  .feature-chip:hover { background: #0A3D2B !important; color: #fff !important; }
  .feature-chip { transition: background 0.2s, color 0.2s; }
  .benefit-card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(10,61,43,0.12); }
  .benefit-card { transition: transform 0.3s, box-shadow 0.3s; }
`;

export default function Technology() {
  return (
    <>
      <Head>
        <title>Our Technology — AquaGas Delivery</title>
        <meta name="description" content="Modern technology powering AquaGas — reliable, secure, and built for Kenya's LPG delivery needs." />
      </Head>
      <style>{styles}</style>

      <div className="ag-body" style={{ background: ag.cream, color: ag.text }}>

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section style={{
          background: ag.forestDk, position:'relative',
          overflow:'hidden', padding:'5rem 0 8rem'
        }}>
          {/* abstract grid pattern */}
          <div style={{
            position:'absolute', inset:0,
            backgroundImage:`linear-gradient(rgba(201,164,74,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,164,74,0.04) 1px, transparent 1px)`,
            backgroundSize:'60px 60px', pointerEvents:'none'
          }}/>
          <div style={{
            position:'absolute', bottom:0, left:0, right:0, height:'1px',
            background:`linear-gradient(90deg, transparent, ${ag.gold}40, transparent)`
          }}/>

          <div className="container mx-auto px-6" style={{ textAlign:'center', position:'relative' }}>
            <span style={{
              display:'inline-block', padding:'6px 18px', borderRadius:'100px',
              border:`1px solid rgba(255,255,255,0.15)`,
              color:'rgba(255,255,255,0.7)', fontSize:'0.78rem',
              letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'1.75rem'
            }}>Built for Scale & Security</span>

            <h1 className="ag-display" style={{
              fontSize:'clamp(2.8rem, 7vw, 5rem)', fontWeight:600,
              color:'#fff', lineHeight:1.08, marginBottom:'1.5rem'
            }}>
              Powering Reliable Delivery<br />
              <em style={{ color: ag.gold }}>With Modern Technology</em>
            </h1>

            <p style={{
              color:'rgba(255,255,255,0.6)', fontSize:'1.1rem',
              maxWidth:'500px', margin:'0 auto 2.5rem', lineHeight:1.75
            }}>
              Flutter apps, Node.js backend, and real-time tracking — all designed for Kenya's LPG delivery needs.
            </p>

            <a href="#stack" style={{
              display:'inline-flex', alignItems:'center', gap:'8px',
              background: ag.flame, color:'#fff',
              padding:'14px 28px', borderRadius:'8px',
              fontWeight:600, fontSize:'0.95rem', textDecoration:'none'
            }}>Explore Our Stack <ArrowRight size={18} /></a>
          </div>
        </section>

        {/* ── PILLARS ──────────────────────────────────────────────── */}
        <section style={{ padding:'0 0 4rem' }}>
          <div className="container mx-auto px-6">
            <div style={{
              display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',
              gap:'1.5rem', marginTop:'-3.5rem'
            }}>
              {[
                { icon: Zap, title:'Lightning Fast', desc:'Real-time updates with sub-second response times', accent: ag.flame },
                { icon: Lock, title:'Secure by Design', desc:'JWT authentication and end-to-end encrypted data', accent: ag.forest },
                { icon: Globe, title:'Built to Scale', desc:'Architecture ready to expand across all of Kenya', accent: ag.gold },
              ].map((item, i) => (
                <div key={i} style={{
                  background:'#fff', borderRadius:'14px', padding:'2rem',
                  textAlign:'center', border:`1px solid ${ag.border}`,
                  boxShadow:'0 4px 24px rgba(10,61,43,0.08)'
                }}>
                  <div style={{
                    width:'52px', height:'52px', borderRadius:'12px',
                    background:`${item.accent}12`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    margin:'0 auto 1rem'
                  }}>
                    <item.icon size={26} color={item.accent} />
                  </div>
                  <h3 style={{ fontWeight:600, color: ag.text, fontSize:'1rem', marginBottom:'0.5rem' }}>{item.title}</h3>
                  <p style={{ color: ag.mid, fontSize:'0.88rem', lineHeight:1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TECH STACK ───────────────────────────────────────────── */}
        <section id="stack" style={{ padding:'5rem 0', background:'#fff' }}>
          <div className="container mx-auto px-6">
            <div style={{ textAlign:'center', marginBottom:'3.5rem' }}>
              <span style={{
                display:'inline-block', padding:'5px 16px',
                background:`${ag.forest}10`, borderRadius:'100px',
                color: ag.forest, fontSize:'0.78rem', fontWeight:700,
                letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'1rem'
              }}>Technology Stack</span>
              <h2 className="ag-display" style={{
                fontSize:'clamp(2rem, 4vw, 2.8rem)', fontWeight:600, color: ag.text
              }}>Built with <em style={{ color: ag.forest }}>Modern Tools</em></h2>
            </div>

            <div style={{
              display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem',
              maxWidth:'920px', margin:'0 auto'
            }}>
              {/* Frontend */}
              <div style={{
                background: ag.cream, borderRadius:'16px',
                border:`1px solid ${ag.border}`, overflow:'hidden'
              }}>
                <div style={{
                  padding:'1.5rem 2rem', borderBottom:`1px solid ${ag.border}`,
                  background:`${ag.flame}08`
                }}>
                  <h3 style={{ fontWeight:700, color: ag.text, fontSize:'1rem', letterSpacing:'0.05em' }}>
                    FRONTEND
                  </h3>
                </div>
                <div style={{ padding:'1.5rem' }}>
                  {[
                    { icon: Smartphone, title:'Flutter', desc:'Cross-platform mobile apps for iOS & Android' },
                    { icon: Code, title:'Next.js / React', desc:'Responsive web dashboard and admin panel' },
                  ].map((item, i) => (
                    <div key={i} className="tech-item" style={{
                      display:'flex', gap:'1rem', padding:'1rem',
                      borderRadius:'10px', marginBottom: i === 0 ? '0.5rem' : 0
                    }}>
                      <div style={{
                        width:'44px', height:'44px', borderRadius:'10px',
                        background:`${ag.flame}10`, flexShrink:0,
                        display:'flex', alignItems:'center', justifyContent:'center'
                      }}>
                        <item.icon size={20} color={ag.flame} />
                      </div>
                      <div>
                        <h4 style={{ fontWeight:600, color: ag.text, fontSize:'0.95rem', marginBottom:'4px' }}>{item.title}</h4>
                        <p style={{ color: ag.mid, fontSize:'0.83rem', lineHeight:1.5 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Backend */}
              <div style={{
                background: ag.cream, borderRadius:'16px',
                border:`1px solid ${ag.border}`, overflow:'hidden'
              }}>
                <div style={{
                  padding:'1.5rem 2rem', borderBottom:`1px solid ${ag.border}`,
                  background:`${ag.forest}08`
                }}>
                  <h3 style={{ fontWeight:700, color: ag.text, fontSize:'1rem', letterSpacing:'0.05em' }}>
                    BACKEND & INFRASTRUCTURE
                  </h3>
                </div>
                <div style={{ padding:'1.5rem' }}>
                  {[
                    { icon: Server, title:'Node.js', desc:'High-performance API server with Express' },
                    { icon: Database, title:'MySQL', desc:'Reliable, structured relational database' },
                    { icon: Lock, title:'JWT Auth', desc:'Secure token-based authentication' },
                    { icon: Cpu, title:'REST API', desc:'Clean, documented API architecture' },
                  ].map((item, i) => (
                    <div key={i} className="tech-item" style={{
                      display:'flex', gap:'1rem', padding:'0.75rem 1rem',
                      borderRadius:'10px'
                    }}>
                      <div style={{
                        width:'40px', height:'40px', borderRadius:'8px',
                        background:`${ag.forest}10`, flexShrink:0,
                        display:'flex', alignItems:'center', justifyContent:'center'
                      }}>
                        <item.icon size={18} color={ag.forest} />
                      </div>
                      <div>
                        <h4 style={{ fontWeight:600, color: ag.text, fontSize:'0.9rem', marginBottom:'2px' }}>{item.title}</h4>
                        <p style={{ color: ag.mid, fontSize:'0.8rem', lineHeight:1.5 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BENEFITS ─────────────────────────────────────────────── */}
        <section style={{ padding:'5rem 0', background: ag.cream }}>
          <div className="container mx-auto px-6">
            <div style={{ textAlign:'center', marginBottom:'3rem' }}>
              <h2 className="ag-display" style={{
                fontSize:'clamp(2rem, 4vw, 2.8rem)', fontWeight:600, color: ag.text
              }}>Technology That <em style={{ color: ag.forest }}>Delivers Results</em></h2>
            </div>

            <div style={{
              display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))',
              gap:'1.5rem', maxWidth:'880px', margin:'0 auto'
            }}>
              {[
                { icon: CheckCircle, title:'Real-Time Updates', desc:'Instant order tracking and push notifications keep everyone informed at every step.', accent: ag.flame },
                { icon: Shield, title:'Enterprise Security', desc:'Bank-level encryption and JWT authentication protect user data and transactions.', accent: ag.forest },
                { icon: TrendingUp, title:'Scalable Growth', desc:'Infrastructure designed to handle 10x growth without re-architecture.', accent: ag.gold },
              ].map((b, i) => (
                <div key={i} className="benefit-card" style={{
                  background:'#fff', borderRadius:'14px', padding:'2rem',
                  textAlign:'center', border:`1px solid ${ag.border}`,
                  boxShadow:'0 2px 16px rgba(10,61,43,0.05)'
                }}>
                  <div style={{
                    width:'52px', height:'52px', borderRadius:'12px',
                    background:`${b.accent}12`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    margin:'0 auto 1.1rem'
                  }}>
                    <b.icon size={26} color={b.accent} />
                  </div>
                  <h3 style={{ fontWeight:600, color: ag.text, fontSize:'1.05rem', marginBottom:'0.6rem' }}>{b.title}</h3>
                  <p style={{ color: ag.mid, fontSize:'0.88rem', lineHeight:1.65 }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES GRID ────────────────────────────────────────── */}
        <section style={{ padding:'5rem 0', background:'#fff' }}>
          <div className="container mx-auto px-6">
            <div style={{ maxWidth:'760px', margin:'0 auto', textAlign:'center' }}>
              <h2 className="ag-display" style={{
                fontSize:'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight:600, color: ag.text, marginBottom:'2.5rem'
              }}>Platform <em style={{ color: ag.forest }}>Features</em></h2>

              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.75rem', justifyContent:'center' }}>
                {[
                  'Real-time GPS tracking', 'Push notifications', 'In-app M-Pesa payments',
                  'Order history & receipts', 'Multi-language support', 'Offline mode capability',
                  'Analytics dashboard', 'SMS notifications', 'Rider dispatch system',
                  'Vendor inventory tools', 'Customer reviews', 'Route optimisation',
                ].map((feature, i) => (
                  <span key={i} className="feature-chip" style={{
                    display:'inline-flex', alignItems:'center', gap:'7px',
                    padding:'9px 16px', borderRadius:'100px',
                    border:`1px solid ${ag.border}`,
                    fontSize:'0.85rem', fontWeight:500, color: ag.text,
                    cursor:'default'
                  }}>
                    <CheckCircle size={14} color={ag.forest} />
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section style={{
          padding:'5rem 0',
          background:`linear-gradient(135deg, ${ag.forestDk} 0%, ${ag.forest} 100%)`,
          position:'relative', overflow:'hidden'
        }}>
          <div style={{
            position:'absolute', inset:0,
            backgroundImage:`linear-gradient(rgba(201,164,74,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,164,74,0.04) 1px, transparent 1px)`,
            backgroundSize:'50px 50px', pointerEvents:'none'
          }}/>
          <div className="container mx-auto px-6" style={{ textAlign:'center', position:'relative' }}>
            <h2 className="ag-display" style={{
              fontSize:'clamp(2rem, 4vw, 3rem)', fontWeight:600, color:'#fff', marginBottom:'1rem'
            }}>
              Experience the<br />
              <em style={{ color: ag.gold }}>Technology Difference</em>
            </h2>
            <p style={{ color:'rgba(255,255,255,0.6)', marginBottom:'2.5rem', fontSize:'1.05rem' }}>
              See how our platform transforms gas delivery with modern technology.
            </p>
            <div style={{ display:'flex', justifyContent:'center', gap:'1rem', flexWrap:'wrap' }}>
              <Link href="/shop" style={{
                background: ag.flame, color:'#fff',
                padding:'14px 32px', borderRadius:'8px',
                fontWeight:600, textDecoration:'none', fontSize:'0.95rem'
              }}>Try It Now</Link>
              <Link href="/investors" style={{
                padding:'14px 32px', borderRadius:'8px',
                border:'1px solid rgba(255,255,255,0.25)',
                color:'#fff', fontWeight:500, textDecoration:'none', fontSize:'0.95rem'
              }}>Partner With Us</Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
