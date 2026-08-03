'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
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

interface MyPackage {
  id: string
  name: string
  description: string | null
  isPublished: boolean
  createdAt: string
  updatedAt: string
  slug: string
}

export default function HomeClient({ initialFilters, initialSort, initialQ, children }: HomeClientProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [sort, setSort] = useState(initialSort)
  const [view, setView] = useState<'all' | 'mine'>('all')
  const { data: session } = useSession()
  const [myPackages, setMyPackages] = useState<MyPackage[]>([])
  const [myLoading, setMyLoading] = useState(false)

  useEffect(() => {
    if (view !== 'mine' || !session?.user) return
    setMyLoading(true)
    fetch('/api/packages/mine')
      .then(r => r.ok ? r.json() : [])
      .then((data: MyPackage[]) => setMyPackages(data))
      .finally(() => setMyLoading(false))
  }, [view, session])

  function buildUrl(newFilters: FilterState, newSort: string) {
    const params = new URLSearchParams()
    if (initialQ) params.set('q', initialQ)
    if (newFilters.industries.length > 0) params.set('ind', newFilters.industries.join(','))
    if (newFilters.businessFunctions.length > 0) params.set('bf', newFilters.businessFunctions.join(','))
    if (newFilters.workflows.length > 0) params.set('wf', newFilters.workflows.join(','))
    if (newFilters.modelTasks.length > 0) params.set('mt', newFilters.modelTasks.join(','))
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
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-1 border-b border-gray-200 -mb-5 pb-0">
              <h1 className="text-xl font-bold mr-4" style={{ color: '#1E1B4B' }}>Requirements packages</h1>
              {(['all', 'mine'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors"
                  style={view === v ? { color: '#1E1B4B', borderColor: '#1E1B4B' } : { color: '#6B7280', borderColor: 'transparent' }}
                >
                  {v === 'all' ? 'All packages' : 'My packages'}
                </button>
              ))}
            </div>
            <Link
              href="/new"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{ backgroundColor: '#F59E0B', color: '#1E1B4B' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              New package
            </Link>
          </div>

          {view === 'mine' ? (
            <div className="mt-10">
              {!session?.user ? (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-sm">Sign in to see your packages.</p>
                </div>
              ) : myLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />)}
                </div>
              ) : myPackages.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                  <p className="text-sm font-semibold text-gray-600 mb-1">No packages yet</p>
                  <p className="text-xs mb-4">Create your first requirements package to get started.</p>
                  <Link href="/new" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: '#1E1B4B', color: 'white' }}>
                    New package
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {myPackages.map(pkg => (
                    <Link key={pkg.id} href={`/packages/${pkg.slug}`}
                      className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900 group-hover:text-indigo-800 truncate">{pkg.name}</span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                            style={pkg.isPublished
                              ? { backgroundColor: '#D1FAE5', color: '#065F46' }
                              : { backgroundColor: '#FEF3C7', color: '#92400E' }}
                          >
                            {pkg.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        {pkg.description && <p className="text-xs text-gray-500 mt-0.5 truncate">{pkg.description}</p>}
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-4">
                        {new Date(pkg.updatedAt).toLocaleDateString()}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Sort bar */}
              <div className="flex items-center gap-1 mt-10 mb-5">
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}
