import Link from 'next/link'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Nav } from '@/components/nav'

export default async function VendorDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  const user = session?.user as any

  const vendor = await prisma.vendor.findUnique({
    where: { id: params.id },
    include: { submittedBy: { select: { name: true, username: true, image: true } } },
  })

  if (!vendor) notFound()

  // Find packages that list this vendor by name
  const linkedPackages = await prisma.package.findMany({
    where: {
      isPublished: true,
      vendorList: { path: '$[*].name', string_contains: vendor.name },
    },
    include: {
      author: true,
      _count: { select: { stars: true } },
    },
    take: 12,
  }).catch(() => []) // JSON path query may vary by DB; graceful fallback

  return (
    <>
      <Nav user={user} />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/marketplace" className="text-sm text-gray-500 hover:text-indigo-600 mb-6 inline-block">
          ← Marketplace
        </Link>

        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4">
            {vendor.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={vendor.logoUrl} alt={vendor.name}
                className="w-16 h-16 rounded-xl object-contain bg-gray-50 border border-gray-100 flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
                style={{ backgroundColor: '#EEF2FF', color: '#3730A3' }}>
                {vendor.name[0].toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold" style={{ color: '#1E1B4B' }}>{vendor.name}</h1>
                {vendor.verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8' }}>
                    ✓ Verified
                  </span>
                )}
              </div>
              {vendor.website && (
                <a href={vendor.website} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:underline mt-0.5 inline-block">
                  {vendor.website.replace(/^https?:\/\//, '')} ↗
                </a>
              )}
              {vendor.categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {vendor.categories.map((cat) => (
                    <span key={cat} className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: '#EEF2FF', color: '#3730A3' }}>
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          {vendor.description && (
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">{vendor.description}</p>
          )}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
            Submitted
            {vendor.submittedBy?.username && (
              <> by <Link href={`/${vendor.submittedBy.username}`} className="text-indigo-600 hover:underline">
                {vendor.submittedBy.name ?? vendor.submittedBy.username}
              </Link></>
            )}
            {' · '}{new Date(vendor.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Linked packages */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Requirements packages using {vendor.name}
          </h2>
          {linkedPackages.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-sm text-gray-400">
              No packages have listed this vendor yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {linkedPackages.map((pkg) => (
                <Link key={pkg.id} href={`/packages/${pkg.slug}`}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm hover:border-indigo-200 transition-all">
                  <p className="text-sm font-semibold text-gray-900">{pkg.name}</p>
                  {pkg.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{pkg.description}</p>}
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <span>by {pkg.author.name ?? pkg.author.username}</span>
                    <span>· ⭐ {pkg._count.stars}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
