'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface VoteData {
  averages: Record<string, number | null>
  counts: Record<string, number>
  userVotes: Record<string, number>
}

interface MetricRowProps {
  label: string
  metric: string
  color: string
  average: number | null
  count: number
  userScore: number | undefined
  readOnly: boolean
  onVote: (metric: string, score: number) => void
}

const StarFilled = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
)

const StarOutline = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
  </svg>
)

function MetricRow({ label, metric, color, average, count, userScore, readOnly, onVote }: MetricRowProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  const displayScore = hovered ?? userScore ?? 0

  return (
    <div className="flex items-center gap-3 py-1">
      <span className="text-xs font-medium text-gray-600 w-24 flex-shrink-0">{label}</span>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            disabled={readOnly}
            onClick={() => !readOnly && onVote(metric, star)}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onMouseLeave={() => !readOnly && setHovered(null)}
            className="transition-colors focus:outline-none"
            style={{
              color: star <= displayScore ? color : '#D1D5DB',
              cursor: readOnly ? 'default' : 'pointer',
            }}
            aria-label={`Rate ${label} ${star} star${star !== 1 ? 's' : ''}`}
          >
            {star <= displayScore ? <StarFilled /> : <StarOutline />}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 ml-1">
        {average !== null ? (
          <span className="text-xs text-gray-500 font-medium">{average.toFixed(1)} avg</span>
        ) : (
          <span className="text-xs text-gray-400">No votes yet</span>
        )}
        {count > 0 && (
          <span
            className="text-xs px-1.5 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
          >
            {count}
          </span>
        )}
      </div>
    </div>
  )
}

export function PackageMetricVotes({ packageId }: { packageId: string }) {
  const { data: session } = useSession()
  const [data, setData] = useState<VoteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)

  useEffect(() => {
    fetch(`/api/packages/${packageId}/vote`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [packageId])

  async function handleVote(metric: string, score: number) {
    if (!session?.user || voting) return
    setVoting(true)
    try {
      const res = await fetch(`/api/packages/${packageId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metric, score }),
      })
      if (res.ok) {
        // Refresh vote data
        const updated = await fetch(`/api/packages/${packageId}/vote`).then((r) => r.json())
        setData(updated)
      }
    } finally {
      setVoting(false)
    }
  }

  const isLoggedIn = !!session?.user

  if (loading) {
    return (
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="h-10 bg-gray-50 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quality Rating</span>
        {!isLoggedIn && (
          <span className="text-xs text-gray-400 italic">Sign in to rate</span>
        )}
      </div>
      <MetricRow
        label="Completeness"
        metric="completeness"
        color="#4338CA"
        average={data?.averages.completeness ?? null}
        count={data?.counts.completeness ?? 0}
        userScore={data?.userVotes.completeness}
        readOnly={!isLoggedIn}
        onVote={handleVote}
      />
      <MetricRow
        label="Actionable"
        metric="actionable"
        color="#D97706"
        average={data?.averages.actionable ?? null}
        count={data?.counts.actionable ?? 0}
        userScore={data?.userVotes.actionable}
        readOnly={!isLoggedIn}
        onVote={handleVote}
      />
    </div>
  )
}
