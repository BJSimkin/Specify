import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { getInitials, formatNumber } from '@/lib/utils'

export const metadata = { title: 'Leaderboard — Specify' }

export default async function LeaderboardPage() {
  const users = await prisma.user.findMany({
    where: { packages: { some: { isPublished: true } } },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      org: true,
      occupation: true,
      specialty: true,
      packages: {
        where: { isPublished: true },
        select: {
          _count: { select: { stars: true, forks: true } },
        },
      },
      _count: { select: { packages: true, followers: true } },
    },
  })

  const leaderboard = users
    .map((u) => ({
      ...u,
      totalStars: u.packages.reduce((s, p) => s + p._count.stars, 0),
      totalForks: u.packages.reduce((s, p) => s + p._count.forks, 0),
    }))
    .sort((a, b) => b.totalStars - a.totalStars)
    .slice(0, 50)

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1E1B4B' }}>
          Leaderboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">Top contributors ranked by total stars across all published packages.</p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p>No contributors yet. Publish a package to appear here!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center gap-4 px-4 py-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors"
              style={index < 3 ? { borderColor: '#E0E7FF', backgroundColor: '#F5F3FF10' } : {}}
            >
              {/* Rank */}
              <div className="w-8 text-center flex-shrink-0">
                {index < 3 ? (
                  <span className="text-xl">{medals[index]}</span>
                ) : (
                  <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                )}
              </div>

              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold overflow-hidden flex-shrink-0 text-sm"
                style={{ backgroundColor: '#1E1B4B', color: '#F59E0B' }}
              >
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  getInitials(user.name)
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link href={`/${user.username}`} className="text-sm font-semibold text-gray-900 hover:text-indigo-600">
                  {user.name ?? user.username}
                </Link>
                {user.org && <span className="text-xs text-gray-400 ml-1.5">· {user.org}</span>}
                {user.occupation && (
                  <p className="text-xs text-gray-500">
                    {user.occupation}
                    {user.specialty ? ` · ${user.specialty}` : ''}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-5 flex-shrink-0">
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span className="text-sm font-bold text-gray-900">{formatNumber(user.totalStars)}</span>
                  </div>
                  <p className="text-xs text-gray-400">stars</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900">{formatNumber(user.totalForks)}</p>
                  <p className="text-xs text-gray-400">forks</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900">{formatNumber(user._count.packages)}</p>
                  <p className="text-xs text-gray-400">packages</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
