'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { PackageWithRelations } from '@/types'
import { CERTIFIER_DISPLAY_MAP } from '@/types'
import { CertBadge } from '@/components/cert-badge'
import { formatDate, formatRelativeDate, formatNumber, getInitials } from '@/lib/utils'

type Tab = 'requirements' | 'discussion' | 'canvas' | 'vendors' | 'governance' | 'versions'

interface PackageDetailClientProps {
  pkg: PackageWithRelations
  currentUserId: string | null
  initialStarred: boolean
  initialStarCount: number
}

function ObligationBadge({ obligation }: { obligation: string }) {
  const isShall = obligation === 'SHALL'
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide"
      style={{
        backgroundColor: isShall ? '#EEF2FF' : '#FEF3C7',
        color: isShall ? '#3730A3' : '#92400E',
      }}
    >
      {obligation.toLowerCase()}
    </span>
  )
}

function TagPill({ value, category }: { value: string; category: string }) {
  const styles: Record<string, { bg: string; text: string }> = {
    USE_CASE: { bg: '#EEF2FF', text: '#3730A3' },
    INDUSTRY: { bg: '#F0FDF4', text: '#166534' },
    MODEL_TYPE: { bg: '#FDF2F8', text: '#9D174D' },
    DEPLOYMENT_ENV: { bg: '#FFF7ED', text: '#9A3412' },
    RISK_TIER: { bg: '#FEF2F2', text: '#991B1B' },
    CUSTOM: { bg: '#F3F4F6', text: '#374151' },
  }
  const s = styles[category] ?? { bg: '#F3F4F6', text: '#374151' }
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {value}
    </span>
  )
}

interface SimilarReq {
  id: string
  reqId: string
  title: string
  obligation: string
  body: string | null
  tags: string[]
  package: { id: string; slug: string; name: string; author: { username: string | null } }
}

export default function PackageDetailClient({
  pkg,
  currentUserId,
  initialStarred,
  initialStarCount,
}: PackageDetailClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('requirements')
  const [starred, setStarred] = useState(initialStarred)
  const [starCount, setStarCount] = useState(initialStarCount)
  const [starLoading, setStarLoading] = useState(false)
  const [expandedReqs, setExpandedReqs] = useState<Set<string>>(new Set())
  const [commentBodies, setCommentBodies] = useState<Record<string, string>>({})
  const [submittingComment, setSubmittingComment] = useState(false)
  const [similarReqs, setSimilarReqs] = useState<Record<string, SimilarReq[]>>({})
  const [loadingSimilar, setLoadingSimilar] = useState<Record<string, boolean>>({})

  // Contributor management
  const [newContributor, setNewContributor] = useState('')
  const [addingContributor, setAddingContributor] = useState(false)
  const [contributors, setContributors] = useState(pkg.contributors ?? [])

  const [author, slugPart] = pkg.slug.split('/')
  const isOwner = currentUserId === pkg.authorId

  const useCaseTags = pkg.tags.filter((t) => t.category === 'USE_CASE')
  const industryTags = pkg.tags.filter((t) => t.category === 'INDUSTRY')
  const modelTypeTags = pkg.tags.filter((t) => t.category === 'MODEL_TYPE')
  const deploymentTags = pkg.tags.filter((t) => t.category === 'DEPLOYMENT_ENV')
  const riskTierTags = pkg.tags.filter((t) => t.category === 'RISK_TIER')
  const customTags = pkg.tags.filter((t) => t.category === 'CUSTOM')

  // Compute fork diff vs parent
  const forkDiff = pkg.forkedFrom
    ? computeForkDiff(pkg.forkedFrom.requirements ?? [], pkg.requirements)
    : null

  async function handleStar() {
    if (!currentUserId) { router.push('/api/auth/signin'); return }
    setStarLoading(true)
    try {
      const res = await fetch(`/api/packages/${pkg.id}/star`, { method: 'POST' })
      const data = await res.json()
      setStarred(data.starred)
      setStarCount(data.count)
    } finally { setStarLoading(false) }
  }

  async function handleFork() {
    if (!currentUserId) { router.push('/api/auth/signin'); return }
    const res = await fetch(`/api/packages/${pkg.id}/fork`, { method: 'POST' })
    if (res.ok) {
      const forked = await res.json()
      router.push(`/packages/${forked.slug}`)
    }
  }

  function handleDownload() {
    window.location.href = `/api/packages/${pkg.id}/download`
  }

  function toggleReq(reqId: string) {
    setExpandedReqs((prev) => {
      const next = new Set(prev)
      if (next.has(reqId)) next.delete(reqId)
      else next.add(reqId)
      return next
    })
  }

  async function loadSimilarReqs(req: typeof pkg.requirements[0]) {
    if (similarReqs[req.id]) return
    setLoadingSimilar((p) => ({ ...p, [req.id]: true }))
    try {
      const params = new URLSearchParams({
        title: req.title,
        tags: req.tags.join(','),
        excludePackageId: pkg.id,
      })
      const res = await fetch(`/api/requirements/similar?${params}`)
      if (res.ok) {
        const data = await res.json()
        setSimilarReqs((p) => ({ ...p, [req.id]: data }))
      }
    } finally {
      setLoadingSimilar((p) => ({ ...p, [req.id]: false }))
    }
  }

  async function submitComment(packageId: string, requirementId?: string) {
    const key = requirementId ?? '__package__'
    const body = commentBodies[key]?.trim()
    if (!body) return
    setSubmittingComment(true)
    try {
      await fetch(`/api/packages/${packageId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body, requirementId }),
      })
      setCommentBodies((prev) => ({ ...prev, [key]: '' }))
      router.refresh()
    } finally { setSubmittingComment(false) }
  }

  async function handleAddContributor() {
    if (!newContributor.trim()) return
    setAddingContributor(true)
    try {
      const res = await fetch(`/api/packages/${pkg.id}/contributors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newContributor.trim() }),
      })
      if (res.ok) {
        const c = await res.json()
        setContributors((prev) => [...prev, c])
        setNewContributor('')
      }
    } finally { setAddingContributor(false) }
  }

  async function handleRemoveContributor(username: string) {
    await fetch(`/api/packages/${pkg.id}/contributors`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    })
    setContributors((prev) => prev.filter((c) => c.user.username !== username))
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'requirements', label: `Requirements (${pkg.requirements.length})` },
    { id: 'discussion', label: `Discussion (${pkg._count.comments})` },
    { id: 'versions', label: `Versions (${pkg.versions.length})` },
    { id: 'canvas', label: 'Canvas' },
    { id: 'vendors', label: 'Vendors' },
    { id: 'governance', label: 'Governance' },
  ]

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-indigo-600">Packages</Link>
        <span>/</span>
        <Link href={`/${author}`} className="hover:text-indigo-600">{author}</Link>
        <span>/</span>
        <span className="font-medium text-gray-900">{slugPart}</span>
      </div>

      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="card p-5 mb-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold" style={{ color: '#1E1B4B' }}>{pkg.slug}</h1>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-mono font-bold border"
                    style={{ backgroundColor: '#EEF2FF', color: '#3730A3', borderColor: '#C7D2FE' }}
                  >
                    v{pkg.currentVersion}
                  </span>
                  {pkg.certifications.map((cert) => (
                    <CertBadge key={cert.id} certifier={cert.certifier} />
                  ))}
                  {'isOpenSource' in pkg && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={
                        (pkg as any).isOpenSource
                          ? { backgroundColor: '#ECFDF5', color: '#065F46' }
                          : { backgroundColor: '#FEF3C7', color: '#92400E' }
                      }
                    >
                      {(pkg as any).isOpenSource ? 'Open source' : 'Includes paid services'}
                    </span>
                  )}
                </div>
                {pkg.description && (
                  <p className="text-gray-600 mt-1.5 text-sm leading-relaxed">{pkg.description}</p>
                )}
                {pkg.forkedFrom && (
                  <p className="text-xs text-gray-400 mt-1">
                    Forked from{' '}
                    <Link href={`/packages/${pkg.forkedFrom.slug}`} className="text-indigo-500 hover:underline">
                      {pkg.forkedFrom.slug}
                    </Link>
                    {forkDiff && (
                      <span className="ml-2">
                        <span className="text-green-600">+{forkDiff.added}</span>
                        {' '}
                        <span className="text-amber-600">~{forkDiff.modified}</span>
                        {' '}
                        <span className="text-red-500">-{forkDiff.removed}</span>
                        {' '}requirements changed
                      </span>
                    )}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden"
                      style={{ backgroundColor: '#4338CA', color: 'white' }}
                    >
                      {pkg.author.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={pkg.author.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        getInitials(pkg.author.name)
                      )}
                    </div>
                    <Link href={`/${pkg.author.username}`} className="text-sm text-gray-600 hover:text-indigo-600">
                      {pkg.author.name}
                    </Link>
                    {pkg.author.org && <span className="text-xs text-gray-400">· {pkg.author.org}</span>}
                  </div>
                  <span className="text-xs text-gray-400">Posted {formatDate(pkg.createdAt)}</span>
                  {(pkg as any).publishedAt && (
                    <span className="text-xs text-gray-400">· Published {formatDate((pkg as any).publishedAt)}</span>
                  )}
                  <span className="text-xs text-gray-400">· {formatNumber(pkg.viewCount)} views</span>
                </div>

                {/* AI Model & Dataset URLs */}
                {((pkg as any).aiModelUrls?.length > 0 || (pkg as any).datasetUrls?.length > 0) && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {(pkg as any).aiModelUrls?.map((url: string) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2 py-1 rounded-full border text-indigo-600 border-indigo-200 hover:bg-indigo-50 flex items-center gap-1"
                      >
                        🤖 {url.replace('https://', '').split('/').slice(0, 2).join('/')}
                      </a>
                    ))}
                    {(pkg as any).datasetUrls?.map((url: string) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2 py-1 rounded-full border text-emerald-600 border-emerald-200 hover:bg-emerald-50 flex items-center gap-1"
                      >
                        📊 {url.replace('https://', '').split('/').slice(0, 2).join('/')}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleStar}
                  disabled={starLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-medium transition-colors"
                  style={
                    starred
                      ? { backgroundColor: '#FEF3C7', borderColor: '#F59E0B', color: '#92400E' }
                      : { backgroundColor: 'white', borderColor: '#D1D5DB', color: '#374151' }
                  }
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={starred ? '#F59E0B' : 'none'} stroke={starred ? '#F59E0B' : 'currentColor'} strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {starred ? 'Starred' : 'Star'} · {formatNumber(starCount)}
                </button>
                <button
                  onClick={handleFork}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-medium bg-white border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 2a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m9 0a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3M6 7.5c1.11 0 3.08.59 4.5 1.75C11.92 10.41 13.89 11 15 11v2c-1.67 0-4.08-.83-6-2.25V17a3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 .5.04V7.79c-.17-.18-.33-.28-.5-.29z" />
                  </svg>
                  Fork · {formatNumber(pkg._count.forks)}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-medium bg-white border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                  </svg>
                  CSV
                </button>
                {isOwner && (
                  <Link
                    href={`/packages/${author}/${slugPart}/edit`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors"
                    style={{ backgroundColor: '#1E1B4B', color: 'white' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                    Edit
                  </Link>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-gray-100">
              {useCaseTags.map((t) => <TagPill key={t.id} value={t.value} category={t.category} />)}
              {industryTags.map((t) => <TagPill key={t.id} value={t.value} category={t.category} />)}
              {modelTypeTags.map((t) => <TagPill key={t.id} value={t.value} category={t.category} />)}
              {deploymentTags.map((t) => <TagPill key={t.id} value={t.value} category={t.category} />)}
              {riskTierTags.map((t) => <TagPill key={t.id} value={t.value} category={t.category} />)}
              {customTags.map((t) => <TagPill key={t.id} value={t.value} category={t.category} />)}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-gray-200 mb-4 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap"
                style={
                  activeTab === tab.id
                    ? { color: '#1E1B4B', borderColor: '#1E1B4B' }
                    : { color: '#6B7280', borderColor: 'transparent' }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Requirements tab */}
          {activeTab === 'requirements' && (
            <div className="space-y-3">
              {pkg.requirements.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">No requirements defined yet.</div>
              )}
              {pkg.requirements.map((req) => {
                const isExpanded = expandedReqs.has(req.id)
                const similar = similarReqs[req.id] ?? []
                const isSimilarLoading = loadingSimilar[req.id]
                return (
                  <div key={req.id} className="card overflow-hidden">
                    <button
                      onClick={() => { toggleReq(req.id); if (!isExpanded) loadSimilarReqs(req) }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
                        className="text-gray-400 flex-shrink-0 transition-transform"
                        style={{ transform: isExpanded ? 'rotate(90deg)' : 'none' }}
                      >
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                      </svg>
                      <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: '#EEF2FF', color: '#3730A3' }}>
                        {req.reqId}
                      </span>
                      <span className="flex-1 text-sm font-medium text-gray-900">{req.title}</span>
                      <div className="flex items-center gap-2">
                        {req.tags.map((tag) => (
                          <span key={tag} className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>
                            {tag}
                          </span>
                        ))}
                        <ObligationBadge obligation={req.obligation} />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-gray-100">
                        {req.body && (
                          <div className="mt-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {req.body}
                          </div>
                        )}
                        {req.dependsOn.length > 0 && (
                          <div className="mt-3 flex items-center gap-1.5">
                            <span className="text-xs text-gray-400 font-medium">Depends on:</span>
                            {req.dependsOn.map((dep) => (
                              <span key={dep} className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: '#F3F4F6', color: '#374151' }}>{dep}</span>
                            ))}
                          </div>
                        )}
                        {req.subRequirements.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {req.subRequirements.map((sub) => (
                              <div key={sub.id} className="ml-6 pl-3 border-l-2 border-indigo-100">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono text-indigo-400 font-semibold">{sub.subId}</span>
                                  <span className="text-sm text-gray-700 font-medium">{sub.title}</span>
                                  <ObligationBadge obligation={sub.obligation} />
                                </div>
                                {sub.body && <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{sub.body}</p>}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Similar requirements */}
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Similar requirements in other packages</p>
                          {isSimilarLoading ? (
                            <p className="text-xs text-gray-400">Loading...</p>
                          ) : similar.length === 0 ? (
                            <p className="text-xs text-gray-400">No similar requirements found.</p>
                          ) : (
                            <div className="space-y-1.5">
                              {similar.slice(0, 3).map((s) => (
                                <div key={s.id} className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2">
                                  <span className="text-xs font-mono text-indigo-400 mt-0.5">{s.reqId}</span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-800 truncate">{s.title}</p>
                                    <Link href={`/packages/${s.package.slug}`} className="text-xs text-indigo-500 hover:underline">{s.package.slug}</Link>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Comments */}
                        {req.comments.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                              {req.comments.length} comment{req.comments.length !== 1 ? 's' : ''}
                            </p>
                            {req.comments.map((c) => (
                              <div key={c.id} className="flex gap-2">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: '#4338CA', color: 'white' }}>
                                  {getInitials(c.author.name)}
                                </div>
                                <div className="bg-gray-50 rounded-lg px-3 py-2 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-gray-700">{c.author.name}</span>
                                    <span className="text-xs text-gray-400">{formatRelativeDate(c.createdAt)}</span>
                                  </div>
                                  <p className="text-sm text-gray-700 mt-0.5">{c.body}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {currentUserId && (
                          <div className="mt-3 flex gap-2">
                            <input
                              type="text"
                              value={commentBodies[req.id] ?? ''}
                              onChange={(e) => setCommentBodies((prev) => ({ ...prev, [req.id]: e.target.value }))}
                              placeholder="Add a comment on this requirement..."
                              className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-300"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitComment(pkg.id, req.id) }
                              }}
                            />
                            <button
                              onClick={() => submitComment(pkg.id, req.id)}
                              disabled={submittingComment || !commentBodies[req.id]?.trim()}
                              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                              style={{ backgroundColor: '#1E1B4B', color: 'white' }}
                            >
                              Post
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'discussion' && (
            <div className="space-y-4">
              <div className="card p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Package discussion</h3>
                {pkg.requirements.filter((r) => r.comments.length > 0).length === 0 && (
                  <p className="text-sm text-gray-400">No comments yet. Start the discussion!</p>
                )}
                {pkg.requirements.filter((r) => r.comments.length > 0).map((req) => (
                  <div key={req.id} className="mb-4">
                    <p className="text-xs font-medium text-indigo-500 mb-2">On {req.reqId}: {req.title}</p>
                    {req.comments.map((c) => (
                      <div key={c.id} className="flex gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: '#4338CA', color: 'white' }}>
                          {getInitials(c.author.name)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">{c.author.name}</span>
                            <span className="text-xs text-gray-400">{formatRelativeDate(c.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{c.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                {currentUserId && (
                  <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: '#4338CA', color: 'white' }}>?</div>
                    <div className="flex-1">
                      <textarea
                        value={commentBodies['__package__'] ?? ''}
                        onChange={(e) => setCommentBodies((prev) => ({ ...prev, __package__: e.target.value }))}
                        placeholder="Leave a comment..."
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-300 resize-none"
                      />
                      <button
                        onClick={() => submitComment(pkg.id)}
                        disabled={submittingComment || !commentBodies['__package__']?.trim()}
                        className="mt-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                        style={{ backgroundColor: '#1E1B4B', color: 'white' }}
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'versions' && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Version history</h3>
              {pkg.forkedFrom && forkDiff && (
                <div className="mb-4 p-3 rounded-lg border border-indigo-100 bg-indigo-50">
                  <p className="text-xs font-semibold text-indigo-700 mb-1">Changes from forked source</p>
                  <p className="text-xs text-indigo-600">
                    Forked from{' '}
                    <Link href={`/packages/${pkg.forkedFrom.slug}`} className="underline">
                      {pkg.forkedFrom.slug}
                    </Link>
                    {' · '}
                    <span className="text-green-700">+{forkDiff.added} added</span>
                    {', '}
                    <span className="text-amber-700">{forkDiff.modified} modified</span>
                    {', '}
                    <span className="text-red-600">{forkDiff.removed} removed</span>
                  </p>
                  {forkDiff.details.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {forkDiff.details.map((d, i) => (
                        <li key={i} className="text-xs flex items-center gap-1.5">
                          <span className={d.type === 'added' ? 'text-green-600' : d.type === 'removed' ? 'text-red-500' : 'text-amber-600'}>
                            {d.type === 'added' ? '+' : d.type === 'removed' ? '-' : '~'}
                          </span>
                          <span className="font-mono text-indigo-600">{d.reqId}</span>
                          <span className="text-gray-700">{d.title}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {pkg.versions.length === 0 ? (
                <p className="text-sm text-gray-400">No versions published yet.</p>
              ) : (
                <div className="space-y-3">
                  {pkg.versions.map((v) => (
                    <div key={v.id} className="flex items-start justify-between gap-3 py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <span className="text-sm font-mono font-semibold text-gray-800">v{v.version}</span>
                        {v.changelog && <p className="text-xs text-gray-500 mt-0.5">{v.changelog}</p>}
                        <p className="text-xs text-gray-400 mt-0.5">by {v.publishedBy.name} · {formatDate(v.publishedAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'canvas' && (
            <div className="card p-8 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto" style={{ backgroundColor: '#EEF2FF' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#4338CA">
                  <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Canvas — Coming Soon</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">An interactive canvas for visualising your AI system architecture and requirement flow.</p>
            </div>
          )}

          {activeTab === 'vendors' && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Vendor integrations</h3>
              <p className="text-sm text-gray-400 text-center py-8">No vendor integrations specified in this package.</p>
            </div>
          )}

          {activeTab === 'governance' && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Governance &amp; compliance</h3>
              <div className="space-y-4">
                {riskTierTags.length > 0 && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Risk tier</label>
                    <TagPill value={riskTierTags[0].value} category="RISK_TIER" />
                  </div>
                )}
                {pkg.certifications.length > 0 ? (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Certifications</label>
                    <div className="flex flex-wrap gap-2">
                      {pkg.certifications.map((cert) => (
                        <div key={cert.id} className="flex flex-col gap-1">
                          <CertBadge certifier={cert.certifier} />
                          {cert.notes && <p className="text-xs text-gray-500 ml-1">{cert.notes}</p>}
                          <p className="text-xs text-gray-400 ml-1">Granted {formatDate(cert.grantedAt)} by {cert.grantedBy.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-500">This package has not been certified yet.</p>
                    <p className="text-xs text-gray-400 mt-1">Certifications are granted by TÜV SÜD, BSI, or the EU AI Office.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="w-64 flex-shrink-0 space-y-4">
          {/* Author card */}
          <div className="card p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Author</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold overflow-hidden" style={{ backgroundColor: '#4338CA', color: 'white' }}>
                {pkg.author.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={pkg.author.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  getInitials(pkg.author.name)
                )}
              </div>
              <div>
                <Link href={`/${pkg.author.username}`} className="text-sm font-semibold text-gray-900 hover:text-indigo-600">
                  {pkg.author.name}
                </Link>
                {pkg.author.org && <p className="text-xs text-gray-400">{pkg.author.org}</p>}
              </div>
            </div>
          </div>

          {/* Contributors */}
          <div className="card p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Contributors</h3>
            {contributors.length === 0 ? (
              <p className="text-xs text-gray-400">No contributors tagged yet.</p>
            ) : (
              <div className="space-y-2 mb-3">
                {contributors.map((c) => (
                  <div key={c.id} className="flex items-center gap-2 group">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden flex-shrink-0" style={{ backgroundColor: '#4338CA', color: 'white' }}>
                      {c.user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.user.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        getInitials(c.user.name)
                      )}
                    </div>
                    <Link href={`/${c.user.username}`} className="text-xs text-gray-700 hover:text-indigo-600 flex-1">{c.user.name}</Link>
                    <span className="text-xs text-gray-400">{c.role}</span>
                    {isOwner && (
                      <button
                        onClick={() => handleRemoveContributor(c.user.username ?? '')}
                        className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 text-xs"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {isOwner && (
              <div className="flex gap-1">
                <input
                  type="text"
                  value={newContributor}
                  onChange={(e) => setNewContributor(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddContributor() }}
                  placeholder="@username"
                  className="flex-1 text-xs px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-300"
                />
                <button
                  onClick={handleAddContributor}
                  disabled={addingContributor}
                  className="px-2 py-1 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#1E1B4B', color: 'white' }}
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Forks */}
          {pkg.forks && pkg.forks.length > 0 && (
            <div className="card p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Forks ({pkg._count.forks})
              </h3>
              <div className="space-y-2">
                {pkg.forks.slice(0, 5).map((fork) => (
                  <div key={fork.id} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden flex-shrink-0" style={{ backgroundColor: '#4338CA', color: 'white' }}>
                      {fork.author.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={fork.author.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        getInitials(fork.author.name)
                      )}
                    </div>
                    <Link href={`/${fork.author.username}`} className="text-xs text-gray-600 hover:text-indigo-600">
                      {fork.author.name}
                    </Link>
                  </div>
                ))}
                {pkg._count.forks > 5 && (
                  <p className="text-xs text-gray-400">+{pkg._count.forks - 5} more forks</p>
                )}
              </div>
            </div>
          )}

          {/* License */}
          <div className="card p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">License</h3>
            <span className="text-sm font-medium text-gray-700">{pkg.license}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Compute a diff between parent requirements and forked requirements
function computeForkDiff(
  parentReqs: Array<{ reqId: string; title: string; body?: string | null }>,
  childReqs: Array<{ reqId: string; title: string; body?: string | null }>
) {
  const parentMap = new Map(parentReqs.map((r) => [r.reqId, r]))
  const childMap = new Map(childReqs.map((r) => [r.reqId, r]))

  const details: Array<{ type: 'added' | 'removed' | 'modified'; reqId: string; title: string }> = []
  let added = 0, removed = 0, modified = 0

  for (const [reqId, child] of childMap) {
    const parent = parentMap.get(reqId)
    if (!parent) {
      added++
      details.push({ type: 'added', reqId, title: child.title })
    } else if (parent.title !== child.title || parent.body !== child.body) {
      modified++
      details.push({ type: 'modified', reqId, title: child.title })
    }
  }
  for (const [reqId, parent] of parentMap) {
    if (!childMap.has(reqId)) {
      removed++
      details.push({ type: 'removed', reqId, title: parent.title })
    }
  }

  return { added, removed, modified, details }
}
