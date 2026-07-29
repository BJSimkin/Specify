import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { buildPackageSlug } from '@/lib/utils'
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
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, username: true } })

    if (!user?.username) {
      return NextResponse.json({ error: 'User profile incomplete' }, { status: 400 })
    }

    const original = await prisma.package.findUnique({
      where: { id: params.id },
      include: {
        requirements: {
          orderBy: { order: 'asc' },
          include: { subRequirements: { orderBy: { order: 'asc' } } },
        },
        tags: true,
      },
    })

    if (!original) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    if (original.authorId === userId) {
      return NextResponse.json({ error: 'Cannot fork your own package' }, { status: 400 })
    }

    // Build new slug
    const [, originalName] = original.slug.split('/')
    let newSlug = buildPackageSlug(user.username, originalName)

    // Handle slug conflicts
    let attempt = 0
    while (await prisma.package.findUnique({ where: { slug: newSlug }, select: { id: true } })) {
      attempt++
      newSlug = buildPackageSlug(user.username, `${originalName}-${attempt}`)
    }

    // Create the forked package
    const forked = await prisma.package.create({
      data: {
        slug: newSlug,
        authorId: userId,
        name: original.name,
        description: original.description,
        license: original.license,
        specifyVersion: original.specifyVersion,
        currentVersion: original.currentVersion,
        isPublished: true,
        forkedFromId: original.id,
        tags: {
          createMany: {
            data: original.tags.map((t) => ({ category: t.category, value: t.value })),
          },
        },
        requirements: {
          create: original.requirements.map((req, order) => ({
            reqId: req.reqId,
            title: req.title,
            tags: req.tags,
            obligation: req.obligation,
            body: req.body,
            dependsOn: req.dependsOn,
            order,
            subRequirements: {
              create: req.subRequirements.map((sub, subOrder) => ({
                subId: sub.subId,
                title: sub.title,
                obligation: sub.obligation,
                body: sub.body,
                order: subOrder,
              })),
            },
          })),
        },
      },
    })

    // Record the fork
    await prisma.fork.create({
      data: {
        originalPackageId: original.id,
        forkedPackageId: forked.id,
        forkerId: userId,
      },
    })

    // Notify original author
    if (original.authorId !== userId) {
      await prisma.notification.create({
        data: {
          userId: original.authorId,
          type: NotificationType.FORK,
          packageId: original.id,
          actorId: userId,
          data: { forkedSlug: forked.slug },
        },
      })
    }

    return NextResponse.json(forked, { status: 201 })
  } catch (err) {
    console.error('POST /api/packages/[id]/fork error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
