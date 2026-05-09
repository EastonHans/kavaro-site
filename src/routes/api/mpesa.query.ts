import { createFileRoute } from '@tanstack/react-router'

async function getAccessToken() {
  const key = process.env.MPESA_CONSUMER_KEY!
  const secret = process.env.MPESA_CONSUMER_SECRET!
  const env = process.env.MPESA_ENV || 'sandbox'
  const base = env === 'live' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke'
  const auth = Buffer.from(`${key}:${secret}`).toString('base64')
  const r = await fetch(`${base}/oauth/v1/generate/token?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  })
  const j: any = await r.json()
  return { token: j.access_token as string, base }
}

export const Route = createFileRoute('/api/mpesa/query')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { checkoutRequestId } = await request.json()
          if (!checkoutRequestId) {
            return Response.json({ success: false, message: 'Missing checkoutRequestId' }, { status: 400 })
          }
          if (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_PASSKEY) {
            return Response.json({ success: true, resultCode: -1, message: 'Pending (M-Pesa not configured).' })
          }
          const { token, base } = await getAccessToken()
          const shortcode = process.env.MPESA_SHORTCODE!
          const passkey = process.env.MPESA_PASSKEY!
          const ts = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14)
          const password = Buffer.from(`${shortcode}${passkey}${ts}`).toString('base64')

          const r = await fetch(`${base}/mpesa/stkpushquery/v1/query`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ BusinessShortCode: shortcode, Password: password, Timestamp: ts, CheckoutRequestID: checkoutRequestId }),
          })
          const j: any = await r.json()
          // Treat "request being processed" as pending
          if (j?.errorCode === '500.001.1001') {
            return Response.json({ success: true, resultCode: -1, message: 'Pending' }, { status: 202 })
          }
          const code = j?.ResultCode != null ? Number(j.ResultCode) : -1
          return Response.json({ success: true, resultCode: code, message: j?.ResultDesc || '' })
        } catch (err: any) {
          return Response.json({ success: true, resultCode: -1, message: 'Pending' })
        }
      },
    },
  },
})
