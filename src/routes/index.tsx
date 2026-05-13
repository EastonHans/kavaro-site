import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import PaymentModal from '@/components/PaymentModal'
import VerificationModal from '@/components/VerificationModal'
import founderImg from '@/assets/founder.png'
import styles from './Home.module.css'

export const Route = createFileRoute('/')({
  component: Home,
  head: () => ({
    meta: [
      { title: 'Kavaro Agency — A Modern Digital Studio' },
      { name: 'description', content: 'A modern remote digital studio building websites and digital experiences for growing businesses — UI/UX, web development and AI-ready design.' },
      { property: 'og:title', content: 'Kavaro Agency — A Modern Digital Studio' },
      { property: 'og:description', content: 'A modern remote digital studio building websites and digital experiences for growing businesses.' },
    ],
  }),
})

const stats = [
  { num: 'UI/UX', label: 'Product Design Grad' },
  { num: 'SE', label: 'Student @ Moringa' },
  { num: '100%', label: 'Remote · Worldwide' },
  { num: '12h', label: 'Reply Time' },
]
const services = [
  { num: '01', title: 'Web Development', desc: 'Modern, AI-ready websites and platforms — landing pages, booking flows and dashboards built with care.', tag: 'React · Node.js · TypeScript' },
  { num: '02', title: 'AI Solutions', desc: 'Smart assistants, automation and AI features integrated into your product where they actually help.', tag: 'LLMs · Automation · Integration' },
  { num: '03', title: 'UI / UX Design', desc: 'Interfaces designed by a trained product designer — clear flows, real research, no fluff.', tag: 'Figma · Prototyping · Research' },
  { num: '04', title: 'Graphic Design', desc: 'Visual identities and marketing assets that make your brand feel intentional and modern.', tag: 'Branding · Print · Social' },
]
const techStack = ['React', 'Node.js', 'TypeScript', 'Next.js', 'Tailwind', 'Supabase', 'OpenAI', 'Stripe', 'M-Pesa', 'AWS']
const industries = [
  { icon: '🏥', name: 'Healthcare & Clinics', desc: 'Patient portals, appointment booking, results delivery.' },
  { icon: '💊', name: 'Pharmacies & Labs', desc: 'Online catalogues, prescription requests, deliveries.' },
  { icon: '🎓', name: 'Schools & Training', desc: 'Admissions, fee portals, parent communication.' },
  { icon: '🛍️', name: 'Local Businesses', desc: 'Storefronts, online ordering, customer engagement.' },
  { icon: '💼', name: 'Service Providers', desc: 'Bookings, quotes, client dashboards and CRM.' },
  { icon: '🌍', name: 'International Brands', desc: 'Marketing sites, SaaS products, AI integrations.' },
]
const skills = [
  'UI / UX Product Design', 'Figma & Prototyping', 'User Research', 'Design Systems',
  'React & TypeScript', 'Node.js', 'Tailwind CSS', 'AI / LLM Integration', 'Responsive Web', 'Accessibility',
]
const whyUs = [
  { title: 'Designer-First', desc: 'Every project starts with research and design thinking — not a template.' },
  { title: 'Honest & Hands-On', desc: 'You work directly with the founder. No middlemen, no account managers.' },
  { title: 'Remote-Native', desc: '100% online studio. We work async with clients across timezones.' },
  { title: 'AI-Ready', desc: 'Every site we build can integrate AI — chat, automation, smart search.' },
]
const projects = [
  {
    title: 'Healthcare Booking — Concept',
    type: 'Concept Website',
    problem: 'Local clinics in Nairobi rely on phone calls for appointments — patients wait, lines drop, no-shows are high.',
    solution: 'A clean booking site with doctor profiles, time-slot picker, SMS reminders and a simple admin view.',
    tools: ['Figma', 'React', 'Tailwind', 'Supabase'],
    outcome: 'Concept prototype reduces booking friction to 3 taps. Designed mobile-first for low-bandwidth use.',
    accent: 'linear-gradient(135deg, #1e3a5f, #0a1929)',
  },
  {
    title: 'Pharmacy Brand Refresh',
    type: 'Brand Redesign',
    problem: 'A neighbourhood pharmacy had no consistent visual identity across signage, WhatsApp and packaging.',
    solution: 'New logo system, colour palette and a single-page website with WhatsApp ordering and product catalogue.',
    tools: ['Figma', 'Illustrator', 'Next.js'],
    outcome: 'Cohesive brand kit + landing page concept ready for handoff. Designed for under-1s mobile load.',
    accent: 'linear-gradient(135deg, #c9a961, #8a6f33)',
  },
  {
    title: 'Student Onboarding — UX Case Study',
    type: 'UX Case Study',
    problem: 'New students at a training school dropped off during signup because the flow had 14 fields on one screen.',
    solution: 'Restructured into a 4-step progressive flow with clear progress, social login and saved drafts.',
    tools: ['Figma', 'User Interviews', 'Prototyping'],
    outcome: 'Prototype tested with 6 users — completion time dropped from 8m to 2m in unmoderated tests.',
    accent: 'linear-gradient(135deg, #2d5f4a, #0f2a1f)',
  },
  {
    title: 'AI Customer Assistant — Demo',
    type: 'React + AI Project',
    problem: 'Service businesses repeat the same 20 questions all day — pricing, hours, location, booking.',
    solution: 'Embeddable chat widget powered by an LLM, trained on a business FAQ, with handoff to WhatsApp.',
    tools: ['React', 'OpenAI API', 'Node.js', 'TypeScript'],
    outcome: 'Working demo answers 80% of common questions instantly. Deployable to any site in minutes.',
    accent: 'linear-gradient(135deg, #4a2d5f, #1a0f2a)',
  },
]
const steps = [
  { num: '01', title: 'Discovery Call', desc: 'Free 30-min call to understand your goals and constraints.' },
  { num: '02', title: 'Proposal', desc: 'Clear scope, timeline and pricing — sent within 48 hours.' },
  { num: '03', title: 'Deposit Payment', desc: '50% upfront via M-Pesa, bank transfer or Stripe to start.' },
  { num: '04', title: 'Design & Build', desc: 'Iterative design and development with weekly check-ins.' },
  { num: '05', title: 'Revisions', desc: 'Two rounds of revisions included on every package.' },
  { num: '06', title: 'Final Delivery', desc: 'Launch, training and a clean handoff with all assets.' },
  { num: '07', title: 'Support', desc: '30 days of post-launch support included on every project.' },
]

const CALENDLY_URL = 'https://calendly.com/kavaro/30min'

function Home() {
  const [modal, setModal] = useState({ open: false, service: '' })
  const [verifyModal, setVerifyModal] = useState({ open: false, service: '' })
  const [hoveredSvc, setHoveredSvc] = useState<number | null>(null)

  function handlePayClick(serviceName: string) {
    setVerifyModal({ open: true, service: serviceName })
  }
  function handleVerified() {
    setModal({ open: true, service: verifyModal.service })
    setVerifyModal({ open: false, service: '' })
  }

  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.badge}><span className={styles.dot}/><p>Remote Digital Studio · Nairobi</p></div>
          <h1>A Modern Digital Studio for <em>Growing</em> Businesses</h1>
          <p>Kavaro is a small remote studio building websites and digital experiences for businesses that are ready to grow online. Designed by a trained product designer, built with modern tools.</p>
          <div className={styles.heroBtns}>
            <a href={CALENDLY_URL} target="_blank" rel="noreferrer" className="btn-primary">Book a Call</a>
            <Link to="/services" className="btn-secondary">Explore Services</Link>
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.statsGrid}>
            {stats.map(s => (
              <div className={styles.statCard} key={s.label}>
                <div className={styles.statNum}>{s.num}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.techStrip}>
        <span className={styles.techLabel}>Built with</span>
        <div className={styles.techList}>
          {techStack.map(t => <span key={t} className={styles.techItem}>{t}</span>)}
        </div>
      </div>

      <section className={styles.vmSec}>
        <div className={styles.vmImageWrap}>
          <img src={founderImg} alt="Founder of Kavaro Agency" className={styles.vmImage} loading="lazy" />
          <div className={styles.vmFounder}>
            <strong>Kavaro</strong>
            <span>Founder · Designer · Builder</span>
          </div>
        </div>
        <div className={styles.vmCards}>
          <div className="section-label">About Kavaro</div>
          <h2 className={styles.storyH}>A Studio Built on <em>Design</em> &amp; Curiosity</h2>
          <p className={styles.storyP}>I'm a UI/UX product design graduate currently studying software engineering at Moringa School. Kavaro started while watching my father navigate dialysis — chasing schedules, results and updates in person. Most local services had no digital presence. None.</p>
          <p className={styles.storyP}>So I started building. Kavaro is a remote studio focused on giving small and growing businesses the kind of digital experience usually reserved for bigger players — done with care, by someone learning and shipping in public.</p>
          <div className={styles.vmCard}>
            <h3>Our Vision</h3>
            <p>A world where every growing business — from a Nairobi clinic to a remote-first startup — has a digital experience that genuinely works for the people using it.</p>
          </div>
          <div className={styles.vmCard}>
            <h3>Our Mission</h3>
            <p>Design and build modern websites and digital tools that help growing businesses serve their customers better — combining product-design thinking with hands-on engineering.</p>
          </div>
        </div>
      </section>

      <section className={styles.industriesSec}>
        <div className="section-label">Who We Serve</div>
        <h2 className={styles.secH}>Built for Businesses That <em>Serve People</em></h2>
        <p className={styles.secSub}>Small and growing businesses — from local clinics to remote-first startups. If your customers need to find, book or buy from you, we can help.</p>
        <div className={styles.indGrid}>
          {industries.map(i => (
            <div className={styles.indCard} key={i.name}>
              <div className={styles.indIcon}>{i.icon}</div>
              <h4>{i.name}</h4>
              <p>{i.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className="section-label">What We Do</div>
        <h2 className={styles.secH}>Services for Growing Businesses</h2>
        <p className={styles.secSub}>Strategic thinking and hands-on craft — delivered as websites, AI tools and brand systems that move the needle.</p>
        <div className={styles.svcGrid}>
          {services.map((s, i) => (
            <div key={s.num} className={`${styles.svcCard} ${hoveredSvc === i ? styles.svcHovered : ''}`}
              onMouseEnter={() => setHoveredSvc(i)} onMouseLeave={() => setHoveredSvc(null)}>
              <div className={styles.svcNum}>{s.num}</div>
              <h3 className={styles.svcTitle}>{s.title}</h3>
              <p className={styles.svcDesc}>{s.desc}</p>
              <span className={styles.svcTag}>{s.tag}</span>
              <div className={styles.svcActions}>
                <button className="btn-primary" style={{ fontSize: 12, padding: '10px 18px' }}
                  onClick={() => handlePayClick(s.title)}>Pay Now</button>
                <Link to="/contact" className="btn-secondary" style={{ fontSize: 12, padding: '10px 18px' }}>Enquire</Link>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link to="/services" className="btn-navy">View All Services & Pricing →</Link>
        </div>
      </section>

      {/* SAMPLE / CONCEPT PROJECTS — replaces fake testimonials */}
      <section className={styles.projSec}>
        <div className="section-label">Sample Work</div>
        <h2 className={styles.secH}>Concept Projects &amp; Case Studies</h2>
        <p className={styles.secSub}>Kavaro is new — so instead of fake testimonials, here are real concept projects, brand redesigns and UX case studies we've built to demonstrate what we can do.</p>
        <div className={styles.projGrid}>
          {projects.map(p => (
            <article className={styles.projCard} key={p.title}>
              <div className={styles.projHero} style={{ background: p.accent }}>
                <span className={styles.projType}>{p.type}</span>
              </div>
              <div className={styles.projBody}>
                <h3 className={styles.projTitle}>{p.title}</h3>
                <div className={styles.projBlock}>
                  <span className={styles.projLabel}>Problem</span>
                  <p>{p.problem}</p>
                </div>
                <div className={styles.projBlock}>
                  <span className={styles.projLabel}>Solution</span>
                  <p>{p.solution}</p>
                </div>
                <div className={styles.projBlock}>
                  <span className={styles.projLabel}>Tools Used</span>
                  <div className={styles.projTools}>
                    {p.tools.map(t => <span key={t} className={styles.projTool}>{t}</span>)}
                  </div>
                </div>
                <div className={styles.projBlock}>
                  <span className={styles.projLabel}>Outcome</span>
                  <p>{p.outcome}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className={styles.projNote}>* These are concept and case-study projects designed to showcase Kavaro's approach. Real client work and testimonials will appear here as projects ship.</p>
      </section>

      {/* SKILLS — replaces "More Expertise Coming Soon" */}
      <section className={styles.skillsSec}>
        <div className={styles.skillsInner}>
          <div>
            <div className="section-label" style={{ color: 'var(--gold)' }}>Skills &amp; Background</div>
            <h2 className={styles.comingH}>Trained in Design,<br/><em>Building</em> in Code</h2>
            <p className={styles.comingDesc}>Graduated as a UI/UX product designer. Currently deep in software engineering at Moringa School. Kavaro is the studio where both come together — designed properly, built modern.</p>
            <div className={styles.ctags}>
              {skills.map(s => <div className={styles.ctag} key={s}>{s}</div>)}
            </div>
          </div>
          <div className={styles.notify}>
            <h3>Book a Free Discovery Call</h3>
            <p>Pick a 30-minute slot that works for you. We'll talk through your project, your goals and how Kavaro can help — no pressure, no hard sell.</p>
            <a href={CALENDLY_URL} target="_blank" rel="noreferrer" className={styles.calBtn}>📅 Schedule on Calendly →</a>
            <p style={{ marginTop: 16, fontSize: 12 }}>Or use the <Link to="/contact" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>contact form</Link> if you'd rather write first.</p>
          </div>
        </div>
      </section>

      <section className={styles.whySec}>
        <div className="section-label">Why Kavaro</div>
        <h2 className={styles.secH}>The Kavaro Difference</h2>
        <p className={styles.secSub}>A small remote studio focused on craft, honesty and the kind of attention bigger agencies can't give.</p>
        <div className={styles.whyGrid}>
          {whyUs.map(w => (
            <div className={styles.whyCard} key={w.title}>
              <h4>{w.title}</h4>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className="section-label">How We Work</div>
        <h2 className={styles.secH}>Our Process — A System You Can Trust</h2>
        <p className={styles.secSub}>Businesses trust systems. Here's exactly what working with Kavaro looks like, from first call to ongoing support.</p>
        <div className={styles.procSteps7}>
          {steps.map(s => (
            <div className={styles.step} key={s.num}>
              <div className={styles.stepN}>{s.num}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.ctaSec}>
        <h2>Ready to Build Something <em>Real?</em></h2>
        <p>Whether you're a clinic in Nairobi or a startup anywhere in the world — let's talk. 100% remote, 100% honest.</p>
        <div className={styles.ctaBtns}>
          <a href={CALENDLY_URL} target="_blank" rel="noreferrer" className="btn-primary">Book a Call</a>
          <Link to="/contact" className="btn-secondary">Send a Message</Link>
        </div>
      </section>

      <VerificationModal isOpen={verifyModal.open}
        onClose={() => setVerifyModal({ open: false, service: '' })}
        onVerified={handleVerified} service={verifyModal.service} />
      <PaymentModal isOpen={modal.open} onClose={() => setModal({ open: false, service: '' })} service={modal.service} />
    </main>
  )
}
