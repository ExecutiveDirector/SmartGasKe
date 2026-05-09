import React, { useRef } from 'react';
import { TrendingUp, BarChart2, Users, Globe, DollarSign, PieChart, ArrowRight, Zap, Shield, LayoutDashboard } from 'lucide-react';

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
  .no-scroll::-webkit-scrollbar { display:none; }
  .no-scroll { -ms-overflow-style:none; scrollbar-width:none; }
  .metric-card:hover { transform: translateY(-4px) scale(1.01); }
  .metric-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .scroll-btn:hover { background: #E8621A; }
  .scroll-btn { transition: background 0.2s; }
  .revenue-card:hover { border-color: #0A3D2B; }
  .revenue-card { transition: border-color 0.25s, box-shadow 0.25s; }
`;

export default function Investors() {
  const metricsRef = useRef<HTMLDivElement>(null);
  const revenueRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement>, dir: 'left' | 'right') => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir === 'left' ? -280 : 280, behavior:'smooth' });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ag-body" style={{ background: ag.cream, color: ag.text }}>

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section style={{
          background: ag.forestDk, position:'relative',
          overflow:'hidden', padding:'5rem 0 8rem'
        }}>
          {/* decorative rings */}
          {[700, 540, 380].map((size, i) => (
            <div key={i} style={{
              position:'absolute', top:'50%', right:'-160px',
              transform:'translateY(-50%)',
              width:`${size}px`, height:`${size}px`, borderRadius:'50%',
              border:`1px solid rgba(201,164,74,${0.05 + i * 0.03})`,
              pointerEvents:'none'
            }}/>
          ))}
          <div style={{
            position:'absolute', bottom:0, left:0, right:0, height:'1px',
            background:`linear-gradient(90deg, transparent, ${ag.gold}40, transparent)`
          }}/>

          <div className="container mx-auto px-6" style={{ textAlign:'center', position:'relative' }}>
            <span style={{
              display:'inline-block', padding:'6px 18px', borderRadius:'100px',
              border:`1px solid rgba(201,164,74,0.35)`,
              color: ag.gold, fontSize:'0.78rem',
              letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'1.75rem'
            }}>Regulated · EPRA-Aligned · Investor Ready</span>

            <h1 className="ag-display" style={{
              fontSize:'clamp(2.8rem, 7vw, 5rem)', fontWeight:600,
              color:'#fff', lineHeight:1.08, marginBottom:'1.5rem'
            }}>
              Scaling <em style={{ color: ag.gold }}>Clean LPG Energy</em><br />
              Across Urban Kenya
            </h1>

            <p style={{
              color:'rgba(255,255,255,0.6)', fontSize:'1.1rem',
              maxWidth:'520px', margin:'0 auto 2.5rem', lineHeight:1.75
            }}>
              AquaGas is building Kenya's most trusted digital LPG delivery platform — focused on safety, speed, and scalable returns.
            </p>

            <div style={{ display:'flex', justifyContent:'center', gap:'1rem', flexWrap:'wrap' }}>
              <a href="#opportunity" style={{
                display:'inline-flex', alignItems:'center', gap:'8px',
                background: ag.flame, color:'#fff',
                padding:'14px 28px', borderRadius:'8px',
                fontWeight:600, fontSize:'0.95rem', textDecoration:'none'
              }}>View Opportunity <ArrowRight size={18} /></a>
              <a href="/contact?type=investor" style={{
                display:'inline-flex', alignItems:'center',
                padding:'14px 28px', borderRadius:'8px',
                border:'1px solid rgba(255,255,255,0.25)',
                color:'#fff', fontWeight:500, fontSize:'0.95rem', textDecoration:'none'
              }}>Speak to Founders</a>
            </div>
          </div>
        </section>

        {/* ── METRICS ──────────────────────────────────────────────── */}
        <section style={{ padding:'0 0 5rem' }}>
          <div className="container mx-auto px-6" style={{ position:'relative', marginTop:'-3.5rem' }}>
            <button className="scroll-btn" onClick={() => scroll(metricsRef, 'left')} style={{
              position:'absolute', left:'-16px', top:'50%', transform:'translateY(-50%)',
              background: ag.forest, color:'#fff', border:'none',
              width:'44px', height:'44px', borderRadius:'50%',
              fontSize:'1.4rem', cursor:'pointer', zIndex:10,
              boxShadow:'0 4px 16px rgba(0,0,0,0.2)', display:'flex', alignItems:'center', justifyContent:'center'
            }}>‹</button>
            <button className="scroll-btn" onClick={() => scroll(metricsRef, 'right')} style={{
              position:'absolute', right:'-16px', top:'50%', transform:'translateY(-50%)',
              background: ag.forest, color:'#fff', border:'none',
              width:'44px', height:'44px', borderRadius:'50%',
              fontSize:'1.4rem', cursor:'pointer', zIndex:10,
              boxShadow:'0 4px 16px rgba(0,0,0,0.2)', display:'flex', alignItems:'center', justifyContent:'center'
            }}>›</button>

            <div ref={metricsRef} className="no-scroll" style={{
              display:'flex', gap:'1.25rem', overflowX:'auto',
              scrollSnapType:'x mandatory', padding:'1rem 0.5rem'
            }}>
              {[
                { icon: Users, num:'5,000+', label:'Verified Users', accent: ag.flame },
                { icon: TrendingUp, num:'1,200+', label:'Monthly Deliveries', accent: ag.forest },
                { icon: DollarSign, num:'KES 8M+', label:'Annual Run Rate', accent: ag.gold },
                { icon: Globe, num:'Nairobi+', label:'Expansion Ready', accent: ag.flame },
              ].map((m, i) => (
                <div key={i} className="metric-card" style={{
                  background:'#fff', borderRadius:'16px', padding:'2rem',
                  textAlign:'center', flexShrink:0, width:'220px',
                  scrollSnapAlign:'start', border:`1px solid ${ag.border}`,
                  boxShadow:'0 4px 24px rgba(10,61,43,0.08)'
                }}>
                  <div style={{
                    width:'52px', height:'52px', borderRadius:'12px',
                    background:`${m.accent}12`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    margin:'0 auto 1rem'
                  }}>
                    <m.icon size={26} color={m.accent} />
                  </div>
                  <div className="ag-display" style={{
                    fontSize:'2.4rem', fontWeight:600, color: ag.text, lineHeight:1, fontStyle:'italic'
                  }}>{m.num}</div>
                  <div style={{ color: ag.mid, fontSize:'0.85rem', marginTop:'6px', fontWeight:500 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── REVENUE MODEL ────────────────────────────────────────── */}
        <section id="opportunity" style={{ padding:'5rem 0', background:'#fff' }}>
          <div className="container mx-auto px-6">
            <div style={{ textAlign:'center', marginBottom:'3rem' }}>
              <span style={{
                display:'inline-block', padding:'5px 16px',
                background:`${ag.forest}10`, borderRadius:'100px',
                color: ag.forest, fontSize:'0.78rem', fontWeight:700,
                letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'1rem'
              }}>Business Model</span>
              <h2 className="ag-display" style={{
                fontSize:'clamp(2rem, 4vw, 2.8rem)', fontWeight:600, color: ag.text
              }}>Scalable <em style={{ color: ag.forest }}>Revenue Engine</em></h2>
            </div>

            <div style={{ position:'relative' }}>
              <button className="scroll-btn" onClick={() => scroll(revenueRef, 'left')} style={{
                position:'absolute', left:'-16px', top:'50%', transform:'translateY(-50%)',
                background: ag.forest, color:'#fff', border:'none',
                width:'44px', height:'44px', borderRadius:'50%',
                fontSize:'1.4rem', cursor:'pointer', zIndex:10,
                boxShadow:'0 4px 16px rgba(0,0,0,0.2)',
                display:'flex', alignItems:'center', justifyContent:'center'
              }}>‹</button>
              <button className="scroll-btn" onClick={() => scroll(revenueRef, 'right')} style={{
                position:'absolute', right:'-16px', top:'50%', transform:'translateY(-50%)',
                background: ag.forest, color:'#fff', border:'none',
                width:'44px', height:'44px', borderRadius:'50%',
                fontSize:'1.4rem', cursor:'pointer', zIndex:10,
                boxShadow:'0 4px 16px rgba(0,0,0,0.2)',
                display:'flex', alignItems:'center', justifyContent:'center'
              }}>›</button>

              <div ref={revenueRef} className="no-scroll" style={{
                display:'flex', gap:'1.5rem', overflowX:'auto',
                scrollSnapType:'x mandatory', padding:'1rem 0.5rem'
              }}>
                {[
                  { icon: PieChart, title:'Order Commissions', desc:'10–15% per successful LPG transaction, aligned with market rates.' },
                  { icon: DollarSign, title:'Vendor Subscriptions', desc:'Premium dashboards, compliance tools, and priority placement.' },
                  { icon: BarChart2, title:'Logistics & Listings', desc:'Delivery fees and promoted vendor listings drive additional revenue.' },
                ].map((b, i) => (
                  <div key={i} className="revenue-card" style={{
                    background: ag.cream, borderRadius:'16px',
                    padding:'2.25rem', flexShrink:0, width:'280px',
                    scrollSnapAlign:'start', border:`1px solid ${ag.border}`,
                    boxShadow:'0 2px 16px rgba(10,61,43,0.05)'
                  }}>
                    <div style={{
                      width:'52px', height:'52px', borderRadius:'12px',
                      background:`${ag.forest}10`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      marginBottom:'1.25rem'
                    }}>
                      <b.icon size={26} color={ag.forest} />
                    </div>
                    <h3 style={{ fontSize:'1.1rem', fontWeight:600, color: ag.text, marginBottom:'0.75rem' }}>{b.title}</h3>
                    <p style={{ color: ag.mid, fontSize:'0.9rem', lineHeight:1.7 }}>{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── ADMIN DASHBOARD ──────────────────────────────────────── */}
        <section style={{ padding:'5rem 0', background: ag.cream }}>
          <div className="container mx-auto px-6">
            <div style={{
              display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem',
              alignItems:'center', maxWidth:'960px', margin:'0 auto'
            }}>
              <div>
                <span style={{
                  display:'inline-block', padding:'5px 16px',
                  background:`${ag.forest}10`, borderRadius:'100px',
                  color: ag.forest, fontSize:'0.78rem', fontWeight:700,
                  letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'1.25rem'
                }}>Operational Transparency</span>

                <h2 className="ag-display" style={{
                  fontSize:'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight:600,
                  color: ag.text, lineHeight:1.2, marginBottom:'1.5rem'
                }}>
                  Investor-Grade<br /><em style={{ color: ag.forest }}>Admin Dashboard</em>
                </h2>

                <ul style={{ display:'flex', flexDirection:'column', gap:'0.85rem' }}>
                  {[
                    'Real-time orders & revenue tracking',
                    'Vendor compliance & EPRA safety logs',
                    'Rider performance & delivery SLAs',
                    'City-level expansion analytics',
                  ].map((item, i) => (
                    <li key={i} style={{ display:'flex', alignItems:'center', gap:'12px', color: ag.mid, fontSize:'0.95rem' }}>
                      <span style={{
                        width:'6px', height:'6px', borderRadius:'50%',
                        background: ag.flame, flexShrink:0
                      }}/>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{
                background:`linear-gradient(160deg, ${ag.forestDk} 0%, ${ag.forest} 100%)`,
                borderRadius:'20px', padding:'3rem',
                boxShadow:`0 24px 60px rgba(10,61,43,0.25)`
              }}>
                <LayoutDashboard size={44} color={ag.gold} style={{ marginBottom:'1.5rem' }} />
                <p style={{ fontSize:'1.3rem', fontWeight:600, color:'#fff', marginBottom:'0.5rem' }}>Live Admin View</p>
                <p style={{ color:'rgba(255,255,255,0.6)', lineHeight:1.75, fontSize:'0.95rem' }}>
                  Designed for founders, operators, and investors — full visibility at every level of the business.
                </p>
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
            position:'absolute', top:'50%', left:'-100px', transform:'translateY(-50%)',
            width:'500px', height:'500px', borderRadius:'50%',
            border:`1px solid rgba(201,164,74,0.1)`, pointerEvents:'none'
          }}/>
          <div className="container mx-auto px-6" style={{ textAlign:'center', position:'relative' }}>
            <h2 className="ag-display" style={{
              fontSize:'clamp(2rem, 4vw, 3rem)', fontWeight:600, color:'#fff', marginBottom:'1rem'
            }}>
              Invest in Kenya's<br />
              <em style={{ color: ag.gold }}>Clean Energy Infrastructure</em>
            </h2>
            <p style={{ color:'rgba(255,255,255,0.6)', marginBottom:'2.5rem', fontSize:'1.05rem', maxWidth:'480px', margin:'0 auto 2.5rem' }}>
              AquaGas combines regulation, technology, and logistics into a defensible LPG platform built to scale.
            </p>
            <div style={{ display:'flex', justifyContent:'center', gap:'1rem', flexWrap:'wrap' }}>
              <a href="/pitch-deck.pdf" style={{
                background: ag.flame, color:'#fff',
                padding:'14px 32px', borderRadius:'8px',
                fontWeight:600, textDecoration:'none', fontSize:'0.95rem'
              }}>Download Pitch Deck</a>
              <a href="/contact?type=investor" style={{
                padding:'14px 32px', borderRadius:'8px',
                border:'1px solid rgba(255,255,255,0.25)',
                color:'#fff', fontWeight:500, textDecoration:'none', fontSize:'0.95rem'
              }}>Book a Meeting</a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
