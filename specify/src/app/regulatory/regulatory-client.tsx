'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ARTICLES,
  ABSTRACTED_REQUIREMENTS,
  REGULATIONS,
  type RegArticle,
} from '@/lib/regulatory-data'

type RegulationId = 'eu-ai-act' | 'nist-ai-rmf'

const TAG_COLORS: Record<string, string> = {
  'scope': 'bg-blue-100 text-blue-700',
  'general': 'bg-gray-100 text-gray-600',
  'applicability': 'bg-blue-100 text-blue-700',
  'definitions': 'bg-purple-100 text-purple-700',
  'prohibited': 'bg-red-100 text-red-700',
  'fundamental-rights': 'bg-red-100 text-red-700',
  'biometric': 'bg-orange-100 text-orange-700',
  'high-risk': 'bg-amber-100 text-amber-700',
  'classification': 'bg-teal-100 text-teal-700',
  'compliance': 'bg-green-100 text-green-700',
  'risk-management': 'bg-indigo-100 text-indigo-700',
  'documentation': 'bg-slate-100 text-slate-700',
  'data': 'bg-cyan-100 text-cyan-700',
  'governance': 'bg-violet-100 text-violet-700',
  'bias': 'bg-rose-100 text-rose-700',
  'transparency': 'bg-sky-100 text-sky-700',
  'human-oversight': 'bg-emerald-100 text-emerald-700',
  'accuracy': 'bg-lime-100 text-lime-700',
  'robustness': 'bg-lime-100 text-lime-700',
  'cybersecurity': 'bg-red-100 text-red-700',
  'provider': 'bg-blue-100 text-blue-700',
  'obligations': 'bg-orange-100 text-orange-700',
  'quality-management': 'bg-violet-100 text-violet-700',
  'deployer': 'bg-blue-100 text-blue-700',
  'conformity': 'bg-green-100 text-green-700',
  'assessment': 'bg-green-100 text-green-700',
  'certification': 'bg-green-100 text-green-700',
  'registration': 'bg-gray-100 text-gray-600',
  'database': 'bg-gray-100 text-gray-600',
  'chatbot': 'bg-sky-100 text-sky-700',
  'deepfake': 'bg-red-100 text-red-700',
  'disclosure': 'bg-sky-100 text-sky-700',
  'gpai': 'bg-purple-100 text-purple-700',
  'systemic-risk': 'bg-red-100 text-red-700',
  'red-teaming': 'bg-orange-100 text-orange-700',
  'copyright': 'bg-gray-100 text-gray-600',
  'monitoring': 'bg-indigo-100 text-indigo-700',
  'post-market': 'bg-indigo-100 text-indigo-700',
  'lifecycle': 'bg-teal-100 text-teal-700',
  'incident-reporting': 'bg-red-100 text-red-700',
  'serious-incident': 'bg-red-100 text-red-700',
  'notification': 'bg-orange-100 text-orange-700',
  'explainability': 'bg-sky-100 text-sky-700',
  'rights': 'bg-purple-100 text-purple-700',
  'penalties': 'bg-red-100 text-red-700',
  'enforcement': 'bg-red-100 text-red-700',
  'policy': 'bg-violet-100 text-violet-700',
  'accountability': 'bg-orange-100 text-orange-700',
  'risk-tolerance': 'bg-amber-100 text-amber-700',
  'culture': 'bg-pink-100 text-pink-700',
  'leadership': 'bg-pink-100 text-pink-700',
  'review': 'bg-gray-100 text-gray-600',
  'third-party': 'bg-cyan-100 text-cyan-700',
  'supply-chain': 'bg-cyan-100 text-cyan-700',
  'roles': 'bg-orange-100 text-orange-700',
  'cross-functional': 'bg-violet-100 text-violet-700',
  'diversity': 'bg-pink-100 text-pink-700',
  'fairness': 'bg-rose-100 text-rose-700',
  'workforce': 'bg-pink-100 text-pink-700',
  'training': 'bg-teal-100 text-teal-700',
  'competence': 'bg-teal-100 text-teal-700',
  'oversight': 'bg-emerald-100 text-emerald-700',
  'enterprise-risk': 'bg-violet-100 text-violet-700',
  'enterprise': 'bg-violet-100 text-violet-700',
  'risk-priorities': 'bg-amber-100 text-amber-700',
  'business-objectives': 'bg-blue-100 text-blue-700',
  'procurement': 'bg-cyan-100 text-cyan-700',
  'legal': 'bg-gray-100 text-gray-600',
  'regulations': 'bg-indigo-100 text-indigo-700',
  'context': 'bg-slate-100 text-slate-700',
  'purpose': 'bg-slate-100 text-slate-700',
  'users': 'bg-blue-100 text-blue-700',
  'scientific': 'bg-teal-100 text-teal-700',
  'domain-knowledge': 'bg-teal-100 text-teal-700',
  'categorization': 'bg-teal-100 text-teal-700',
  'trustworthiness': 'bg-green-100 text-green-700',
  'risk-level': 'bg-amber-100 text-amber-700',
  'evaluation': 'bg-green-100 text-green-700',
  'affected-groups': 'bg-rose-100 text-rose-700',
  'data-collection': 'bg-cyan-100 text-cyan-700',
  'stakeholders': 'bg-blue-100 text-blue-700',
  'diverse': 'bg-pink-100 text-pink-700',
  'risk-register': 'bg-indigo-100 text-indigo-700',
  'impact': 'bg-amber-100 text-amber-700',
  'likelihood': 'bg-amber-100 text-amber-700',
  'communication': 'bg-sky-100 text-sky-700',
  'sharing': 'bg-sky-100 text-sky-700',
  'measurement': 'bg-green-100 text-green-700',
  'metrics': 'bg-green-100 text-green-700',
  'methods': 'bg-green-100 text-green-700',
  'testing': 'bg-lime-100 text-lime-700',
  'representativeness': 'bg-lime-100 text-lime-700',
  'safety': 'bg-red-100 text-red-700',
  'adversarial': 'bg-orange-100 text-orange-700',
  'interpretability': 'bg-sky-100 text-sky-700',
  'security': 'bg-red-100 text-red-700',
  'privacy': 'bg-purple-100 text-purple-700',
  'data-minimisation': 'bg-cyan-100 text-cyan-700',
  'design': 'bg-blue-100 text-blue-700',
  'environment': 'bg-green-100 text-green-700',
  'sustainability': 'bg-green-100 text-green-700',
  'risk-treatment': 'bg-indigo-100 text-indigo-700',
  'effectiveness': 'bg-emerald-100 text-emerald-700',
  'post-deployment': 'bg-indigo-100 text-indigo-700',
  'prioritization': 'bg-amber-100 text-amber-700',
  'contingency': 'bg-orange-100 text-orange-700',
  'planning': 'bg-blue-100 text-blue-700',
  'residual-risk': 'bg-orange-100 text-orange-700',
  'reporting': 'bg-red-100 text-red-700',
  'mechanisms': 'bg-gray-100 text-gray-600',
  'incident-response': 'bg-red-100 text-red-700',
  'tracking': 'bg-indigo-100 text-indigo-700',
  'response-plans': 'bg-indigo-100 text-indigo-700',
  'deployment': 'bg-teal-100 text-teal-700',
  'pre-deployment': 'bg-teal-100 text-teal-700',
  'activation': 'bg-teal-100 text-teal-700',
  'feedback': 'bg-sky-100 text-sky-700',
  'continuous-improvement': 'bg-emerald-100 text-emerald-700',
  'risk-assessment': 'bg-indigo-100 text-indigo-700',
  'information': 'bg-sky-100 text-sky-700',
  'record-keeping': 'bg-slate-100 text-slate-700',
  'logging': 'bg-slate-100 text-slate-700',
}

function tagColor(tag: string): string {
  return TAG_COLORS[tag] ?? 'bg-gray-100 text-gray-600'
}

function groupArticles(articles: RegArticle[]): Map<string, RegArticle[]> {
  const map = new Map<string, RegArticle[]>()
  for (const a of articles) {
    const key = a.path[0]
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(a)
  }
  return map
}

export default function RegulatoryClient() {
  const [activeRegulation, setActiveRegulation] = useState<RegulationId>('eu-ai-act')
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null)
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())

  const filteredArticles = useMemo(
    () => ARTICLES.filter((a) => a.regulationId === activeRegulation),
    [activeRegulation],
  )

  const grouped = useMemo(() => groupArticles(filteredArticles), [filteredArticles])

  const selectedArticle = useMemo(
    () => (selectedArticleId ? ARTICLES.find((a) => a.id === selectedArticleId) ?? null : null),
    [selectedArticleId],
  )

  const regulation = useMemo(
    () => REGULATIONS.find((r) => r.id === activeRegulation)!,
    [activeRegulation],
  )

  const euCount = ARTICLES.filter((a) => a.regulationId === 'eu-ai-act').length
  const nistCount = ARTICLES.filter((a) => a.regulationId === 'nist-ai-rmf').length

  function toggleSection(section: string) {
    setCollapsedSections((prev) => {
      const next = new Set(prev)
      if (next.has(section)) next.delete(section)
      else next.add(section)
      return next
    })
  }

  function handleTabChange(id: RegulationId) {
    setActiveRegulation(id)
    setSelectedArticleId(null)
    setCollapsedSections(new Set())
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
      {/* ── Left panel ── */}
      <aside className="w-72 flex-shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Regulatory Database
          </h2>
          {/* Tabs */}
          <div className="flex rounded-lg bg-gray-200 p-0.5 gap-0.5">
            <button
              onClick={() => handleTabChange('eu-ai-act')}
              className={`flex-1 text-xs font-medium py-1.5 px-2 rounded-md transition-colors ${
                activeRegulation === 'eu-ai-act'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              EU AI Act
            </button>
            <button
              onClick={() => handleTabChange('nist-ai-rmf')}
              className={`flex-1 text-xs font-medium py-1.5 px-2 rounded-md transition-colors ${
                activeRegulation === 'nist-ai-rmf'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              NIST AI RMF
            </button>
          </div>
        </div>

        {/* Tree */}
        <nav className="flex-1 overflow-y-auto py-2">
          {Array.from(grouped.entries()).map(([section, articles]) => {
            const isCollapsed = collapsedSections.has(section)
            return (
              <div key={section}>
                {/* Section header */}
                <button
                  onClick={() => toggleSection(section)}
                  className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-100 transition-colors group"
                >
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide leading-tight pr-2 line-clamp-2">
                    {section}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-xs text-gray-400 font-medium">{articles.length}</span>
                    <svg
                      className={`w-3 h-3 text-gray-400 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Articles */}
                {!isCollapsed && (
                  <ul>
                    {articles.map((article) => {
                      const isSelected = selectedArticleId === article.id
                      return (
                        <li key={article.id}>
                          <button
                            onClick={() => setSelectedArticleId(article.id)}
                            className={`w-full text-left px-4 py-2 flex flex-col gap-0.5 transition-colors ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            <span
                              className={`text-xs font-semibold ${
                                isSelected ? 'text-indigo-100' : 'text-indigo-700'
                              }`}
                            >
                              {article.number}
                            </span>
                            <span className={`text-xs leading-snug truncate ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                              {article.title}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })}
        </nav>
      </aside>

      {/* ── Right panel ── */}
      <main className="flex-1 overflow-y-auto p-6">
        {!selectedArticle ? (
          <WelcomeScreen euCount={euCount} nistCount={nistCount} />
        ) : (
          <ArticleDetail article={selectedArticle} regulationColor={regulation.color} />
        )}
      </main>
    </div>
  )
}

// ── Welcome screen ────────────────────────────────────────────────────────────

function WelcomeScreen({ euCount, nistCount }: { euCount: number; nistCount: number }) {
  return (
    <div className="max-w-2xl mx-auto pt-16 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
        style={{ backgroundColor: '#1E1B4B' }}
      >
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-2" style={{ color: '#1E1B4B' }}>
        Regulatory Database
      </h1>
      <p className="text-gray-500 mb-10 leading-relaxed">
        Browse articles from the EU AI Act and NIST AI Risk Management Framework. Select an article
        from the left panel to view its summary and linked abstracted requirements.
      </p>

      <div className="grid grid-cols-2 gap-4 text-left">
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#003399' }} />
            <span className="text-sm font-semibold text-gray-800">EU AI Act 2024</span>
          </div>
          <p className="text-3xl font-bold mb-1" style={{ color: '#1E1B4B' }}>
            {euCount}
          </p>
          <p className="text-xs text-gray-500">articles indexed</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#1B4F72' }} />
            <span className="text-sm font-semibold text-gray-800">NIST AI RMF 2023</span>
          </div>
          <p className="text-3xl font-bold mb-1" style={{ color: '#1E1B4B' }}>
            {nistCount}
          </p>
          <p className="text-xs text-gray-500">subcategories indexed</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 p-5 text-left">
        <p className="text-sm font-semibold text-gray-700 mb-1">
          {ABSTRACTED_REQUIREMENTS.length} Abstracted Requirements
        </p>
        <p className="text-xs text-gray-500">
          Cross-regulation requirements synthesised from both frameworks, enabling side-by-side
          comparison of how each regulation addresses the same compliance theme.
        </p>
      </div>
    </div>
  )
}

// ── Article detail ────────────────────────────────────────────────────────────

function ArticleDetail({
  article,
  regulationColor,
}: {
  article: RegArticle
  regulationColor: string
}) {
  const regulation = REGULATIONS.find((r) => r.id === article.regulationId)!
  const linkedReqs = ABSTRACTED_REQUIREMENTS.filter((r) =>
    article.abstractedReqIds.includes(r.id),
  )

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5 flex-wrap">
        {article.path.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-gray-300">›</span>}
            <span>{crumb}</span>
          </span>
        ))}
      </nav>

      {/* Number + Title */}
      <div className="mb-5">
        <p className="text-sm font-semibold mb-1" style={{ color: regulationColor }}>
          {article.number}
        </p>
        <h1 className="text-2xl font-bold leading-tight" style={{ color: '#1E1B4B' }}>
          {article.title}
        </h1>
      </div>

      {/* Summary */}
      <p className="text-base text-gray-700 leading-relaxed mb-6">{article.summary}</p>

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tagColor(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Abstracted requirements */}
      {linkedReqs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Abstracted Requirements
          </h2>
          <div className="flex flex-wrap gap-2">
            {linkedReqs.map((req) => (
              <Link
                key={req.id}
                href={`/regulatory/requirement/${req.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
              >
                <span className="text-xs font-semibold text-amber-600">{req.id}</span>
                <span>{req.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Regulation badge */}
      <div className="pt-6 border-t border-gray-100">
        <span
          className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full text-white"
          style={{ backgroundColor: regulationColor }}
        >
          {regulation.shortName} {regulation.year}
        </span>
      </div>
    </div>
  )
}
