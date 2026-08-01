'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { AUDIT_CATEGORIES, type RiskCategory, type ThreatVector } from '@/lib/scenarios-data'

// ─── Source badge colours ──────────────────────────────────────────────────────
const SOURCE_COLORS: Record<string, { bg: string; text: string }> = {
  'WMDP':              { bg: '#FEF3C7', text: '#92400E' },
  'HarmBench':         { bg: '#FEE2E2', text: '#991B1B' },
  'SafeScience':       { bg: '#F0FDF4', text: '#166534' },
  'AgentHarm':         { bg: '#EDE9FE', text: '#5B21B6' },
  'MH-Crisis':         { bg: '#FDF2F8', text: '#9D174D' },
  'Gretel':            { bg: '#EFF6FF', text: '#1D4ED8' },
  'INTIMA':            { bg: '#FFF7ED', text: '#9A3412' },
  'SocialHarm Bench':  { bg: '#F0FDF4', text: '#065F46' },
  'PentestEval':       { bg: '#F8FAFC', text: '#334155' },
  'DarkBench':         { bg: '#1F2937', text: '#F9FAFB' },
  'FORTRESS':          { bg: '#FEF9C3', text: '#713F12' },
  'Aegis':             { bg: '#FAF5FF', text: '#581C87' },
}

// Map short category names to risk repository links
const RISK_LINKS: Record<string, string> = {
  'Harmful Knowledge Uplift':        '/risk-repository',
  'Autonomous Harmful Action':       '/risk-repository',
  'Cyber Capability Uplift':         '/risk-repository',
  'Security':                        '/risk-repository',
  'Inadvertent Discrimination':      '/risk-repository',
  'Privacy Violation':               '/risk-repository',
  'Mental Health':                   '/risk-repository',
  'Opaque Decision-Making':          '/risk-repository',
  'Manipulation & Mass Influence':   '/risk-repository',
  'IP & Confidentiality':            '/risk-repository',
  'Fraud & Social Engineering':      '/risk-repository',
  'Misinformation':                  '/risk-repository',
  'Persuasion':                      '/risk-repository',
  'Content Safety — Harmful Content': '/risk-repository',
  'Content Safety — Illicit Behaviour': '/risk-repository',
}

function SourceBadge({ source }: { source: string | null }) {
  if (!source) return null
  const col = SOURCE_COLORS[source] ?? { bg: '#F3F4F6', text: '#374151' }
  return (
    <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
      style={{ backgroundColor: col.bg, color: col.text }}>
      {source}
    </span>
  )
}

function QualityDots({ quality }: { quality: number | null }) {
  if (!quality) return null
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: i <= quality ? '#4338CA' : '#E5E7EB' }} />
      ))}
    </div>
  )
}

function VectorCard({
  vector,
  isSelected,
  onClick,
}: {
  vector: ThreatVector
  isSelected: boolean
  onClick: () => void
}) {
  const count = vector.samples.length
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2.5 rounded-xl border transition-all"
      style={isSelected
        ? { borderColor: '#818CF8', backgroundColor: '#EEF2FF' }
        : { borderColor: '#E5E7EB', backgroundColor: 'white' }
      }
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-gray-900 leading-snug flex-1">{vector.name}</p>
        <span
          className="flex-shrink-0 text-xs font-bold px-1.5 py-0.5 rounded-full"
          style={count > 0
            ? { backgroundColor: '#EEF2FF', color: '#3730A3' }
            : { backgroundColor: '#F3F4F6', color: '#9CA3AF' }
          }
        >
          {count}
        </span>
      </div>
      {count === 0 && (
        <p className="text-xs text-gray-400 mt-0.5 italic">No samples yet</p>
      )}
    </button>
  )
}

export default function SelfAuditClient() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedVectorName, setSelectedVectorName] = useState<string | null>(null)
  const [sourceFilter, setSourceFilter] = useState<string>('ALL')
  const [search, setSearch] = useState('')
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const selectedCategory = useMemo(
    () => AUDIT_CATEGORIES.find((c) => c.id === selectedCategoryId) ?? null,
    [selectedCategoryId]
  )

  const selectedVector = useMemo(
    () => selectedCategory?.vectors.find((v) => v.name === selectedVectorName) ?? null,
    [selectedCategory, selectedVectorName]
  )

  // All sources in selected category
  const availableSources = useMemo(() => {
    if (!selectedCategory) return []
    const srcs = new Set<string>()
    for (const v of selectedCategory.vectors) {
      for (const s of v.samples) {
        if (s.source) srcs.add(s.source)
      }
    }
    return Array.from(srcs).sort()
  }, [selectedCategory])

  // Filtered samples
  const filteredSamples = useMemo(() => {
    if (!selectedVector) return []
    return selectedVector.samples.filter((s) => {
      const matchSource = sourceFilter === 'ALL' || s.source === sourceFilter
      const q = search.toLowerCase()
      const matchSearch = !q || s.text.toLowerCase().includes(q)
      return matchSource && matchSearch
    })
  }, [selectedVector, sourceFilter, search])

  // Total samples in selected category
  const categoryTotal = selectedCategory
    ? selectedCategory.vectors.reduce((sum, v) => sum + v.samples.length, 0)
    : 0

  function copyToClipboard(text: string, idx: number) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 1500)
    })
  }

  function handleCategorySelect(cat: RiskCategory) {
    setSelectedCategoryId(cat.id)
    setSelectedVectorName(null)
    setSourceFilter('ALL')
    setSearch('')
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#1E1B4B' }}>Self Audit</h1>
        <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">
          Test your AI system against curated risk scenarios drawn from published safety benchmarks and research datasets.
          Select a risk category, then a threat vector to browse test inputs. Each sample can be copied directly into your evaluation pipeline.
        </p>
        <div className="flex gap-4 mt-3 text-xs text-gray-400">
          <span><strong className="text-gray-700">{AUDIT_CATEGORIES.length}</strong> risk categories</span>
          <span><strong className="text-gray-700">{AUDIT_CATEGORIES.reduce((s, c) => s + c.vectors.length, 0)}</strong> threat vectors</span>
          <span><strong className="text-gray-700">{AUDIT_CATEGORIES.reduce((s, c) => s + c.vectors.reduce((vs, v) => vs + v.samples.length, 0), 0).toLocaleString()}</strong> test samples</span>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Left: Category list */}
        <div className="w-60 flex-shrink-0">
          <div className="sticky top-16">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Risk category</p>
            <div className="space-y-1">
              {AUDIT_CATEGORIES.map((cat) => {
                const total = cat.vectors.reduce((s, v) => s + v.samples.length, 0)
                const isActive = selectedCategoryId === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat)}
                    className="w-full text-left px-3 py-2 rounded-xl border text-xs transition-all"
                    style={isActive
                      ? { borderColor: '#818CF8', backgroundColor: '#EEF2FF', color: '#3730A3', fontWeight: 600 }
                      : { borderColor: '#E5E7EB', backgroundColor: 'white', color: '#374151' }
                    }
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="leading-snug flex-1">{cat.shortName}</span>
                      <span className="flex-shrink-0 font-bold" style={{ color: isActive ? '#3730A3' : '#9CA3AF' }}>
                        {total}
                      </span>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: isActive ? '#6366F1' : '#9CA3AF' }}>
                      {cat.vectors.length} vector{cat.vectors.length !== 1 ? 's' : ''}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Middle: Threat vectors */}
        <div className="w-72 flex-shrink-0">
          {!selectedCategory ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="mb-2 opacity-20">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              <p className="text-sm">Select a risk category</p>
            </div>
          ) : (
            <div className="sticky top-16">
              {/* Category header */}
              <div className="mb-3 p-3 rounded-xl border border-gray-200 bg-gray-50">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">Risk category</p>
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{selectedCategory.shortName}</p>
                  </div>
                  <Link
                    href={RISK_LINKS[selectedCategory.shortName] ?? '/risk-repository'}
                    className="flex-shrink-0 text-xs text-indigo-600 hover:underline flex items-center gap-1 mt-1"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
                    Risk repo
                  </Link>
                </div>
                <div className="flex gap-3 mt-2 text-xs text-gray-400">
                  <span><strong className="text-gray-700">{categoryTotal}</strong> samples</span>
                  <span><strong className="text-gray-700">{selectedCategory.vectors.length}</strong> vectors</span>
                </div>
              </div>

              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Threat vectors</p>
              <div className="space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
                {selectedCategory.vectors.map((v) => (
                  <VectorCard
                    key={v.name}
                    vector={v}
                    isSelected={selectedVectorName === v.name}
                    onClick={() => {
                      setSelectedVectorName(v.name)
                      setSourceFilter('ALL')
                      setSearch('')
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Samples table */}
        <div className="flex-1 min-w-0">
          {!selectedVector ? (
            <div className="flex flex-col items-center justify-center py-24 text-center text-gray-400">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="mb-3 opacity-20">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
              <p className="text-sm">Select a threat vector to browse test inputs</p>
            </div>
          ) : (
            <div>
              {/* Vector header */}
              <div className="border border-gray-200 rounded-xl p-4 mb-4">
                <p className="text-xs text-gray-400 mb-1">Threat vector</p>
                <h2 className="text-base font-semibold text-gray-900 mb-1">{selectedVector.name}</h2>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <span><strong className="text-gray-900">{selectedVector.samples.length}</strong> test sample{selectedVector.samples.length !== 1 ? 's' : ''}</span>
                  {selectedVector.samples.length === 0 && (
                    <span className="text-amber-600 font-medium">⚠ No samples yet — more being added</span>
                  )}
                </div>
              </div>

              {selectedVector.samples.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl text-gray-400">
                  <p className="text-sm font-medium">No test samples for this vector yet</p>
                  <p className="text-xs mt-1">Check back as the dataset grows</p>
                </div>
              ) : (
                <>
                  {/* Filters */}
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search samples…"
                      className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400 flex-1 min-w-0"
                    />
                    <select
                      value={sourceFilter}
                      onChange={(e) => setSourceFilter(e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400 bg-white"
                    >
                      <option value="ALL">All sources</option>
                      {availableSources.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <p className="text-xs text-gray-400 mb-3">
                    Showing <strong className="text-gray-700">{filteredSamples.length}</strong> of {selectedVector.samples.length} samples
                  </p>

                  {/* Samples */}
                  <div className="space-y-2">
                    {filteredSamples.map((sample, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-xl p-4 bg-white hover:border-indigo-200 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm text-gray-800 leading-relaxed flex-1">{sample.text}</p>
                          <button
                            onClick={() => copyToClipboard(sample.text, idx)}
                            className="flex-shrink-0 mt-0.5 p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                            title="Copy to clipboard"
                          >
                            {copiedIdx === idx ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="#16A34A">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                              </svg>
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="#9CA3AF">
                                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                              </svg>
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <SourceBadge source={sample.source} />
                          {sample.quality !== null && (
                            <div className="flex items-center gap-1.5">
                              <QualityDots quality={sample.quality} />
                              <span className="text-xs text-gray-400">quality {sample.quality}/5</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
