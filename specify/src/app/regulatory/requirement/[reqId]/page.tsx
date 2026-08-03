import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ABSTRACTED_REQUIREMENTS, ARTICLES, REGULATIONS } from '@/lib/regulatory-data'

// ── Category colours ──────────────────────────────────────────────────────────

const CATEGORY_STYLES: Record<string, string> = {
  Technical: 'bg-blue-100 text-blue-800',
  Governance: 'bg-violet-100 text-violet-800',
  Transparency: 'bg-sky-100 text-sky-800',
  Data: 'bg-cyan-100 text-cyan-800',
  Oversight: 'bg-emerald-100 text-emerald-800',
  Security: 'bg-red-100 text-red-800',
  Documentation: 'bg-slate-100 text-slate-700',
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function RequirementPage({
  params,
}: {
  params: Promise<{ reqId: string }>
}) {
  const { reqId } = await params

  const req = ABSTRACTED_REQUIREMENTS.find((r) => r.id === reqId)
  if (!req) notFound()

  // Group refs by regulationId
  const regIds = Array.from(new Set(req.refs.map((r) => r.regulationId)))

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 flex-wrap">
        <Link href="/regulatory" className="hover:text-indigo-600 transition-colors">
          Regulatory Database
        </Link>
        <span className="text-gray-300">›</span>
        <span>Abstracted Requirements</span>
        <span className="text-gray-300">›</span>
        <span className="text-gray-600 font-medium">{req.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-3 mb-3 flex-wrap">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-500 font-mono">
            {req.id}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${CATEGORY_STYLES[req.category] ?? 'bg-gray-100 text-gray-600'}`}
          >
            {req.category}
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-4" style={{ color: '#1E1B4B' }}>
          {req.title}
        </h1>
        <p className="text-base text-gray-700 leading-relaxed max-w-3xl">{req.description}</p>
      </div>

      {/* Cross-regulation comparison */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-5">
          Cross-Regulation Comparison
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {regIds.map((regId) => {
            const regulation = REGULATIONS.find((r) => r.id === regId)
            if (!regulation) return null

            const refsForReg = req.refs.filter((r) => r.regulationId === regId)

            return (
              <div key={regId} className="rounded-xl border border-gray-200 overflow-hidden">
                {/* Regulation header */}
                <div
                  className="px-5 py-3 flex items-center gap-2"
                  style={{ backgroundColor: regulation.color }}
                >
                  <span className="text-sm font-semibold text-white">
                    {regulation.shortName}
                  </span>
                  <span className="text-xs text-white/70">{regulation.year}</span>
                  <span className="ml-auto text-xs font-medium text-white/80 bg-white/20 px-2 py-0.5 rounded-full">
                    {regulation.jurisdiction}
                  </span>
                </div>

                {/* Articles */}
                <div className="divide-y divide-gray-100">
                  {refsForReg.map((ref) => {
                    const article = ARTICLES.find((a) => a.id === ref.articleId)
                    return (
                      <div key={ref.articleId} className="px-5 py-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <Link
                              href="/regulatory"
                              className="text-sm font-semibold hover:underline"
                              style={{ color: regulation.color }}
                            >
                              {ref.articleRef}
                            </Link>
                            {article && (
                              <p className="text-sm font-medium text-gray-800 mt-0.5">
                                {article.title}
                              </p>
                            )}
                          </div>
                          <span
                            className={`inline-flex items-center flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                              ref.relevance === 'direct'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {ref.relevance === 'direct' ? 'Direct' : 'Related'}
                          </span>
                        </div>
                        {article && (
                          <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                            {article.summary}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Back link */}
      <Link
        href="/regulatory"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Regulatory Database
      </Link>
    </div>
  )
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ reqId: string }>
}) {
  const { reqId } = await params
  const req = ABSTRACTED_REQUIREMENTS.find((r) => r.id === reqId)
  return {
    title: req ? `${req.id} — ${req.title} — Specify` : 'Requirement — Specify',
  }
}
