import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/contact/payment-confirmation')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          console.log('[payment.confirmation]', body)
          return Response.json({ success: true, message: 'Receipt logged.' })
        } catch {
          return Response.json({ success: false, message: 'Could not log receipt.' }, { status: 500 })
        }
      },
    },
  },
})
