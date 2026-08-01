import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const versions = await prisma.riskVersion.findMany({
      orderBy: { createdAt: 'asc' },
      include: { _count: { select: { risks: true } } },
    })
    return NextResponse.json(versions)
  } catch (err) {
    console.error('GET /api/risks/versions error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
