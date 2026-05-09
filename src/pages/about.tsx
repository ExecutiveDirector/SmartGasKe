import Head from 'next/head';
import Link from 'next/link';
import { Shield, Users, Truck, Heart, Building2, Target, CheckCircle, ArrowRight } from 'lucide-react';

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
  .stat-num { font-family: 'Cormorant Garamond', serif; font-style: italic; }
  .flame-dot::before { content:''; display:inline-block; width:8px; height:8px; border-radius:50%; background:#E8621A; margin-right:10px; flex-shrink:0; }
`;

export default function About() {
  return (
    <>
      <Head>
        <title>About AquaGas — Kenya's Trusted LPG Platform</title>
        <meta name="description" content="The story behind AquaGas — making LPG delivery in Kenya safer, faster, and more transparent." />
      </Head>
      <style>{styles}</style>

      <div className="ag-body" style={{ background: ag.cream, color: ag.text }}>

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section style={{ background: ag.forestDk, position: 'relative', overflow: 'hidden' }}>
          {/* decorative rings */}
          <div style={{
            position:'absolute', top:'-80px', right:'-80px',
            width:'500px', height:'500px', borderRadius:'50%',
            border:`1px solid rgba(201,164,74,0.15)`, pointerEvents:'none'
          }}/>
          <div style={{
            position:'absolute', top:'-40px', right:'-40px',
            width:'360px', height:'360px', borderRadius:'50%',
            border:`1px solid rgba(201,164,74,0.1)`, pointerEvents:'none'
          }}/>
          <div style={{
            position:'absolute', bottom:0, left:0, right:0, height:'1px',
            background:`linear-gradient(90deg, transparent, ${ag.gold}, transparent)`
          }}/>

          <div className="container mx-auto px-6 py-28 relative">
            <span className="ag-body" style={{
              display:'inline-block', marginBottom:'1.5rem',
              padding:'6px 18px', borderRadius:'100px',
              border:`1px solid rgba(201,164,74,0.4)`,
              color: ag.gold, fontSize:'0.8rem', letterSpacing:'0.12em', textTransform:'uppercase'
            }}>
              Est. 2024 · Nairobi, Kenya
            </span>

            <h1 className="ag-display" style={{
              fontSize:'clamp(2.8rem, 6vw, 5rem)', fontWeight:600,
              color:'#fff', lineHeight:1.1, maxWidth:'720px', marginBottom:'1.5rem'
            }}>
              Making Gas Delivery<br />
              <em style={{ color: ag.gold }}>Safer, Faster & Transparent</em>
            </h1>

            <p style={{
              fontSize:'1.15rem', color:'rgba(255,255,255,0.65)',
              maxWidth:'520px', lineHeight:1.75, marginBottom:'2.5rem'
            }}>
              We're transforming how Kenyans access cooking gas — through technology, trust, and a customer-first approach built on real experience.
            </p>

            <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
              <a href="#our-story" style={{
                display:'inline-flex', alignItems:'center', gap:'8px',
                background: ag.flame, color:'#fff',
                padding:'14px 28px', borderRadius:'8px',
                fontWeight:600, fontSize:'0.95rem', textDecoration:'none',
                transition:'background 0.2s'
              }}>
                Our Story <ArrowRight size={18} />
              </a>
              <Link href="/contact" style={{
                display:'inline-flex', alignItems:'center',
                padding:'14px 28px', borderRadius:'8px',
                border:'1px solid rgba(255,255,255,0.25)',
                color:'#fff', fontWeight:500, fontSize:'0.95rem', textDecoration:'none'
              }}>
                Get in Touch
              </Link>
            </div>
          </div>
        </section>

        {/* ── STATS ────────────────────────────────────────────────── */}
        <section style={{ padding:'0 0 4rem' }}>
          <div className="container mx-auto px-6">
            <div style={{
              display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',
              gap:'1.5rem', marginTop:'-3rem'
            }}>
              {[
                { num:'5,000+', label:'Happy Customers',       icon: Heart    },
                { num:'1,200+', label:'Deliveries Completed',  icon: Truck    },
                { num:'60+',    label:'Verified Vendors',      icon: Building2 },
                { num:'98%',    label:'On-Time Delivery',      icon: Target   },
              ].map((s, i) => (
                <div key={i} className="ag-card" style={{
                  background:'#fff', borderRadius:'12px',
                  padding:'2rem', textAlign:'center',
                  border:`1px solid ${ag.border}`,
                  boxShadow:'0 4px 24px rgba(10,61,43,0.06)'
                }}>
                  <div style={{
                    width:'48px', height:'48px', borderRadius:'10px',
                    background:`${ag.forest}0D`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    margin:'0 auto 1rem'
                  }}>
                    <s.icon size={22} color={ag.forest} />
                  </div>
                  <div className="stat-num" style={{ fontSize:'2.6rem', fontWeight:600, color: ag.forest, lineHeight:1 }}>
                    {s.num}
                  </div>
                  <div style={{ fontSize:'0.85rem', color: ag.mid, marginTop:'6px', fontWeight:500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STORY ────────────────────────────────────────────────── */}
        <section id="our-story" style={{ padding:'5rem 0', background:'#fff' }}>
          <div className="container mx-auto px-6">
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5rem', alignItems:'center' }} className="md:grid-cols-2">
              {/* Left */}
              <div>
                <span style={{
                  display:'inline-block', padding:'5px 16px',
                  background:`${ag.forest}12`, borderRadius:'100px',
                  color: ag.forest, fontSize:'0.8rem', fontWeight:600,
                  letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'1.5rem'
                }}>Our Beginning</span>

                <h2 className="ag-display" style={{
                  fontSize:'clamp(2rem, 4vw, 3rem)', fontWeight:600,
                  color: ag.text, lineHeight:1.15, marginBottom:'1.5rem'
                }}>
                  Born from<br /><em style={{ color: ag.forest }}>Real Experience</em>
                </h2>

                <p style={{ color: ag.mid, lineHeight:1.8, marginBottom:'1.5rem', fontSize:'1rem' }}>
                  Our founder spent years working as an Uber/Bolt rider and JG Gas supplier in Nairobi — witnessing daily the challenges facing the LPG delivery industry.
                </p>

                <div style={{ display:'flex', flexDirection:'column', gap:'0.85rem' }}>
                  {[
                    'Long waiting times of 2–5 days for delivery',
                    'Lack of transparency in pricing and delivery status',
                    'Safety concerns with untracked deliveries',
                    'Poor coordination between customers, vendors, and riders',
                  ].map((item, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'12px' }}>
                      <CheckCircle size={18} color={ag.flame} style={{ flexShrink:0, marginTop:'3px' }} />
                      <span style={{ color: ag.mid, fontSize:'0.95rem', lineHeight:1.6 }}>{item}</span>
                    </div>
                  ))}
                </div>

                <p style={{
                  marginTop:'1.75rem', fontWeight:600, color: ag.text,
                  fontSize:'1rem', lineHeight:1.6,
                  paddingLeft:'1.25rem', borderLeft:`3px solid ${ag.flame}`
                }}>
                  These challenges inspired AquaGas — a platform designed to solve real problems with modern technology.
                </p>
              </div>

              {/* Right */}
              <div style={{
                background: ag.cream, borderRadius:'16px',
                padding:'2.5rem', border:`1px solid ${ag.border}`
              }}>
                <h3 className="ag-display" style={{
                  fontSize:'1.8rem', fontWeight:600, color: ag.text, marginBottom:'2rem'
                }}>Our Promise</h3>

                <div style={{ marginBottom:'2rem' }}>
                  <h4 style={{ fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.1em', color: ag.forest, fontWeight:700, marginBottom:'0.75rem' }}>Mission</h4>
                  <p style={{ color: ag.mid, lineHeight:1.75, fontSize:'0.95rem' }}>
                    To deliver LPG in Kenya faster, safer, and more transparently using modern technology and a customer-first approach.
                  </p>
                </div>

                <div>
                  <h4 style={{ fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.1em', color: ag.forest, fontWeight:700, marginBottom:'1rem' }}>Core Values</h4>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                    {['Safety','Speed','Transparency','Reliability','Innovation','Respect'].map(v => (
                      <div key={v} style={{
                        padding:'10px 14px', borderRadius:'8px',
                        background:'#fff', border:`1px solid ${ag.border}`,
                        fontSize:'0.85rem', fontWeight:500, color: ag.text,
                        textAlign:'center'
                      }}>{v}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY AQUAGAS ──────────────────────────────────────────── */}
        <section style={{ padding:'5rem 0', background: ag.cream }}>
          <div className="container mx-auto px-6">
            <div style={{ textAlign:'center', marginBottom:'3rem' }}>
              <h2 className="ag-display" style={{
                fontSize:'clamp(2rem, 4vw, 2.8rem)', fontWeight:600, color: ag.text
              }}>Why Choose <em style={{ color: ag.forest }}>AquaGas?</em></h2>
              <p style={{ color: ag.mid, marginTop:'1rem', fontSize:'1.05rem' }}>
                A platform that works for everyone in the supply chain
              </p>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'1.5rem' }}>
              {[
                {
                  icon: Users, title:'For Customers', accent: ag.flame,
                  points:['Fast, reliable delivery','Real-time tracking','Transparent pricing','24/7 customer support']
                },
                {
                  icon: Building2, title:'For Vendors', accent: ag.forest,
                  points:['Expanded customer reach','Efficient order management','Digital payment solutions','Business analytics']
                },
                {
                  icon: Truck, title:'For Riders', accent: ag.gold,
                  points:['Fair, reliable earnings','Optimised routes','Safety equipment & support','Flexible schedules']
                },
              ].map((item, i) => (
                <div key={i} className="ag-card" style={{
                  background:'#fff', borderRadius:'14px',
                  padding:'2.25rem', border:`1px solid ${ag.border}`,
                  boxShadow:'0 2px 16px rgba(10,61,43,0.05)'
                }}>
                  <div style={{
                    width:'52px', height:'52px', borderRadius:'12px',
                    background:`${item.accent}14`,
                    display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.25rem'
                  }}>
                    <item.icon size={26} color={item.accent} />
                  </div>
                  <h3 style={{ fontSize:'1.15rem', fontWeight:600, color: ag.text, marginBottom:'1rem' }}>{item.title}</h3>
                  <ul style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                    {item.points.map((p, j) => (
                      <li key={j} style={{ display:'flex', alignItems:'center', gap:'10px', fontSize:'0.9rem', color: ag.mid }}>
                        <span style={{ width:'6px', height:'6px', borderRadius:'50%', background: item.accent, flexShrink:0 }}/>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOUNDER CARD ─────────────────────────────────────────── */}
        <section style={{ padding:'5rem 0', background:'#fff' }}>
          <div className="container mx-auto px-6">
            <div style={{
              maxWidth:'860px', margin:'0 auto',
              borderRadius:'16px', overflow:'hidden',
              border:`1px solid ${ag.border}`,
              display:'grid', gridTemplateColumns:'2fr 3fr'
            }}>
              <div style={{
                background:`linear-gradient(135deg, ${ag.forestDk}, ${ag.forest})`,
                padding:'3rem', display:'flex', flexDirection:'column',
                alignItems:'center', justifyContent:'center', textAlign:'center'
              }}>
                <div style={{
                  width:'88px', height:'88px', borderRadius:'50%',
                  background:'rgba(255,255,255,0.12)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'1.6rem', fontWeight:700, color:'#fff',
                  marginBottom:'1.25rem', border:'2px solid rgba(201,164,74,0.4)'
                }}>PM</div>
                <h3 className="ag-display" style={{ fontSize:'1.5rem', color:'#fff', fontWeight:600 }}>Peter Maina</h3>
                <p style={{ color: ag.gold, fontSize:'0.85rem', marginTop:'6px', fontWeight:500 }}>Founder & CEO</p>
              </div>
              <div style={{ padding:'2.5rem' }}>
                <h3 className="ag-display" style={{ fontSize:'1.7rem', fontWeight:600, color: ag.text, marginBottom:'1rem' }}>
                  From Rider to Founder
                </h3>
                <p style={{ color: ag.mid, lineHeight:1.8, marginBottom:'1.5rem', fontSize:'0.95rem' }}>
                  After years of firsthand experience in Nairobi's delivery industry, Peter built a solution that addresses the real challenges facing customers, vendors, and riders alike.
                </p>
                <Link href="/founder" style={{
                  display:'inline-flex', alignItems:'center', gap:'8px',
                  color: ag.flame, fontWeight:600, textDecoration:'none',
                  fontSize:'0.95rem'
                }}>
                  Read Peter's Full Story <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section style={{
          padding:'5rem 0',
          background:`linear-gradient(135deg, ${ag.forestDk} 0%, ${ag.forest} 60%, #1a5c3a 100%)`,
          position:'relative', overflow:'hidden'
        }}>
          <div style={{
            position:'absolute', top:'50%', right:'-100px',
            transform:'translateY(-50%)',
            width:'400px', height:'400px', borderRadius:'50%',
            border:`1px solid rgba(201,164,74,0.12)`, pointerEvents:'none'
          }}/>
          <div className="container mx-auto px-6" style={{ textAlign:'center', position:'relative' }}>
            <h2 className="ag-display" style={{
              fontSize:'clamp(2rem, 4vw, 3rem)', fontWeight:600, color:'#fff', marginBottom:'1rem'
            }}>
              Ready for a Better<br />
              <em style={{ color: ag.gold }}>Gas Delivery Experience?</em>
            </h2>
            <p style={{ color:'rgba(255,255,255,0.65)', marginBottom:'2.5rem', fontSize:'1.05rem' }}>
              Join thousands of Nairobi households who trust AquaGas.
            </p>
            <div style={{ display:'flex', justifyContent:'center', gap:'1rem', flexWrap:'wrap' }}>
              <Link href="/shop" style={{
                background: ag.flame, color:'#fff',
                padding:'14px 32px', borderRadius:'8px',
                fontWeight:600, textDecoration:'none', fontSize:'0.95rem'
              }}>Order Gas Now</Link>
              <Link href="/partners" style={{
                padding:'14px 32px', borderRadius:'8px',
                border:'1px solid rgba(255,255,255,0.3)',
                color:'#fff', fontWeight:500, textDecoration:'none', fontSize:'0.95rem'
              }}>Become a Partner</Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
