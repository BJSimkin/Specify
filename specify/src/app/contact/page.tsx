'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { AUDIT_CATEGORIES } from '@/lib/scenarios-data'

// ─── Newsletter Section ────────────────────────────────────────────────────────
const NEWSLETTER_TOPICS = ['Risk', 'Regulatory', 'Research', 'Tooling'] as const
type NewsletterTopic = typeof NEWSLETTER_TOPICS[number]

function NewsletterSection() {
  const { data: session } = useSession()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [org, setOrg] = useState('')
  const [topics, setTopics] = useState<NewsletterTopic[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'already' | 'error'>('idle')

  function toggleTopic(t: NewsletterTopic) {
    setTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  // Auto-populate from session
  useEffect(() => {
    if (session?.user) {
      if (session.user.email) setEmail(session.user.email)
      if (session.user.name) setName(session.user.name)
    }
  }, [session])

  // Check if already subscribed
  useEffect(() => {
    if (!email || !email.includes('@')) return
    const check = async () => {
      try {
        const res = await fetch(`/api/newsletter?email=${encodeURIComponent(email)}`)
        const data = await res.json()
        if (data.subscribed) setStatus('already')
        else if (status === 'already') setStatus('idle')
      } catch { /* ignore */ }
    }
    const timeout = setTimeout(check, 600)
    return () => clearTimeout(timeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, org, topics }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="mt-12 pt-10 border-t border-gray-100">
      <div className="max-w-xl">
        <div className="flex items-center gap-2 mb-1">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#4338CA"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          <h2 className="text-lg font-bold" style={{ color: '#1E1B4B' }}>Stay up to date</h2>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Get notified about new requirements packages, risk repository updates, and Specify releases.
        </p>

        {status === 'success' ? (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: '#F0FDF4' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#16A34A"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            <p className="text-sm font-semibold text-green-700">You&apos;re subscribed! We&apos;ll keep you posted.</p>
          </div>
        ) : status === 'already' ? (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: '#EEF2FF' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#4338CA"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            <p className="text-sm font-semibold text-indigo-700">You&apos;re already subscribed with this email.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Name</label>
                <input
                  type="text" value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Email *</label>
                <input
                  type="email" required value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status !== 'idle') setStatus('idle') }}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Organisation</label>
              <input
                type="text" value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder="Company or institution (optional)"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Topics of interest <span className="text-gray-400 normal-case font-normal">(select one or more)</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {NEWSLETTER_TOPICS.map(t => (
                  <button key={t} type="button" onClick={() => toggleTopic(t)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                    style={topics.includes(t)
                      ? { backgroundColor: '#EEF2FF', color: '#3730A3', borderColor: '#818CF8' }
                      : { backgroundColor: 'white', color: '#6B7280', borderColor: '#E5E7EB' }
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {status === 'error' && (
              <p className="text-xs text-red-600">Something went wrong. Please try again.</p>
            )}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-60"
              style={{ backgroundColor: '#4338CA', color: 'white' }}
            >
              {status === 'loading' ? 'Subscribing…' : 'Subscribe to newsletter'}
            </button>
            <p className="text-xs text-gray-400">No spam. Unsubscribe any time.</p>
          </form>
        )}
      </div>
    </div>
  )
}


// ─── Contribute Samples Section ───────────────────────────────────────────────
function ContributeSamplesSection() {
  const { data: session } = useSession()
  const [mode, setMode] = useState<'url' | 'prompt'>('prompt')
  const [url, setUrl] = useState('')
  const [prompt, setPrompt] = useState('')
  const [attribution, setAttribution] = useState('')
  const [category, setCategory] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => { setSubmitted(false); setPrompt(''); setUrl(''); setAttribution('') }, 3000)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold mb-1" style={{ color: '#1E1B4B' }}>📤 Contribute test samples</h2>
        <p className="text-sm text-gray-500">
          Help expand the risk repository by submitting new test prompts. Submissions are reviewed before being added to the dataset.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="border border-amber-200 rounded-xl p-4" style={{ backgroundColor: '#FFFBEB' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-amber-700">New submission</span>
          <div className="flex gap-1 p-0.5 bg-amber-100 rounded-lg">
            {(['prompt', 'url'] as const).map(m => (
              <button key={m} type="button" onClick={() => setMode(m)}
                className="px-3 py-1 rounded-md text-xs font-semibold transition-all"
                style={mode === m ? { backgroundColor: 'white', color: '#92400E', boxShadow: '0 1px 2px rgba(0,0,0,.08)' } : { color: '#B45309' }}>
                {m === 'prompt' ? 'Single prompt' : 'Dataset URL'}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_200px_200px]">
          {mode === 'prompt'
            ? <textarea value={prompt} onChange={e => setPrompt(e.target.value)} required rows={3} placeholder="Enter a test prompt…"
                className="border border-amber-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-amber-400 bg-white" />
            : <input type="url" value={url} onChange={e => setUrl(e.target.value)} required placeholder="https://… (CSV or JSON)"
                className="border border-amber-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white" />}
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="border border-amber-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-amber-400">
            <option value="">Category (optional)</option>
            {AUDIT_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.shortName}</option>)}
          </select>
          <input value={attribution} onChange={e => setAttribution(e.target.value)}
            placeholder={session?.user?.name ?? 'Your name / org'}
            className="border border-amber-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white" />
        </div>
        <div className="flex items-center justify-end mt-3">
          <button type="submit"
            className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={submitted ? { backgroundColor: '#D1FAE5', color: '#065F46' } : { backgroundColor: '#92400E', color: 'white' }}>
            {submitted ? '✓ Submitted!' : 'Submit'}
          </button>
        </div>
      </form>
      <div className="border border-gray-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Contribution guidelines</p>
        <ul className="space-y-1 text-xs text-gray-600">
          <li>• Prompts must probe a specific risk vector and clearly relate to a risk category</li>
          <li>• Redact any operational payloads — describe the attack surface, not the content</li>
          <li>• Include source attribution where the prompt derives from published research</li>
          <li>• Synthetic prompts are welcome; label the source as &ldquo;synthetic&rdquo;</li>
        </ul>
      </div>
    </div>
  )
}

// ─── Submit Risk Section ──────────────────────────────────────────────────────
function SubmitRiskSection() {
  const { data: session } = useSession()
  const [form, setForm] = useState({ title: '', category: '', description: '', impact: '', attribution: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (session?.user?.name) setForm(f => ({ ...f, attribution: f.attribution || session.user?.name || '' }))
  }, [session])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => { setSubmitted(false); setForm({ title: '', category: '', description: '', impact: '', attribution: '' }) }, 3000)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold mb-1" style={{ color: '#1E1B4B' }}>⚠️ Submit a risk</h2>
        <p className="text-sm text-gray-500">
          Spotted a risk scenario not yet in the repository? Submit it for review and inclusion.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="border border-red-200 rounded-xl p-4 space-y-3" style={{ backgroundColor: '#FFF5F5' }}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Risk title *</label>
            <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Brief title for this risk"
              className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-red-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-red-400">
              <option value="">Select category…</option>
              {AUDIT_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.shortName}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Description *</label>
          <textarea required rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Describe the risk scenario in detail…"
            className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm resize-none bg-white focus:outline-none focus:border-red-400" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Potential impact</label>
          <input value={form.impact} onChange={e => setForm(f => ({ ...f, impact: e.target.value }))}
            placeholder="What harm could this enable?"
            className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-red-400" />
        </div>
        <div className="flex items-center gap-3">
          <input value={form.attribution} onChange={e => setForm(f => ({ ...f, attribution: e.target.value }))}
            placeholder="Your name / org (optional)"
            className="flex-1 border border-red-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-red-400" />
          <button type="submit"
            className="px-4 py-2 rounded-lg text-sm font-semibold flex-shrink-0"
            style={submitted ? { backgroundColor: '#D1FAE5', color: '#065F46' } : { backgroundColor: '#DC2626', color: 'white' }}>
            {submitted ? '✓ Submitted!' : 'Submit risk'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Contact Page ──────────────────────────────────────────────────────────────
export default function ContactPage() {
  const { data: session } = useSession()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  // Auto-populate name/email from session
  useEffect(() => {
    if (session?.user) {
      setForm((f) => ({
        ...f,
        name: f.name || session.user?.name || '',
        email: f.email || session.user?.email || '',
      }))
    }
  }, [session])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const mailto = `mailto:contact@specify.ai?subject=${encodeURIComponent(form.subject || 'Specify enquiry')}&body=${encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    )}`
    window.location.href = mailto
    setSent(true)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3" style={{ color: '#1E1B4B' }}>Contact us</h1>
        <p className="text-gray-500 text-base max-w-xl">
          Have a question, feedback, or want to contribute to Specify? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Contact info */}
        <div className="space-y-6">
          {[
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              ),
              label: 'Email',
              value: 'contact@specify.ai',
              href: 'mailto:contact@specify.ai',
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              ),
              label: 'Based in',
              value: 'United Kingdom',
              href: null,
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              ),
              label: 'GitHub',
              value: 'github.com/specify-ai',
              href: 'https://github.com/specify-ai',
            },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EEF2FF', color: '#4338CA' }}>
                {item.icon}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="text-sm text-indigo-600 hover:underline mt-0.5 block">{item.value}</a>
                ) : (
                  <p className="text-sm text-gray-700 mt-0.5">{item.value}</p>
                )}
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Reasons to reach out</p>
            <ul className="space-y-1.5 text-sm text-gray-600">
              {[
                'Report an issue or bug',
                'Suggest a new feature',
                'Contribute to the risk repository',
                'Request a vendor listing',
                'Partnerships & integrations',
                'General feedback',
              ].map((r) => (
                <li key={r} className="flex items-start gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#4338CA" className="mt-0.5 flex-shrink-0"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#F0FDF4' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#16A34A"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Email client opened</h2>
              <p className="text-sm text-gray-500 max-w-sm">Your message has been pre-filled in your email client. Send it from there and we&apos;ll get back to you shortly.</p>
              <button onClick={() => setSent(false)} className="mt-6 text-sm text-indigo-600 hover:underline">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Name *</label>
                  <input
                    type="text" required value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Email *</label>
                  <input
                    type="email" required value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Subject</label>
                <input
                  type="text" value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  placeholder="What is this about?"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Message *</label>
                <textarea
                  required value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us what's on your mind…"
                  rows={6}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-indigo-400"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                style={{ backgroundColor: '#1E1B4B', color: 'white' }}
              >
                Send message
              </button>
              <p className="text-xs text-gray-400 mt-2">This will open your email client with the message pre-filled.</p>
            </form>
          )}
        </div>
      </div>

      {/* Contribute samples + Submit risk */}
      <div className="mt-12 pt-10 border-t border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ContributeSamplesSection />
        <SubmitRiskSection />
      </div>

      {/* Newsletter signup */}
      <NewsletterSection />
    </div>
  )
}
