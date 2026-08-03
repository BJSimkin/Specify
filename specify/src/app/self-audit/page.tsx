import { Suspense } from 'react'
import SelfAuditClient from './self-audit-client'

export const metadata = {
  title: 'Self Audit — Specify',
  description: 'Test your AI system against curated risk scenarios and threat vectors.',
}

export default function SelfAuditPage() {
  return (
    <Suspense>
      <SelfAuditClient />
    </Suspense>
  )
}
