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
      { title: 'Kavaro Agency — AI-Native Websites & Digital Systems' },
      { name: 'description', content: 'Nairobi-based digital studio building AI-native websites, booking platforms and digital systems for healthcare, services and modern brands worldwide.' },
      { property: 'og:title', content: 'Kavaro Agency — AI-Native Websites & Digital Systems' },
      { property: 'og:description', content: 'We build websites and digital tools for businesses where being offline isn\'t an option — from Nairobi to anywhere.' },
    ],
  }),
})

const stats = [
  { num: '50+', label: 'Projects Shipped' },
  { num: '100%', label: 'AI-Ready Builds' },
  { num: '12h', label: 'Reply Time' },
  { num: '4', label: 'Continents Served' },
]
const services = [
  { num: '01', title: 'Web Development', desc: 'Fast, AI-ready websites and platforms — booking systems, portals and dashboards built to last.', tag: 'React · Node.js · TypeScript' },
  { num: '02', title: 'AI Solutions', desc: 'Smart assistants, automation and AI features baked into your product from day one.', tag: 'LLMs · Automation · Integration' },
  { num: '03', title: 'UI / UX Design', desc: 'Interfaces that turn first-time visitors into long-term clients — designed with intent.', tag: 'Figma · Prototyping · Research' },
  { num: '04', title: 'Graphic Design', desc: 'Visual identities and marketing assets that make your brand impossible to ignore.', tag: 'Branding · Print · Social' },
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
const upcoming = ['Digital Marketing','Content Strategy','Photography & Video','SEO & Analytics','Copywriting','Motion Design']
const whyUs = [
  { title: 'AI-Native', desc: 'Every site we ship can include an AI assistant — not bolted on, designed in.' },
  { title: 'Global Standards', desc: 'Nairobi-based talent delivering work that competes with London, Berlin or NYC.' },
  { title: 'Fast Replies', desc: 'We respond within 12 hours. Always. Across timezones.' },
  { title: 'Outcome-Driven', desc: 'We measure success by your bookings, conversions and revenue — not pixels.' },
]
const steps = [
  { num: '01', title: 'Discovery', desc: 'We learn your business, users, and competitive landscape.' },
  { num: '02', title: 'Strategy', desc: 'A clear creative direction and project roadmap.' },
  { num: '03', title: 'Design & Build', desc: 'Iterative creation with regular client check-ins.' },
  { num: '04', title: 'Launch & Support', desc: 'Smooth handoff, training, and ongoing support.' },
]
const testimonials = [
  { quote: 'Kavaro shipped our booking site in two weeks. Our phone stopped ringing off the hook — patients book online now.', name: 'Clinic Director', company: 'Nairobi · Healthcare' },
  { quote: 'Beautiful work, fair pricing, and they actually reply. Hard to find that combination anywhere.', name: 'Founder', company: 'London · SaaS' },
  { quote: 'The AI assistant they built handles 70% of customer questions automatically. Game-changer for us.', name: 'CEO', company: 'Lagos · E-commerce' },
]

function Home() {
  const [modal, setModal] = useState({ open: false, service: '' })
  const [verifyModal, setVerifyModal] = useState({ open: false, service: '' })
  const [notifyForm, setNotifyForm] = useState({ name: '', email: '' })
  const [notifySent, setNotifySent] = useState(false)
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
          <div className={styles.badge}><span className={styles.dot}/><p>AI-Native Digital Studio · Nairobi</p></div>
          <h1>Digital Systems for Businesses Where Being <em>Offline</em> Isn't an Option</h1>
          <p>We design, build and ship AI-native websites, booking platforms and digital tools — for healthcare, local services and modern brands. From Nairobi to anywhere.</p>
          <div className={styles.heroBtns}>
            <Link to="/services" className="btn-primary">Explore Services</Link>
            <Link to="/contact" className="btn-secondary">Start a Project</Link>
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
            <span>Founder &amp; Creative Director</span>
          </div>
        </div>
        <div className={styles.vmCards}>
          <div className="section-label">Why Kavaro Exists</div>
          <h2 className={styles.storyH}>The Origin of a <em>Thesis</em></h2>
          <p className={styles.storyP}>Kavaro began with a simple observation. While helping my father navigate dialysis appointments — chasing schedules, results and updates in person — I realised most essential service providers had no digital front door. No website. No portal. Nothing.</p>
          <p className={styles.storyP}>That gap isn't unique to one hospital. It's everywhere local businesses operate. Kavaro exists to close it — and to bring the same calibre of digital products to ambitious brands worldwide.</p>
          <div className={styles.vmCard}>
            <h3>Our Vision</h3>
            <p>A world where every business — from a Nairobi clinic to a London startup — has a digital presence that actually works for its people.</p>
          </div>
          <div className={styles.vmCard}>
            <h3>Our Mission</h3>
            <p>Build AI-native websites and digital systems that help businesses serve their customers better — combining African creativity with world-class engineering.</p>
          </div>
        </div>
      </section>

      <section className={styles.industriesSec}>
        <div className="section-label">Who We Serve</div>
        <h2 className={styles.secH}>Built for Businesses That <em>Serve People</em></h2>
        <p className={styles.secSub}>From local clinics to international SaaS — if your customers need to find, book or buy from you, we build the system that makes it happen.</p>
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
        <h2 className={styles.secH}>Services Built for Modern Businesses</h2>
        <p className={styles.secSub}>Strategic thinking and precise execution — delivered as websites, AI tools and brand systems that drive real results.</p>
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

      <section className={styles.audienceSec}>
        <div className={styles.audienceCol}>
          <div className="section-label" style={{ color: 'var(--gold)' }}>For Local Businesses</div>
          <h3>Healthcare, Services &amp; Local Brands</h3>
          <p>Affordable KES packages. M-Pesa payments. Get your business online in as little as two weeks — with the same quality our international clients pay USD for.</p>
          <ul>
            <li>Pricing in Kenyan Shillings</li>
            <li>M-Pesa &amp; bank transfer accepted</li>
            <li>In-person consultation in Nairobi</li>
            <li>WhatsApp support during business hours</li>
          </ul>
          <Link to="/services" className="btn-primary">View Local Pricing</Link>
        </div>
        <div className={`${styles.audienceCol} ${styles.audienceColAlt}`}>
          <div className="section-label" style={{ color: 'var(--gold)' }}>For International Clients</div>
          <h3>Startups, SaaS &amp; Global Brands</h3>
          <p>Nairobi-based talent, world-class delivery. Strong timezone overlap with EU and Middle East, full async workflow with the US. World-class engineering at sensible rates.</p>
          <ul>
            <li>Pricing in USD, invoiced via Stripe</li>
            <li>Async-friendly with timezone overlap</li>
            <li>12-hour reply guarantee</li>
            <li>NDA &amp; contract on request</li>
          </ul>
          <Link to="/contact" className="btn-secondary">Book a Call</Link>
        </div>
      </section>

      <section className={styles.coming}>
        <div className={styles.comingInner}>
          <div>
            <div className="section-label" style={{ color: 'var(--gold)' }}>Growing With You</div>
            <h2 className={styles.comingH}>More Expertise <br/><em>Coming Soon</em></h2>
            <p className={styles.comingDesc}>We're expanding Kavaro into a full-service agency. New disciplines are in the pipeline — join our network and be the first to know.</p>
            <div className={styles.ctags}>
              {upcoming.map(u => <div className={styles.ctag} key={u}>{u}</div>)}
            </div>
          </div>
          <div className={styles.notify}>
            <h3>Stay in the Loop</h3>
            <p>Leave your email and we'll notify you the moment we expand our service offering.</p>
            {notifySent ? (
              <div className="alert-success">✓ You're on the list. We'll be in touch!</div>
            ) : (
              <div className={styles.nform}>
                <input type="text" placeholder="Your name" value={notifyForm.name}
                  onChange={e => setNotifyForm(f => ({ ...f, name: e.target.value }))} />
                <input type="email" placeholder="Email address" value={notifyForm.email}
                  onChange={e => setNotifyForm(f => ({ ...f, email: e.target.value }))} />
                <button onClick={() => { if (notifyForm.name && notifyForm.email) setNotifySent(true) }}>Notify Me</button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className={styles.whySec}>
        <div className="section-label">Why Kavaro</div>
        <h2 className={styles.secH}>The Kavaro Difference</h2>
        <p className={styles.secSub}>We're not a template shop. Every engagement is strategic, bespoke, and built to last.</p>
        <div className={styles.whyGrid}>
          {whyUs.map(w => (
            <div className={styles.whyCard} key={w.title}>
              <h4>{w.title}</h4>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.testSec}>
        <div className="section-label">What Clients Say</div>
        <h2 className={styles.secH}>Real Words, Real Results</h2>
        <div className={styles.testGrid}>
          {testimonials.map(t => (
            <div className={styles.testCard} key={t.name + t.company}>
              <div className={styles.testQuote}>&ldquo;</div>
              <p className={styles.testText}>{t.quote}</p>
              <div className={styles.testMeta}>
                <strong>{t.name}</strong>
                <span>{t.company}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className="section-label">How We Work</div>
        <h2 className={styles.secH}>Our Process</h2>
        <p className={styles.secSub}>A clear, collaborative process that keeps you informed and in control.</p>
        <div className={styles.procSteps}>
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
        <h2>Is Your Business Still <em>Offline?</em></h2>
        <p>Whether you run a clinic in Nairobi or a startup in New York — let's talk about getting your business online, properly.</p>
        <div className={styles.ctaBtns}>
          <Link to="/contact" className="btn-primary">Start a Project</Link>
          <Link to="/services" className="btn-secondary">View Services</Link>
        </div>
      </section>

      <VerificationModal isOpen={verifyModal.open}
        onClose={() => setVerifyModal({ open: false, service: '' })}
        onVerified={handleVerified} service={verifyModal.service} />
      <PaymentModal isOpen={modal.open} onClose={() => setModal({ open: false, service: '' })} service={modal.service} />
    </main>
  )
}
