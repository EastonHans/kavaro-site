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
  { num: '01', title: 'UI / UX Design', desc: 'Intuitive, user-centred interfaces crafted from research to pixel-perfect prototypes. We design experiences that convert visitors into loyal clients.', features: ['User Research & Personas', 'Wireframing & Prototyping', 'Figma Design System', 'Usability Testing', 'Handoff to Developers'], price: 'From KES 25,000', usd: 'From $200', tag: 'Design' },
  { num: '02', title: 'Graphic Design', desc: 'Visual identities, brand systems, and marketing assets that tell your story with elegance and clarity across every touchpoint.', features: ['Logo & Brand Identity', 'Business Cards & Stationery', 'Social Media Graphics', 'Pitch Decks & Presentations', 'Print & Digital Assets'], price: 'From KES 15,000', usd: 'From $120', tag: 'Design' },
  { num: '03', title: 'Web Development', desc: 'Fast, responsive, and scalable websites and web applications engineered with modern technologies for performance and growth.', features: ['React / Next.js Development', 'Custom CMS Integration', 'E-commerce Solutions', 'API & Backend Development', 'SEO & Performance Optimization'], price: 'From KES 50,000', usd: 'From $380', tag: 'Development' },
  { num: '04', title: 'Brand Strategy', desc: 'Strategic brand positioning and messaging frameworks that differentiate your business and resonate deeply with your target audience.', features: ['Brand Audit & Research', 'Positioning & Messaging', 'Brand Voice & Guidelines', 'Competitor Analysis', 'Go-to-Market Strategy'], price: 'From KES 30,000', usd: 'From $230', tag: 'Strategy' },
  { num: '05', title: 'AI Solutions', desc: 'Custom AI-powered features for your business — chatbots, content generation, smart search, automation and AI integrations built into your products.', features: ['AI Chatbots & Assistants', 'Content & Copy Generation', 'Workflow Automation', 'LLM & API Integration', 'Custom AI Tooling'], price: 'From KES 40,000', usd: 'From $300', tag: 'AI' },
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
        <div className="section-label">What We Offer</div>
        <h1>Services That <em>Drive Results</em></h1>
        <p>Every service is delivered with strategic intent, precise execution, and a commitment to measurable outcomes.</p>
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
