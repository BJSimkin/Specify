import RiskClient from './risk-client'

export const metadata = {
  title: 'Risk Repository — Specify',
  description: 'Community-maintained catalogue of AI system risks with severity voting, comments, and version control.',
}

export default function RiskRepositoryPage() {
  return <RiskClient />
}
