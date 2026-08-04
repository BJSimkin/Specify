import { Suspense } from 'react'
import DatasetAuditClient from './dataset-audit-client'

export const metadata = {
  title: 'Dataset Audit — Specify',
  description: 'Upload a dataset, configure AI annotation strategies, and review results with human-in-the-loop verification.',
}

export default function DatasetAuditPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-400">Loading…</div>}>
      <DatasetAuditClient />
    </Suspense>
  )
}
