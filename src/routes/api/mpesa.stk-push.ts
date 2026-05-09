import { createFileRoute } from '@tanstack/react-router'

// Real M-Pesa Daraja STK Push. Returns helpful error if env vars are not configured yet.
async function getAccessToken() {
  const key = process.env.MPESA_CONSUMER_KEY!
  const secret = process.env.MPESA_CONSUMER_SECRET!
  const env = process.env.MPESA_ENV || 'sandbox'
  const base = env === 'live' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke'
  const auth = Buffer.from(`${key}:${secret}`).toString('base64')
  const r = await fetch(`${base}/oauth/v1/generate/token?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  })
  if (!r.ok) throw new Error('M-Pesa auth failed')
  const j: any = await r.json()
  return { token: j.access_token as string, base }
}

function normalizePhone(p: string) {
  const digits = p.replace(/\D/g, '')
  if (digits.startsWith('254')) return digits
  if (digits.startsWith('0')) return '254' + digits.slice(1)
  if (digits.startsWith('7') || digits.startsWith('1')) return '254' + digits
  return digits
}

export const Route = createFileRoute('/api/mpesa/stk-push')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const { phone, amount, name, email, service } = body || {}
          const amt = Number(amount)
          if (!phone || !amt || isNaN(amt) || amt < 1) {
            return Response.json({ success: false, message: 'Phone and a valid amount are required.' }, { status: 400 })
          }
          const phoneStd = normalizePhone(String(phone))
          if (!/^254(7|1)\d{8}$/.test(phoneStd)) {
            return Response.json({ success: false, message: 'Enter a valid Safaricom number (07XX or 01XX).' }, { status: 400 })
          }

          if (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_PASSKEY) {
            return Response.json({
              success: false,
              message: 'M-Pesa is not configured yet. Add MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE, MPESA_PASSKEY and MPESA_CALLBACK_URL as project secrets.',
            }, { status: 503 })
          }

          const { token, base } = await getAccessToken()
          const shortcode = process.env.MPESA_SHORTCODE!
          const passkey = process.env.MPESA_PASSKEY!
          const callback = process.env.MPESA_CALLBACK_URL!
          const ts = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14)
          const password = Buffer.from(`${shortcode}${passkey}${ts}`).toString('base64')

          const r = await fetch(`${base}/mpesa/stkpush/v1/processrequest`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              BusinessShortCode: shortcode, Password: password, Timestamp: ts,
              TransactionType: 'CustomerPayBillOnline', Amount: Math.floor(amt),
              PartyA: phoneStd, PartyB: shortcode, PhoneNumber: phoneStd,
              CallBackURL: callback, AccountReference: (service || 'Kavaro').slice(0, 12),
              TransactionDesc: `Payment from ${name || 'client'}`,
            }),
          })
          const j: any = await r.json()
          if (j?.ResponseCode === '0') {
            return Response.json({ success: true, checkoutRequestId: j.CheckoutRequestID, message: 'STK push sent.' })
          }
          return Response.json({ success: false, message: j?.errorMessage || j?.ResponseDescription || 'STK push failed.' }, { status: 400 })
        } catch (err: any) {
          return Response.json({ success: false, message: err?.message || 'M-Pesa request failed.' }, { status: 500 })
        }
      },
    },
  },
})
