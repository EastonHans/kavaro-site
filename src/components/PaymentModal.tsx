import { useState, useEffect, useRef } from 'react'
import { mpesaAPI, bankAPI, contactAPI } from '@/lib/api'
import styles from './PaymentModal.module.css'

interface Props {
  isOpen: boolean
  onClose: () => void
  service: string
  price?: string
}

export default function PaymentModal({ isOpen, onClose, service, price }: Props) {
  const [method, setMethod] = useState<'mpesa' | 'paypal' | 'bank'>('mpesa')
  const [step, setStep] = useState<'form' | 'processing' | 'success' | 'error'>('form')
  const [bankDetails, setBankDetails] = useState<any>(null)
  const [msg, setMsg] = useState('')
  const [checkoutId, setCheckoutId] = useState<string | null>(null)
  const [polling, setPolling] = useState(false)
  const pollRef = useRef<any>(null)

  const [form, setForm] = useState({ name: '', email: '', phone: '', amount: price || '' })

  useEffect(() => {
    if (price) setForm(f => ({ ...f, amount: price }))
  }, [price])

  useEffect(() => {
    if (method === 'bank' && !bankDetails) {
      bankAPI.getDetails()
        .then((r: any) => setBankDetails(r.data.details))
        .catch(() => setBankDetails({ error: true }))
    }
  }, [method, bankDetails])

  useEffect(() => {
    if (!polling || !checkoutId) return
    let attempts = 0
    const MAX_ATTEMPTS = 24
    pollRef.current = setInterval(async () => {
      attempts++
      if (attempts >= MAX_ATTEMPTS) {
        clearInterval(pollRef.current)
        setPolling(false)
        setStep('error')
        setMsg('Payment timed out. If you completed the payment, please contact us at websitekavaro@gmail.com.')
        return
      }
      try {
        const res: any = await mpesaAPI.queryStatus(checkoutId)
        const { resultCode } = res.data
        if (resultCode === 0) {
          clearInterval(pollRef.current)
          setPolling(false)
          try {
            await contactAPI.sendPaymentConfirmation({
              clientName: form.name, clientEmail: form.email, service,
              amount: `KES ${form.amount}`, method: 'M-Pesa', reference: checkoutId,
            })
          } catch {}
          setStep('success')
          setMsg('Payment confirmed! A receipt has been sent to your email.')
        } else if (resultCode === 1032) {
          clearInterval(pollRef.current); setPolling(false); setStep('error')
          setMsg('Payment was cancelled. Please try again.')
        } else if (resultCode === 1037) {
          clearInterval(pollRef.current); setPolling(false); setStep('error')
          setMsg('No response from your phone. Please check your M-Pesa and try again.')
        }
      } catch {}
    }, 5000)
    return () => clearInterval(pollRef.current)
  }, [polling, checkoutId, form, service])

  useEffect(() => {
    if (!isOpen) clearInterval(pollRef.current)
  }, [isOpen])

  if (!isOpen) return null

  const field = (key: keyof typeof form, label: string, type = 'text', placeholder = '') => (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        required
      />
    </div>
  )

  async function handleMpesa(e: React.FormEvent) {
    e.preventDefault()
    setStep('processing')
    setMsg('Sending STK Push to your phone...')
    try {
      const res: any = await mpesaAPI.stkPush({ ...form, service })
      setCheckoutId(res.data.checkoutRequestId)
      setPolling(true)
      setMsg('STK Push sent! Enter your M-Pesa PIN on your phone to complete payment.')
    } catch (err: any) {
      setStep('error')
      setMsg(err?.response?.data?.message || err?.message || 'M-Pesa request failed. Please try again.')
    }
  }

  async function handlePaypal(e: React.FormEvent) {
    e.preventDefault()
    const username = (import.meta as any).env?.VITE_PAYPAL_ME_USERNAME || 'kavaro'
    const usdAmount = parseFloat(form.amount)
    if (isNaN(usdAmount) || usdAmount <= 0) {
      setStep('error'); setMsg('Please enter a valid USD amount.'); return
    }
    window.open(`https://www.paypal.com/paypalme/${username}/${usdAmount}`, '_blank')
    setStep('success')
    setMsg(`Redirected to PayPal! Complete the payment there and email us your receipt at websitekavaro@gmail.com.`)
  }

  async function handleBank(e: React.FormEvent) {
    e.preventDefault()
    setStep('success')
    setMsg(`Thank you, ${form.name}! Use the bank details below and email your proof of payment to websitekavaro@gmail.com.`)
  }

  function reset() {
    setStep('form'); setMsg(''); setPolling(false); setCheckoutId(null)
    clearInterval(pollRef.current)
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose} aria-label="Close">&times;</button>
        <div className={styles.header}>
          <div className={styles.logo}>Kavaro<span>.</span></div>
          <div className={styles.serviceTag}>{service}</div>
        </div>

        {step === 'form' && (
          <>
            <div className={styles.methods}>
              {(['mpesa', 'paypal', 'bank'] as const).map(m => (
                <button key={m}
                  className={`${styles.methodBtn} ${method === m ? styles.active : ''}`}
                  onClick={() => setMethod(m)} type="button">
                  {m === 'mpesa' && <span>📱</span>}
                  {m === 'paypal' && <span>🌐</span>}
                  {m === 'bank' && <span>🏦</span>}
                  {m === 'mpesa' ? 'M-Pesa' : m === 'paypal' ? 'PayPal' : 'Bank Transfer'}
                </button>
              ))}
            </div>

            {method === 'mpesa' && (
              <form className={styles.form} onSubmit={handleMpesa}>
                <p className={styles.hint}>An STK Push will be sent to your Safaricom number. Enter your PIN to pay.</p>
                {field('name', 'Full Name', 'text', 'Jane Doe')}
                {field('email', 'Email Address', 'email', 'jane@email.com')}
                {field('phone', 'M-Pesa Phone Number', 'tel', '07XX XXX XXX')}
                <div className="form-group">
                  <label>Amount (KES)</label>
                  <input type="number" value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    required min="1" placeholder="e.g. 25000" />
                </div>
                <button type="submit" className={`btn-primary ${styles.payBtn}`}>Pay with M-Pesa →</button>
              </form>
            )}

            {method === 'paypal' && (
              <form className={styles.form} onSubmit={handlePaypal}>
                <p className={styles.hint}>You'll be redirected to PayPal to complete payment securely.</p>
                {field('name', 'Full Name', 'text', 'Jane Doe')}
                {field('email', 'Email Address', 'email', 'jane@email.com')}
                <div className="form-group">
                  <label>Amount (USD)</label>
                  <input type="number" value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    required min="1" step="0.01" placeholder="e.g. 200" />
                </div>
                <button type="submit" className={`btn-primary ${styles.payBtn}`} style={{ background: '#0070ba' }}>
                  Pay with PayPal →
                </button>
              </form>
            )}

            {method === 'bank' && (
              <form className={styles.form} onSubmit={handleBank}>
                <p className={styles.hint}>Transfer directly to our account and email us your receipt.</p>
                {field('name', 'Full Name', 'text', 'Jane Doe')}
                {field('email', 'Email Address', 'email', 'jane@email.com')}
                <div className="form-group">
                  <label>Amount</label>
                  <input type="text" value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    required placeholder="e.g. KES 25,000" />
                </div>
                <button type="submit" className={`btn-primary ${styles.payBtn}`}>Show Bank Details →</button>
              </form>
            )}
          </>
        )}

        {step === 'processing' && (
          <div className={styles.statusBox}>
            <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
            <p className={styles.statusMsg}>{msg || 'Processing your payment...'}</p>
            {polling && <p className={styles.statusHint}>Waiting for M-Pesa confirmation. Do not close this window.</p>}
          </div>
        )}

        {step === 'success' && (
          <div className={styles.statusBox}>
            <div className={styles.successIcon}>✓</div>
            <p className={styles.statusMsg}>{msg}</p>
            {method === 'bank' && bankDetails && !bankDetails.error && (
              <div className={styles.bankDetails}>
                {Object.entries(bankDetails).map(([k, v]: [string, any]) => (
                  v ? (
                    <div key={k} className={styles.bankRow}>
                      <span>{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <strong>{String(v)}</strong>
                    </div>
                  ) : null
                ))}
                <p className={styles.bankNote}>
                  Email proof of payment to <a href="mailto:websitekavaro@gmail.com">websitekavaro@gmail.com</a>
                </p>
              </div>
            )}
            {method === 'bank' && bankDetails?.error && (
              <div className={styles.bankDetails}>
                <p style={{ color: '#e44' }}>Could not load bank details. Please contact us directly at websitekavaro@gmail.com</p>
              </div>
            )}
            <button className="btn-primary" onClick={onClose} style={{ marginTop: 20 }}>Done</button>
          </div>
        )}

        {step === 'error' && (
          <div className={styles.statusBox}>
            <div className={styles.errorIcon}>✕</div>
            <p className={styles.statusMsg}>{msg}</p>
            <button className="btn-primary" onClick={reset}>Try Again</button>
          </div>
        )}
      </div>
    </div>
  )
}
