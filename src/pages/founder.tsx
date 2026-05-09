import Head from 'next/head';
import { Zap, Shield, Bike, Code, GraduationCap, MapPin, ArrowRight, Heart, Target } from 'lucide-react';

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
  .ag-card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(10,61,43,0.12); }
  .ag-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .trait:hover { background: #0A3D2B; color: #fff !important; }
  .trait { transition: background 0.2s, color 0.2s; cursor: default; }
`;

export default function Founder() {
  return (
    <>
      <Head>
        <title>Meet Peter Maina — Founder, AquaGas</title>
        <meta name="description" content="Peter Maina's journey from delivery rider to tech entrepreneur building Kenya's leading LPG platform." />
      </Head>
      <style>{styles}</style>

      <div className="ag-body" style={{ background: ag.cream, color: ag.text }}>

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section style={{
          background: ag.forestDk, position:'relative', overflow:'hidden',
          padding:'5rem 0 8rem'
        }}>
          {/* decorative arc */}
          <div style={{
            position:'absolute', bottom:'-200px', left:'50%',
            transform:'translateX(-50%)',
            width:'900px', height:'400px', borderRadius:'50%',
            background:'rgba(255,255,255,0.03)', pointerEvents:'none'
          }}/>
          <div style={{
            position:'absolute', bottom:0, left:0, right:0, height:'1px',
            background:`linear-gradient(90deg, transparent, ${ag.gold}40, transparent)`
          }}/>

          <div className="container mx-auto px-6" style={{ textAlign:'center', position:'relative' }}>
            <span style={{
              display:'inline-flex', alignItems:'center', gap:'8px',
              padding:'6px 18px', borderRadius:'100px',
              border:`1px solid rgba(201,164,74,0.35)`,
              color: ag.gold, fontSize:'0.78rem',
              letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'2rem'
            }}>
              <Heart size={13} /> The Journey Behind AquaGas
            </span>

            <h1 className="ag-display" style={{
              fontSize:'clamp(2.8rem, 7vw, 5.5rem)', fontWeight:600,
              color:'#fff', lineHeight:1.08, marginBottom:'1.5rem'
            }}>
              From Delivery Rider<br />
              <em style={{ color: ag.gold }}>to Tech Entrepreneur</em>
            </h1>

            <p style={{
              color:'rgba(255,255,255,0.6)', fontSize:'1.1rem',
              maxWidth:'540px', margin:'0 auto', lineHeight:1.75
            }}>
              Meet Peter Maina — the founder who turned firsthand experience into a platform that's reshaping LPG delivery across Kenya.
            </p>
          </div>
        </section>

        {/* ── PROFILE CARD ─────────────────────────────────────────── */}
        <section style={{ padding:'0 0 5rem' }}>
          <div className="container mx-auto px-6">
            <div style={{
              maxWidth:'1000px', margin:'-4rem auto 0',
              background:'#fff', borderRadius:'20px',
              border:`1px solid ${ag.border}`,
              boxShadow:'0 8px 48px rgba(10,61,43,0.10)',
              overflow:'hidden',
              display:'grid', gridTemplateColumns:'2fr 3fr'
            }}>
              {/* Left panel */}
              <div style={{
                background:`linear-gradient(160deg, ${ag.forestDk} 0%, ${ag.forest} 100%)`,
                padding:'3.5rem 2.5rem',
                display:'flex', flexDirection:'column',
                alignItems:'center', justifyContent:'center', textAlign:'center'
              }}>
                <div style={{
                  width:'120px', height:'120px', borderRadius:'50%',
                  background:'rgba(255,255,255,0.08)',
                  border:`2px solid rgba(201,164,74,0.5)`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'2.2rem', fontWeight:700, color:'#fff',
                  marginBottom:'1.5rem', letterSpacing:'0.05em'
                }}>PM</div>

                <h2 className="ag-display" style={{
                  fontSize:'2rem', fontWeight:600, color:'#fff', marginBottom:'6px'
                }}>Peter Maina</h2>
                <p style={{ color: ag.gold, fontWeight:500, fontSize:'0.9rem', marginBottom:'2rem' }}>
                  Founder & CEO
                </p>

                <div style={{ display:'flex', flexDirection:'column', gap:'0.85rem', width:'100%' }}>
                  {[
                    { icon: GraduationCap, label:'BSc Physics, CUEA' },
                    { icon: MapPin, label:'Nairobi, Kenya' },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display:'flex', alignItems:'center', gap:'12px',
                      background:'rgba(255,255,255,0.08)', borderRadius:'10px',
                      padding:'10px 14px'
                    }}>
                      <item.icon size={16} color={ag.gold} />
                      <span style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.85rem' }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right panel */}
              <div style={{ padding:'3rem 3rem 3rem 2.5rem' }}>
                <h3 className="ag-display" style={{
                  fontSize:'2rem', fontWeight:600, color: ag.text, marginBottom:'1.5rem'
                }}>The Journey</h3>

                <div style={{ display:'flex', flexDirection:'column', gap:'1rem', marginBottom:'2rem' }}>
                  {[
                    "Peter's journey to founding AquaGas began on Nairobi's streets as a Bolt and Uber rider, followed by years as a JG Gas supplier.",
                    'During this time, he witnessed firsthand the challenges of the LPG industry: long wait times, lack of transparency, safety concerns, and poor coordination across the supply chain.',
                    'Drawing on his physics background and passion for technology, Peter built AquaGas to solve these problems through smart logistics and a customer-first approach.',
                  ].map((para, i) => (
                    <p key={i} style={{ color: ag.mid, lineHeight:1.8, fontSize:'0.95rem' }}>{para}</p>
                  ))}
                </div>

                <blockquote style={{
                  borderLeft:`3px solid ${ag.flame}`,
                  paddingLeft:'1.25rem', margin:'0 0 2rem',
                  fontStyle:'italic', color: ag.text, fontWeight:500, fontSize:'1rem',
                  lineHeight:1.7
                }}>
                  "The problem wasn't just about delivery — it was about creating a system that works for everyone in the supply chain."
                </blockquote>

                {/* Traits */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'0.75rem' }}>
                  {[
                    { icon: Bike, label:'Field Experience' },
                    { icon: Code, label:'Tech Innovation' },
                    { icon: Shield, label:'Safety First' },
                    { icon: Heart, label:'Customer Focus' },
                    { icon: Target, label:'Problem Solver' },
                    { icon: Zap, label:'Fast Execution' },
                  ].map((item, i) => (
                    <div key={i} className="trait" style={{
                      display:'flex', flexDirection:'column', alignItems:'center',
                      gap:'8px', padding:'14px 10px', borderRadius:'10px',
                      border:`1px solid ${ag.border}`, textAlign:'center'
                    }}>
                      <item.icon size={20} color={ag.forest} />
                      <span style={{ fontSize:'0.75rem', fontWeight:600, color: ag.mid }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── VISION ───────────────────────────────────────────────── */}
        <section style={{ padding:'5rem 0', background:'#fff' }}>
          <div className="container mx-auto px-6">
            <div style={{ maxWidth:'840px', margin:'0 auto', textAlign:'center' }}>
              <span style={{
                display:'inline-block', padding:'5px 16px',
                background:`${ag.forest}10`, borderRadius:'100px',
                color: ag.forest, fontSize:'0.78rem', fontWeight:700,
                letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'1.5rem'
              }}>Vision</span>

              <h2 className="ag-display" style={{
                fontSize:'clamp(2rem, 4vw, 2.8rem)', fontWeight:600,
                color: ag.text, lineHeight:1.2, marginBottom:'1.25rem'
              }}>
                A Kenya Where No Household<br />
                <em style={{ color: ag.forest }}>Ever Runs Out of Gas</em>
              </h2>

              <p style={{ color: ag.mid, fontSize:'1.05rem', lineHeight:1.8, marginBottom:'3rem' }}>
                Deliveries that are fast, transparent, and reliable — for customers, vendors, and riders alike.
              </p>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1.25rem', marginBottom:'3rem' }}>
                {[
                  { title:'For Customers', desc:'Fast delivery with real-time tracking and transparent pricing.' },
                  { title:'For Vendors', desc:'Efficient order management and a larger customer reach.' },
                  { title:'For Riders', desc:'Fair earnings, optimised routes, and safety support.' },
                ].map((item, i) => (
                  <div key={i} className="ag-card" style={{
                    padding:'1.75rem', borderRadius:'12px',
                    border:`1px solid ${ag.border}`, textAlign:'left',
                    boxShadow:'0 2px 12px rgba(10,61,43,0.05)'
                  }}>
                    <h3 style={{ fontSize:'1rem', fontWeight:600, color: ag.text, marginBottom:'0.6rem' }}>{item.title}</h3>
                    <p style={{ color: ag.mid, fontSize:'0.88rem', lineHeight:1.7 }}>{item.desc}</p>
                  </div>
                ))}
              </div>

              <div style={{ display:'flex', justifyContent:'center', gap:'1rem', flexWrap:'wrap' }}>
                <a href="/contact" style={{
                  display:'inline-flex', alignItems:'center', gap:'8px',
                  background: ag.forest, color:'#fff',
                  padding:'14px 28px', borderRadius:'8px',
                  fontWeight:600, fontSize:'0.95rem', textDecoration:'none'
                }}>Get in Touch <ArrowRight size={16} /></a>
                <a href="/shop" style={{
                  display:'inline-flex', alignItems:'center',
                  padding:'14px 28px', borderRadius:'8px',
                  border:`1px solid ${ag.border}`,
                  color: ag.text, fontWeight:500, textDecoration:'none', fontSize:'0.95rem'
                }}>Order Gas Now</a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
