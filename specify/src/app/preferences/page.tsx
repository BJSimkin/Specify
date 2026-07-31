'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { USE_CASES, INDUSTRIES, CERTIFIERS } from '@/types'

export default function PreferencesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Profile fields
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [org, setOrg] = useState('')
  const [country, setCountry] = useState('')
  const [occupation, setOccupation] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [publications, setPublications] = useState<string[]>([])
  const [newPub, setNewPub] = useState('')

  // Preferences
  const [useCases, setUseCases] = useState<string[]>([])
  const [industries, setIndustries] = useState<string[]>([])
  const [certifiers, setCertifiers] = useState<string[]>([])
  const [notifyOnMatch, setNotifyOnMatch] = useState(true)
  const [notifyOnComment, setNotifyOnComment] = useState(true)
  const [notifyOnFork, setNotifyOnFork] = useState(true)
  const [notifyOnReply, setNotifyOnReply] = useState(true)
  const [notifyOnStar, setNotifyOnStar] = useState(true)
  const [notifyOnFollow, setNotifyOnFollow] = useState(true)

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<'profile' | 'interests' | 'notifications'>('profile')

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
          setName(data.name ?? '')
          setBio(data.bio ?? '')
          setOrg(data.org ?? '')
          setCountry(data.country ?? '')
          setOccupation(data.occupation ?? '')
          setSpecialty(data.specialty ?? '')
          setLinkedinUrl(data.linkedinUrl ?? '')
          setPublications(data.publications ?? [])
          if (data.preferences) {
            setUseCases(data.preferences.useCases ?? [])
            setIndustries(data.preferences.industries ?? [])
            setCertifiers(data.preferences.certifiers ?? [])
            setNotifyOnMatch(data.preferences.notifyOnMatch ?? true)
            setNotifyOnComment(data.preferences.notifyOnComment ?? true)
            setNotifyOnFork(data.preferences.notifyOnFork ?? true)
            setNotifyOnReply(data.preferences.notifyOnReply ?? true)
            setNotifyOnStar(data.preferences.notifyOnStar ?? true)
            setNotifyOnFollow(data.preferences.notifyOnFollow ?? true)
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
      await Promise.all([
        fetch(`/api/users/${user.username}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'profile',
            name, bio, org, country, occupation, specialty, linkedinUrl, publications,
          }),
        }),
        fetch(`/api/users/${user.username}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            useCases, industries, certifiers,
            notifyOnMatch, notifyOnComment, notifyOnFork, notifyOnReply,
            notifyOnStar, notifyOnFollow,
          }),
        }),
      ])
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  function toggleItem(arr: string[], setArr: (v: string[]) => void, item: string) {
    setArr(arr.includes(item) ? arr.filter((v) => v !== item) : [...arr, item])
  }

  function addPublication() {
    if (newPub.trim() && !publications.includes(newPub.trim())) {
      setPublications([...publications, newPub.trim()])
      setNewPub('')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  const SECTIONS = [
    { id: 'profile', label: 'Profile' },
    { id: 'interests', label: 'Interests' },
    { id: 'notifications', label: 'Notifications' },
  ] as const

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2" style={{ color: '#1E1B4B' }}>
        Settings
      </h1>

      {/* Section tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-6">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className="px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px"
            style={
              activeSection === s.id
                ? { color: '#1E1B4B', borderColor: '#1E1B4B' }
                : { color: '#6B7280', borderColor: 'transparent' }
            }
          >
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === 'profile' && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="input resize-none"
              placeholder="Brief description about yourself"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organisation</label>
              <input
                type="text"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                className="input"
                placeholder="Company or institution"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="input"
                placeholder="e.g. United Kingdom"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="input"
                placeholder="e.g. AI Safety Researcher"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Speciality</label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="input"
                placeholder="e.g. LLM evaluation"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="input"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Publications</label>
            <p className="text-xs text-gray-400 mb-2">Add links or titles of papers, articles, or other work.</p>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newPub}
                onChange={(e) => setNewPub(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addPublication() } }}
                className="input flex-1"
                placeholder="URL or title and press Enter"
              />
              <button
                type="button"
                onClick={addPublication}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50"
              >
                Add
              </button>
            </div>
            <div className="space-y-1">
              {publications.map((pub, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <span className="flex-1 text-sm text-gray-700 truncate">{pub}</span>
                  <button
                    type="button"
                    onClick={() => setPublications(publications.filter((_, j) => j !== i))}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSection === 'interests' && (
        <div className="space-y-6">
          <p className="text-sm text-gray-500">Get notified when new packages match your interests.</p>
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
      )}

      {activeSection === 'notifications' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 mb-4">Choose which activity triggers notifications.</p>
          {[
            { label: 'Matching packages published', description: 'When a new package matches your interests', value: notifyOnMatch, onChange: setNotifyOnMatch },
            { label: 'Comments on your packages', description: 'When someone comments on a package you own', value: notifyOnComment, onChange: setNotifyOnComment },
            { label: 'Forks of your packages', description: 'When someone forks one of your packages', value: notifyOnFork, onChange: setNotifyOnFork },
            { label: 'Replies to your comments', description: 'When someone replies to a comment you made', value: notifyOnReply, onChange: setNotifyOnReply },
            { label: 'Stars on your packages', description: 'When someone stars one of your packages', value: notifyOnStar, onChange: setNotifyOnStar },
            { label: 'New followers', description: 'When someone follows you', value: notifyOnFollow, onChange: setNotifyOnFollow },
          ].map((setting) => (
            <label key={setting.label} className="flex items-start justify-between gap-4 cursor-pointer py-2">
              <div>
                <p className="text-sm font-medium text-gray-800">{setting.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{setting.description}</p>
              </div>
              <div className="relative flex-shrink-0">
                <div
                  onClick={() => setting.onChange(!setting.value)}
                  className="w-10 h-6 rounded-full transition-colors cursor-pointer"
                  style={{ backgroundColor: setting.value ? '#1E1B4B' : '#D1D5DB' }}
                >
                  <div
                    className="w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5"
                    style={{ transform: setting.value ? 'translateX(18px)' : 'translateX(2px)' }}
                  />
                </div>
              </div>
            </label>
          ))}
        </div>
      )}

      {/* Save */}
      <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          style={{ backgroundColor: '#F59E0B', color: '#1E1B4B' }}
        >
          {saving ? 'Saving...' : 'Save changes'}
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
