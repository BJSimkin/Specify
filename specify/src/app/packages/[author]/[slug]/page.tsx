import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import PackageDetailClient from './detail-client'

interface PageProps {
  params: { author: string; slug: string }
}

async function getPackage(author: string, slugPart: string) {
  const fullSlug = `${author}/${slugPart}`
  const pkg = await prisma.package.findUnique({
    where: { slug: fullSlug },
    include: {
      author: true,
      requirements: {
        orderBy: { order: 'asc' },
        include: {
          subRequirements: { orderBy: { order: 'asc' } },
          comments: { include: { author: true }, orderBy: { createdAt: 'asc' } },
        },
      },
      certifications: { include: { grantedBy: true } },
      tags: true,
      versions: { orderBy: { publishedAt: 'desc' }, include: { publishedBy: true } },
      forkedFrom: {
        include: {
          author: true,
          requirements: { orderBy: { order: 'asc' } },
        },
      },
      forks: { orderBy: { createdAt: 'desc' }, include: { author: true } },
      contributors: { include: { user: { select: { id: true, name: true, username: true, image: true, org: true } } } },
      _count: { select: { stars: true, forks: true, comments: true } },
    },
  })
  return pkg
}

export async function generateMetadata({ params }: PageProps) {
  const pkg = await getPackage(params.author, params.slug)
  if (!pkg) return { title: 'Not found' }
  return {
    title: `${pkg.slug} — Sequel`,
    description: pkg.description ?? `AI requirements package by ${pkg.author.name}`,
  }
}

export default async function PackagePage({ params }: PageProps) {
  const [pkg, session] = await Promise.all([
    getPackage(params.author, params.slug),
    auth(),
  ])

  if (!pkg) notFound()

  const currentUserId = session?.user ? (session.user as { id: string }).id : null

  // Check if current user has starred
  let starred = false
  if (currentUserId) {
    const star = await prisma.star.findUnique({
      where: { userId_packageId: { userId: currentUserId, packageId: pkg.id } },
      select: { id: true },
    })
    starred = !!star
  }

  // Increment view count
  await prisma.package.update({ where: { id: pkg.id }, data: { viewCount: { increment: 1 } } })

  return (
    <PackageDetailClient
      pkg={pkg}
      currentUserId={currentUserId}
      initialStarred={starred}
      initialStarCount={pkg._count.stars}
    />
  )
}
