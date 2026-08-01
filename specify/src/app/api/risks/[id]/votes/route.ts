import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET vote distribution + user's vote
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    const userId = (session?.user as { id?: string } | undefined)?.id

    const votes = await prisma.riskVote.findMany({
      where: { riskId: params.id },
      select: { score: true, userId: true },
    })

    // Build distribution 0-10
    const distribution: Record<number, number> = {}
    for (let i = 0; i <= 10; i++) distribution[i] = 0
    for (const v of votes) distribution[v.score] = (distribution[v.score] ?? 0) + 1

    // Quartile calculation
    const scores = votes.map((v) => v.score).sort((a, b) => a - b)
    const n = scores.length
    let q1 = 0, median = 0, q3 = 0, mean = 0
    if (n > 0) {
      mean = scores.reduce((s, v) => s + v, 0) / n
      median = n % 2 === 0 ? (scores[n / 2 - 1] + scores[n / 2]) / 2 : scores[Math.floor(n / 2)]
      q1 = n >= 4 ? scores[Math.floor(n / 4)] : scores[0]
      q3 = n >= 4 ? scores[Math.floor((3 * n) / 4)] : scores[n - 1]
    }

    const userVote = userId ? votes.find((v) => v.userId === userId)?.score ?? null : null

    return NextResponse.json({
      distribution,
      count: n,
      mean: Math.round(mean * 10) / 10,
      median,
      q1,
      q3,
      userVote,
    })
  } catch (err) {
    console.error('GET /api/risks/[id]/votes error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST cast or update a vote
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session.user as { id: string }).id

    const { score } = await request.json()
    if (typeof score !== 'number' || score < 0 || score > 10 || !Number.isInteger(score)) {
      return NextResponse.json({ error: 'Score must be an integer 0–10' }, { status: 400 })
    }

    // Check risk exists
    const risk = await prisma.risk.findUnique({ where: { id: params.id } })
    if (!risk) return NextResponse.json({ error: 'Risk not found' }, { status: 404 })

    // Upsert vote (one per user per risk)
    const existing = await prisma.riskVote.findUnique({
      where: { riskId_userId: { riskId: params.id, userId } },
    })

    if (existing) {
      // User already voted — do NOT allow changes
      return NextResponse.json({ error: 'You have already voted on this risk', alreadyVoted: true }, { status: 409 })
    }

    const vote = await prisma.riskVote.create({
      data: { riskId: params.id, userId, score },
    })

    return NextResponse.json({ vote, message: 'Vote recorded' })
  } catch (err) {
    console.error('POST /api/risks/[id]/votes error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
