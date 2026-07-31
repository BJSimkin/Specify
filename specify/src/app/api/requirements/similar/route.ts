import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') ?? ''
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) ?? []
    const excludePackageId = searchParams.get('excludePackageId') ?? ''

    if (!title && tags.length === 0) {
      return NextResponse.json([])
    }

    // Find requirements with matching tags or similar title keywords
    const titleWords = title
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3)

    const requirements = await prisma.requirement.findMany({
      where: {
        package: {
          isPublished: true,
          ...(excludePackageId ? { id: { not: excludePackageId } } : {}),
        },
        OR: [
          ...(tags.length > 0
            ? [{ tags: { hasSome: tags } }]
            : []),
          ...(titleWords.length > 0
            ? titleWords.map((word) => ({
                title: { contains: word, mode: 'insensitive' as const },
              }))
            : []),
        ],
      },
      include: {
        package: {
          select: { id: true, slug: true, name: true, author: { select: { username: true } } },
        },
      },
      orderBy: { package: { stars: { _count: 'desc' } } },
      take: 10,
    })

    return NextResponse.json(requirements)
  } catch (err) {
    console.error('GET /api/requirements/similar error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
