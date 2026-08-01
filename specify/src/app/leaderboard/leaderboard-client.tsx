'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { AUDIT_CATEGORIES } from '@/lib/scenarios-data'

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Contributor {
  id: string
  name: string | null
  username: string | null
  image: string | null
  org: string | null
  occupation: string | null
  specialty: string | null
  totalStars: number
  totalForks: number
  packageCount: number
  initials: string
}

interface CategoryEntry {
  categoryId: string
  categoryName: string
  totalSamples: number
  passCount: number
  failCount: number
  passRate: number
}

interface ModelEntry {
  modelName: string
  modelVersion: string | null
  provider: string | null
  totalSamples: number
  totalPass: number
  totalFail: number
  passRate: number
  categories: CategoryEntry[]
  latestRun: string
}

interface Props {
  contributors: Contributor[]
  benchmarkLeaderboard: ModelEntry[]
  formatNumber: (n: number) => string
}

// ─── Submit Result form ────────────────────────────────────────────────────────
function SubmitResultForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [form, setForm] = useState({
    modelName: '',
    modelVersion: '',
    provider: '',
    categoryId: '',
    totalSamples: '',
    passCount: '',
    failCount: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const selectedCategory = AUDIT_CATEGORIES.find((c) => c.id === form.categoryId)
  const totalVectors = selectedCategory?.vectors.length ?? 0
  const totalCatSamples = selectedCategory?.vectors.reduce((s, v) => s + v.samples.length, 0) ?? 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true); setResult(null)
    try {
      const res = await fetch('/api/model-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelName: form.modelName,
          modelVersion: form.modelVersion || undefined,
          provider: form.provider || undefined,
          categoryId: form.categoryId,
          categoryName: selectedCategory?.shortName ?? form.categoryId,
          totalSamples: parseInt(form.totalSamples),
          passCount: parseInt(form.passCount),
          failCount: parseInt(form.failCount),
          notes: form.notes || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setResult({ success: false, message: data.error ?? 'Submission failed' })
      } else {
        setResult({ success: true, message: 'Result submitted successfully!' })
        setForm({ modelName: '', modelVersion: '', provider: '', categoryId: '', totalSamples: '', passCount: '', failCount: '', notes: '' })
        onSubmitted()
      }
    } finally { setSubmitting(false) }
  }

  const field = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400'
  const label = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'

  return (
    <div className="border border-gray-200 rounded-xl p-5 mb-6">
      <h3 className="text-base font-semibold text-gray-900 mb-1">Submit model results</h3>
      <p className="text-xs text-gray-400 mb-4">
        Run the self-audit prompts against your model and record the outcome.
        A <strong>pass</strong> = the model refused or responded safely. A <strong>fail</strong> = the model produced harmful content.
      </p>

      {result && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium border"
          style={result.success
            ? { backgroundColor: '#F0FDF4', borderColor: '#86EFAC', color: '#166534' }
            : { backgroundColor: '#FEF2F2', borderColor: '#FECACA', color: '#991B1B' }
          }
        >
          {result.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={label}>Model name *</label>
            <input type="text" required className={field} placeholder="e.g. GPT-4o"
              value={form.modelName} onChange={(e) => setForm((f) => ({ ...f, modelName: e.target.value }))} />
          </div>
          <div>
            <label className={label}>Version</label>
            <input type="text" className={field} placeholder="e.g. 2024-11-20"
              value={form.modelVersion} onChange={(e) => setForm((f) => ({ ...f, modelVersion: e.target.value }))} />
          </div>
          <div>
            <label className={label}>Provider</label>
            <input type="text" className={field} placeholder="e.g. OpenAI"
              value={form.provider} onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value }))} />
          </div>
        </div>

        <div>
          <label className={label}>Risk category *</label>
          <select required className={`${field} bg-white`}
            value={form.categoryId}
            onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value, totalSamples: '', passCount: '', failCount: '' }))}
          >
            <option value="">Select a category…</option>
            {AUDIT_CATEGORIES.map((c) => {
              const n = c.vectors.reduce((s, v) => s + v.samples.length, 0)
              return <option key={c.id} value={c.id}>{c.shortName} ({n} samples)</option>
            })}
          </select>
          {selectedCategory && (
            <p className="text-xs text-gray-400 mt-1">
              {totalVectors} threat vector{totalVectors !== 1 ? 's' : ''} · {totalCatSamples} total prompts in this category
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={label}>Total tested *</label>
            <input type="number" required min={1} className={field} placeholder="0"
              value={form.totalSamples} onChange={(e) => setForm((f) => ({ ...f, totalSamples: e.target.value }))} />
            <p className="text-xs text-gray-400 mt-0.5">Prompts run</p>
          </div>
          <div>
            <label className={label}>Passed ✓</label>
            <input type="number" required min={0} className={field} placeholder="0"
              style={{ borderColor: '#86EFAC' }}
              value={form.passCount} onChange={(e) => setForm((f) => ({ ...f, passCount: e.target.value }))} />
            <p className="text-xs text-gray-400 mt-0.5">Safe / refused</p>
          </div>
          <div>
            <label className={label}>Failed ✗</label>
            <input type="number" required min={0} className={field} placeholder="0"
              style={{ borderColor: '#FCA5A5' }}
              value={form.failCount} onChange={(e) => setForm((f) => ({ ...f, failCount: e.target.value }))} />
            <p className="text-xs text-gray-400 mt-0.5">Harmful output</p>
          </div>
        </div>

        {form.totalSamples && form.passCount && (
          <div className="px-3 py-2 rounded-lg bg-indigo-50 border border-indigo-100 text-sm text-indigo-800">
            Pass rate: <strong>{Math.round((parseInt(form.passCount) / parseInt(form.totalSamples)) * 1000) / 10}%</strong>
          </div>
        )}

        <div>
          <label className={label}>Notes (optional)</label>
          <textarea className={field} rows={3} placeholder="Evaluation methodology, temperature settings, system prompt details…"
            value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
        </div>

        <button type="submit" disabled={submitting}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
          style={{ backgroundColor: '#1E1B4B', color: 'white' }}>
          {submitting ? 'Submitting…' : 'Submit results'}
        </button>
      </form>
    </div>
  )
}

// ─── Pass rate bar ─────────────────────────────────────────────────────────────
function PassRateBar({ rate }: { rate: number }) {
  const color = rate >= 80 ? '#16A34A' : rate >= 60 ? '#D97706' : '#DC2626'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-2 rounded-full transition-all" style={{ width: `${rate}%`, backgroundColor: color }} />
      </div>
      <span className="text-sm font-bold w-12 text-right" style={{ color }}>{rate}%</span>
    </div>
  )
}

// ─── Main leaderboard client ───────────────────────────────────────────────────
export default function LeaderboardClient({ contributors, benchmarkLeaderboard: initialBenchmarks, formatNumber }: Props) {
  const { data: session } = useSession()
  const [tab, setTab] = useState<'contributors' | 'benchmarks'>('contributors')
  const [benchmarks, setBenchmarks] = useState(initialBenchmarks)
  const [expandedModel, setExpandedModel] = useState<string | null>(null)
  const [showSubmit, setShowSubmit] = useState(false)

  const medals = ['🥇', '🥈', '🥉']

  async function refreshBenchmarks() {
    try {
      const res = await fetch('/api/model-results')
      if (res.ok) {
        const data = await res.json()
        setBenchmarks(data.leaderboard ?? [])
      }
    } catch { /* ignore */ }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#1E1B4B' }}>Leaderboard</h1>
        <p className="text-sm text-gray-500">Top contributors and AI model safety benchmark results.</p>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-6">
        {[
          { id: 'contributors', label: 'Contributors' },
          { id: 'benchmarks', label: `Model Benchmarks${benchmarks.length > 0 ? ` (${benchmarks.length})` : ''}` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as 'contributors' | 'benchmarks')}
            className="px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors"
            style={tab === t.id
              ? { color: '#1E1B4B', borderColor: '#1E1B4B' }
              : { color: '#6B7280', borderColor: 'transparent' }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Contributors tab ── */}
      {tab === 'contributors' && (
        <div>
          {contributors.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p>No contributors yet. Publish a package to appear here!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {contributors.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors hover:border-indigo-200 hover:bg-indigo-50/30"
                  style={{ borderColor: index < 3 ? '#E0E7FF' : '#F3F4F6' }}
                >
                  <div className="w-8 text-center flex-shrink-0">
                    {index < 3
                      ? <span className="text-xl">{medals[index]}</span>
                      : <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                    }
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold overflow-hidden flex-shrink-0 text-sm"
                    style={{ backgroundColor: '#1E1B4B', color: '#F59E0B' }}>
                    {user.image
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={user.image} alt="" className="w-full h-full object-cover" />
                      : user.initials
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/${user.username}`} className="text-sm font-semibold text-gray-900 hover:text-indigo-600">
                      {user.name ?? user.username}
                    </Link>
                    {user.org && <span className="text-xs text-gray-400 ml-1.5">· {user.org}</span>}
                    {user.occupation && (
                      <p className="text-xs text-gray-500">{user.occupation}{user.specialty ? ` · ${user.specialty}` : ''}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-5 flex-shrink-0">
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                        <span className="text-sm font-bold text-gray-900">{formatNumber(user.totalStars)}</span>
                      </div>
                      <p className="text-xs text-gray-400">stars</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-900">{formatNumber(user.totalForks)}</p>
                      <p className="text-xs text-gray-400">forks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-900">{formatNumber(user.packageCount)}</p>
                      <p className="text-xs text-gray-400">packages</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Benchmarks tab ── */}
      {tab === 'benchmarks' && (
        <div>
          {/* Submit section */}
          {session ? (
            <div className="mb-4">
              <button
                onClick={() => setShowSubmit((s) => !s)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors"
                style={showSubmit
                  ? { backgroundColor: '#1E1B4B', color: 'white', borderColor: '#1E1B4B' }
                  : { backgroundColor: 'white', color: '#1E1B4B', borderColor: '#1E1B4B' }
                }
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                {showSubmit ? 'Cancel' : 'Submit model results'}
              </button>
            </div>
          ) : (
            <div className="mb-4 px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-600">
              <a href="/auth/signin" className="text-indigo-600 hover:underline font-medium">Sign in</a> to submit your model&apos;s benchmark results.
            </div>
          )}

          {showSubmit && (
            <SubmitResultForm onSubmitted={() => { setShowSubmit(false); refreshBenchmarks() }} />
          )}

          {/* Methodology note */}
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl border mb-5"
            style={{ backgroundColor: '#F0F9FF', borderColor: '#7DD3FC' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#0891B2" className="mt-0.5 flex-shrink-0">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            <p className="text-xs text-blue-900 leading-relaxed">
              <strong>Pass rate</strong> measures how often a model responds safely to harmful prompts —
              higher is better. A pass means the model refused or deflected; a fail means it produced harmful content.
              Prompts are drawn from the <Link href="/self-audit" className="underline">Self Audit</Link> dataset.
            </p>
          </div>

          {benchmarks.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-gray-200 rounded-xl text-gray-400">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="mx-auto mb-3 opacity-20">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
              </svg>
              <p className="text-sm font-medium">No benchmark results yet</p>
              <p className="text-xs mt-1">Be the first to submit your model&apos;s performance against the self-audit dataset.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {benchmarks.map((model, idx) => {
                const key = `${model.modelName}|||${model.modelVersion ?? ''}`
                const isExpanded = expandedModel === key
                const passColor = model.passRate >= 80 ? '#16A34A' : model.passRate >= 60 ? '#D97706' : '#DC2626'
                return (
                  <div key={key} className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Model row */}
                    <button
                      onClick={() => setExpandedModel(isExpanded ? null : key)}
                      className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      {/* Rank */}
                      <div className="w-8 text-center flex-shrink-0">
                        {idx < 3
                          ? <span className="text-xl">{medals[idx]}</span>
                          : <span className="text-sm font-bold text-gray-400">#{idx + 1}</span>
                        }
                      </div>

                      {/* Model info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-sm font-bold text-gray-900">{model.modelName}</span>
                          {model.modelVersion && (
                            <span className="text-xs text-gray-400">{model.modelVersion}</span>
                          )}
                          {model.provider && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ backgroundColor: '#EEF2FF', color: '#3730A3' }}>
                              {model.provider}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-3 text-xs text-gray-400 mt-0.5">
                          <span>{model.totalSamples.toLocaleString()} prompts tested</span>
                          <span>{model.categories.length} categor{model.categories.length !== 1 ? 'ies' : 'y'}</span>
                        </div>
                      </div>

                      {/* Pass rate */}
                      <div className="w-48 flex-shrink-0">
                        <PassRateBar rate={model.passRate} />
                        <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                          <span className="text-green-600">{model.totalPass.toLocaleString()} passed</span>
                          <span className="text-red-500">{model.totalFail.toLocaleString()} failed</span>
                        </div>
                      </div>

                      {/* Expand chevron */}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400 flex-shrink-0 transition-transform"
                        style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', color: '#9CA3AF' }}>
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                      </svg>
                    </button>

                    {/* Expanded: per-category breakdown */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 px-4 py-4 bg-gray-50">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Results by category</p>
                        <div className="space-y-2">
                          {[...model.categories].sort((a, b) => b.passRate - a.passRate).map((cat) => (
                            <div key={cat.categoryId} className="bg-white border border-gray-200 rounded-lg px-3 py-2">
                              <div className="flex items-center justify-between gap-3 mb-1">
                                <span className="text-xs font-medium text-gray-700 flex-1">{cat.categoryName}</span>
                                <span className="text-xs text-gray-400">{cat.totalSamples} tested</span>
                              </div>
                              <PassRateBar rate={cat.passRate} />
                              <div className="flex gap-3 text-xs mt-0.5">
                                <span className="text-green-600">{cat.passCount} passed</span>
                                <span className="text-red-500">{cat.failCount} failed</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-3">
                          Last updated: {new Date(model.latestRun).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
