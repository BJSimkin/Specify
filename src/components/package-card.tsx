'use client'

import { useRouter } from 'next/navigation'
import type { PackageCard as PackageCardType } from '@/types'
import { formatDate, formatNumber, getInitials } from '@/lib/utils'
import { CERTIFIER_DISPLAY_MAP } from '@/types'
import { CertBadge } from './cert-badge'

interface PackageCardProps {
  pkg: PackageCardType
}

export function PackageCard({ pkg }: PackageCardProps) {
  const router = useRouter()
  const [authorUsername, packageSlug] = pkg.slug.split('/')
  const isCertified = pkg.certifications.length > 0

  const useCaseTags = pkg.tags.filter((t) => t.category === 'USE_CASE').map((t) => t.value)
  const industryTags = pkg.tags.filter((t) => t.category === 'INDUSTRY').map((t) => t.value)

  return (
    <div
      onClick={() => router.push(`/packages/${authorUsername}/${packageSlug}`)}
      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group overflow-hidden"
      style={isCertified ? { borderTopColor: '#F59E0B', borderTopWidth: 3 } : {}}
    >
      {/* Certified bar */}
      {isCertified && (
        <div
          className="flex items-center gap-2 px-4 py-1.5 border-b"
          style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#D97706">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
          <span className="text-xs font-semibold" style={{ color: '#92400E' }}>
            Certified
          </span>
          <div className="flex items-center gap-1.5">
            {pkg.certifications.map((cert) => (
              <CertBadge key={cert.id} certifier={cert.certifier} size="sm" />
            ))}
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3
              className="font-semibold text-base group-hover:underline truncate"
              style={{ color: '#1E1B4B' }}
            >
              {pkg.slug}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {/* Author avatar */}
              <div
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden"
                style={{ backgroundColor: '#4338CA', color: 'white' }}
              >
                {pkg.author.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={pkg.author.image}
                    alt={pkg.author.name ?? ''}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(pkg.author.name)
                )}
              </div>
              <span className="text-xs text-gray-500">
                {pkg.author.name}
                {pkg.author.org && (
                  <span className="text-gray-400"> · {pkg.author.org}</span>
                )}
              </span>
            </div>
          </div>
          <span className="flex-shrink-0 text-xs text-gray-400 mt-0.5">
            Posted {formatDate(pkg.createdAt)}
          </span>
        </div>

        {/* Description */}
        {pkg.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{pkg.description}</p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {useCaseTags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: '#EEF2FF', color: '#3730A3' }}
            >
              {tag}
            </span>
          ))}
          {industryTags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: '#F0FDF4', color: '#166534' }}
            >
              {tag}
            </span>
          ))}
          {useCaseTags.length + industryTags.length > 5 && (
            <span className="text-xs text-gray-400">+{useCaseTags.length + industryTags.length - 5} more</span>
          )}
        </div>

        {/* Footer stats */}
        <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            {formatNumber(pkg._count.stars)}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
              <path d="M6 2a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m9 0a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3M6 7.5c1.11 0 3.08.59 4.5 1.75C11.92 10.41 13.89 11 15 11v2c-1.67 0-4.08-.83-6-2.25V17a3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 .5.04V7.79c-.17-.18-.33-.28-.5-.29z" />
            </svg>
            {formatNumber(pkg._count.forks)}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {formatNumber(pkg._count.comments)}
          </span>
          <span className="ml-auto text-xs text-gray-400 font-mono">v{pkg.currentVersion}</span>
        </div>
      </div>
    </div>
  )
}
