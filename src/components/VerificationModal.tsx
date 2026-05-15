import { useState } from 'react'
import styles from './VerificationModal.module.css'

interface Props {
  isOpen: boolean
  onClose: () => void
  onVerified: (data: { ticket: string | null; idName: string; idNumber: string }) => void
  service: string
}

// Simple, trust-first confirmation step. No camera, no ID upload — just
// name, email, and an optional project reference, plus clear trust signals.
// We pass `idName` (full name) + `idNumber` (project ref) onward so the
// existing PaymentModal contract still works.
export default function VerificationModal({ isOpen, onClose, onVerified, service }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [projectRef, setProjectRef] = useState('')
  const [agree, setAgree] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  if (!isOpen) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    if (!name.trim() || name.trim().length < 2) return setErr('Please enter your full name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setErr('Please enter a valid email address.')
    if (!agree) return setErr('Please confirm you agree to proceed.')
    onVerified({
      ticket: projectRef.trim() || null,
      idName: name.trim(),
      idNumber: projectRef.trim() || 'N/A',
    })
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose} aria-label="Close">&times;</button>

        <div className={styles.header}>
          <div className={styles.logo}>Kavaro<span>.</span></div>
          <div className={styles.serviceTag}>{service}</div>
        </div>

        <div className={styles.body}>
          <h3 className={styles.stepTitle}>Confirm Your Order</h3>
          <p className={styles.stepDesc}>
            Quick details before we head to checkout. We use these to send your receipt and keep your project organised.
          </p>

          <form className={styles.simpleForm} onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Jane Wanjiku"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="jane@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                maxLength={255}
              />
            </div>

            <div className="form-group">
              <label>Project Reference <span className={styles.optional}>(optional)</span></label>
              <input
                type="text"
                placeholder="e.g. Bakery website redesign"
                value={projectRef}
                onChange={e => setProjectRef(e.target.value)}
                maxLength={120}
              />
            </div>

            <div className={styles.trustList}>
              <div className={styles.trustRow}>
                <span className={styles.trustIcon}>🔒</span>
                <div><strong>Encrypted checkout</strong><p>M-Pesa, PayPal & bank — handled by their secure systems, not ours.</p></div>
              </div>
              <div className={styles.trustRow}>
                <span className={styles.trustIcon}>🪪</span>
                <div><strong>No card details stored</strong><p>We never see or save your card or M-Pesa PIN.</p></div>
              </div>
              <div className={styles.trustRow}>
                <span className={styles.trustIcon}>↩</span>
                <div><strong>7-day satisfaction window</strong><p>If we haven't started work, you're refundable. Talk to us anytime.</p></div>
              </div>
            </div>

            <label className={styles.agreeRow}>
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
              <span>I confirm my details are correct and agree to proceed to payment.</span>
            </label>

            {err && <p className={styles.idError}>⚠ {err}</p>}

            <button type="submit" className={styles.verifyBtn}>Continue to Payment →</button>
            <button type="button" className={styles.backBtn} onClick={onClose}>Cancel</button>
          </form>
        </div>
      </div>
    </div>
  )
}
