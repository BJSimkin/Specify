'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filters } from '@/components/filters'
import type { FilterState } from '@/types'

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recent' },
  { value: 'stars', label: 'Stars' },
  { value: 'forks', label: 'Forks' },
  { value: 'downloads', label: 'Downloads' },
] as const

interface HomeClientProps {
  initialFilters: FilterState
  initialSort: string
  initialQ: string
  children: React.ReactNode
}

export default function HomeClient({ initialFilters, initialSort, initialQ, children }: HomeClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [sort, setSort] = useState(initialSort)

  function buildUrl(newFilters: FilterState, newSort: string) {
    const params = new URLSearchParams()
    if (initialQ) params.set('q', initialQ)
    if (newFilters.useCases.length > 0) params.set('uc', newFilters.useCases.join(','))
    if (newFilters.industries.length > 0) params.set('ind', newFilters.industries.join(','))
    if (newFilters.certifiers.length > 0) params.set('cert', newFilters.certifiers.join(','))
    if (newSort !== 'recent') params.set('sort', newSort)
    const qs = params.toString()
    return qs ? `/?${qs}` : '/'
  }

  function handleFilterChange(newFilters: FilterState) {
    setFilters(newFilters)
    startTransition(() => {
      router.push(buildUrl(newFilters, sort))
    })
  }

  function handleSortChange(newSort: string) {
    setSort(newSort)
    startTransition(() => {
      router.push(buildUrl(filters, newSort))
    })
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <div className="flex gap-8">
        {/* Sidebar */}
        <Filters filters={filters} onChange={handleFilterChange} />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div className="flex items-center gap-1 mb-5">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSortChange(opt.value)}
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                style={
                  sort === opt.value
                    ? { backgroundColor: '#1E1B4B', color: 'white' }
                    : { backgroundColor: 'transparent', color: '#6B7280' }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
