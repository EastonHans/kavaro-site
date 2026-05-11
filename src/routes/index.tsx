import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import PaymentModal from '@/components/PaymentModal'
import VerificationModal from '@/components/VerificationModal'
import styles from './Home.module.css'

export const Route = createFileRoute('/')({
  component: Home,
  head: () => ({
    meta: [
      { title: 'Kavaro Agency — Design & Development in Nairobi' },
      { name: 'description', content: 'Professional UI/UX, graphic design and web development for businesses that mean business.' },
    ],
  }),
})

const stats = [
  { num: '120+', label: 'Projects Delivered' },
  { num: '98%', label: 'Client Satisfaction' },
  { num: '5+', label: 'Years Experience' },
  { num: '40+', label: 'Global Clients' },
]
const services = [
  { num: '01', title: 'UI / UX Design', desc: 'Intuitive interfaces crafted with user psychology at the core.', tag: 'Figma · Prototyping · Research' },
  { num: '02', title: 'Graphic Design', desc: 'Visual identities and marketing assets that tell your story.', tag: 'Branding · Print · Social' },
  { num: '03', title: 'Web Development', desc: 'Fast, responsive, scalable websites engineered for growth.', tag: 'React · Node.js · CMS' },
  { num: '04', title: 'AI Solutions', desc: 'Smart chatbots, automation and AI features built into your products.', tag: 'LLMs · Automation · Integration' },
]
const marqueeItems = ['UI/UX Design','Web Development','Graphic Design','Brand Strategy','Digital Solutions']
const upcoming = ['Digital Marketing','Content Strategy','Photography & Video','SEO & Analytics','Copywriting','Motion Design']
const whyUs = [
  { title: 'Strategy First', desc: 'We understand your business before designing a single pixel.' },
  { title: 'On-Time Delivery', desc: 'Structured sprints with full client transparency.' },
  { title: 'Dedicated Team', desc: 'A focused team assigned to your project throughout.' },
  { title: 'Results-Driven', desc: 'We measure success by metrics that matter to your bottom line.' },
]
const steps = [
  { num: '01', title: 'Discovery', desc: 'We learn your business, goals, and competitive landscape.' },
  { num: '02', title: 'Strategy', desc: 'A clear creative direction and project roadmap.' },
  { num: '03', title: 'Design & Build', desc: 'Iterative creation with regular client check-ins.' },
  { num: '04', title: 'Launch & Support', desc: 'Smooth handoff, training, and ongoing support.' },
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
          <div className={styles.badge}><span className={styles.dot}/><p>Professional Creative Agency</p></div>
          <h1>We Build Brands That <em>Command</em> Attention</h1>
          <p>From pixel-perfect interfaces to scalable web systems — Kavaro Agency delivers strategic design and development solutions for businesses that mean business.</p>
          <div className={styles.heroBtns}>
            <Link to="/services" className="btn-primary">Explore Services</Link>
            <Link to="/contact" className="btn-secondary">Get a Free Quote</Link>
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

      <div className={styles.marquee}>
        <div className={styles.mtrack}>
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i}>{item}&nbsp;&nbsp;&#9632;&nbsp;&nbsp;</span>
          ))}
        </div>
      </div>

      <section className={styles.section}>
        <div className="section-label">What We Do</div>
        <h2 className={styles.secH}>Services Built for Modern Businesses</h2>
        <p className={styles.secSub}>We combine strategic thinking with precise execution to deliver creative solutions that drive real results.</p>
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
        <h2 className={styles.secH}>The Agency Difference</h2>
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
        <h2>Ready to Build Something <em>Great?</em></h2>
        <p>Let's talk about your project. No obligation, no jargon — just a straight conversation.</p>
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
