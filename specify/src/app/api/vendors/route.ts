import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

const VendorSchema = z.object({
  name: z.string().min(1).max(100),
  website: z.string().url().optional().or(z.literal('')),
  description: z.string().max(1000).optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  categories: z.array(z.string()).optional().default([]),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') ?? ''
    const category = searchParams.get('category') ?? ''

    const vendors = await prisma.vendor.findMany({
      where: {
        ...(q ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        } : {}),
        ...(category ? { categories: { has: category } } : {}),
      },
      orderBy: [{ verified: 'desc' }, { name: 'asc' }],
      include: {
        submittedBy: { select: { name: true, username: true } },
      },
    })

    return NextResponse.json(vendors)
  } catch (err) {
    console.error('GET /api/vendors error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as { id: string }).id
    const body = await request.json()
    const parsed = VendorSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
    }

    const data = parsed.data

    const vendor = await prisma.vendor.create({
      data: {
        name: data.name,
        website: data.website || null,
        description: data.description || null,
        logoUrl: data.logoUrl || null,
        categories: data.categories,
        submittedById: userId,
      },
    })

    return NextResponse.json(vendor, { status: 201 })
  } catch (err) {
    console.error('POST /api/vendors error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
