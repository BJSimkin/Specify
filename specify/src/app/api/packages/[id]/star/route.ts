import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

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
      select: { id: true },
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
    }

    const count = await prisma.star.count({ where: { packageId: pkg.id } })

    return NextResponse.json({ starred: !existingStar, count })
  } catch (err) {
    console.error('POST /api/packages/[id]/star error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
