import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET /api/prompt-quality?categoryId=...&vectorName=...
// Returns: { counts: Record<string, number>, userVotes: string[] }
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const vectorName = searchParams.get('vectorName')

    const session = await auth()
    const userId = (session?.user as { id?: string } | undefined)?.id

    // Build key prefix to match
    let keyPrefix: string | undefined
    if (categoryId && vectorName) {
      keyPrefix = `${categoryId}:::${vectorName}:::`
    } else if (categoryId) {
      keyPrefix = `${categoryId}:::`
    }

    const where = keyPrefix
      ? { promptKey: { startsWith: keyPrefix } }
      : {}

    const [allVotes, userVotes] = await Promise.all([
      prisma.promptQuality.groupBy({
        by: ['promptKey'],
        where,
        _count: { promptKey: true },
      }),
      userId
        ? prisma.promptQuality.findMany({
            where: { ...where, userId },
            select: { promptKey: true },
          })
        : Promise.resolve([]),
    ])

    const counts: Record<string, number> = {}
    for (const row of allVotes) {
      counts[row.promptKey] = row._count.promptKey
    }

    return NextResponse.json({
      counts,
      userVotes: userVotes.map((v) => v.promptKey),
    })
  } catch (err) {
    console.error('GET /api/prompt-quality error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/prompt-quality
// Body: { promptKey: string }
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session.user as { id: string }).id

    const { promptKey } = await request.json()
    if (!promptKey || typeof promptKey !== 'string') {
      return NextResponse.json({ error: 'promptKey required' }, { status: 400 })
    }

    // Toggle: if already voted, remove vote
    const existing = await prisma.promptQuality.findUnique({
      where: { promptKey_userId: { promptKey, userId } },
    })

    if (existing) {
      await prisma.promptQuality.delete({
        where: { promptKey_userId: { promptKey, userId } },
      })
      return NextResponse.json({ action: 'removed' })
    }

    await prisma.promptQuality.create({ data: { promptKey, userId } })
    return NextResponse.json({ action: 'added' })
  } catch (err) {
    console.error('POST /api/prompt-quality error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
