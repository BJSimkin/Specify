import HazardsClient from './hazards-client'

export const metadata = {
  title: 'Hazards & Controls — Specify',
  description: 'Interactive mapping of AI system hazards to their corresponding controls and mitigations.',
}

export default function HazardsPage() {
  return <HazardsClient />
}
