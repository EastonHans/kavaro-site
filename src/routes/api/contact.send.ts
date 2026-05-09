import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/contact/send')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const { name, email, message } = body || {}
          if (!name || !email || !message) {
            return Response.json({ success: false, message: 'Name, email and message are required.' }, { status: 400 })
          }
          // Email delivery hook — wire up SMTP/Resend/Postmark here when secrets are configured.
          console.log('[contact.send]', { name, email, service: body.service, budget: body.budget })
          return Response.json({
            success: true,
            message: "Thanks! We've received your message and will get back to you within 24 hours.",
          })
        } catch (err: any) {
          return Response.json({ success: false, message: 'Could not process the request.' }, { status: 500 })
        }
      },
    },
  },
})
