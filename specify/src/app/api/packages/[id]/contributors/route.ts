import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contributors = await prisma.packageContributor.findMany({
      where: { packageId: params.id },
      include: {
        user: {
          select: { id: true, name: true, username: true, image: true, org: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(contributors)
  } catch (err) {
    console.error('GET /api/packages/[id]/contributors error:', err)
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

    const currentUserId = (session.user as { id: string }).id

    // Only the package author can add contributors
    const pkg = await prisma.package.findUnique({
      where: { id: params.id },
      select: { authorId: true },
    })
    if (!pkg) return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    if (pkg.authorId !== currentUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { username, role } = await request.json()
    if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 })

    const targetUser = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    })
    if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const contributor = await prisma.packageContributor.upsert({
      where: { packageId_userId: { packageId: params.id, userId: targetUser.id } },
      create: { packageId: params.id, userId: targetUser.id, role: role ?? 'contributor' },
      update: { role: role ?? 'contributor' },
      include: {
        user: { select: { id: true, name: true, username: true, image: true, org: true } },
      },
    })

    return NextResponse.json(contributor, { status: 201 })
  } catch (err) {
    console.error('POST /api/packages/[id]/contributors error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUserId = (session.user as { id: string }).id
    const pkg = await prisma.package.findUnique({ where: { id: params.id }, select: { authorId: true } })
    if (!pkg) return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    if (pkg.authorId !== currentUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { username } = await request.json()
    const targetUser = await prisma.user.findUnique({ where: { username }, select: { id: true } })
    if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    await prisma.packageContributor.delete({
      where: { packageId_userId: { packageId: params.id, userId: targetUser.id } },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/packages/[id]/contributors error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
