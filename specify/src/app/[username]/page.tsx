import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { PackageCard } from '@/components/package-card'
import { formatDate, getInitials, formatNumber } from '@/lib/utils'

interface PageProps {
  params: { username: string }
  searchParams: { tab?: string }
}

export async function generateMetadata({ params }: PageProps) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    select: { name: true, username: true },
  })
  if (!user) return { title: 'Not found' }
  return { title: `${user.name ?? user.username} — Specify` }
}

export default async function UserProfilePage({ params, searchParams }: PageProps) {
  const [session, user] = await Promise.all([
    auth(),
    prisma.user.findUnique({
      where: { username: params.username },
      include: {
        packages: {
          where: { isPublished: true },
          orderBy: { createdAt: 'desc' },
          include: {
            author: true,
            certifications: true,
            tags: true,
            _count: { select: { stars: true, forks: true, comments: true, versions: true } },
          },
        },
        stars: {
          orderBy: { createdAt: 'desc' },
          include: {
            package: {
              include: {
                author: true,
                certifications: true,
                tags: true,
                _count: { select: { stars: true, forks: true, comments: true, versions: true } },
              },
            },
          },
        },
        forks: {
          orderBy: { createdAt: 'desc' },
          include: {
            forkedPackage: {
              include: {
                author: true,
                certifications: true,
                tags: true,
                _count: { select: { stars: true, forks: true, comments: true, versions: true } },
              },
            },
          },
        },
        _count: { select: { packages: true, stars: true, forks: true } },
      },
    }),
  ])

  if (!user) notFound()

  const currentUserId = session?.user ? (session.user as { id: string }).id : null
  const isOwn = currentUserId === user.id

  const tab = searchParams.tab ?? 'packages'

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
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-sm text-gray-500">@{user.username}</p>
              {user.org && (
                <p className="text-sm text-gray-600 mt-0.5">{user.org}</p>
              )}
              {user.bio && (
                <p className="text-sm text-gray-700 mt-2 max-w-lg">{user.bio}</p>
              )}
              <p className="text-xs text-gray-400 mt-2">Joined {formatDate(user.createdAt)}</p>
            </div>
            {isOwn && (
              <Link
                href="/preferences"
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium"
              >
                Edit profile
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-1.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#6B7280">
                <path d="M20 6h-2.18c.07-.44.18-.88.18-1.34C18 2.1 15.9 0 13.34 0c-1.3 0-2.43.52-3.29 1.36L9 2.5 7.95 1.36C7.09.52 5.96 0 4.66 0 2.1 0 0 2.1 0 4.66c0 .46.11.9.18 1.34H0v2h20v-2z" />
                <path d="M4 10l-1.41 1.41L7 15.83l5-5 5 5 1.41-1.41L13 8.99l-5 5-4-4z" opacity=".3"/>
              </svg>
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#6B7280">
                <path d="M6 2a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m9 0a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3M6 7.5c1.11 0 3.08.59 4.5 1.75C11.92 10.41 13.89 11 15 11v2c-1.67 0-4.08-.83-6-2.25V17a3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 .5.04V7.79c-.17-.18-.33-.28-.5-.29z" />
              </svg>
              <span className="text-sm font-semibold text-gray-900">{formatNumber(user._count.forks)}</span>
              <span className="text-sm text-gray-500">forks</span>
            </div>
          </div>
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
            href={`/${params.username}?tab=${t.id}`}
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
                <Link href="/new" className="mt-3 inline-block px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: '#F59E0B', color: '#1E1B4B' }}>
                  Publish your first package
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.packages.map((pkg) => (
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
              {user.stars.map((star) => (
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
              {user.forks.map((fork) => (
                <PackageCard key={fork.id} pkg={fork.forkedPackage} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
