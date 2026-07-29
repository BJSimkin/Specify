import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim() ?? ''

    if (!q) {
      return NextResponse.json([])
    }

    const packages = await prisma.package.findMany({
      where: {
        isPublished: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { slug: { contains: q, mode: 'insensitive' } },
          { requirements: { some: { title: { contains: q, mode: 'insensitive' } } } },
        ],
      },
      take: 10,
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        currentVersion: true,
        author: { select: { name: true, username: true, image: true } },
        certifications: { select: { certifier: true } },
        _count: { select: { stars: true } },
      },
      orderBy: { stars: { _count: 'desc' } },
    })

    return NextResponse.json(packages)
  } catch (err) {
    console.error('GET /api/search error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
