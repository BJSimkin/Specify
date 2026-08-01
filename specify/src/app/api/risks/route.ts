import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const versionId = searchParams.get('versionId') ?? undefined
    const category = searchParams.get('category') ?? undefined

    // If no versionId provided, fetch the latest version
    let resolvedVersionId = versionId
    if (!resolvedVersionId) {
      const latest = await prisma.riskVersion.findFirst({ orderBy: { createdAt: 'desc' } })
      resolvedVersionId = latest?.id
    }

    if (!resolvedVersionId) {
      return NextResponse.json({ risks: [], version: null })
    }

    const where: Record<string, unknown> = { versionId: resolvedVersionId }
    if (category) where.category = category

    const [risks, version] = await Promise.all([
      prisma.risk.findMany({
        where,
        orderBy: [{ category: 'asc' }, { riskNum: 'asc' }],
        include: {
          _count: { select: { votes: true, comments: true } },
          votes: { select: { score: true } },
        },
      }),
      prisma.riskVersion.findUnique({ where: { id: resolvedVersionId } }),
    ])

    // Compute vote averages for client-side sorting
    const risksWithAvg = risks.map((risk) => {
      const scores = risk.votes.map((v) => v.score)
      const count = scores.length
      const avg = count > 0 ? scores.reduce((s, v) => s + v, 0) / count : null
      const { votes: _votes, ...rest } = risk
      void _votes
      return {
        ...rest,
        voteAvg: avg !== null ? Math.round(avg * 10) / 10 : null,
        voteCount: count,
      }
    })

    return NextResponse.json({ risks: risksWithAvg, version })
  } catch (err) {
    console.error('GET /api/risks error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
