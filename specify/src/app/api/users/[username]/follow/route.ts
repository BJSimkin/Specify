import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { NotificationType } from '@prisma/client'

export async function GET(
  _request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ following: false })
    }
    const followerId = (session.user as { id: string }).id
    const target = await prisma.user.findUnique({
      where: { username: params.username },
      select: { id: true },
    })
    if (!target) return NextResponse.json({ following: false })
    const existing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId: target.id } },
    })
    return NextResponse.json({ following: !!existing })
  } catch (err) {
    console.error('GET /api/users/[username]/follow error:', err)
    return NextResponse.json({ following: false })
  }
}

export async function POST(
  _request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const followerId = (session.user as { id: string }).id

    const target = await prisma.user.findUnique({
      where: { username: params.username },
      select: { id: true },
    })

    if (!target) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (target.id === followerId) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
    }

    const existing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId: target.id } },
    })

    if (existing) {
      await prisma.follow.delete({
        where: { followerId_followingId: { followerId, followingId: target.id } },
      })
      return NextResponse.json({ following: false })
    } else {
      await prisma.follow.create({
        data: { followerId, followingId: target.id },
      })
      // Notify the followed user
      const targetPrefs = await prisma.userPreference.findUnique({
        where: { userId: target.id },
        select: { notifyOnFollow: true },
      })
      if (!targetPrefs || targetPrefs.notifyOnFollow) {
        await prisma.notification.create({
          data: {
            userId: target.id,
            type: NotificationType.FOLLOW,
            actorId: followerId,
            data: {},
          },
        })
      }
      return NextResponse.json({ following: true })
    }
  } catch (err) {
    console.error('POST /api/users/[username]/follow error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
