import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

// GET /api/model-results?categoryId=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId') ?? undefined

    const results = await prisma.modelBenchmarkResult.findMany({
      where: categoryId ? { categoryId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        submittedBy: { select: { id: true, name: true, username: true, image: true } },
      },
    })

    // Aggregate per model (across categories)
    const modelMap: Record<string, {
      modelName: string
      modelVersion: string | null
      provider: string | null
      totalSamples: number
      totalPass: number
      totalFail: number
      categories: Array<{
        categoryId: string
        categoryName: string
        totalSamples: number
        passCount: number
        failCount: number
        passRate: number
      }>
      latestRun: string
    }> = {}

    for (const r of results) {
      const key = `${r.modelName}|||${r.modelVersion ?? ''}`
      if (!modelMap[key]) {
        modelMap[key] = {
          modelName: r.modelName,
          modelVersion: r.modelVersion,
          provider: r.provider,
          totalSamples: 0,
          totalPass: 0,
          totalFail: 0,
          categories: [],
          latestRun: r.createdAt.toISOString(),
        }
      }
      const m = modelMap[key]
      m.totalSamples += r.totalSamples
      m.totalPass += r.passCount
      m.totalFail += r.failCount
      m.categories.push({
        categoryId: r.categoryId,
        categoryName: r.categoryName,
        totalSamples: r.totalSamples,
        passCount: r.passCount,
        failCount: r.failCount,
        passRate: r.totalSamples > 0 ? Math.round((r.passCount / r.totalSamples) * 1000) / 10 : 0,
      })
    }

    const leaderboard = Object.values(modelMap)
      .map((m) => ({
        ...m,
        passRate: m.totalSamples > 0 ? Math.round((m.totalPass / m.totalSamples) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.passRate - a.passRate)

    return NextResponse.json({ results, leaderboard })
  } catch (err) {
    console.error('GET /api/model-results error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const submitSchema = z.object({
  modelName: z.string().min(1).max(100),
  modelVersion: z.string().max(50).optional(),
  provider: z.string().max(100).optional(),
  categoryId: z.string().min(1),
  categoryName: z.string().min(1),
  totalSamples: z.number().int().positive(),
  passCount: z.number().int().min(0),
  failCount: z.number().int().min(0),
  notes: z.string().max(2000).optional(),
})

// POST /api/model-results
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session.user as { id: string }).id

    const body = await request.json()
    const parsed = submitSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const data = parsed.data
    if (data.passCount + data.failCount > data.totalSamples) {
      return NextResponse.json({ error: 'Pass + fail count cannot exceed total samples' }, { status: 400 })
    }

    const result = await prisma.modelBenchmarkResult.create({
      data: {
        modelName: data.modelName,
        modelVersion: data.modelVersion ?? null,
        provider: data.provider ?? null,
        categoryId: data.categoryId,
        categoryName: data.categoryName,
        totalSamples: data.totalSamples,
        passCount: data.passCount,
        failCount: data.failCount,
        notes: data.notes ?? null,
        submittedById: userId,
      },
    })

    return NextResponse.json({ result }, { status: 201 })
  } catch (err) {
    console.error('POST /api/model-results error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
