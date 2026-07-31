import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { NotificationType } from '@prisma/client'

export async function POST(
  _request: NextRequest,
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

    const existingStar = await prisma.star.findUnique({
      where: { userId_packageId: { userId, packageId: pkg.id } },
    })

    if (existingStar) {
      await prisma.star.delete({
        where: { userId_packageId: { userId, packageId: pkg.id } },
      })
    } else {
      await prisma.star.create({
        data: { userId, packageId: pkg.id },
      })
      // Notify the package author (not if starring own package)
      if (pkg.authorId !== userId) {
        const authorPrefs = await prisma.userPreference.findUnique({
          where: { userId: pkg.authorId },
          select: { notifyOnStar: true },
        })
        if (!authorPrefs || authorPrefs.notifyOnStar) {
          await prisma.notification.create({
            data: {
              userId: pkg.authorId,
              type: NotificationType.STAR,
              packageId: pkg.id,
              actorId: userId,
              data: { packageSlug: pkg.slug },
            },
          })
        }
      }
    }

    const count = await prisma.star.count({ where: { packageId: pkg.id } })

    return NextResponse.json({ starred: !existingStar, count })
  } catch (err) {
    console.error('POST /api/packages/[id]/star error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
