import Link from 'next/link'
import { auth } from '@/lib/auth'
import { Nav } from '@/components/nav'

export default async function RiskRepositoryPage() {
  const session = await auth()
  const user = session?.user as any

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
          Risk Repository
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
          A shared library of AI risk entries — structured, searchable, and linked to the
          requirements packages that address them.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
          {[
            { icon: '⚠️', title: 'Risk entries', desc: 'Catalogued risks by category, severity, and domain' },
            { icon: '🔗', title: 'Linked packages', desc: 'See which packages address each risk' },
            { icon: '📊', title: 'Risk heatmaps', desc: 'Visualise coverage across your AI portfolio' },
          ].map((f) => (
            <div key={f.title} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm text-left">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Back to Explore
        </Link>
      </main>
    </>
  )
}
