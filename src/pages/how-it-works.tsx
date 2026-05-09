import Head from 'next/head';
import Link from 'next/link';
import { Smartphone, ShoppingCart, MapPin, CreditCard, UserCheck, Package, Truck, CheckCircle, ArrowRight } from 'lucide-react';

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
  .step-card:hover .step-icon { transform: scale(1.08); }
  .step-icon { transition: transform 0.25s ease; }
  .ag-card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(10,61,43,0.12); }
  .ag-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .connector { position:absolute; top:32px; left:calc(50% + 40px); width:calc(100% - 80px); height:1px; }
`;

function StepRow({ steps, accent, num }: { steps: any[], accent: string, num?: boolean }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(${steps.length}, 1fr)`, gap:'1.5rem', position:'relative' }}>
      {steps.map((step, i) => (
        <div key={i} className="step-card" style={{ textAlign:'center', position:'relative' }}>
          {/* connector line */}
          {i < steps.length - 1 && (
            <div className="connector" style={{ background:`${accent}30` }} />
          )}
          {/* number badge */}
          <div style={{
            width:'60px', height:'60px', borderRadius:'50%',
            background: accent, color:'#fff',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'1.35rem', fontWeight:700,
            margin:'0 auto 1.25rem', position:'relative', zIndex:2,
            boxShadow:`0 4px 20px ${accent}40`
          }}>{i + 1}</div>
          {/* icon */}
          <div className="step-icon" style={{
            width:'52px', height:'52px', borderRadius:'12px',
            background:`${accent}10`,
            display:'flex', alignItems:'center', justifyContent:'center',
            margin:'0 auto 1rem'
          }}>
            <step.icon size={24} color={accent} />
          </div>
          <h3 style={{ fontSize:'1rem', fontWeight:600, color: ag.text, marginBottom:'0.5rem' }}>{step.title}</h3>
          <p style={{ fontSize:'0.88rem', color: ag.mid, lineHeight:1.6 }}>{step.desc}</p>
        </div>
      ))}
    </div>
  );
}

export default function HowItWorks() {
  return (
    <>
      <Head>
        <title>How It Works — AquaGas Delivery</title>
        <meta name="description" content="Learn how AquaGas works — simple steps for customers, vendors, and riders to use our gas delivery platform." />
      </Head>
      <style>{styles}</style>

      <div className="ag-body" style={{ background: ag.cream, color: ag.text }}>

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section style={{
          background: ag.forestDk, position:'relative',
          overflow:'hidden', padding:'5rem 0 8rem'
        }}>
          <div style={{
            position:'absolute', top:'-120px', right:'-120px',
            width:'600px', height:'600px', borderRadius:'50%',
            border:`1px solid rgba(201,164,74,0.1)`, pointerEvents:'none'
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
            }}>Simple · Safe · Seamless</span>

            <h1 className="ag-display" style={{
              fontSize:'clamp(2.8rem, 7vw, 5rem)', fontWeight:600,
              color:'#fff', lineHeight:1.08, marginBottom:'1.5rem'
            }}>
              Gas Delivery,<br />
              <em style={{ color: ag.gold }}>Simplified</em>
            </h1>

            <p style={{
              color:'rgba(255,255,255,0.6)', fontSize:'1.1rem',
              maxWidth:'480px', margin:'0 auto 2.5rem', lineHeight:1.75
            }}>
              From order to doorstep in hours. Real-time tracking, verified vendors, and secure payments.
            </p>

            <a href="#customers" style={{
              display:'inline-flex', alignItems:'center', gap:'8px',
              background: ag.flame, color:'#fff',
              padding:'14px 28px', borderRadius:'8px',
              fontWeight:600, fontSize:'0.95rem', textDecoration:'none'
            }}>See How It Works <ArrowRight size={18} /></a>
          </div>
        </section>

        {/* ── QUICK CARDS ──────────────────────────────────────────── */}
        <section style={{ padding:'0 0 4rem' }}>
          <div className="container mx-auto px-6">
            <div style={{
              display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',
              gap:'1.5rem', marginTop:'-3.5rem'
            }}>
              {[
                { icon: Smartphone, title:'Order', desc:'Place your order via app or web in seconds', accent: ag.flame },
                { icon: Truck, title:'Track', desc:'Watch your delivery in real-time on the map', accent: ag.forest },
                { icon: CheckCircle, title:'Receive', desc:'Verified riders deliver safely to your door', accent: ag.gold },
              ].map((card, i) => (
                <div key={i} className="ag-card" style={{
                  background:'#fff', borderRadius:'14px', padding:'2rem',
                  textAlign:'center', border:`1px solid ${ag.border}`,
                  boxShadow:'0 4px 24px rgba(10,61,43,0.08)'
                }}>
                  <div style={{
                    width:'56px', height:'56px', borderRadius:'14px',
                    background:`${card.accent}12`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    margin:'0 auto 1rem'
                  }}>
                    <card.icon size={28} color={card.accent} />
                  </div>
                  <h3 style={{ fontWeight:600, color: ag.text, fontSize:'1.05rem', marginBottom:'0.5rem' }}>{card.title}</h3>
                  <p style={{ color: ag.mid, fontSize:'0.88rem', lineHeight:1.6 }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CUSTOMERS ────────────────────────────────────────────── */}
        <section id="customers" style={{ padding:'5rem 0', background:'#fff' }}>
          <div className="container mx-auto px-6">
            <div style={{ textAlign:'center', marginBottom:'3.5rem' }}>
              <span style={{
                display:'inline-block', padding:'5px 16px',
                background:`${ag.flame}12`, borderRadius:'100px',
                color: ag.flame, fontSize:'0.78rem', fontWeight:700,
                letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'1rem'
              }}>For Customers</span>
              <h2 className="ag-display" style={{
                fontSize:'clamp(2rem, 4vw, 2.8rem)', fontWeight:600, color: ag.text, marginBottom:'0.75rem'
              }}>Get Gas in <em style={{ color: ag.flame }}>4 Simple Steps</em></h2>
              <p style={{ color: ag.mid, fontSize:'1rem', maxWidth:'440px', margin:'0 auto' }}>
                No more waiting days for delivery. Order gas and track it live.
              </p>
            </div>

            <div style={{ maxWidth:'900px', margin:'0 auto' }}>
              <StepRow accent={ag.flame} steps={[
                { icon: Smartphone, title:'Download App', desc:'Get AquaGas and create your account' },
                { icon: ShoppingCart, title:'Place Order', desc:'Select gas type, size, and delivery address' },
                { icon: MapPin, title:'Track Live', desc:'Monitor your delivery in real-time' },
                { icon: CreditCard, title:'Pay & Receive', desc:'Pay securely and receive your gas' },
              ]} />
            </div>
          </div>
        </section>

        {/* ── VENDORS ──────────────────────────────────────────────── */}
        <section id="vendors" style={{ padding:'5rem 0', background: ag.cream }}>
          <div className="container mx-auto px-6">
            <div style={{ textAlign:'center', marginBottom:'3.5rem' }}>
              <span style={{
                display:'inline-block', padding:'5px 16px',
                background:`${ag.forest}12`, borderRadius:'100px',
                color: ag.forest, fontSize:'0.78rem', fontWeight:700,
                letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'1rem'
              }}>For Vendors</span>
              <h2 className="ag-display" style={{
                fontSize:'clamp(2rem, 4vw, 2.8rem)', fontWeight:600, color: ag.text, marginBottom:'0.75rem'
              }}>Grow Your <em style={{ color: ag.forest }}>Business</em></h2>
              <p style={{ color: ag.mid, fontSize:'1rem', maxWidth:'440px', margin:'0 auto' }}>
                Reach more customers and streamline operations with our platform.
              </p>
            </div>

            <div style={{ maxWidth:'900px', margin:'0 auto' }}>
              <StepRow accent={ag.forest} steps={[
                { icon: UserCheck, title:'Register', desc:'Sign up and complete vendor verification' },
                { icon: Package, title:'List Products', desc:'Add your gas cylinders, prices, and stock' },
                { icon: ShoppingCart, title:'Receive Orders', desc:'Get instant order notifications' },
                { icon: Truck, title:'Coordinate', desc:'Manage deliveries with riders' },
              ]} />
            </div>
          </div>
        </section>

        {/* ── RIDERS ───────────────────────────────────────────────── */}
        <section id="riders" style={{ padding:'5rem 0', background:'#fff' }}>
          <div className="container mx-auto px-6">
            <div style={{ textAlign:'center', marginBottom:'3.5rem' }}>
              <span style={{
                display:'inline-block', padding:'5px 16px',
                background:`${ag.gold}18`, borderRadius:'100px',
                color:'#7a5c10', fontSize:'0.78rem', fontWeight:700,
                letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'1rem'
              }}>For Riders</span>
              <h2 className="ag-display" style={{
                fontSize:'clamp(2rem, 4vw, 2.8rem)', fontWeight:600, color: ag.text, marginBottom:'0.75rem'
              }}>Deliver & <em style={{ color:'#9a6e15' }}>Earn</em></h2>
              <p style={{ color: ag.mid, fontSize:'1rem', maxWidth:'440px', margin:'0 auto' }}>
                Join our network and earn flexibly delivering gas across Nairobi.
              </p>
            </div>

            <div style={{ maxWidth:'900px', margin:'0 auto' }}>
              <StepRow accent={ag.gold} steps={[
                { icon: UserCheck, title:'Join', desc:'Register and complete rider verification' },
                { icon: CheckCircle, title:'Accept Jobs', desc:'Choose deliveries that suit your schedule' },
                { icon: MapPin, title:'Navigate', desc:'Use GPS navigation to deliver efficiently' },
                { icon: CreditCard, title:'Get Paid', desc:'Confirm delivery and receive payment' },
              ]} />
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
            position:'absolute', top:'50%', right:'-80px', transform:'translateY(-50%)',
            width:'360px', height:'360px', borderRadius:'50%',
            border:`1px solid rgba(201,164,74,0.12)`, pointerEvents:'none'
          }}/>
          <div className="container mx-auto px-6" style={{ textAlign:'center', position:'relative' }}>
            <h2 className="ag-display" style={{
              fontSize:'clamp(2rem, 4vw, 3rem)', fontWeight:600, color:'#fff', marginBottom:'1rem'
            }}>
              Ready to Get<br /><em style={{ color: ag.gold }}>Started?</em>
            </h2>
            <p style={{ color:'rgba(255,255,255,0.6)', marginBottom:'2.5rem', fontSize:'1.05rem' }}>
              Join thousands using AquaGas for fast, reliable gas delivery.
            </p>
            <div style={{ display:'flex', justifyContent:'center', gap:'1rem', flexWrap:'wrap' }}>
              <Link href="/shop" style={{
                background: ag.flame, color:'#fff',
                padding:'14px 32px', borderRadius:'8px',
                fontWeight:600, textDecoration:'none', fontSize:'0.95rem'
              }}>Order Gas Now</Link>
              <Link href="/partners" style={{
                padding:'14px 32px', borderRadius:'8px',
                border:'1px solid rgba(255,255,255,0.25)',
                color:'#fff', fontWeight:500, textDecoration:'none', fontSize:'0.95rem'
              }}>Become a Partner</Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
