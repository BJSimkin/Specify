import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const comments = await prisma.riskComment.findMany({
      where: { riskId: id },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { id: true, name: true, username: true, image: true } },
      },
    })
    return NextResponse.json(comments)
  } catch (err: any) {
    console.error('GET /api/risks/[id]/comments error:', err?.message ?? err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session.user as { id: string }).id

    const { body } = await request.json()
    if (!body?.trim()) return NextResponse.json({ error: 'Comment cannot be empty' }, { status: 400 })

    const risk = await prisma.risk.findUnique({ where: { id } })
    if (!risk) return NextResponse.json({ error: 'Risk not found' }, { status: 404 })

    const comment = await prisma.riskComment.create({
      data: { riskId: id, userId, body: body.trim() },
      include: {
        user: { select: { id: true, name: true, username: true, image: true } },
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (err: any) {
    console.error('POST /api/risks/[id]/comments error:', err?.message ?? err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
