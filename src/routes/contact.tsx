import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { contactAPI } from '@/lib/api'
import styles from './Contact.module.css'

export const Route = createFileRoute('/contact')({
  component: Contact,
  head: () => ({
    meta: [
      { title: 'Contact — Kavaro Agency' },
      { name: 'description', content: 'Tell us about your project and we will get back within 24 hours.' },
    ],
  }),
})

const services = ['UI / UX Design', 'Graphic Design', 'Web Development', 'AI Solutions', 'Brand Identity', 'Digital Marketing', 'Other']
const budgets = ['Under KES 20,000', 'KES 20,000 – 50,000', 'KES 50,000 – 100,000', 'KES 100,000+', "Let's discuss"]

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', budget: '', message: '' })
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<any>) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setStatus(null)
    try {
      const res: any = await contactAPI.send(form)
      setStatus({ type: 'success', msg: res.data.message })
      setForm({ name: '', email: '', phone: '', service: '', budget: '', message: '' })
    } catch (err: any) {
      setStatus({ type: 'error', msg: err?.response?.data?.message || err?.message || 'Failed to send. Please try again.' })
    } finally { setLoading(false) }
  }

  return (
    <main>
      <div className="page-hero">
        <div className="section-label">Get in Touch</div>
        <h1>Let's Build Something <em>Together</em></h1>
        <p>Kavaro is a 100% remote digital studio. Book a free discovery call or send us a message — we reply within 24 hours.</p>
        <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://calendly.com/kavaro/30min" target="_blank" rel="noreferrer" className="btn-primary">📅 Book a Free 30-min Call</a>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.formSide}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.row}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" value={form.name} onChange={set('name')} placeholder="Jane Doe" required />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" value={form.email} onChange={set('email')} placeholder="jane@company.com" required />
                </div>
              </div>
              <div className={styles.row}>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+254 7XX XXX XXX" />
                </div>
                <div className="form-group">
                  <label>Service Interested In</label>
                  <select value={form.service} onChange={set('service')}>
                    <option value="">Select a service...</option>
                    {services.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Budget Range</label>
                <select value={form.budget} onChange={set('budget')}>
                  <option value="">Select your budget...</option>
                  {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Tell Us About Your Project *</label>
                <textarea value={form.message} onChange={set('message')}
                  placeholder="Describe what you need, your goals, timeline, and any other relevant details..." required />
              </div>
              {status && (
                <div className={status.type === 'success' ? 'alert-success' : 'alert-error'}>{status.msg}</div>
              )}
              <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '15px 40px' }}>
                {loading ? <><span className="spinner" /> Sending...</> : 'Send Message →'}
              </button>
            </form>
          </div>

          <div className={styles.infoSide}>
            <div className={styles.infoCard}>
              <h3>Direct Contact</h3>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>✉</div>
                <div>
                  <p className={styles.contactLabel}>Email</p>
                  <a href="mailto:websitekavaro@gmail.com">websitekavaro@gmail.com</a>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>💬</div>
                <div>
                  <p className={styles.contactLabel}>WhatsApp</p>
                  <a href={`https://wa.me/254791610525?text=${encodeURIComponent("Hi Kavaro! I'd like to chat about a project.")}`} target="_blank" rel="noreferrer" onClick={(e) => { e.preventDefault(); window.open(`https://wa.me/254791610525?text=${encodeURIComponent("Hi Kavaro! I'd like to chat about a project.")}`, '_blank', 'noopener,noreferrer') }}>+254 791 610 525</a>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>🌍</div>
                <div>
                  <p className={styles.contactLabel}>Location</p>
                  <p>Remote · Based in Nairobi, Kenya</p>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>⏱</div>
                <div>
                  <p className={styles.contactLabel}>Response Time</p>
                  <p>Within 24 hours</p>
                </div>
              </div>
            </div>

            <div className={styles.infoCard}>
              <h3>Prefer to Talk?</h3>
              <p style={{ fontSize: 14, color: 'var(--grey-mid)', lineHeight: 1.7, marginBottom: 16 }}>Skip the form — book a free 30-minute discovery call directly on our calendar.</p>
              <a href="https://calendly.com/kavaro/30min" target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'inline-block' }}>📅 Open Calendly</a>
            </div>

            <div className={styles.infoCard}>
              <h3>What Happens Next?</h3>
              <div className={styles.nextStep}><span>01</span><p>We review your inquiry within 24 hours</p></div>
              <div className={styles.nextStep}><span>02</span><p>Schedule a free 30-min discovery call</p></div>
              <div className={styles.nextStep}><span>03</span><p>Receive a custom proposal & timeline</p></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
