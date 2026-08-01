'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'

// ─── Types ─────────────────────────────────────────────────────────────────────
interface RiskVersion {
  id: string
  version: string
  label: string | null
  notes: string | null
  createdAt: string
  _count?: { risks: number }
}

interface Risk {
  id: string
  riskNum: number
  category: string
  title: string
  description: string
  versionId: string
  _count?: { votes: number; comments: number }
}

interface VoteData {
  distribution: Record<string, number>
  count: number
  mean: number
  median: number
  q1: number
  q3: number
  userVote: number | null
}

interface Comment {
  id: string
  body: string
  createdAt: string
  user: { id: string; name: string | null; username: string | null; image: string | null }
}

interface DiffResult {
  added: Risk[]
  removed: Risk[]
  modified: { before: Risk; after: Risk }[]
  unchanged: number
}

// ─── Category colours ──────────────────────────────────────────────────────────
const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Harmful Knowledge & Capability Uplift': { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  'Autonomous & Agentic Harm':             { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
  'Manipulation, Deception & Societal Harm': { bg: '#EDE9FE', text: '#5B21B6', border: '#C4B5FD' },
  'Loss of Control & Alignment Failure':   { bg: '#FFF7ED', text: '#9A3412', border: '#FDBA74' },
  'Cyber Offence & Security':              { bg: '#F0FDF4', text: '#166534', border: '#86EFAC' },
  'Systemic & Civilisational Risks':       { bg: '#FDF2F8', text: '#86198F', border: '#F0ABFC' },
  'Content Harms':                         { bg: '#FFF1F2', text: '#9F1239', border: '#FDA4AF' },
  'Privacy, Discrimination & Rights Violations': { bg: '#EFF6FF', text: '#1D4ED8', border: '#93C5FD' },
}

const CATEGORIES = Object.keys(CAT_COLORS)

// ─── Distribution Chart (SVG) ──────────────────────────────────────────────────
function DistributionChart({ data }: { data: VoteData }) {
  const W = 260, H = 90, PAD_L = 20, PAD_R = 8, PAD_T = 8, PAD_B = 24
  const chartW = W - PAD_L - PAD_R
  const chartH = H - PAD_T - PAD_B
  const maxVal = Math.max(...Object.values(data.distribution), 1)
  const barW = chartW / 11 - 2

  const bars = Array.from({ length: 11 }, (_, i) => {
    const count = data.distribution[i] ?? 0
    const h = (count / maxVal) * chartH
    const x = PAD_L + i * (chartW / 11)
    const y = PAD_T + chartH - h
    return { i, count, h, x, y }
  })

  // Quartile x-positions
  const xOf = (v: number) => PAD_L + v * (chartW / 10)

  return (
    <svg width={W} height={H} className="overflow-visible">
      {/* Bars */}
      {bars.map(({ i, h, x, y, count }) => (
        <g key={i}>
          <rect
            x={x + 1}
            y={y}
            width={barW}
            height={Math.max(h, 1)}
            rx={2}
            fill={i <= 3 ? '#86EFAC' : i <= 6 ? '#FCD34D' : '#FCA5A5'}
            opacity={count === 0 ? 0.25 : 0.85}
          />
          {count > 0 && h > 14 && (
            <text x={x + 1 + barW / 2} y={y + 10} textAnchor="middle" fontSize={8} fill="#374151">{count}</text>
          )}
        </g>
      ))}

      {/* Q1–Q3 box overlay */}
      {data.count > 0 && (
        <rect
          x={xOf(data.q1)}
          y={PAD_T}
          width={xOf(data.q3) - xOf(data.q1)}
          height={chartH}
          fill="#1E1B4B"
          opacity={0.07}
          rx={2}
        />
      )}

      {/* Median line */}
      {data.count > 0 && (
        <line
          x1={xOf(data.median)} y1={PAD_T - 2}
          x2={xOf(data.median)} y2={PAD_T + chartH + 2}
          stroke="#1E1B4B" strokeWidth={1.5} strokeDasharray="3,2"
        />
      )}

      {/* Q1 / Q3 tick labels */}
      {data.count > 0 && (
        <>
          <text x={xOf(data.q1)} y={H - 2} textAnchor="middle" fontSize={8} fill="#6B7280">Q1={data.q1}</text>
          <text x={xOf(data.median)} y={H - 2} textAnchor="middle" fontSize={8} fill="#1E1B4B" fontWeight="bold">M={data.median}</text>
          <text x={xOf(data.q3)} y={H - 2} textAnchor="middle" fontSize={8} fill="#6B7280">Q3={data.q3}</text>
        </>
      )}

      {/* X-axis labels 0 and 10 */}
      <text x={PAD_L} y={H} textAnchor="middle" fontSize={8} fill="#9CA3AF">0</text>
      <text x={W - PAD_R} y={H} textAnchor="middle" fontSize={8} fill="#9CA3AF">10</text>
    </svg>
  )
}

// ─── Voting widget ─────────────────────────────────────────────────────────────
function VotingWidget({ riskId, onVoted }: { riskId: string; onVoted?: () => void }) {
  const { data: session } = useSession()
  const [voteData, setVoteData] = useState<VoteData | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch(`/api/risks/${riskId}/votes`)
    if (res.ok) setVoteData(await res.json())
  }, [riskId])

  useEffect(() => { load() }, [load])

  async function castVote(score: number) {
    if (!session) { setMessage('Sign in to vote'); return }
    if (voteData?.userVote !== null && voteData?.userVote !== undefined) return
    setSubmitting(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/risks/${riskId}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(data.error ?? 'Failed to vote')
      } else {
        setMessage('Vote recorded!')
        await load()
        onVoted?.()
      }
    } finally { setSubmitting(false) }
  }

  const hasVoted = voteData !== null && voteData.userVote !== null && voteData.userVote !== undefined
  const isLoading = voteData === null

  return (
    <div className="space-y-3">
      {/* Chart */}
      {!isLoading && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Risk severity distribution</span>
            <span className="text-xs text-gray-400">{voteData!.count} vote{voteData!.count !== 1 ? 's' : ''}{voteData!.count > 0 ? ` · avg ${voteData!.mean}` : ''}</span>
          </div>
          {voteData!.count === 0 ? (
            <div className="text-xs text-gray-400 italic py-2">No votes yet — be the first to rate this risk.</div>
          ) : (
            <DistributionChart data={voteData!} />
          )}
        </div>
      )}

      {/* Vote buttons */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          {hasVoted ? `Your vote: ${voteData!.userVote}/10` : 'Rate severity (0 = negligible, 10 = catastrophic)'}
        </p>
        <div className="flex gap-1 flex-wrap">
          {Array.from({ length: 11 }, (_, i) => {
            const isSelected = hasVoted && voteData!.userVote === i
            const isHovered = !hasVoted && hovered === i
            return (
              <button
                key={i}
                onClick={() => !hasVoted && castVote(i)}
                onMouseEnter={() => !hasVoted && setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                disabled={submitting || hasVoted}
                className="w-8 h-8 rounded-md text-xs font-bold border transition-all"
                style={
                  isSelected
                    ? { backgroundColor: '#1E1B4B', color: 'white', borderColor: '#1E1B4B' }
                    : isHovered
                    ? { backgroundColor: '#EEF2FF', color: '#1E1B4B', borderColor: '#818CF8' }
                    : { backgroundColor: 'white', color: '#6B7280', borderColor: '#E5E7EB', cursor: hasVoted ? 'default' : 'pointer' }
                }
                title={`Score ${i}`}
              >
                {i}
              </button>
            )
          })}
        </div>
        {message && (
          <p className={`text-xs mt-1.5 ${message.includes('recorded') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>
        )}
        {!session && (
          <p className="text-xs text-gray-400 mt-1">
            <a href="/auth/signin" className="text-indigo-600 hover:underline">Sign in</a> to cast your vote.
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Comments section ──────────────────────────────────────────────────────────
function CommentsSection({ riskId }: { riskId: string }) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/risks/${riskId}/comments`).then((r) => r.json()).then(setComments)
  }, [riskId])

  async function submit() {
    if (!body.trim()) return
    setSubmitting(true); setError(null)
    try {
      const res = await fetch(`/api/risks/${riskId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setComments((prev) => [...prev, data])
      setBody('')
    } finally { setSubmitting(false) }
  }

  const initials = (name: string | null) => (name ?? '?').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
  const timeAgo = (d: string) => {
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
    if (s < 60) return 'just now'
    if (s < 3600) return `${Math.floor(s / 60)}m ago`
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`
    return `${Math.floor(s / 86400)}d ago`
  }

  return (
    <div className="mt-5 border-t border-gray-100 pt-4 space-y-4">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Comments ({comments.length})</h4>

      {comments.length === 0 && <p className="text-xs text-gray-400 italic">No comments yet.</p>}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: '#EEF2FF', color: '#3730A3' }}>
              {c.user.image
                ? <img src={c.user.image} alt="" className="w-7 h-7 rounded-full" />
                : initials(c.user.name)
              }
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-semibold text-gray-800">{c.user.name ?? c.user.username ?? 'User'}</span>
                <span className="text-xs text-gray-400">{timeAgo(c.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-700 mt-0.5">{c.body}</p>
            </div>
          </div>
        ))}
      </div>

      {session ? (
        <div className="flex gap-2 pt-1">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add a comment…"
            rows={2}
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-indigo-400"
          />
          <button
            onClick={submit}
            disabled={submitting || !body.trim()}
            className="px-3 py-1 rounded-lg text-sm font-semibold self-end transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#1E1B4B', color: 'white' }}
          >
            {submitting ? '…' : 'Post'}
          </button>
        </div>
      ) : (
        <p className="text-xs text-gray-400"><a href="/auth/signin" className="text-indigo-600 hover:underline">Sign in</a> to comment.</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ─── Risk Row ──────────────────────────────────────────────────────────────────
function RiskRow({ risk }: { risk: Risk }) {
  const [expanded, setExpanded] = useState(false)
  const col = CAT_COLORS[risk.category] ?? { bg: '#F9FAFB', text: '#374151', border: '#E5E7EB' }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-2">
      {/* Header row */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
      >
        <span className="text-xs font-mono text-gray-400 mt-0.5 w-8 flex-shrink-0">#{risk.riskNum}</span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className="inline-block px-2 py-0.5 rounded-full text-xs font-medium border"
              style={{ backgroundColor: col.bg, color: col.text, borderColor: col.border }}
            >
              {risk.category}
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-900">{risk.title}</p>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{risk.description}</p>
        </div>
        <div className="flex items-center gap-3 ml-2 flex-shrink-0">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
            {risk._count?.votes ?? 0}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" /></svg>
            {risk._count?.comments ?? 0}
          </span>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
            className="text-gray-400 transition-transform flex-shrink-0"
            style={{ transform: expanded ? 'rotate(90deg)' : 'none', color: '#9CA3AF' }}
          >
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </div>
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 bg-white">
          <p className="text-sm text-gray-700 mt-4 leading-relaxed">{risk.description}</p>
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VotingWidget riskId={risk.id} />
            <CommentsSection riskId={risk.id} />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Submit risk form ──────────────────────────────────────────────────────────
function SubmitRiskForm() {
  const [form, setForm] = useState({ category: '', title: '', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; id?: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true); setResult(null)
    try {
      const res = await fetch('/api/risks/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setResult({ success: false, message: data.error ?? 'Submission failed' })
      } else {
        setResult({ success: true, message: data.message, id: data.submission.id })
        setForm({ category: '', title: '', description: '' })
      }
    } finally { setSubmitting(false) }
  }

  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-1">Submit a new risk</h3>
      <p className="text-xs text-gray-400 mb-4">Propose a risk for inclusion in the next version. Submissions are reviewed before being added to the repository.</p>

      {result && (
        <div
          className="mb-4 px-4 py-3 rounded-lg text-sm font-medium border"
          style={
            result.success
              ? { backgroundColor: '#F0FDF4', borderColor: '#86EFAC', color: '#166534' }
              : { backgroundColor: '#FEF2F2', borderColor: '#FECACA', color: '#991B1B' }
          }
        >
          {result.message}
          {result.success && result.id && (
            <span className="block text-xs mt-1 opacity-70">Reference ID: {result.id}</span>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Category *</label>
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 bg-white"
            required
          >
            <option value="">Select a category…</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Risk title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Adversarial fine-tuning attacks"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
            required minLength={5}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Describe the risk clearly, including how it arises and what harm it causes…"
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-indigo-400"
            required minLength={20}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
          style={{ backgroundColor: '#1E1B4B', color: 'white' }}
        >
          {submitting ? 'Submitting…' : 'Submit risk'}
        </button>
      </form>
    </div>
  )
}

// ─── Version diff panel ────────────────────────────────────────────────────────
function VersionDiff({ fromId, toId }: { fromId: string; toId: string }) {
  const [diff, setDiff] = useState<DiffResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/risks/diff?from=${fromId}&to=${toId}`)
      .then((r) => r.json())
      .then((d) => { setDiff(d); setLoading(false) })
  }, [fromId, toId])

  if (loading) return <div className="text-sm text-gray-400 py-4 text-center">Loading diff…</div>
  if (!diff) return null

  return (
    <div className="border border-gray-200 rounded-xl p-5 mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Version changes</h3>
      <div className="flex gap-4 text-sm mb-4">
        <span className="text-green-700 font-medium">+{diff.added.length} added</span>
        <span className="text-red-600 font-medium">−{diff.removed.length} removed</span>
        <span className="text-amber-600 font-medium">~{diff.modified.length} modified</span>
        <span className="text-gray-400">{diff.unchanged} unchanged</span>
      </div>

      {diff.added.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">Added</p>
          <div className="space-y-1">
            {diff.added.map((r) => (
              <div key={r.id} className="text-xs px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-green-900">
                <span className="font-medium">#{r.riskNum}</span> {r.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {diff.removed.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">Removed</p>
          <div className="space-y-1">
            {diff.removed.map((r) => (
              <div key={r.id} className="text-xs px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-red-900">
                <span className="font-medium">#{r.riskNum}</span> {r.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {diff.modified.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Modified</p>
          <div className="space-y-2">
            {diff.modified.map(({ before, after }) => (
              <div key={after.id} className="text-xs px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="font-semibold text-amber-900">#{after.riskNum} {after.title}</p>
                {before.title !== after.title && (
                  <p className="mt-1 text-amber-700">Title: <span className="line-through opacity-60">{before.title}</span> → {after.title}</p>
                )}
                {before.description !== after.description && (
                  <p className="mt-1 text-amber-700">Description updated</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function RiskClient() {
  const [versions, setVersions] = useState<RiskVersion[]>([])
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null)
  const [compareVersionId, setCompareVersionId] = useState<string | null>(null)
  const [showDiff, setShowDiff] = useState(false)
  const [risks, setRisks] = useState<Risk[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])  // empty = all
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'risks' | 'submit'>('risks')

  // Load versions
  useEffect(() => {
    fetch('/api/risks/versions').then((r) => r.json()).then((v: RiskVersion[]) => {
      setVersions(v)
      if (v.length > 0) setCurrentVersionId(v[v.length - 1].id)
    })
  }, [])

  // Load risks when version changes
  useEffect(() => {
    if (!currentVersionId) return
    setLoading(true)
    fetch(`/api/risks?versionId=${currentVersionId}`)
      .then((r) => r.json())
      .then(({ risks }) => { setRisks(risks ?? []); setLoading(false) })
  }, [currentVersionId])

  // Filtered risks
  const filtered = risks.filter((r) => {
    const matchCat = selectedCategories.length === 0 || selectedCategories.includes(r.category)
    const q = search.toLowerCase()
    const matchSearch = !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const currentVersion = versions.find((v) => v.id === currentVersionId)
  const prevVersion = currentVersion
    ? versions[versions.findIndex((v) => v.id === currentVersionId) - 1]
    : undefined

  // Category counts for current filtered set (before category filter)
  const catCounts: Record<string, number> = {}
  for (const r of risks) catCounts[r.category] = (catCounts[r.category] ?? 0) + 1

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1E1B4B' }}>Risk Repository</h1>
            <p className="text-sm text-gray-500 mt-1">
              Community-maintained catalogue of AI system risks. Rate severity, comment, and propose new risks.
            </p>
          </div>

          {/* Version selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Version</label>
            <select
              value={currentVersionId ?? ''}
              onChange={(e) => { setCurrentVersionId(e.target.value); setShowDiff(false) }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400 bg-white"
            >
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  v{v.version}{v.label ? ` — ${v.label}` : ''} ({v._count?.risks ?? '?'} risks)
                </option>
              ))}
            </select>
            {prevVersion && (
              <button
                onClick={() => setShowDiff((s) => !s)}
                className="px-3 py-1.5 text-xs font-semibold border rounded-lg transition-colors"
                style={showDiff
                  ? { backgroundColor: '#1E1B4B', color: 'white', borderColor: '#1E1B4B' }
                  : { backgroundColor: 'white', color: '#374151', borderColor: '#D1D5DB' }
                }
              >
                {showDiff ? 'Hide diff' : `Diff vs v${prevVersion.version}`}
              </button>
            )}
          </div>
        </div>

        {/* Version notes */}
        {currentVersion?.notes && (
          <div className="mt-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 border border-gray-200 bg-gray-50">
            {currentVersion.notes}
          </div>
        )}
      </div>

      {/* Diff panel */}
      {showDiff && prevVersion && currentVersionId && (
        <VersionDiff fromId={prevVersion.id} toId={currentVersionId} />
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-5">
        {[
          { id: 'risks', label: `Risk list (${risks.length})` },
          { id: 'submit', label: 'Submit a risk' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as 'risks' | 'submit')}
            className="px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px"
            style={activeTab === t.id
              ? { color: '#1E1B4B', borderColor: '#1E1B4B' }
              : { color: '#6B7280', borderColor: 'transparent' }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'submit' && (
        <div className="max-w-2xl">
          <SubmitRiskForm />
        </div>
      )}

      {activeTab === 'risks' && (
        <div className="flex gap-6">
          {/* Sidebar filters */}
          <div className="w-56 flex-shrink-0">
            <div className="sticky top-16">
              {/* Search */}
              <div className="mb-4">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search risks…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</h3>
                {selectedCategories.length > 0 && (
                  <button onClick={() => setSelectedCategories([])} className="text-xs text-indigo-600 hover:underline">
                    Clear
                  </button>
                )}
              </div>

              {/* Select all */}
              <label className="flex items-center gap-2 cursor-pointer mb-1">
                <div
                  onClick={() => setSelectedCategories([])}
                  className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer"
                  style={{
                    backgroundColor: selectedCategories.length === 0 ? '#1E1B4B' : 'white',
                    borderColor: selectedCategories.length === 0 ? '#1E1B4B' : '#D1D5DB',
                  }}
                >
                  {selectedCategories.length === 0 && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="white">
                      <path d="M1.5 6l3 3 6-6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-700">All categories</span>
                <span className="ml-auto text-xs text-gray-400">{risks.length}</span>
              </label>

              <div className="space-y-0.5 mt-1">
                {CATEGORIES.map((cat) => {
                  const col = CAT_COLORS[cat]
                  const count = catCounts[cat] ?? 0
                  const checked = selectedCategories.includes(cat)
                  return (
                    <label key={cat} className="flex items-start gap-2 cursor-pointer group py-0.5">
                      <div
                        onClick={() => toggleCategory(cat)}
                        className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors cursor-pointer"
                        style={{
                          backgroundColor: checked ? '#1E1B4B' : 'white',
                          borderColor: checked ? '#1E1B4B' : '#D1D5DB',
                        }}
                      >
                        {checked && (
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="white">
                            <path d="M1.5 6l3 3 6-6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-gray-700 leading-tight block">{cat}</span>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{count}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Risk list */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-lg font-semibold text-gray-600 mb-1">No risks found</p>
                <p className="text-sm">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-gray-400 mb-3">
                  Showing <span className="font-semibold text-gray-700">{filtered.length}</span> of {risks.length} risks
                  {search && <> matching &ldquo;<span className="text-indigo-600">{search}</span>&rdquo;</>}
                </p>
                {filtered.map((r) => <RiskRow key={r.id} risk={r} />)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
