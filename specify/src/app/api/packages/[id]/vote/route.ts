import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  // Aggregate averages for this package
  const votes = await prisma.packageMetricVote.findMany({ where: { packageId: id } })

  const agg: Record<string, { sum: number; count: number }> = {}
  for (const v of votes) {
    if (!agg[v.metric]) agg[v.metric] = { sum: 0, count: 0 }
    agg[v.metric].sum += v.score
    agg[v.metric].count++
  }
  const averages: Record<string, number | null> = {
    completeness: agg.completeness ? agg.completeness.sum / agg.completeness.count : null,
    actionable:   agg.actionable   ? agg.actionable.sum   / agg.actionable.count   : null,
  }
  const counts: Record<string, number> = {
    completeness: agg.completeness?.count ?? 0,
    actionable:   agg.actionable?.count   ?? 0,
  }

  // User's own votes (if logged in)
  let userVotes: Record<string, number> = {}
  if (session?.user?.id) {
    const uvotes = await prisma.packageMetricVote.findMany({
      where: { packageId: id, userId: session.user.id },
    })
    for (const v of uvotes) userVotes[v.metric] = v.score
  }

  return NextResponse.json({ averages, counts, userVotes })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { metric, score } = body as { metric: string; score: number }

  if (!['completeness', 'actionable'].includes(metric)) {
    return NextResponse.json({ error: 'Invalid metric' }, { status: 400 })
  }
  if (typeof score !== 'number' || score < 1 || score > 5) {
    return NextResponse.json({ error: 'Score must be 1–5' }, { status: 400 })
  }

  const vote = await prisma.packageMetricVote.upsert({
    where: { packageId_userId_metric: { packageId: id, userId: session.user.id, metric } },
    create: { packageId: id, userId: session.user.id, metric, score },
    update: { score },
  })

  return NextResponse.json({ vote })
}
