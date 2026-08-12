import { prisma } from '@/lib/prisma'
import { getInitials, formatNumber } from '@/lib/utils'
import LeaderboardClient from './leaderboard-client'

export const metadata = { title: 'Leaderboard — Sequel' }

export default async function LeaderboardPage() {
  // Contributors leaderboard
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
        select: { _count: { select: { stars: true, forks: true } } },
      },
      _count: { select: { packages: true, followers: true } },
    },
  })

  const contributors = users
    .map((u) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      image: u.image,
      org: u.org ?? null,
      occupation: u.occupation ?? null,
      specialty: u.specialty ?? null,
      totalStars: u.packages.reduce((s, p) => s + p._count.stars, 0),
      totalForks: u.packages.reduce((s, p) => s + p._count.forks, 0),
      packageCount: u._count.packages,
      initials: getInitials(u.name),
    }))
    .sort((a, b) => b.totalStars - a.totalStars)
    .slice(0, 50)

  // Model benchmark results — aggregate per model+version
  const rawResults = await prisma.modelBenchmarkResult.findMany({
    orderBy: { createdAt: 'desc' },
  })

  type CategoryEntry = {
    categoryId: string; categoryName: string
    totalSamples: number; passCount: number; failCount: number; passRate: number
  }
  type ModelEntry = {
    modelName: string; modelVersion: string | null; provider: string | null
    totalSamples: number; totalPass: number; totalFail: number; passRate: number
    categories: CategoryEntry[]; latestRun: string
  }

  const modelMap = new Map<string, ModelEntry>()
  for (const r of rawResults) {
    const key = `${r.modelName}|||${r.modelVersion ?? ''}`
    if (!modelMap.has(key)) {
      modelMap.set(key, {
        modelName: r.modelName, modelVersion: r.modelVersion, provider: r.provider,
        totalSamples: 0, totalPass: 0, totalFail: 0, passRate: 0,
        categories: [], latestRun: r.createdAt.toISOString(),
      })
    }
    const m = modelMap.get(key)!
    m.totalSamples += r.totalSamples
    m.totalPass += r.passCount
    m.totalFail += r.failCount
    m.categories.push({
      categoryId: r.categoryId, categoryName: r.categoryName,
      totalSamples: r.totalSamples, passCount: r.passCount, failCount: r.failCount,
      passRate: r.totalSamples > 0 ? Math.round((r.passCount / r.totalSamples) * 1000) / 10 : 0,
    })
    if (new Date(r.createdAt) > new Date(m.latestRun)) m.latestRun = r.createdAt.toISOString()
  }

  const benchmarkLeaderboard = Array.from(modelMap.values())
    .map((m) => ({ ...m, passRate: m.totalSamples > 0 ? Math.round((m.totalPass / m.totalSamples) * 1000) / 10 : 0 }))
    .sort((a, b) => b.passRate - a.passRate)

  return (
    <LeaderboardClient
      contributors={contributors}
      benchmarkLeaderboard={benchmarkLeaderboard}
      formatNumber={formatNumber}
    />
  )
}
