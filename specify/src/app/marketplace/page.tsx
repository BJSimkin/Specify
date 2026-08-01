import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const VENDOR_CATEGORIES = [
  'LLM / Foundation Model',
  'Evaluation & Benchmarking',
  'Monitoring & Observability',
  'Data & Labelling',
  'Vector Database',
  'Inference & Deployment',
  'Security & Red Teaming',
  'Compliance & Governance',
  'Fine-tuning & Training',
  'Orchestration & Agents',
  'Other',
]

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string }
}) {
  const session = await auth()
  const user = session?.user as any

  const vendors = await prisma.vendor.findMany({
    where: {
      ...(searchParams.q ? {
        OR: [
          { name: { contains: searchParams.q, mode: 'insensitive' } },
          { description: { contains: searchParams.q, mode: 'insensitive' } },
        ],
      } : {}),
      ...(searchParams.category ? { categories: { has: searchParams.category } } : {}),
    },
    orderBy: [{ verified: 'desc' }, { name: 'asc' }],
    include: { submittedBy: { select: { name: true, username: true } } },
  })

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1E1B4B' }}>Vendor Marketplace</h1>
            <p className="text-sm text-gray-500 mt-1">
              Tools, platforms, and services used in AI system deployments — linked to requirements packages.
            </p>
          </div>
          {user && (
            <Link
              href="/marketplace/submit"
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{ backgroundColor: '#F59E0B', color: '#1E1B4B' }}
            >
              + List a vendor
            </Link>
          )}
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className="w-48 flex-shrink-0">
            <div className="sticky top-16 space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Category</p>
              <Link
                href="/marketplace"
                className={`block px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!searchParams.category ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                All vendors
              </Link>
              {VENDOR_CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/marketplace?category=${encodeURIComponent(cat)}`}
                  className={`block px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${searchParams.category === cat ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </aside>

          {/* Vendor grid */}
          <div className="flex-1">
            {/* Search */}
            <form className="mb-5">
              <input
                type="text"
                name="q"
                defaultValue={searchParams.q}
                placeholder="Search vendors…"
                className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </form>

            {vendors.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
                <p className="text-gray-400 text-sm mb-3">No vendors found.</p>
                {user && (
                  <Link href="/marketplace/submit" className="text-indigo-600 text-sm font-medium hover:underline">
                    Be the first to list one →
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {vendors.map((vendor) => (
                  <Link
                    key={vendor.id}
                    href={`/marketplace/${vendor.id}`}
                    className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-indigo-200 transition-all"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {vendor.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={vendor.logoUrl} alt={vendor.name} className="w-10 h-10 rounded-lg object-contain bg-gray-50 border border-gray-100" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
                          style={{ backgroundColor: '#EEF2FF', color: '#3730A3' }}>
                          {vendor.name[0].toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">{vendor.name}</h3>
                          {vendor.verified && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#1D4ED8" title="Verified">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#1D4ED8" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        {vendor.website && (
                          <p className="text-xs text-gray-400 truncate">{vendor.website.replace(/^https?:\/\//, '')}</p>
                        )}
                      </div>
                    </div>
                    {vendor.description && (
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{vendor.description}</p>
                    )}
                    {vendor.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {vendor.categories.slice(0, 2).map((cat) => (
                          <span key={cat} className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ backgroundColor: '#EEF2FF', color: '#3730A3' }}>
                            {cat}
                          </span>
                        ))}
                        {vendor.categories.length > 2 && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium text-gray-400">
                            +{vendor.categories.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
    </div>
  )
}
