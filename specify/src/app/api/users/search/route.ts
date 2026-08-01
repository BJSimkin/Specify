import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim() ?? ''

    if (q.length < 2) {
      return NextResponse.json([])
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q, mode: 'insensitive' } },
          { name: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        org: true,
      },
      take: 8,
    })

    return NextResponse.json(users)
  } catch (err) {
    console.error('GET /api/users/search error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
