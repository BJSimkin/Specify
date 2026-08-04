'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LogoWithWordmark } from './logo'
import { getInitials } from '@/lib/utils'

interface NavUser {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
  username?: string
}

interface NavProps {
  user?: NavUser | null
  unreadCount?: number
}

export function Nav({ user, unreadCount = 0 }: NavProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <nav
      style={{ backgroundColor: '#1E1B4B', height: 50, position: 'sticky', top: 0, zIndex: 100 }}
      className="flex items-center px-4 gap-4 border-b border-indigo-900 shadow-md"
    >
      {/* Logo */}
      <Link href="/" className="flex-shrink-0">
        <LogoWithWordmark size={28} />
      </Link>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-lg">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300"
            width="14"
            height="14"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search packages..."
            className="w-full pl-9 pr-3 py-1.5 rounded-md text-sm focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              borderColor: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          />
        </div>
      </form>

      {/* Nav links */}
      <div className="flex items-center gap-1">
        <Link
          href="/homepage"
          className="px-3 py-1.5 rounded-md text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-800 transition-colors"
        >
          Home
        </Link>
        <Link
          href="/"
          className="px-3 py-1.5 rounded-md text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-800 transition-colors"
        >
          Requirements
        </Link>
        <Link
          href="/marketplace"
          className="px-3 py-1.5 rounded-md text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-800 transition-colors"
        >
          Marketplace
        </Link>
        <Link
          href="/risk-repository"
          className="px-3 py-1.5 rounded-md text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-800 transition-colors"
        >
          Risk & Hazards
        </Link>
        <Link
          href="/dataset-audit"
          className="px-3 py-1.5 rounded-md text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-800 transition-colors"
        >
          Dataset Audit
        </Link>
        <Link
          href="/self-audit"
          className="px-3 py-1.5 rounded-md text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-800 transition-colors"
        >
          Model Audit
        </Link>
        <Link
          href="/education"
          className="px-3 py-1.5 rounded-md text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-800 transition-colors"
        >
          Education
        </Link>
        <Link
          href="/regulatory"
          className="px-3 py-1.5 rounded-md text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-800 transition-colors"
        >
          Regulatory
        </Link>
        <Link
          href="/contact"
          className="px-3 py-1.5 rounded-md text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-800 transition-colors"
        >
          Contact
        </Link>
      </div>

      {user ? (
        <div className="flex items-center gap-2">
          {/* Bell */}
          <Link
            href="/notifications"
            className="relative p-1.5 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-800 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>
            {unreadCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full text-xs font-bold"
                style={{ backgroundColor: '#F59E0B', color: '#1E1B4B' }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          {/* Avatar dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden ring-2 ring-indigo-400 hover:ring-amber-400 transition-all"
            >
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt={user.name ?? ''} className="w-full h-full object-cover" />
              ) : (
                <span
                  className="w-full h-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: '#4338CA', color: 'white' }}
                >
                  {getInitials(user.name)}
                </span>
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                {user.username && (
                  <Link
                    href={`/${user.username}`}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Your profile
                  </Link>
                )}
                <Link
                  href="/preferences"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setDropdownOpen(false)}
                >
                  Preferences
                </Link>
                <hr className="my-1" />
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            href="/api/auth/signin"
            className="px-3 py-1.5 rounded-md text-sm font-medium border border-indigo-400 text-indigo-200 hover:text-white hover:bg-indigo-800 transition-colors"
          >
            Sign in
          </Link>
        </div>
      )}
    </nav>
  )
}
