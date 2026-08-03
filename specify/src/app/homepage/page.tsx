import { prisma } from '@/lib/prisma'
import { getInitials, formatNumber } from '@/lib/utils'
import HomepageClient from './homepage-client'

export const metadata = { title: 'Specify' }

export default async function HomepagePage() {
  // Fetch contributor leaderboard data
  const users = await prisma.user.findMany({
    where: { packages: { some: { isPublished: true } } },
    select: {
      id: true, name: true, username: true, image: true, org: true,
      occupation: true, specialty: true,
      packages: {
        where: { isPublished: true },
        select: { _count: { select: { stars: true, forks: true } } },
      },
      _count: { select: { packages: true } },
    },
  })

  const contributors = users
    .map((u) => ({
      id: u.id, name: u.name, username: u.username, image: u.image,
      org: u.org ?? null, occupation: u.occupation ?? null, specialty: u.specialty ?? null,
      totalStars: u.packages.reduce((s, p) => s + p._count.stars, 0),
      totalForks: u.packages.reduce((s, p) => s + p._count.forks, 0),
      packageCount: u._count.packages,
      initials: getInitials(u.name),
    }))
    .sort((a, b) => b.totalStars - a.totalStars)
    .slice(0, 10)

  // Fetch model benchmark leaderboard
  const rawResults = await prisma.modelBenchmarkResult.findMany({ orderBy: { createdAt: 'desc' } })

  type ModelEntry = {
    modelName: string; modelVersion: string | null; provider: string | null
    totalSamples: number; totalPass: number; passRate: number
  }
  const modelMap = new Map<string, ModelEntry>()
  for (const r of rawResults) {
    const key = `${r.modelName}|||${r.modelVersion ?? ''}`
    if (!modelMap.has(key)) {
      modelMap.set(key, { modelName: r.modelName, modelVersion: r.modelVersion, provider: r.provider, totalSamples: 0, totalPass: 0, passRate: 0 })
    }
    const m = modelMap.get(key)!
    m.totalSamples += r.totalSamples
    m.totalPass += r.passCount
  }
  const benchmarks = Array.from(modelMap.values())
    .map((m) => ({ ...m, passRate: m.totalSamples > 0 ? Math.round((m.totalPass / m.totalSamples) * 1000) / 10 : 0 }))
    .sort((a, b) => b.passRate - a.passRate)
    .slice(0, 10)

  return <HomepageClient contributors={contributors} benchmarks={benchmarks} formatNumber={formatNumber} />
}
