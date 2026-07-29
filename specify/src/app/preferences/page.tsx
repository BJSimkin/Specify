'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { USE_CASES, INDUSTRIES, CERTIFIERS } from '@/types'

export default function PreferencesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [useCases, setUseCases] = useState<string[]>([])
  const [industries, setIndustries] = useState<string[]>([])
  const [certifiers, setCertifiers] = useState<string[]>([])
  const [notifyOnMatch, setNotifyOnMatch] = useState(true)
  const [notifyOnComment, setNotifyOnComment] = useState(true)
  const [notifyOnFork, setNotifyOnFork] = useState(true)
  const [notifyOnReply, setNotifyOnReply] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    async function loadPrefs() {
      if (!session?.user) return
      const user = session.user as { username?: string }
      if (!user.username) return

      try {
        const res = await fetch(`/api/users/${user.username}`)
        if (res.ok) {
          const data = await res.json()
          if (data.preferences) {
            setUseCases(data.preferences.useCases ?? [])
            setIndustries(data.preferences.industries ?? [])
            setCertifiers(data.preferences.certifiers ?? [])
            setNotifyOnMatch(data.preferences.notifyOnMatch ?? true)
            setNotifyOnComment(data.preferences.notifyOnComment ?? true)
            setNotifyOnFork(data.preferences.notifyOnFork ?? true)
            setNotifyOnReply(data.preferences.notifyOnReply ?? true)
          }
        }
      } finally {
        setLoading(false)
      }
    }
    loadPrefs()
  }, [session])

  async function handleSave() {
    if (!session?.user) return
    const user = session.user as { username?: string }
    if (!user.username) return

    setSaving(true)
    setSaved(false)
    try {
      await fetch(`/api/users/${user.username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          useCases,
          industries,
          certifiers,
          notifyOnMatch,
          notifyOnComment,
          notifyOnFork,
          notifyOnReply,
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  function toggleItem(arr: string[], setArr: (v: string[]) => void, item: string) {
    setArr(arr.includes(item) ? arr.filter((v) => v !== item) : [...arr, item])
  }

  if (status === 'loading' || loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-40 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2" style={{ color: '#1E1B4B' }}>
        Preferences
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Customize which packages you get notified about and what kinds of updates you receive.
      </p>

      {/* Interest matching */}
      <section className="card p-5 mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Interest matching</h2>
        <p className="text-sm text-gray-500 mb-4">
          Get notified when new packages match your interests.
        </p>

        <div className="space-y-5">
          {/* Use cases */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Use cases</label>
            <div className="flex flex-wrap gap-2">
              {USE_CASES.map((uc) => (
                <button
                  key={uc}
                  type="button"
                  onClick={() => toggleItem(useCases, setUseCases, uc)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
                  style={
                    useCases.includes(uc)
                      ? { backgroundColor: '#1E1B4B', color: 'white', borderColor: '#1E1B4B' }
                      : { backgroundColor: 'white', color: '#6B7280', borderColor: '#D1D5DB' }
                  }
                >
                  {uc}
                </button>
              ))}
            </div>
          </div>

          {/* Industries */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industries</label>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  type="button"
                  onClick={() => toggleItem(industries, setIndustries, ind)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
                  style={
                    industries.includes(ind)
                      ? { backgroundColor: '#1E1B4B', color: 'white', borderColor: '#1E1B4B' }
                      : { backgroundColor: 'white', color: '#6B7280', borderColor: '#D1D5DB' }
                  }
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          {/* Certifiers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Certified by</label>
            <div className="flex flex-wrap gap-2">
              {CERTIFIERS.map((cert) => (
                <button
                  key={cert}
                  type="button"
                  onClick={() => toggleItem(certifiers, setCertifiers, cert)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
                  style={
                    certifiers.includes(cert)
                      ? { backgroundColor: '#F59E0B', color: '#78350F', borderColor: '#F59E0B' }
                      : { backgroundColor: 'white', color: '#6B7280', borderColor: '#D1D5DB' }
                  }
                >
                  {cert}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Notification toggles */}
      <section className="card p-5 mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Notification settings</h2>
        <p className="text-sm text-gray-500 mb-4">Choose which activity triggers notifications.</p>

        <div className="space-y-3">
          {[
            {
              label: 'Matching packages published',
              description: 'When a new package matches your interests',
              value: notifyOnMatch,
              onChange: setNotifyOnMatch,
            },
            {
              label: 'Comments on your packages',
              description: 'When someone comments on a package you own',
              value: notifyOnComment,
              onChange: setNotifyOnComment,
            },
            {
              label: 'Forks of your packages',
              description: 'When someone forks one of your packages',
              value: notifyOnFork,
              onChange: setNotifyOnFork,
            },
            {
              label: 'Replies to your comments',
              description: 'When someone comments on a thread you participated in',
              value: notifyOnReply,
              onChange: setNotifyOnReply,
            },
          ].map((setting) => (
            <label
              key={setting.label}
              className="flex items-start justify-between gap-4 cursor-pointer py-2"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{setting.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{setting.description}</p>
              </div>
              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  checked={setting.value}
                  onChange={(e) => setting.onChange(e.target.checked)}
                  className="sr-only"
                />
                <div
                  onClick={() => setting.onChange(!setting.value)}
                  className="w-10 h-6 rounded-full transition-colors cursor-pointer"
                  style={{ backgroundColor: setting.value ? '#1E1B4B' : '#D1D5DB' }}
                >
                  <div
                    className="w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5"
                    style={{
                      transform: setting.value ? 'translateX(18px)' : 'translateX(2px)',
                    }}
                  />
                </div>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          style={{ backgroundColor: '#F59E0B', color: '#1E1B4B' }}
        >
          {saving ? 'Saving...' : 'Save preferences'}
        </button>
        {saved && (
          <span className="text-sm font-medium text-green-600 flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Saved
          </span>
        )}
      </div>
    </div>
  )
}
