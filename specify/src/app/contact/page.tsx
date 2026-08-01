'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Opens the user's email client with pre-filled fields
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
    </div>
  )
}
