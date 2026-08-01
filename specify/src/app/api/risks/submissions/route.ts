import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

const CATEGORIES = [
  'Harmful Knowledge & Capability Uplift',
  'Autonomous & Agentic Harm',
  'Manipulation, Deception & Societal Harm',
  'Loss of Control & Alignment Failure',
  'Cyber Offence & Security',
  'Systemic & Civilisational Risks',
  'Content Harms',
  'Privacy, Discrimination & Rights Violations',
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (id) {
      const sub = await prisma.riskSubmission.findUnique({ where: { id } })
      if (!sub) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(sub)
    }
    // Admin: list all
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const submissions = await prisma.riskSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, username: true } } },
    })
    return NextResponse.json(submissions)
  } catch (err) {
    console.error('GET /api/risks/submissions error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const userId = (session?.user as { id?: string } | undefined)?.id

    const { category, title, description } = await request.json()

    if (!category || !CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'Invalid or missing category' }, { status: 400 })
    }
    if (!title?.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    if (!description?.trim()) return NextResponse.json({ error: 'Description is required' }, { status: 400 })
    if (title.trim().length < 5) return NextResponse.json({ error: 'Title too short (min 5 chars)' }, { status: 400 })
    if (description.trim().length < 20) return NextResponse.json({ error: 'Description too short (min 20 chars)' }, { status: 400 })

    const submission = await prisma.riskSubmission.create({
      data: {
        category,
        title: title.trim(),
        description: description.trim(),
        userId: userId ?? null,
        // Auto-accept for now — in production this would be 'pending' and reviewed by admin
        status: 'pending',
      },
    })

    return NextResponse.json({ submission, message: 'Your risk has been submitted for review.' }, { status: 201 })
  } catch (err) {
    console.error('POST /api/risks/submissions error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
