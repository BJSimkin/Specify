import { Suspense } from 'react'
import SystemAuditClient from './system-audit-client'

export const metadata = {
  title: 'System Audit — Specify',
  description: 'Test agentic AI models in secure virtual environments with screen recording and replay.',
}

export default function SystemAuditPage() {
  return (
    <Suspense>
      <SystemAuditClient />
    </Suspense>
  )
}
