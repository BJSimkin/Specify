'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PackageCard } from '@/components/package-card'
import { formatDate, getInitials, formatNumber } from '@/lib/utils'

interface UserProfile {
  id: string
  name: string | null
  username: string | null
  image: string | null
  org: string | null
  bio: string | null
  country: string | null
  occupation: string | null
  specialty: string | null
  linkedinUrl: string | null
  publications: string[]
  createdAt: string
  packages: any[]
  stars: any[]
  forks: any[]
  _count: {
    packages: number
    stars: number
    forks: number
    followers: number
    following: number
  }
}

export default function UserProfilePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const username = params.username as string
  const tab = searchParams.get('tab') ?? 'packages'
  const { data: session } = useSession()

  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  const currentUserId = session?.user ? (session.user as { id?: string }).id : null
  const currentUsername = session?.user ? (session.user as { username?: string }).username : null
  const isOwn = currentUsername === username

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await fetch(`/api/users/${username}`)
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [username])

  useEffect(() => {
    async function checkFollow() {
      if (!currentUserId || !user || isOwn) return
      const res = await fetch(`/api/users/${username}/follow/status`)
      if (res.ok) {
        const data = await res.json()
        setFollowing(data.following)
      }
    }
    checkFollow()
  }, [currentUserId, user, username, isOwn])

  async function handleFollow() {
    if (!currentUserId) return
    setFollowLoading(true)
    try {
      const res = await fetch(`/api/users/${username}/follow`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setFollowing(data.following)
        if (user) {
          setUser((prev) =>
            prev
              ? {
                  ...prev,
                  _count: {
                    ...prev._count,
                    followers: prev._count.followers + (data.following ? 1 : -1),
                  },
                }
              : prev
          )
        }
      }
    } finally {
      setFollowLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="flex gap-6">
            <div className="w-20 h-20 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-200 rounded w-48" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-screen-lg mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">User not found.</p>
      </div>
    )
  }

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="flex items-start gap-6 mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold overflow-hidden flex-shrink-0"
          style={{ backgroundColor: '#1E1B4B', color: '#F59E0B' }}
        >
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt="" className="w-full h-full object-cover" />
          ) : (
            getInitials(user.name)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-sm text-gray-500">@{user.username}</p>
              {user.org && <p className="text-sm text-gray-600 mt-0.5">{user.org}</p>}
              {user.occupation && (
                <p className="text-sm text-gray-600 mt-0.5">
                  {user.occupation}
                  {user.specialty ? ` · ${user.specialty}` : ''}
                </p>
              )}
              {user.country && (
                <p className="text-sm text-gray-500 mt-0.5">📍 {user.country}</p>
              )}
              {user.bio && (
                <p className="text-sm text-gray-700 mt-2 max-w-lg">{user.bio}</p>
              )}
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {user.linkedinUrl && (
                  <a
                    href={user.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                )}
                <p className="text-xs text-gray-400">Joined {formatDate(new Date(user.createdAt))}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isOwn ? (
                <Link
                  href="/preferences"
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                >
                  Edit profile
                </Link>
              ) : currentUserId ? (
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                  style={
                    following
                      ? { backgroundColor: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB' }
                      : { backgroundColor: '#1E1B4B', color: 'white' }
                  }
                >
                  {followLoading ? '...' : following ? 'Following' : 'Follow'}
                </button>
              ) : null}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-gray-900">{formatNumber(user._count.packages)}</span>
              <span className="text-sm text-gray-500">packages</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span className="text-sm font-semibold text-gray-900">{formatNumber(user._count.stars)}</span>
              <span className="text-sm text-gray-500">stars</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-gray-900">{formatNumber(user._count.followers ?? 0)}</span>
              <span className="text-sm text-gray-500">followers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-gray-900">{formatNumber(user._count.following ?? 0)}</span>
              <span className="text-sm text-gray-500">following</span>
            </div>
          </div>

          {/* Publications */}
          {user.publications && user.publications.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Publications</p>
              <ul className="space-y-1">
                {user.publications.map((pub, i) => (
                  <li key={i}>
                    {pub.startsWith('http') ? (
                      <a
                        href={pub}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:underline"
                      >
                        {pub}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-700">{pub}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-6">
        {[
          { id: 'packages', label: `Packages (${user._count.packages})` },
          { id: 'starred', label: `Starred (${user._count.stars})` },
          { id: 'forked', label: `Forked (${user._count.forks})` },
        ].map((t) => (
          <Link
            key={t.id}
            href={`/${username}?tab=${t.id}`}
            className="px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px"
            style={
              tab === t.id
                ? { color: '#1E1B4B', borderColor: '#1E1B4B' }
                : { color: '#6B7280', borderColor: 'transparent' }
            }
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'packages' && (
        <>
          {user.packages.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-base">No packages published yet.</p>
              {isOwn && (
                <Link
                  href="/new"
                  className="mt-3 inline-block px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ backgroundColor: '#F59E0B', color: '#1E1B4B' }}
                >
                  Publish your first package
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.packages.map((pkg: any) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'starred' && (
        <>
          {user.stars.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No starred packages yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.stars.map((star: any) => (
                <PackageCard key={star.id} pkg={star.package} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'forked' && (
        <>
          {user.forks.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No forked packages yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.forks.map((fork: any) => (
                <PackageCard key={fork.id} pkg={fork.forkedPackage} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
