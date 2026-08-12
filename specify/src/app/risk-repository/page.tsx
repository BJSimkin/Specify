import RiskClient from './risk-client'

export const metadata = {
  title: 'Risk Repository — Sequel',
  description: 'Community-maintained catalogue of AI system risks with severity voting, comments, and version control.',
}

export default function RiskRepositoryPage() {
  return <RiskClient />
}
