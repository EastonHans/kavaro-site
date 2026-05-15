import { createFileRoute } from '@tanstack/react-router'

// Safaricom posts here after STK push completion. Public endpoint — no auth header.
// We log the result; later we can persist it to the DB or trigger a confirmation email.
export const Route = createFileRoute('/api/mpesa/callback')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const cb = body?.Body?.stkCallback
          const code = cb?.ResultCode
          const desc = cb?.ResultDesc
          const items: any[] = cb?.CallbackMetadata?.Item || []
          const get = (k: string) => items.find(i => i.Name === k)?.Value
          const summary = {
            checkoutRequestId: cb?.CheckoutRequestID,
            merchantRequestId: cb?.MerchantRequestID,
            resultCode: code,
            resultDesc: desc,
            amount: get('Amount'),
            mpesaReceipt: get('MpesaReceiptNumber'),
            phone: get('PhoneNumber'),
            transactionDate: get('TransactionDate'),
          }
          console.log('[mpesa.callback]', JSON.stringify(summary))
          // Safaricom expects a 200 with this exact shape, otherwise it retries.
          return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
        } catch (err) {
          console.error('[mpesa.callback] error', err)
          return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
        }
      },
      GET: async () => Response.json({ ok: true, hint: 'POST endpoint for Safaricom STK callbacks' }),
    },
  },
})
