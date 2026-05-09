import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/bank/details')({
  server: {
    handlers: {
      GET: async () => {
        const details = {
          bankName: process.env.BANK_NAME || 'Equity Bank Kenya',
          accountName: process.env.BANK_ACCOUNT_NAME || 'Kavaro Agency',
          accountNumber: process.env.BANK_ACCOUNT_NUMBER || '0123456789012',
          branch: process.env.BANK_BRANCH || 'Westlands Branch',
          swiftCode: process.env.BANK_SWIFT || 'EQBLKENA',
        }
        return Response.json({ success: true, details })
      },
    },
  },
})
