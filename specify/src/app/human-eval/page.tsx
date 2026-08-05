import { Suspense } from 'react'
import HumanEvalClient from './human-eval-client'

export const metadata = {
  title: 'Human Eval — Specify',
  description: 'Human red team playground: chat with the model under test and tag responses as safe or unsafe.',
}

export default function HumanEvalPage() {
  return (
    <Suspense>
      <HumanEvalClient />
    </Suspense>
  )
}
