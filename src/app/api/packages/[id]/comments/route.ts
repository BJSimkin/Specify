import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { NotificationType } from '@prisma/client'

const CommentSchema = z.object({
  body: z.string().min(1).max(10000),
  requirementId: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const requirementId = searchParams.get('requirementId')

    const where: Record<string, unknown> = { packageId: params.id }
    if (requirementId) {
      where.requirementId = requirementId
    }

    const comments = await prisma.comment.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      include: { author: true },
    })

    return NextResponse.json(comments)
  } catch (err) {
    console.error('GET /api/packages/[id]/comments error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as { id: string }).id

    const pkg = await prisma.package.findUnique({
      where: { id: params.id },
      select: { id: true, authorId: true, slug: true },
    })

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    const body = await request.json()
    const parsed = CommentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body', details: parsed.error.flatten() }, { status: 400 })
    }

    const { body: commentBody, requirementId } = parsed.data

    const comment = await prisma.comment.create({
      data: {
        authorId: userId,
        packageId: pkg.id,
        requirementId,
        body: commentBody,
      },
      include: { author: true },
    })

    // Notify package author if they're not the commenter
    if (pkg.authorId !== userId) {
      await prisma.notification.create({
        data: {
          userId: pkg.authorId,
          type: NotificationType.COMMENT,
          packageId: pkg.id,
          actorId: userId,
          data: { requirementId: requirementId ?? null, snippet: commentBody.slice(0, 100) },
        },
      })
    }

    // Notify previous unique commenters (excluding current user and package author)
    const previousCommenters = await prisma.comment.findMany({
      where: {
        packageId: pkg.id,
        authorId: { notIn: [userId, pkg.authorId] },
      },
      select: { authorId: true },
      distinct: ['authorId'],
    })

    if (previousCommenters.length > 0) {
      await prisma.notification.createMany({
        data: previousCommenters.map((c) => ({
          userId: c.authorId,
          type: NotificationType.REPLY,
          packageId: pkg.id,
          actorId: userId,
          data: { snippet: commentBody.slice(0, 100) },
        })),
        skipDuplicates: true,
      })
    }

    return NextResponse.json(comment, { status: 201 })
  } catch (err) {
    console.error('POST /api/packages/[id]/comments error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
