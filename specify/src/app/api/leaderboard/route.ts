import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get users with total star count across all their packages
    const users = await prisma.user.findMany({
      where: {
        packages: { some: { isPublished: true } },
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        org: true,
        occupation: true,
        specialty: true,
        packages: {
          where: { isPublished: true },
          select: {
            _count: { select: { stars: true, forks: true } },
          },
        },
        _count: { select: { packages: true, followers: true } },
      },
    })

    // Compute total stars and forks per user, then sort
    const leaderboard = users
      .map((u) => {
        const totalStars = u.packages.reduce((sum, p) => sum + p._count.stars, 0)
        const totalForks = u.packages.reduce((sum, p) => sum + p._count.forks, 0)
        return {
          id: u.id,
          name: u.name,
          username: u.username,
          image: u.image,
          org: u.org,
          occupation: u.occupation,
          specialty: u.specialty,
          totalStars,
          totalForks,
          packageCount: u._count.packages,
          followerCount: u._count.followers,
        }
      })
      .sort((a, b) => b.totalStars - a.totalStars)
      .slice(0, 50)

    return NextResponse.json(leaderboard)
  } catch (err) {
    console.error('GET /api/leaderboard error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
