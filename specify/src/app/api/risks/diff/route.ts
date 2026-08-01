import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fromId = searchParams.get('from')
    const toId = searchParams.get('to')

    if (!fromId || !toId) {
      return NextResponse.json({ error: 'Both from and to version IDs are required' }, { status: 400 })
    }

    const [fromRisks, toRisks] = await Promise.all([
      prisma.risk.findMany({ where: { versionId: fromId }, orderBy: { riskNum: 'asc' } }),
      prisma.risk.findMany({ where: { versionId: toId }, orderBy: { riskNum: 'asc' } }),
    ])

    const fromMap = new Map(fromRisks.map((r) => [r.riskNum, r]))
    const toMap = new Map(toRisks.map((r) => [r.riskNum, r]))

    const added = toRisks.filter((r) => !fromMap.has(r.riskNum))
    const removed = fromRisks.filter((r) => !toMap.has(r.riskNum))
    const modified = toRisks.filter((r) => {
      const prev = fromMap.get(r.riskNum)
      return prev && (prev.title !== r.title || prev.description !== r.description || prev.category !== r.category)
    }).map((r) => ({ before: fromMap.get(r.riskNum)!, after: r }))

    return NextResponse.json({ added, removed, modified, unchanged: toRisks.length - added.length - modified.length })
  } catch (err) {
    console.error('GET /api/risks/diff error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
