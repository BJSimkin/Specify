import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const versionId = searchParams.get('versionId') ?? undefined
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10', 10), 50)

    // Resolve latest version if not specified
    let resolvedVersionId = versionId
    if (!resolvedVersionId) {
      const latest = await prisma.riskVersion.findFirst({ orderBy: { createdAt: 'desc' } })
      resolvedVersionId = latest?.id
    }
    if (!resolvedVersionId) return NextResponse.json([])

    // Get all risks in this version with their votes
    const risks = await prisma.risk.findMany({
      where: { versionId: resolvedVersionId },
      include: {
        votes: { select: { score: true } },
        _count: { select: { votes: true, comments: true } },
      },
    })

    // Calculate stats per risk, require at least 1 vote
    const scored = risks
      .filter((r) => r.votes.length > 0)
      .map((r) => {
        const scores = r.votes.map((v) => v.score).sort((a, b) => a - b)
        const n = scores.length
        const mean = scores.reduce((s, v) => s + v, 0) / n
        const median = n % 2 === 0
          ? (scores[n / 2 - 1] + scores[n / 2]) / 2
          : scores[Math.floor(n / 2)]
        const distribution: Record<number, number> = {}
        for (let i = 0; i <= 10; i++) distribution[i] = 0
        for (const s of scores) distribution[s] = (distribution[s] ?? 0) + 1
        const q1 = n >= 4 ? scores[Math.floor(n / 4)] : scores[0]
        const q3 = n >= 4 ? scores[Math.floor((3 * n) / 4)] : scores[n - 1]

        return {
          id: r.id,
          riskNum: r.riskNum,
          category: r.category,
          title: r.title,
          description: r.description,
          voteCount: n,
          mean: Math.round(mean * 10) / 10,
          median,
          q1,
          q3,
          distribution,
          commentCount: r._count.comments,
        }
      })
      // Sort by mean descending, then by vote count as tiebreaker
      .sort((a, b) => b.mean - a.mean || b.voteCount - a.voteCount)
      .slice(0, limit)

    return NextResponse.json(scored)
  } catch (err) {
    console.error('GET /api/risks/top error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
