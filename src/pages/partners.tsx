import React from 'react';
import { Users, Truck, Building2, CheckCircle, ArrowRight, ChevronRight, ShieldCheck, DollarSign, Clock, Zap } from 'lucide-react';

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
  .partner-tab { transition: background 0.2s, color 0.2s, border-color 0.2s; }
  .partner-tab:hover { border-color: #0A3D2B !important; }
  .benefit-card:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(10,61,43,0.1); }
  .benefit-card { transition: transform 0.3s, box-shadow 0.3s; }
  .req-item { transition: background 0.2s; }
  .req-item:hover { background: #0A3D2B10 !important; }
`;

function StatBadge({ num, label }: { num: string, label: string }) {
  return (
    <div style={{ textAlign:'center', padding:'1.25rem' }}>
      <div className="ag-display" style={{
        fontSize:'2.2rem', fontWeight:600, color: ag.forest,
        lineHeight:1, fontStyle:'italic', marginBottom:'6px'
      }}>{num}</div>
      <div style={{ fontSize:'0.82rem', color: ag.mid, fontWeight:500 }}>{label}</div>
    </div>
  );
}

export default function Partners() {
  return (
    <>
      <style>{styles}</style>
      <div className="ag-body" style={{ background: ag.cream, color: ag.text }}>

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section style={{
          background: ag.forestDk, position:'relative',
          overflow:'hidden', padding:'5rem 0 8rem'
        }}>
          {[600, 440].map((size, i) => (
            <div key={i} style={{
              position:'absolute', top:'50%', left:'-160px',
              transform:'translateY(-50%)',
              width:`${size}px`, height:`${size}px`, borderRadius:'50%',
              border:`1px solid rgba(201,164,74,${0.06 + i * 0.04})`, pointerEvents:'none'
            }}/>
          ))}
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
            }}>AquaGas Partner Network · Kenya</span>

            <h1 className="ag-display" style={{
              fontSize:'clamp(2.8rem, 7vw, 5rem)', fontWeight:600,
              color:'#fff', lineHeight:1.08, marginBottom:'1.5rem'
            }}>
              Partner With a<br />
              <em style={{ color: ag.gold }}>Trusted LPG Platform</em>
            </h1>

            <p style={{
              color:'rgba(255,255,255,0.6)', fontSize:'1.1rem',
              maxWidth:'520px', margin:'0 auto 2rem', lineHeight:1.75
            }}>
              AquaGas connects verified LPG vendors and certified delivery riders to thousands of households — safely, reliably, and transparently.
            </p>

            {/* EPRA badge */}
            <div style={{ display:'flex', justifyContent:'center', marginBottom:'2.5rem' }}>
              <div style={{
                display:'inline-flex', alignItems:'center', gap:'12px',
                background:'rgba(255,255,255,0.08)',
                border:'1px solid rgba(201,164,74,0.3)',
                padding:'12px 20px', borderRadius:'12px'
              }}>
                <ShieldCheck size={20} color={ag.gold} />
                <div style={{ textAlign:'left' }}>
                  <p style={{ fontWeight:600, color:'#fff', fontSize:'0.9rem' }}>EPRA Safety Aligned</p>
                  <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.78rem' }}>LPG handling & delivery standards</p>
                </div>
              </div>
            </div>

            <div style={{ display:'flex', justifyContent:'center', gap:'1rem', flexWrap:'wrap' }}>
              <a href="#vendor" style={{
                display:'inline-flex', alignItems:'center', gap:'8px',
                background: ag.flame, color:'#fff',
                padding:'14px 28px', borderRadius:'8px',
                fontWeight:600, fontSize:'0.95rem', textDecoration:'none'
              }}>Apply as LPG Vendor <ArrowRight size={18} /></a>
              <a href="#rider" style={{
                display:'inline-flex', alignItems:'center',
                padding:'14px 28px', borderRadius:'8px',
                border:'1px solid rgba(255,255,255,0.25)',
                color:'#fff', fontWeight:500, fontSize:'0.95rem', textDecoration:'none'
              }}>Apply as Delivery Rider</a>
            </div>
          </div>
        </section>

        {/* ── BENEFIT CARDS ────────────────────────────────────────── */}
        <section style={{ padding:'0 0 4rem' }}>
          <div className="container mx-auto px-6">
            <div style={{
              display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',
              gap:'1.25rem', marginTop:'-3.5rem'
            }}>
              {[
                { icon: Users, title:'Verified Customers', desc:'Access thousands of active gas users in Nairobi', accent: ag.flame },
                { icon: Zap, title:'Fast Settlements', desc:'Mobile money payouts — no delays', accent: ag.forest },
                { icon: ShieldCheck, title:'Safety First', desc:'Compliance and training support included', accent: ag.gold },
                { icon: DollarSign, title:'Predictable Earnings', desc:'Transparent, competitive commission model', accent: ag.flame },
              ].map((b, i) => (
                <div key={i} className="benefit-card" style={{
                  background:'#fff', borderRadius:'14px', padding:'1.75rem',
                  textAlign:'center', border:`1px solid ${ag.border}`,
                  boxShadow:'0 4px 20px rgba(10,61,43,0.06)'
                }}>
                  <div style={{
                    width:'48px', height:'48px', borderRadius:'10px',
                    background:`${b.accent}12`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    margin:'0 auto 0.85rem'
                  }}>
                    <b.icon size={22} color={b.accent} />
                  </div>
                  <h3 style={{ fontWeight:600, color: ag.text, fontSize:'0.95rem', marginBottom:'0.5rem' }}>{b.title}</h3>
                  <p style={{ color: ag.mid, fontSize:'0.83rem', lineHeight:1.6 }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── VENDORS ──────────────────────────────────────────────── */}
        <section id="vendor" style={{ padding:'5rem 0', background:'#fff' }}>
          <div className="container mx-auto px-6">
            <div style={{
              display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem',
              alignItems:'center', maxWidth:'1000px', margin:'0 auto'
            }}>
              <div>
                <span style={{
                  display:'inline-block', padding:'5px 16px',
                  background:`${ag.forest}10`, borderRadius:'100px',
                  color: ag.forest, fontSize:'0.78rem', fontWeight:700,
                  letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'1.25rem'
                }}>LPG Vendors</span>

                <h2 className="ag-display" style={{
                  fontSize:'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight:600,
                  color: ag.text, lineHeight:1.15, marginBottom:'1.5rem'
                }}>
                  Scale Your Business<br />
                  <em style={{ color: ag.forest }}>With Confidence</em>
                </h2>

                <ul style={{ display:'flex', flexDirection:'column', gap:'0.85rem', marginBottom:'2rem' }}>
                  {[
                    'Order & inventory management',
                    'Access to verified customer base',
                    'Secure digital payments',
                    'EPRA-aligned safety standards',
                  ].map((item, i) => (
                    <li key={i} style={{ display:'flex', alignItems:'center', gap:'12px', color: ag.mid, fontSize:'0.95rem' }}>
                      <CheckCircle size={17} color={ag.forest} style={{ flexShrink:0 }} />
                      {item}
                    </li>
                  ))}
                </ul>

                <div style={{
                  background: ag.cream, borderRadius:'12px',
                  padding:'1.5rem', border:`1px solid ${ag.border}`, marginBottom:'2rem'
                }}>
                  <h4 style={{ fontWeight:600, color: ag.text, fontSize:'0.9rem', marginBottom:'0.85rem' }}>
                    Vendor Requirements
                  </h4>
                  {[
                    'Business registration certificate',
                    'LPG safety compliance documentation',
                    'Minimum stock availability',
                    'Safety inspection readiness',
                  ].map((req, i) => (
                    <div key={i} className="req-item" style={{
                      display:'flex', alignItems:'center', gap:'10px',
                      padding:'8px 10px', borderRadius:'6px',
                      fontSize:'0.85rem', color: ag.mid
                    }}>
                      <span style={{ width:'5px', height:'5px', borderRadius:'50%', background: ag.flame, flexShrink:0 }}/>
                      {req}
                    </div>
                  ))}
                </div>

                <a href="/contact?type=vendor" style={{
                  display:'inline-flex', alignItems:'center', gap:'8px',
                  background: ag.forest, color:'#fff',
                  padding:'14px 24px', borderRadius:'8px',
                  fontWeight:600, fontSize:'0.9rem', textDecoration:'none'
                }}>Apply as Verified Vendor <ChevronRight size={17} /></a>
              </div>

              {/* Stats panel */}
              <div style={{
                background: ag.cream, borderRadius:'16px',
                border:`1px solid ${ag.border}`, overflow:'hidden'
              }}>
                <div style={{
                  background:`linear-gradient(135deg, ${ag.forestDk}, ${ag.forest})`,
                  padding:'1.75rem 2rem'
                }}>
                  <h3 className="ag-display" style={{ fontSize:'1.5rem', fontWeight:600, color:'#fff' }}>Vendor Metrics</h3>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderTop:`1px solid ${ag.border}` }}>
                  {[
                    { num:'60+', label:'Verified Vendors' },
                    { num:'30%', label:'Avg Sales Growth' },
                    { num:'98%', label:'Payment Reliability' },
                    { num:'Dedicated', label:'Support Line' },
                  ].map((s, i) => (
                    <div key={i} style={{
                      borderRight: i % 2 === 0 ? `1px solid ${ag.border}` : 'none',
                      borderBottom: i < 2 ? `1px solid ${ag.border}` : 'none'
                    }}>
                      <StatBadge num={s.num} label={s.label} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── RIDERS ───────────────────────────────────────────────── */}
        <section id="rider" style={{ padding:'5rem 0', background: ag.cream }}>
          <div className="container mx-auto px-6">
            <div style={{
              display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem',
              alignItems:'center', maxWidth:'1000px', margin:'0 auto'
            }}>
              {/* Stats panel left */}
              <div style={{
                background:'#fff', borderRadius:'16px',
                border:`1px solid ${ag.border}`, overflow:'hidden',
                order: 1
              }}>
                <div style={{
                  background:`linear-gradient(135deg, ${ag.forestDk}, ${ag.forest})`,
                  padding:'1.75rem 2rem'
                }}>
                  <h3 className="ag-display" style={{ fontSize:'1.5rem', fontWeight:600, color:'#fff' }}>Rider Metrics</h3>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderTop:`1px solid ${ag.border}` }}>
                  {[
                    { num:'120+', label:'Active Riders' },
                    { num:'KES 700+', label:'Per Delivery' },
                    { num:'95%', label:'On-Time Rate' },
                    { num:'Weekly', label:'Payouts' },
                  ].map((s, i) => (
                    <div key={i} style={{
                      borderRight: i % 2 === 0 ? `1px solid ${ag.border}` : 'none',
                      borderBottom: i < 2 ? `1px solid ${ag.border}` : 'none'
                    }}>
                      <StatBadge num={s.num} label={s.label} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ order: 2 }}>
                <span style={{
                  display:'inline-block', padding:'5px 16px',
                  background:`${ag.flame}10`, borderRadius:'100px',
                  color: ag.flame, fontSize:'0.78rem', fontWeight:700,
                  letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'1.25rem'
                }}>Delivery Riders</span>

                <h2 className="ag-display" style={{
                  fontSize:'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight:600,
                  color: ag.text, lineHeight:1.15, marginBottom:'1.5rem'
                }}>
                  Certified Delivery<br />
                  <em style={{ color: ag.flame }}>With Predictable Earnings</em>
                </h2>

                <ul style={{ display:'flex', flexDirection:'column', gap:'0.85rem', marginBottom:'2rem' }}>
                  {[
                    { icon: Truck, label:'Optimised delivery routes' },
                    { icon: DollarSign, label:'Per-delivery payments' },
                    { icon: Clock, label:'Flexible shifts' },
                    { icon: ShieldCheck, label:'Safety training & gear provided' },
                  ].map((item, i) => (
                    <li key={i} style={{ display:'flex', alignItems:'center', gap:'12px', color: ag.mid, fontSize:'0.95rem', listStyle:'none' }}>
                      <item.icon size={17} color={ag.flame} style={{ flexShrink:0 }} />
                      {item.label}
                    </li>
                  ))}
                </ul>

                <div style={{
                  background:'#fff', borderRadius:'12px',
                  padding:'1.5rem', border:`1px solid ${ag.border}`, marginBottom:'2rem'
                }}>
                  <h4 style={{ fontWeight:600, color: ag.text, fontSize:'0.9rem', marginBottom:'0.85rem' }}>
                    Rider Requirements
                  </h4>
                  {['Valid driving licence', 'Motorcycle with carrier capacity', 'Smartphone & data plan', 'Safety training (provided)'].map((req, i) => (
                    <div key={i} className="req-item" style={{
                      display:'flex', alignItems:'center', gap:'10px',
                      padding:'8px 10px', borderRadius:'6px',
                      fontSize:'0.85rem', color: ag.mid
                    }}>
                      <span style={{ width:'5px', height:'5px', borderRadius:'50%', background: ag.flame, flexShrink:0 }}/>
                      {req}
                    </div>
                  ))}
                </div>

                <a href="/contact?type=rider" style={{
                  display:'inline-flex', alignItems:'center', gap:'8px',
                  background: ag.flame, color:'#fff',
                  padding:'14px 24px', borderRadius:'8px',
                  fontWeight:600, fontSize:'0.9rem', textDecoration:'none'
                }}>Apply as Certified Rider <ChevronRight size={17} /></a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
