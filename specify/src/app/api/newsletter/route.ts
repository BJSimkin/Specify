import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// POST /api/newsletter — subscribe (upsert)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, name, org } = body

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const session = await auth()
    const userId = session?.user?.id ?? null

    // Upsert: if email already exists, update; otherwise create
    const sub = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {
        name: name || undefined,
        org: org || undefined,
        userId: userId || undefined,
      },
      create: {
        email,
        name: name || null,
        org: org || null,
        userId,
      },
    })

    return NextResponse.json({ success: true, id: sub.id })
  } catch (err) {
    console.error('[newsletter POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/newsletter?email=... — check subscription status
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  if (!email) return NextResponse.json({ subscribed: false })
  const sub = await prisma.newsletterSubscriber.findUnique({ where: { email } })
  return NextResponse.json({ subscribed: !!sub })
}
