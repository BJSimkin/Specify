'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { AUDIT_CATEGORIES, type RiskCategory, type ThreatVector } from '@/lib/scenarios-data'

// ─── Source badge colours ──────────────────────────────────────────────────────
const SOURCE_COLORS: Record<string, { bg: string; text: string }> = {
  'WMDP':             { bg: '#FEF3C7', text: '#92400E' },
  'HarmBench':        { bg: '#FEE2E2', text: '#991B1B' },
  'SafeScience':      { bg: '#F0FDF4', text: '#166534' },
  'AgentHarm':        { bg: '#EDE9FE', text: '#5B21B6' },
  'MH-Crisis':        { bg: '#FDF2F8', text: '#9D174D' },
  'Gretel':           { bg: '#EFF6FF', text: '#1D4ED8' },
  'INTIMA':           { bg: '#FFF7ED', text: '#9A3412' },
  'SocialHarm Bench': { bg: '#F0FDF4', text: '#065F46' },
  'PentestEval':      { bg: '#F8FAFC', text: '#334155' },
  'DarkBench':        { bg: '#1F2937', text: '#F9FAFB' },
  'FORTRESS':         { bg: '#FEF9C3', text: '#713F12' },
  'Aegis':            { bg: '#FAF5FF', text: '#581C87' },
}

const RISK_LINKS: Record<string, string> = {
  'Harmful Knowledge Uplift':          '/risk-repository',
  'Autonomous Harmful Action':         '/risk-repository',
  'Cyber Capability Uplift':           '/risk-repository',
  'Security':                          '/risk-repository',
  'Inadvertent Discrimination':        '/risk-repository',
  'Privacy Violation':                 '/risk-repository',
  'Mental Health':                     '/risk-repository',
  'Opaque Decision-Making':            '/risk-repository',
  'Manipulation & Mass Influence':     '/risk-repository',
  'IP & Confidentiality':              '/risk-repository',
  'Fraud & Social Engineering':        '/risk-repository',
  'Misinformation':                    '/risk-repository',
  'Persuasion':                        '/risk-repository',
  'Content Safety — Harmful Content':  '/risk-repository',
  'Content Safety — Illicit Behaviour':'/risk-repository',
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

// ─── Download helper ───────────────────────────────────────────────────────────
function downloadDataset(format: 'csv' | 'json') {
  const rows: object[] = []
  for (const cat of AUDIT_CATEGORIES) {
    for (const vec of cat.vectors) {
      for (let i = 0; i < vec.samples.length; i++) {
        const s = vec.samples[i]
        rows.push({
          category_id: cat.id,
          category: cat.shortName,
          threat_vector: vec.name,
          sample_index: i,
          prompt: s.text,
          source: s.source ?? '',
          quality_rating: s.quality ?? '',
        })
      }
    }
  }

  if (format === 'json') {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'specify-self-audit-dataset.json'; a.click()
    URL.revokeObjectURL(url)
  } else {
    const headers = Object.keys(rows[0] as object)
    const escape = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const csv = [
      headers.join(','),
      ...rows.map((r) => headers.map((h) => escape((r as Record<string, unknown>)[h])).join(',')),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'specify-self-audit-dataset.csv'; a.click()
    URL.revokeObjectURL(url)
  }
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function SelfAuditClient() {
  const { data: session } = useSession()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedVectorName, setSelectedVectorName] = useState<string | null>(null)
  const [sourceFilter, setSourceFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [showDownload, setShowDownload] = useState(false)

  // Quality vote data: counts + user's voted keys
  const [qualityCounts, setQualityCounts] = useState<Record<string, number>>({})
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set())
  const [votingKey, setVotingKey] = useState<string | null>(null)

  const selectedCategory = useMemo(
    () => AUDIT_CATEGORIES.find((c) => c.id === selectedCategoryId) ?? null,
    [selectedCategoryId]
  )

  const selectedVector = useMemo(
    () => selectedCategory?.vectors.find((v) => v.name === selectedVectorName) ?? null,
    [selectedCategory, selectedVectorName]
  )

  // Fetch quality data when vector changes
  const fetchQuality = useCallback(async (categoryId: string, vectorName: string) => {
    try {
      const res = await fetch(
        `/api/prompt-quality?categoryId=${encodeURIComponent(categoryId)}&vectorName=${encodeURIComponent(vectorName)}`
      )
      if (!res.ok) return
      const data = await res.json()
      setQualityCounts((prev) => ({ ...prev, ...data.counts }))
      setUserVotes((prev) => {
        const next = new Set(prev)
        for (const k of data.userVotes) next.add(k)
        return next
      })
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    if (selectedCategoryId && selectedVectorName) {
      fetchQuality(selectedCategoryId, selectedVectorName)
    }
  }, [selectedCategoryId, selectedVectorName, fetchQuality])

  async function toggleVote(promptKey: string) {
    if (!session) return
    setVotingKey(promptKey)
    try {
      const res = await fetch('/api/prompt-quality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptKey }),
      })
      if (!res.ok) return
      const data = await res.json()
      setUserVotes((prev) => {
        const next = new Set(prev)
        if (data.action === 'added') next.add(promptKey)
        else next.delete(promptKey)
        return next
      })
      setQualityCounts((prev) => ({
        ...prev,
        [promptKey]: (prev[promptKey] ?? 0) + (data.action === 'added' ? 1 : -1),
      }))
    } finally {
      setVotingKey(null)
    }
  }

  const availableSources = useMemo(() => {
    if (!selectedCategory) return []
    const srcs = new Set<string>()
    for (const v of selectedCategory.vectors) {
      for (const s of v.samples) { if (s.source) srcs.add(s.source) }
    }
    return Array.from(srcs).sort()
  }, [selectedCategory])

  // Samples with their prompt keys + quality counts, then sorted by confirmations
  const samplesWithKeys = useMemo(() => {
    if (!selectedVector || !selectedCategoryId) return []
    return selectedVector.samples.map((s, i) => {
      const key = `${selectedCategoryId}:::${selectedVectorName}:::${i}`
      return { ...s, promptKey: key, confirmations: qualityCounts[key] ?? 0 }
    })
  }, [selectedVector, selectedCategoryId, selectedVectorName, qualityCounts])

  const filteredSamples = useMemo(() => {
    const base = samplesWithKeys.filter((s) => {
      const matchSource = sourceFilter === 'ALL' || s.source === sourceFilter
      const q = search.toLowerCase()
      return matchSource && (!q || s.text.toLowerCase().includes(q))
    })
    // Sort by confirmations descending, then original order
    return [...base].sort((a, b) => b.confirmations - a.confirmations)
  }, [samplesWithKeys, sourceFilter, search])

  const categoryTotal = selectedCategory
    ? selectedCategory.vectors.reduce((s, v) => s + v.samples.length, 0)
    : 0

  const totalSamples = AUDIT_CATEGORIES.reduce(
    (s, c) => s + c.vectors.reduce((vs, v) => vs + v.samples.length, 0), 0
  )

  function handleCategorySelect(cat: RiskCategory) {
    setSelectedCategoryId(cat.id)
    setSelectedVectorName(null)
    setSourceFilter('ALL')
    setSearch('')
  }

  function copyToClipboard(text: string, idx: number) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 1500)
    })
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: '#1E1B4B' }}>Self Audit</h1>
            <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">
              Test your AI system against curated risk scenarios from published safety benchmarks.
              Confirm prompt quality to surface the best samples. Results feed the{' '}
              <Link href="/leaderboard" className="text-indigo-600 hover:underline">Model Leaderboard</Link>.
            </p>
            <div className="flex gap-4 mt-2 text-xs text-gray-400">
              <span><strong className="text-gray-700">{AUDIT_CATEGORIES.length}</strong> risk categories</span>
              <span><strong className="text-gray-700">{AUDIT_CATEGORIES.reduce((s, c) => s + c.vectors.length, 0)}</strong> threat vectors</span>
              <span><strong className="text-gray-700">{totalSamples.toLocaleString()}</strong> test samples</span>
            </div>
          </div>

          {/* Download button */}
          <div className="relative">
            <button
              onClick={() => setShowDownload((s) => !s)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors"
              style={{ backgroundColor: '#1E1B4B', color: 'white', borderColor: '#1E1B4B' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              Download dataset
            </button>
            {showDownload && (
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => { downloadDataset('csv'); setShowDownload(false) }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-green-600">
                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-.5 9H13v3.25L11.75 13 11 13.75l2 2 2-2-.75-.75L13 14.25V11h.5v-2H13V8h-1v1h-.5v2zM13 9V3.5L18.5 9H13z"/>
                  </svg>
                  Download CSV
                </button>
                <button
                  onClick={() => { downloadDataset('json'); setShowDownload(false) }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600">
                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM13 9V3.5L18.5 9H13z"/>
                  </svg>
                  Download JSON
                </button>
              </div>
            )}
          </div>
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
                      <span className="flex-shrink-0 font-bold" style={{ color: isActive ? '#3730A3' : '#9CA3AF' }}>{total}</span>
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
        <div className="w-64 flex-shrink-0">
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
                    <p className="text-xs text-gray-500 mb-0.5">Selected</p>
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
                {selectedCategory.vectors.map((v) => {
                  const count = v.samples.length
                  const isSelected = selectedVectorName === v.name
                  return (
                    <button
                      key={v.name}
                      onClick={() => { setSelectedVectorName(v.name); setSourceFilter('ALL'); setSearch('') }}
                      className="w-full text-left px-3 py-2.5 rounded-xl border transition-all"
                      style={isSelected
                        ? { borderColor: '#818CF8', backgroundColor: '#EEF2FF' }
                        : { borderColor: '#E5E7EB', backgroundColor: 'white' }
                      }
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium text-gray-900 leading-snug flex-1">{v.name}</p>
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
                      {count === 0 && <p className="text-xs text-gray-400 mt-0.5 italic">No samples yet</p>}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Samples */}
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
                <p className="text-xs text-gray-400 mb-0.5">Threat vector</p>
                <h2 className="text-sm font-semibold text-gray-900 mb-1">{selectedVector.name}</h2>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <span><strong className="text-gray-900">{selectedVector.samples.length}</strong> samples</span>
                  {selectedVector.samples.length === 0 && (
                    <span className="text-amber-600 font-medium">No samples yet</span>
                  )}
                  {!session && (
                    <span className="text-gray-400">
                      <a href="/auth/signin" className="text-indigo-600 hover:underline">Sign in</a> to confirm prompt quality
                    </span>
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
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <input
                      type="text" value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search samples…"
                      className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400 flex-1 min-w-0"
                    />
                    <select
                      value={sourceFilter}
                      onChange={(e) => setSourceFilter(e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-indigo-400"
                    >
                      <option value="ALL">All sources</option>
                      {availableSources.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <p className="text-xs text-gray-400 mb-3">
                    Showing <strong className="text-gray-700">{filteredSamples.length}</strong> of {selectedVector.samples.length} samples
                    · sorted by quality confirmations
                  </p>

                  {/* Samples */}
                  <div className="space-y-2">
                    {filteredSamples.map((sample, idx) => {
                      const hasVoted = userVotes.has(sample.promptKey)
                      const isVoting = votingKey === sample.promptKey
                      const confirmCount = sample.confirmations
                      return (
                        <div
                          key={idx}
                          className="border rounded-xl p-4 bg-white transition-colors"
                          style={{ borderColor: confirmCount > 0 ? '#C7D2FE' : '#E5E7EB' }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm text-gray-800 leading-relaxed flex-1">{sample.text}</p>
                            <button
                              onClick={() => copyToClipboard(sample.text, idx)}
                              className="flex-shrink-0 p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                              title="Copy prompt"
                            >
                              {copiedIdx === idx ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#16A34A"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                              ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#9CA3AF"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                              )}
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                            {/* Left: source + quality */}
                            <div className="flex items-center gap-3">
                              <SourceBadge source={sample.source} />
                              {sample.quality !== null && (
                                <div className="flex items-center gap-1.5">
                                  <QualityDots quality={sample.quality} />
                                  <span className="text-xs text-gray-400">{sample.quality}/5</span>
                                </div>
                              )}
                            </div>

                            {/* Right: confirm quality button */}
                            <button
                              onClick={() => session ? toggleVote(sample.promptKey) : undefined}
                              disabled={isVoting || !session}
                              title={session ? (hasVoted ? 'Remove quality confirmation' : 'Confirm prompt quality') : 'Sign in to confirm'}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all disabled:opacity-50"
                              style={hasVoted
                                ? { backgroundColor: '#EEF2FF', borderColor: '#818CF8', color: '#3730A3' }
                                : { backgroundColor: 'white', borderColor: '#E5E7EB', color: '#6B7280' }
                              }
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                              </svg>
                              {isVoting ? '…' : confirmCount > 0 ? `${confirmCount} confirmed` : 'Confirm quality'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
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
