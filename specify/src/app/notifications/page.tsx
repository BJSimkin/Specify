import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { formatRelativeDate } from '@/lib/utils'

export const metadata = { title: 'Notifications — Sequel' }

const TYPE_ICONS: Record<string, { icon: string; color: string }> = {
  COMMENT: { icon: '💬', color: '#3B82F6' },
  FORK: { icon: '🍴', color: '#8B5CF6' },
  MATCHING_PACKAGE: { icon: '✨', color: '#F59E0B' },
  REPLY: { icon: '↩️', color: '#10B981' },
  STAR: { icon: '⭐', color: '#F59E0B' },
  FOLLOW: { icon: '👤', color: '#6366F1' },
}

const TYPE_LABELS: Record<string, string> = {
  COMMENT: 'commented on',
  FORK: 'forked',
  MATCHING_PACKAGE: 'published a matching package',
  REPLY: 'also commented on',
  STAR: 'starred',
  FOLLOW: 'started following you',
}

interface PageProps {
  searchParams: { filter?: string }
}

export default async function NotificationsPage({ searchParams }: PageProps) {
  const session = await auth()
  if (!session?.user) redirect('/api/auth/signin')

  const userId = (session.user as { id: string }).id

  const filter = searchParams.filter ?? 'all'

  type NotifType = 'COMMENT' | 'FORK' | 'MATCHING_PACKAGE' | 'REPLY' | 'STAR' | 'FOLLOW'
  const filterMap: Record<string, NotifType[]> = {
    all: [],
    comments: ['COMMENT', 'REPLY'],
    packages: ['MATCHING_PACKAGE'],
    forks: ['FORK'],
    stars: ['STAR'],
    follows: ['FOLLOW'],
  }

  const typeFilter = filterMap[filter] ?? []

  const where: Record<string, unknown> = { userId }
  if (typeFilter.length > 0) {
    where.type = { in: typeFilter }
  }

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.notification.count({ where: { userId, read: false } }),
  ])

  // Fetch actors and packages for display
  const actorIds = [...new Set(notifications.map((n) => n.actorId).filter(Boolean))] as string[]
  const packageIds = [...new Set(notifications.map((n) => n.packageId).filter(Boolean))] as string[]

  const [actors, packages] = await Promise.all([
    actorIds.length > 0
      ? prisma.user.findMany({ where: { id: { in: actorIds } }, select: { id: true, name: true, username: true, image: true } })
      : [],
    packageIds.length > 0
      ? prisma.package.findMany({ where: { id: { in: packageIds } }, select: { id: true, slug: true, name: true } })
      : [],
  ])

  const actorMap = Object.fromEntries(actors.map((a) => [a.id, a]))
  const packageMap = Object.fromEntries(packages.map((p) => [p.id, p]))

  // Mark all as read
  if (unreadCount > 0) {
    await prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } })
  }

  const FILTER_TABS = [
    { id: 'all', label: 'All' },
    { id: 'comments', label: 'Comments' },
    { id: 'packages', label: 'New packages' },
    { id: 'forks', label: 'Forks' },
    { id: 'stars', label: 'Stars' },
    { id: 'follows', label: 'Follows' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1E1B4B' }}>
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">{unreadCount} unread</p>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 mb-6">
        {FILTER_TABS.map((tab) => (
          <Link
            key={tab.id}
            href={`/notifications?filter=${tab.id}`}
            className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
            style={
              filter === tab.id
                ? { backgroundColor: '#1E1B4B', color: 'white' }
                : { backgroundColor: '#F3F4F6', color: '#6B7280' }
            }
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto text-3xl"
            style={{ backgroundColor: '#EEF2FF' }}
          >
            🔔
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">All caught up!</h3>
          <p className="text-sm text-gray-500">
            {filter === 'all'
              ? "You don't have any notifications yet."
              : `No ${filter} notifications yet.`}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {notifications.map((notif) => {
            const actor = notif.actorId ? actorMap[notif.actorId] : null
            const pkg = notif.packageId ? packageMap[notif.packageId] : null
            const typeInfo = TYPE_ICONS[notif.type] ?? { icon: '📣', color: '#6B7280' }
            const typeLabel = TYPE_LABELS[notif.type] ?? 'interacted with'
            const data = notif.data as Record<string, unknown>

            return (
              <div
                key={notif.id}
                className="flex items-start gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-50"
                style={!notif.read ? { backgroundColor: '#EEF2FF' } : {}}
              >
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0"
                  style={{ backgroundColor: `${typeInfo.color}20`, border: `1.5px solid ${typeInfo.color}40` }}
                >
                  {typeInfo.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 leading-snug">
                    {actor ? (
                      <Link href={`/${actor.username}`} className="font-semibold hover:text-indigo-600">
                        {actor.name}
                      </Link>
                    ) : (
                      <span className="font-semibold">Someone</span>
                    )}{' '}
                    {typeLabel}{' '}
                    {pkg ? (
                      <Link
                        href={`/packages/${pkg.slug}`}
                        className="font-semibold text-indigo-600 hover:underline"
                      >
                        {pkg.slug}
                      </Link>
                    ) : (
                      'a package'
                    )}
                  </p>
                  {typeof data?.snippet === 'string' && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">&ldquo;{data.snippet}&rdquo;</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">{formatRelativeDate(notif.createdAt)}</p>
                </div>

                {/* Unread dot */}
                {!notif.read && (
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                    style={{ backgroundColor: '#F59E0B' }}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
