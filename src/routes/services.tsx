import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import PaymentModal from '@/components/PaymentModal'
import VerificationModal from '@/components/VerificationModal'
import styles from './Services.module.css'

export const Route = createFileRoute('/services')({
  component: Services,
  head: () => ({
    meta: [
      { title: 'Services & Pricing — Kavaro Agency' },
      { name: 'description', content: 'UI/UX, graphic design, web development and brand strategy. Transparent pricing in KES and USD.' },
    ],
  }),
})

const services = [
  { num: '01', title: 'UI / UX Design', desc: 'Clean, user-friendly interfaces designed in Figma — built around real people and how they actually use your product. This is what I trained in and where I feel most at home.', features: ['User flows & wireframes', 'Figma mockups & prototypes', 'Mobile-first responsive design', 'Simple design system', 'Developer-ready handoff'], price: 'From KES 8,000', usd: 'From $60', tag: 'Design' },
  { num: '02', title: 'Graphic Design', desc: 'Logos, social media graphics, simple brand kits and presentation slides — the visual basics every small business needs to look credible online.', features: ['Logo design', 'Social media post templates', 'Business cards & flyers', 'Pitch decks & slides', 'Basic brand kit'], price: 'From KES 3,500', usd: 'From $25', tag: 'Design' },
  { num: '03', title: 'Web Development', desc: 'Modern websites built with React and Node.js — landing pages, multi-page business sites, and small web apps. Honest about my level: I write clean front-end code daily and I am actively learning back-end. For complex back-end systems I will tell you upfront.', features: ['React + Node.js websites', 'Responsive landing pages', 'Contact forms & WhatsApp links', 'Simple CMS or static content', 'Currently learning: APIs, databases & CRUD'], price: 'From KES 12,000', usd: 'From $90', tag: 'Development' },
  { num: '04', title: 'Brand Basics', desc: 'A clear name, message and visual direction for new businesses still figuring out who they are. No big strategy decks — just the essentials, done well.', features: ['Brand name & tagline help', 'Color palette & font picks', 'One-page brand summary', 'Tone of voice basics', 'Social bio & profile setup'], price: 'From KES 5,000', usd: 'From $40', tag: 'Strategy' },
  { num: '05', title: 'AI-Enhanced Features', desc: 'Small AI touches added to your website — a chat assistant, a smart contact form, auto-generated copy. Practical AI that helps your customers, not buzzword AI.', features: ['Simple AI chat widget', 'AI-assisted content', 'Smart FAQ / search', 'OpenAI API integration', 'Honest scope — small features only'], price: 'From KES 10,000', usd: 'From $75', tag: 'AI' },
]

function Services() {
  const [modal, setModal] = useState({ open: false, service: '', price: '' })
  const [verifyModal, setVerifyModal] = useState({ open: false, service: '', price: '' })

  function handlePayClick(serviceName: string, price: string) {
    setVerifyModal({ open: true, service: serviceName, price })
  }
  function handleVerified() {
    setModal({ open: true, service: verifyModal.service, price: verifyModal.price })
    setVerifyModal({ open: false, service: '', price: '' })
  }

  return (
    <main>
      <div className="page-hero">
        <div className="section-label">What I Can Build For You</div>
        <h1>Honest Services. <em>Real Skills.</em></h1>
        <p>I'm a UI/UX designer learning full-stack development at Moringa School. These are the things I can genuinely build for you today — at fair, beginner-studio prices. No premium markup, no overselling.</p>
      </div>

      <section className={styles.section}>
        <div className={styles.grid}>
          {services.map(s => (
            <div className={styles.card} key={s.num}>
              <div className={styles.cardTop}>
                <div className={styles.num}>{s.num}</div>
                <span className={styles.tag}>{s.tag}</span>
              </div>
              <h2 className={styles.title}>{s.title}</h2>
              <p className={styles.desc}>{s.desc}</p>
              <ul className={styles.features}>
                {s.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              <div className={styles.cardBottom}>
                <div className={styles.pricing}>
                  <span className={styles.price}>{s.price}</span>
                  <span className={styles.priceSub}>{s.usd}</span>
                </div>
                <div className={styles.cardBtns}>
                  <button className="btn-primary"
                    onClick={() => handlePayClick(s.title, s.price.replace(/[^0-9]/g, ''))}>
                    Pay Now
                  </button>
                  <Link to="/contact" className="btn-navy">Get Quote</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.customSection}>
        <h2>Need Something Custom?</h2>
        <p>Every business is unique. If your requirements don't fit neatly into our standard packages, let's talk. We build tailored solutions for specific challenges.</p>
        <Link to="/contact" className="btn-primary">Discuss Your Project →</Link>
      </section>

      <VerificationModal isOpen={verifyModal.open}
        onClose={() => setVerifyModal({ open: false, service: '', price: '' })}
        onVerified={handleVerified} service={verifyModal.service} />
      <PaymentModal isOpen={modal.open}
        onClose={() => setModal({ open: false, service: '', price: '' })}
        service={modal.service} price={modal.price} />
    </main>
  )
}
