import Link from 'next/link'
import { auth } from '@/lib/auth'
import { Nav } from '@/components/nav'

export default async function CardsPage() {
  const session = await auth()
  const user = session?.user as any

  const cards = [
    {
      icon: '🤖',
      title: 'Model Card',
      desc: 'Document a model\'s intended uses, performance metrics, training data, and limitations.',
    },
    {
      icon: '🗃️',
      title: 'Dataset Card',
      desc: 'Describe dataset composition, collection methodology, known biases, and usage guidelines.',
    },
    {
      icon: '🏗️',
      title: 'System Card',
      desc: 'Capture the full AI system context: components, integrations, human oversight, and deployment.',
    },
    {
      icon: '📋',
      title: 'Impact Assessment',
      desc: 'Structured template for assessing potential societal, ethical, and regulatory impacts.',
    },
  ]

  return (
    <>
      <Nav user={user} />
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6"
          style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
        >
          Coming soon
        </div>
        <h1 className="text-4xl font-bold mb-4" style={{ color: '#1E1B4B' }}>
          Cards &amp; Templates
        </h1>
        <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
          Standardised templates for documenting your AI system. Link them directly to your
          requirements packages.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
          {cards.map((c) => (
            <div
              key={c.title}
              className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm text-left opacity-60"
            >
              <div className="text-3xl mb-3">{c.icon}</div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">{c.title}</h3>
              <p className="text-sm text-gray-500">{c.desc}</p>
              <span
                className="inline-block mt-3 text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#EEF2FF', color: '#3730A3' }}
              >
                Template coming soon
              </span>
            </div>
          ))}
        </div>
        <Link href="/" className="text-sm font-medium text-indigo-600 hover:underline">
          ← Back to Explore
        </Link>
      </main>
    </>
  )
}
