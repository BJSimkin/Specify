import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: params.username },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        username: true,
        org: true,
        bio: true,
        country: true,
        occupation: true,
        specialty: true,
        linkedinUrl: true,
        publications: true,
        createdAt: true,
        packages: {
          where: { isPublished: true },
          orderBy: { createdAt: 'desc' },
          include: {
            certifications: true,
            tags: true,
            _count: { select: { stars: true, forks: true, comments: true, versions: true } },
          },
        },
        stars: {
          orderBy: { createdAt: 'desc' },
          include: {
            package: {
              include: {
                author: true,
                certifications: true,
                tags: true,
                _count: { select: { stars: true, forks: true, comments: true, versions: true } },
              },
            },
          },
        },
        forks: {
          orderBy: { createdAt: 'desc' },
          include: {
            forkedPackage: {
              include: {
                author: true,
                certifications: true,
                tags: true,
                _count: { select: { stars: true, forks: true, comments: true, versions: true } },
              },
            },
          },
        },
        preferences: true,
        _count: { select: { packages: true, stars: true, forks: true, followers: true, following: true } },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (err) {
    console.error('GET /api/users/[username] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const PreferencesSchema = z.object({
  useCases: z.array(z.string()).optional(),
  industries: z.array(z.string()).optional(),
  certifiers: z.array(z.string()).optional(),
  notifyOnMatch: z.boolean().optional(),
  notifyOnComment: z.boolean().optional(),
  notifyOnFork: z.boolean().optional(),
  notifyOnReply: z.boolean().optional(),
  notifyOnStar: z.boolean().optional(),
  notifyOnFollow: z.boolean().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as { id: string }).id
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { username: true } })

    if (user?.username !== params.username) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()

    // Handle profile updates
    if (body.type === 'profile') {
      const ProfileSchema = z.object({
        type: z.literal('profile'),
        name: z.string().max(100).optional(),
        bio: z.string().max(500).optional(),
        org: z.string().max(100).optional(),
        country: z.string().max(100).optional(),
        occupation: z.string().max(100).optional(),
        specialty: z.string().max(200).optional(),
        linkedinUrl: z.string().url().optional().or(z.literal('')),
        publications: z.array(z.string()).optional(),
      })
      const parsed = ProfileSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
      }
      const { type: _type, ...data } = parsed.data
      const updated = await prisma.user.update({ where: { id: userId }, data })
      return NextResponse.json(updated)
    }

    // Handle preferences update
    const parsed = PreferencesSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body', details: parsed.error.flatten() }, { status: 400 })
    }

    const prefs = await prisma.userPreference.upsert({
      where: { userId },
      create: { userId, ...parsed.data },
      update: parsed.data,
    })

    return NextResponse.json(prefs)
  } catch (err) {
    console.error('PUT /api/users/[username] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
