'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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

export default function SubmitVendorPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    website: '',
    description: '',
    logoUrl: '',
    categories: [] as string[],
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function toggleCategory(cat: string) {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter((c) => c !== cat)
        : [...f.categories, cat],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error ?? 'Something went wrong')
        return
      }
      const vendor = await res.json()
      router.push(`/marketplace/${vendor.id}`)
    } catch {
      setError('Network error — please try again')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <a href="/marketplace" className="text-sm text-gray-500 hover:text-indigo-600">← Marketplace</a>
          <h1 className="text-xl font-bold" style={{ color: '#1E1B4B' }}>List a vendor</h1>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor / product name *</label>
            <input
              type="text" value={form.name} required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Weights & Biases"
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
            <input
              type="url" value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://wandb.ai"
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
            <input
              type="url" value={form.logoUrl}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              placeholder="https://example.com/logo.png"
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description} rows={4} maxLength={1000}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What does this vendor do? What problems does it solve in AI development?"
              className="input w-full resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{form.description.length}/1000</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categories *</label>
            <div className="flex flex-wrap gap-2">
              {VENDOR_CATEGORIES.map((cat) => (
                <button
                  key={cat} type="button"
                  onClick={() => toggleCategory(cat)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
                  style={
                    form.categories.includes(cat)
                      ? { backgroundColor: '#1E1B4B', color: 'white', borderColor: '#1E1B4B' }
                      : { backgroundColor: 'white', color: '#6B7280', borderColor: '#D1D5DB' }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit" disabled={saving || !form.name.trim()}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
              style={{ backgroundColor: '#F59E0B', color: '#1E1B4B' }}
            >
              {saving ? 'Submitting…' : 'Submit listing'}
            </button>
            <button type="button" onClick={() => router.back()}
              className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700">
              Cancel
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-400 mt-4">
          Listings are publicly visible. Verified badges are awarded by the Specify team.
        </p>
    </div>
  )
}
