'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { PackageWithRelations } from '@/types'
import { CERTIFIER_DISPLAY_MAP } from '@/types'
import { CertBadge } from '@/components/cert-badge'
import { formatDate, formatRelativeDate, formatNumber, getInitials } from '@/lib/utils'

type Tab = 'requirements' | 'discussion' | 'canvas' | 'vendors' | 'governance'

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

  const [author, slugPart] = pkg.slug.split('/')
  const isOwner = currentUserId === pkg.authorId

  const useCaseTags = pkg.tags.filter((t) => t.category === 'USE_CASE')
  const industryTags = pkg.tags.filter((t) => t.category === 'INDUSTRY')
  const modelTypeTags = pkg.tags.filter((t) => t.category === 'MODEL_TYPE')
  const deploymentTags = pkg.tags.filter((t) => t.category === 'DEPLOYMENT_ENV')
  const riskTierTags = pkg.tags.filter((t) => t.category === 'RISK_TIER')
  const customTags = pkg.tags.filter((t) => t.category === 'CUSTOM')

  async function handleStar() {
    if (!currentUserId) {
      router.push('/api/auth/signin')
      return
    }
    setStarLoading(true)
    try {
      const res = await fetch(`/api/packages/${pkg.id}/star`, { method: 'POST' })
      const data = await res.json()
      setStarred(data.starred)
      setStarCount(data.count)
    } finally {
      setStarLoading(false)
    }
  }

  async function handleFork() {
    if (!currentUserId) {
      router.push('/api/auth/signin')
      return
    }
    const res = await fetch(`/api/packages/${pkg.id}/fork`, { method: 'POST' })
    if (res.ok) {
      const forked = await res.json()
      router.push(`/packages/${forked.slug.replace('/', '/')}`)
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
    } finally {
      setSubmittingComment(false)
    }
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'requirements', label: `Requirements (${pkg.requirements.length})` },
    { id: 'discussion', label: `Discussion (${pkg._count.comments})` },
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
                  <h1 className="text-2xl font-bold" style={{ color: '#1E1B4B' }}>
                    {pkg.slug}
                  </h1>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-mono font-bold border"
                    style={{ backgroundColor: '#EEF2FF', color: '#3730A3', borderColor: '#C7D2FE' }}
                  >
                    v{pkg.currentVersion}
                  </span>
                  {pkg.certifications.map((cert) => (
                    <CertBadge key={cert.id} certifier={cert.certifier} />
                  ))}
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
                    {pkg.author.org && (
                      <span className="text-xs text-gray-400">· {pkg.author.org}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">Posted {formatDate(pkg.createdAt)}</span>
                  <span className="text-xs text-gray-400">· {formatNumber(pkg.viewCount)} views</span>
                </div>
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
          <div className="flex items-center gap-1 border-b border-gray-200 mb-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px"
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

          {/* Tab content */}
          {activeTab === 'requirements' && (
            <div className="space-y-3">
              {pkg.requirements.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">No requirements defined yet.</div>
              )}
              {pkg.requirements.map((req) => {
                const isExpanded = expandedReqs.has(req.id)
                return (
                  <div key={req.id} className="card overflow-hidden">
                    <button
                      onClick={() => toggleReq(req.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-gray-400 flex-shrink-0 transition-transform"
                        style={{ transform: isExpanded ? 'rotate(90deg)' : 'none' }}
                      >
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                      </svg>
                      <span
                        className="text-xs font-mono font-bold px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: '#EEF2FF', color: '#3730A3' }}
                      >
                        {req.reqId}
                      </span>
                      <span className="flex-1 text-sm font-medium text-gray-900">{req.title}</span>
                      <div className="flex items-center gap-2">
                        {req.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
                          >
                            {tag}
                          </span>
                        ))}
                        <ObligationBadge obligation={req.obligation} />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-gray-100">
                        {req.body && (
                          <div className="mt-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap req-body">
                            {req.body}
                          </div>
                        )}
                        {req.dependsOn.length > 0 && (
                          <div className="mt-3 flex items-center gap-1.5">
                            <span className="text-xs text-gray-400 font-medium">Depends on:</span>
                            {req.dependsOn.map((dep) => (
                              <span
                                key={dep}
                                className="text-xs font-mono px-1.5 py-0.5 rounded"
                                style={{ backgroundColor: '#F3F4F6', color: '#374151' }}
                              >
                                {dep}
                              </span>
                            ))}
                          </div>
                        )}
                        {req.subRequirements.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {req.subRequirements.map((sub) => (
                              <div
                                key={sub.id}
                                className="ml-6 pl-3 border-l-2 border-indigo-100"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono text-indigo-400 font-semibold">{sub.subId}</span>
                                  <span className="text-sm text-gray-700 font-medium">{sub.title}</span>
                                  <ObligationBadge obligation={sub.obligation} />
                                </div>
                                {sub.body && (
                                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{sub.body}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Inline comments for requirement */}
                        {req.comments.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                              {req.comments.length} comment{req.comments.length !== 1 ? 's' : ''}
                            </p>
                            {req.comments.map((c) => (
                              <div key={c.id} className="flex gap-2">
                                <div
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                  style={{ backgroundColor: '#4338CA', color: 'white' }}
                                >
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
                              onChange={(e) =>
                                setCommentBodies((prev) => ({ ...prev, [req.id]: e.target.value }))
                              }
                              placeholder="Add a comment on this requirement..."
                              className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-300"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault()
                                  submitComment(pkg.id, req.id)
                                }
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
                {pkg.requirements
                  .flatMap((r) => r.comments)
                  .concat(
                    pkg.requirements.length === 0 ? [] : []
                  ).length === 0 && (
                  <p className="text-sm text-gray-400">No comments yet. Start the discussion!</p>
                )}

                {/* Show all requirement comments grouped */}
                {pkg.requirements
                  .filter((r) => r.comments.length > 0)
                  .map((req) => (
                    <div key={req.id} className="mb-4">
                      <p className="text-xs font-medium text-indigo-500 mb-2">On {req.reqId}: {req.title}</p>
                      {req.comments.map((c) => (
                        <div key={c.id} className="flex gap-3 mb-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                            style={{ backgroundColor: '#4338CA', color: 'white' }}
                          >
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
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: '#4338CA', color: 'white' }}
                    >
                      ?
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={commentBodies['__package__'] ?? ''}
                        onChange={(e) =>
                          setCommentBodies((prev) => ({ ...prev, __package__: e.target.value }))
                        }
                        placeholder="Leave a comment on this package..."
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

          {activeTab === 'canvas' && (
            <div className="card p-8 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto"
                style={{ backgroundColor: '#EEF2FF' }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#4338CA">
                  <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z" />
                  <path d="M9.5 8l-3 4h6l-3-4zm3 4l3-4v8l-3-4z" opacity=".5" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Canvas — Coming Soon</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                An interactive Excalidraw-based canvas for visualizing your AI system architecture and requirement flow. Currently in development.
              </p>
            </div>
          )}

          {activeTab === 'vendors' && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Vendor integrations</h3>
              <p className="text-sm text-gray-400 text-center py-8">
                No vendor integrations specified in this package.
              </p>
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
                {pkg.certifications.length > 0 && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Certifications</label>
                    <div className="flex flex-wrap gap-2">
                      {pkg.certifications.map((cert) => (
                        <div key={cert.id} className="flex flex-col gap-1">
                          <CertBadge certifier={cert.certifier} />
                          {cert.notes && (
                            <p className="text-xs text-gray-500 ml-1">{cert.notes}</p>
                          )}
                          <p className="text-xs text-gray-400 ml-1">
                            Granted {formatDate(cert.grantedAt)} by {cert.grantedBy.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {pkg.certifications.length === 0 && (
                  <div className="border border-dashed border-gray-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-500">This package has not been certified yet.</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Certifications are granted by TÜV SÜD, BSI, or the EU AI Office.
                    </p>
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
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold overflow-hidden"
                style={{ backgroundColor: '#4338CA', color: 'white' }}
              >
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
                {pkg.author.org && (
                  <p className="text-xs text-gray-400">{pkg.author.org}</p>
                )}
              </div>
            </div>
          </div>

          {/* Versions */}
          {pkg.versions.length > 0 && (
            <div className="card p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Versions</h3>
              <div className="space-y-1.5">
                {pkg.versions.map((v) => (
                  <div key={v.id} className="flex items-center justify-between">
                    <span className="text-sm font-mono text-gray-700">v{v.version}</span>
                    <span className="text-xs text-gray-400">{formatDate(v.publishedAt)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Forks */}
          {pkg.forks.length > 0 && (
            <div className="card p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Forks ({pkg._count.forks})
              </h3>
              <div className="space-y-2">
                {pkg.forks.slice(0, 5).map((fork) => (
                  <div key={fork.id} className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden flex-shrink-0"
                      style={{ backgroundColor: '#4338CA', color: 'white' }}
                    >
                      {fork.author.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={fork.author.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        getInitials(fork.author.name)
                      )}
                    </div>
                    <Link
                      href={`/${fork.author.username}`}
                      className="text-xs text-gray-600 hover:text-indigo-600"
                    >
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
