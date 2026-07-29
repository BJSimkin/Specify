import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { PackageCard } from '@/components/package-card'
import type { SearchParams, FilterState } from '@/types'
import { TagCategory } from '@prisma/client'
import HomeClient from './home-client'

const CERTIFIER_MAP: Record<string, string> = {
  'TÜV SÜD': 'TUV_SUD',
  BSI: 'BSI',
  'EU AI Office': 'EU_AI_OFFICE',
}

async function getPackages(searchParams: SearchParams) {
  const q = searchParams.q ?? ''
  const uc = searchParams.uc?.split(',').filter(Boolean) ?? []
  const ind = searchParams.ind?.split(',').filter(Boolean) ?? []
  const cert = searchParams.cert?.split(',').filter(Boolean) ?? []
  const sort = (searchParams.sort ?? 'recent') as 'stars' | 'forks' | 'recent' | 'downloads'
  const page = parseInt(searchParams.page ?? '1', 10)
  const pageSize = 24

  const where: Record<string, unknown> = { isPublished: true }

  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ]
  }

  const tagFilters: unknown[] = []
  if (uc.length > 0) tagFilters.push({ tags: { some: { category: TagCategory.USE_CASE, value: { in: uc } } } })
  if (ind.length > 0) tagFilters.push({ tags: { some: { category: TagCategory.INDUSTRY, value: { in: ind } } } })
  if (cert.length > 0) {
    const dbCerts = cert.map((c) => CERTIFIER_MAP[c]).filter(Boolean)
    if (dbCerts.length > 0) tagFilters.push({ certifications: { some: { certifier: { in: dbCerts } } } })
  }
  if (tagFilters.length > 0) where.AND = tagFilters

  const orderBy: Record<string, unknown>[] = []
  if (sort === 'stars') orderBy.push({ stars: { _count: 'desc' } })
  else if (sort === 'forks') orderBy.push({ forks: { _count: 'desc' } })
  else if (sort === 'downloads') orderBy.push({ viewCount: 'desc' })
  else orderBy.push({ createdAt: 'desc' })

  const [packages, total] = await Promise.all([
    prisma.package.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        author: true,
        certifications: true,
        tags: true,
        _count: { select: { stars: true, forks: true, comments: true, versions: true } },
      },
    }),
    prisma.package.count({ where }),
  ])

  return { packages, total, page, pageSize }
}

interface PageProps {
  searchParams: SearchParams
}

export default async function HomePage({ searchParams }: PageProps) {
  const { packages, total } = await getPackages(searchParams)

  const sort = (searchParams.sort ?? 'recent') as 'stars' | 'forks' | 'recent' | 'downloads'
  const q = searchParams.q ?? ''
  const currentFilters: FilterState = {
    useCases: searchParams.uc?.split(',').filter(Boolean) ?? [],
    industries: searchParams.ind?.split(',').filter(Boolean) ?? [],
    certifiers: searchParams.cert?.split(',').filter(Boolean) ?? [],
    verifiedOnly: false,
  }

  const hasFilters =
    q || currentFilters.useCases.length > 0 || currentFilters.industries.length > 0 || currentFilters.certifiers.length > 0

  return (
    <HomeClient initialFilters={currentFilters} initialSort={sort} initialQ={q}>
      <div className="flex items-center justify-between mb-4">
        <div>
          {hasFilters ? (
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{total.toLocaleString()}</span> package
              {total !== 1 ? 's' : ''} found
              {q && (
                <>
                  {' '}for <span className="font-medium text-indigo-700">&ldquo;{q}&rdquo;</span>
                </>
              )}
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{total.toLocaleString()}</span> packages published
            </p>
          )}
        </div>
      </div>

      {packages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: '#EEF2FF' }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#4338CA">
              <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No packages found</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            {q
              ? `No packages match "${q}". Try different keywords or clear your filters.`
              : 'No packages match these filters. Try adjusting your selections.'}
          </p>
        </div>
      ) : (
        <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-52 bg-gray-200 rounded-lg animate-pulse" />)}</div>}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </Suspense>
      )}
    </HomeClient>
  )
}
