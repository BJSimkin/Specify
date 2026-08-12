import { Suspense } from 'react'
import OffensiveClient from './offensive-client'

export const metadata = {
  title: 'Offensive Probe — Sequel',
  description: 'Offensive & Dynamic Multi Turn probe: run autonomous red-team attack scenarios against your model.',
}

export default function OffensivePage() {
  return (
    <Suspense>
      <OffensiveClient />
    </Suspense>
  )
}
