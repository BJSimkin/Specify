import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const VALID_TYPES = ['system-card', 'model-card', 'dataset-card', 'provenance-record'] as const
type CardType = (typeof VALID_TYPES)[number]

// Return download count for a card type
export async function GET(
  _request: NextRequest,
  { params }: { params: { type: string } }
) {
  const type = params.type as CardType
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: 'Invalid card type' }, { status: 400 })
  }

  const record = await prisma.cardTemplate.findUnique({ where: { id: type } })
  return NextResponse.json({ downloadCount: record?.downloadCount ?? 0 })
}

// Increment download count
export async function POST(
  _request: NextRequest,
  { params }: { params: { type: string } }
) {
  const type = params.type as CardType
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: 'Invalid card type' }, { status: 400 })
  }

  const record = await prisma.cardTemplate.upsert({
    where: { id: type },
    update: { downloadCount: { increment: 1 } },
    create: { id: type, downloadCount: 1 },
  })

  return NextResponse.json({ downloadCount: record.downloadCount })
}
