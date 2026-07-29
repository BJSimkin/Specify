import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateCsv } from '@/lib/csv'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pkg = await prisma.package.findUnique({
      where: { id: params.id },
      select: {
        slug: true,
        requirements: {
          orderBy: { order: 'asc' },
          include: { subRequirements: { orderBy: { order: 'asc' } } },
        },
      },
    })

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    const csv = generateCsv(pkg.requirements)
    const filename = `${pkg.slug.replace('/', '-')}-requirements.csv`

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    console.error('GET /api/packages/[id]/download error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
