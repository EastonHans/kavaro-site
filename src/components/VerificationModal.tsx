import { useState, useRef, useEffect, useCallback } from 'react'
import styles from './VerificationModal.module.css'

function loadZxing(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).ZXing) return resolve((window as any).ZXing)
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/zxing-js/0.21.1/zxing.min.js'
    script.onload = () => resolve((window as any).ZXing)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onVerified: (data: { ticket: string | null; idName: string; idNumber: string }) => void
  service: string
}

export default function VerificationModal({ isOpen, onClose, onVerified, service }: Props) {
  const [step, setStep] = useState(1)
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle')
  const [idStatus, setIdStatus] = useState<'idle' | 'reviewing' | 'success' | 'error'>('idle')
  const [scannedCode, setScannedCode] = useState<string | null>(null)
  const [idPreview, setIdPreview] = useState<string | null>(null)
  const [scanMsg, setScanMsg] = useState('')
  const [idMsg, setIdMsg] = useState('')
  const [cameraErr, setCameraErr] = useState<string | null>(null)
  const [manualCode, setManualCode] = useState('')
  const [showManual, setShowManual] = useState(false)
  const [idName, setIdName] = useState('')
  const [idNumber, setIdNumber] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const readerRef = useRef<any>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const idFileRef = useRef<HTMLInputElement>(null)

  const stopCamera = useCallback(() => {
    if (readerRef.current) {
      try { readerRef.current.reset() } catch {}
      readerRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }, [])

  function validateTicket(code: string) {
    const cleaned = code.trim().toUpperCase()
    if (!cleaned || cleaned.length < 4) {
      setScanStatus('error'); setScanMsg('Invalid code. Please try again.'); return
    }
    setScannedCode(cleaned)
    setScanStatus('success')
    setScanMsg(`Ticket verified: ${cleaned}`)
    setTimeout(() => setStep(2), 1200)
  }

  const startScanner = useCallback(async () => {
    setScanStatus('scanning'); setCameraErr(null)
    try {
      const ZXing = await loadZxing()
      const hints = new Map()
      hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, [
        ZXing.BarcodeFormat.QR_CODE, ZXing.BarcodeFormat.CODE_128,
        ZXing.BarcodeFormat.CODE_39, ZXing.BarcodeFormat.EAN_13,
        ZXing.BarcodeFormat.DATA_MATRIX,
      ])
      const reader = new ZXing.BrowserMultiFormatReader(hints)
      readerRef.current = reader
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      reader.decodeFromStream(stream, videoRef.current, (result: any) => {
        if (result) {
          const code = result.getText()
          stopCamera()
          validateTicket(code)
        }
      })
    } catch (err: any) {
      if (err.name === 'NotAllowedError') setCameraErr('Camera permission denied. Use manual entry below.')
      else if (err.name === 'NotFoundError') setCameraErr('No camera found. Use manual entry below.')
      else setCameraErr('Camera unavailable. Use manual entry below.')
      setScanStatus('idle'); setShowManual(true)
    }
  }, [stopCamera])

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!manualCode.trim()) return
    validateTicket(manualCode)
  }

  async function handleFileScan(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    try {
      const ZXing = await loadZxing()
      const reader = new ZXing.BrowserMultiFormatReader()
      const url = URL.createObjectURL(file)
      const imgEl = new Image()
      imgEl.src = url
      imgEl.onload = async () => {
        try {
          const res: any = await reader.decodeFromImageUrl(url)
          URL.revokeObjectURL(url)
          validateTicket(res.getText())
        } catch {
          URL.revokeObjectURL(url)
          setScanStatus('error'); setScanMsg('No barcode/QR found in image. Try manual entry.'); setShowManual(true)
        }
      }
    } catch {
      setScanStatus('error'); setScanMsg('Could not read image. Try manual entry.'); setShowManual(true)
    }
  }

  function handleIdUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    if (!file.type.startsWith('image/')) {
      setIdMsg('Please upload an image file (JPG, PNG).'); setIdStatus('error'); return
    }
    const url = URL.createObjectURL(file)
    setIdPreview(url); setIdStatus('idle'); setIdMsg('')
  }

  function handleIdSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!idPreview) { setIdMsg('Please upload a photo of your ID.'); setIdStatus('error'); return }
    if (!idName.trim()) { setIdMsg('Please enter the name as it appears on your ID.'); setIdStatus('error'); return }
    if (!idNumber.trim() || idNumber.trim().length < 5) {
      setIdMsg('Please enter a valid ID number.'); setIdStatus('error'); return
    }
    setIdStatus('reviewing'); setIdMsg('Reviewing your ID...')
    setTimeout(() => {
      setIdStatus('success'); setIdMsg('ID verified successfully!')
      setTimeout(() => setStep(3), 1000)
    }, 2000)
  }

  function reset() {
    stopCamera(); setStep(1); setScanStatus('idle'); setIdStatus('idle')
    setScannedCode(null); setIdPreview(null); setScanMsg(''); setIdMsg('')
    setCameraErr(null); setManualCode(''); setShowManual(false); setIdName(''); setIdNumber('')
  }

  useEffect(() => {
    if (!isOpen) stopCamera()
    return () => stopCamera()
  }, [isOpen, stopCamera])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose} aria-label="Close">&times;</button>
        <div className={styles.header}>
          <div className={styles.logo}>Kavaro<span>.</span></div>
          <div className={styles.serviceTag}>{service}</div>
        </div>

        <div className={styles.stepper}>
          {[
            { n: 1, label: 'Scan Ticket' },
            { n: 2, label: 'Verify ID' },
            { n: 3, label: 'Proceed' },
          ].map((s, i) => (
            <div key={s.n} className={styles.stepperItem}>
              <div className={`${styles.stepDot} ${step >= s.n ? styles.stepDone : ''} ${step === s.n ? styles.stepActive : ''}`}>
                {step > s.n ? '✓' : s.n}
              </div>
              <span className={step === s.n ? styles.stepLabelActive : styles.stepLabel}>{s.label}</span>
              {i < 2 && <div className={`${styles.stepLine} ${step > s.n ? styles.stepLineDone : ''}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className={styles.body}>
            <h3 className={styles.stepTitle}>Scan Your Event Ticket</h3>
            <p className={styles.stepDesc}>Point your camera at the QR code or barcode on your ticket, or upload a photo of it.</p>

            {scanStatus === 'scanning' && (
              <div className={styles.viewfinder}>
                <video ref={videoRef} className={styles.video} playsInline muted />
                <div className={styles.scanOverlay}>
                  <div className={styles.scanCorners} />
                  <div className={styles.scanLine} />
                </div>
                <p className={styles.scanHint}>Align QR / barcode within the frame</p>
                <button className={styles.cancelBtn} onClick={() => { stopCamera(); setScanStatus('idle') }}>Cancel</button>
              </div>
            )}

            {scanStatus === 'success' && (
              <div className={styles.statusBox}>
                <div className={styles.successIcon}>✓</div>
                <p className={styles.statusMsg}>{scanMsg}</p>
                <p className={styles.statusHint}>Moving to ID verification...</p>
              </div>
            )}

            {scanStatus === 'error' && (
              <div className={styles.statusBox}>
                <div className={styles.errorIcon}>✕</div>
                <p className={styles.statusMsg}>{scanMsg}</p>
                <button className={styles.retryBtn} onClick={() => setScanStatus('idle')}>Try Again</button>
              </div>
            )}

            {scanStatus === 'idle' && (
              <div className={styles.scanActions}>
                {cameraErr && <p className={styles.cameraErr}>⚠ {cameraErr}</p>}
                {!showManual && (
                  <button className={styles.scanBtn} onClick={startScanner}>
                    <span>📷</span> Open Camera Scanner
                  </button>
                )}
                <label className={styles.uploadBtn}>
                  <span>🖼</span> Upload Ticket Image
                  <input type="file" accept="image/*" ref={fileRef} onChange={handleFileScan} hidden />
                </label>
                <button className={styles.manualToggle} onClick={() => setShowManual(v => !v)}>
                  {showManual ? 'Hide' : 'Enter code manually'}
                </button>
              </div>
            )}

            {showManual && scanStatus !== 'success' && (
              <form className={styles.manualForm} onSubmit={handleManualSubmit}>
                <input type="text" placeholder="e.g. KAVARO-ABC123"
                  value={manualCode} onChange={e => setManualCode(e.target.value)}
                  className={styles.manualInput} autoFocus />
                <button type="submit" className={styles.manualSubmit}>Validate →</button>
              </form>
            )}
          </div>
        )}

        {step === 2 && (
          <div className={styles.body}>
            <h3 className={styles.stepTitle}>Verify Your Identity</h3>
            <p className={styles.stepDesc}>Upload a clear photo of your National ID, Passport, or Driver's Licence to confirm your identity.</p>

            {idStatus === 'reviewing' && (
              <div className={styles.statusBox}>
                <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
                <p className={styles.statusMsg}>{idMsg}</p>
              </div>
            )}

            {idStatus === 'success' && (
              <div className={styles.statusBox}>
                <div className={styles.successIcon}>✓</div>
                <p className={styles.statusMsg}>{idMsg}</p>
                <p className={styles.statusHint}>Proceeding to payment...</p>
              </div>
            )}

            {(idStatus === 'idle' || idStatus === 'error') && (
              <form className={styles.idForm} onSubmit={handleIdSubmit}>
                <label className={styles.idUploadZone}>
                  {idPreview ? (
                    <img src={idPreview} alt="ID preview" className={styles.idPreview} />
                  ) : (
                    <div className={styles.idUploadPlaceholder}>
                      <span>🪪</span>
                      <p>Tap to upload ID photo</p>
                      <small>JPG or PNG, clear & readable</small>
                    </div>
                  )}
                  <input type="file" accept="image/*" ref={idFileRef} onChange={handleIdUpload} hidden />
                </label>

                <div className={styles.idFields}>
                  <div className="form-group">
                    <label>Full Name (as on ID)</label>
                    <input type="text" placeholder="Jane Wanjiku Doe"
                      value={idName} onChange={e => setIdName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>ID / Passport Number</label>
                    <input type="text" placeholder="e.g. 12345678"
                      value={idNumber} onChange={e => setIdNumber(e.target.value.replace(/\s/g, ''))} required />
                  </div>
                </div>

                {idMsg && idStatus === 'error' && <p className={styles.idError}>⚠ {idMsg}</p>}

                <div className={styles.idNote}>
                  🔒 Your ID is used for verification only and is not stored permanently.
                </div>

                <button type="submit" className={styles.verifyBtn}>Verify Identity →</button>
                <button type="button" className={styles.backBtn} onClick={() => { setStep(1); setScanStatus('idle') }}>← Back</button>
              </form>
            )}
          </div>
        )}

        {step === 3 && (
          <div className={styles.body}>
            <div className={styles.verifiedBox}>
              <div className={styles.verifiedIcon}><span>✓</span></div>
              <h3 className={styles.verifiedTitle}>Identity Verified</h3>
              <p className={styles.verifiedDesc}>Both your ticket and ID have been successfully verified. You can now proceed to payment.</p>

              <div className={styles.verifiedDetails}>
                <div className={styles.verifiedRow}><span>🎫 Ticket</span><strong>{scannedCode}</strong></div>
                <div className={styles.verifiedRow}><span>🪪 Name</span><strong>{idName}</strong></div>
                <div className={styles.verifiedRow}><span>🔐 ID No.</span>
                  <strong>{'•'.repeat(Math.max(0, idNumber.length - 3))}{idNumber.slice(-3)}</strong>
                </div>
              </div>

              <button className={styles.proceedBtn}
                onClick={() => { onVerified({ ticket: scannedCode, idName, idNumber }); onClose() }}>
                Proceed to Payment →
              </button>
              <button className={styles.backBtn} onClick={reset}>Start Over</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
