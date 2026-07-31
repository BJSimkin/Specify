'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RequirementEditor } from '@/components/requirement-editor'
import { DepGraph } from '@/components/dep-graph'
import type { PackageFormData, RequirementFormData } from '@/types'
import { USE_CASES, INDUSTRIES, MODEL_TYPES, DEPLOYMENT_ENVS, RISK_TIERS, LICENSES } from '@/types'

const defaultFormData: PackageFormData = {
  name: '',
  description: '',
  version: '0.1.0',
  license: 'MIT',
  useCases: [],
  industries: [],
  modelTypes: [],
  deploymentEnvs: [],
  riskTier: '',
  customTags: [],
  requirements: [],
  aiModelUrls: [],
  datasetUrls: [],
  isOpenSource: true,
  publishedAt: '',
}

interface PackageFormClientProps {
  initialData?: PackageFormData
  packageId?: string
  editSlug?: string
  mode?: 'new' | 'edit'
}

function MultiSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: readonly string[]
  value: string[]
  onChange: (v: string[]) => void
}) {
  function toggle(opt: string) {
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt])
  }
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className="px-2.5 py-1 rounded-full text-xs font-medium border transition-colors"
            style={
              value.includes(opt)
                ? { backgroundColor: '#1E1B4B', color: 'white', borderColor: '#1E1B4B' }
                : { backgroundColor: 'white', color: '#6B7280', borderColor: '#D1D5DB' }
            }
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function PackageFormClient({
  initialData,
  packageId,
  editSlug,
  mode = 'new',
}: PackageFormClientProps) {
  const router = useRouter()
  const [form, setForm] = useState<PackageFormData>(initialData ?? defaultFormData)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<'metadata' | 'requirements'>('metadata')

  function updateField<K extends keyof PackageFormData>(key: K, value: PackageFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(isPublished: boolean) {
    setSaving(true)
    setError(null)

    try {
      const payload = { ...form, isPublished }

      let res: Response
      if (mode === 'edit' && packageId) {
        res = await fetch(`/api/packages/${packageId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch('/api/packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Something went wrong')
        return
      }

      const pkg = await res.json()
      const [author, slug] = pkg.slug.split('/')
      router.push(`/packages/${author}/${slug}`)
    } catch (e) {
      setError('Network error — please try again')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#1E1B4B' }}>
          {mode === 'edit' ? `Edit ${editSlug}` : 'New package'}
        </h1>
        {mode === 'edit' && editSlug && (
          <a
            href={`/packages/${editSlug}`}
            className="text-sm text-gray-500 hover:text-indigo-600"
          >
            ← Back to package
          </a>
        )}
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg border text-sm font-medium" style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA', color: '#991B1B' }}>
          {error}
        </div>
      )}

      {/* Section tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-6">
        {[
          { id: 'metadata', label: 'Metadata & Tags' },
          { id: 'requirements', label: `Requirements (${form.requirements.length})` },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id as 'metadata' | 'requirements')}
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

      {activeSection === 'metadata' && (
        <div className="max-w-2xl space-y-5">
          <div>
            <label className="label" htmlFor="name">Package name *</label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g. rag-customer-support"
              className="input"
              required
            />
            <p className="mt-1 text-xs text-gray-400">
              Lowercase, hyphens allowed. Will be published as{' '}
              <span className="font-mono">username/{form.name || 'package-name'}</span>
            </p>
          </div>

          <div>
            <label className="label" htmlFor="description">Description</label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Brief description of your AI system requirements package"
              rows={3}
              className="input resize-none"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="label" htmlFor="version">Version</label>
              <input
                id="version"
                type="text"
                value={form.version}
                onChange={(e) => updateField('version', e.target.value)}
                placeholder="0.1.0"
                className="input"
              />
            </div>
            <div className="flex-1">
              <label className="label" htmlFor="license">License</label>
              <select
                id="license"
                value={form.license}
                onChange={(e) => updateField('license', e.target.value)}
                className="input"
              >
                {LICENSES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <MultiSelect
            label="Use cases"
            options={USE_CASES}
            value={form.useCases}
            onChange={(v) => updateField('useCases', v)}
          />

          <MultiSelect
            label="Industries"
            options={INDUSTRIES}
            value={form.industries}
            onChange={(v) => updateField('industries', v)}
          />

          <MultiSelect
            label="Model types"
            options={MODEL_TYPES}
            value={form.modelTypes}
            onChange={(v) => updateField('modelTypes', v)}
          />

          <MultiSelect
            label="Deployment environments"
            options={DEPLOYMENT_ENVS}
            value={form.deploymentEnvs}
            onChange={(v) => updateField('deploymentEnvs', v)}
          />

          <div>
            <label className="label" htmlFor="riskTier">EU AI Act risk tier</label>
            <select
              id="riskTier"
              value={form.riskTier}
              onChange={(e) => updateField('riskTier', e.target.value)}
              className="input"
            >
              <option value="">Select risk tier...</option>
              {RISK_TIERS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Custom tags</label>
            <input
              type="text"
              placeholder="Add tag and press Enter (e.g. citation, pii-redaction)"
              className="input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const val = (e.target as HTMLInputElement).value.trim()
                  if (val && !form.customTags.includes(val)) {
                    updateField('customTags', [...form.customTags, val]);
                    (e.target as HTMLInputElement).value = ''
                  }
                }
              }}
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {form.customTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border"
                  style={{ backgroundColor: '#F3F4F6', color: '#374151', borderColor: '#E5E7EB' }}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => updateField('customTags', form.customTags.filter((t) => t !== tag))}
                    className="text-gray-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* AI Models */}
          <div>
            <label className="label">AI model references</label>
            <p className="text-xs text-gray-400 mb-1.5">HuggingFace or GitHub URLs for models used.</p>
            <input
              type="url"
              placeholder="https://huggingface.co/... or https://github.com/..."
              className="input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const val = (e.target as HTMLInputElement).value.trim()
                  if (val && !(form.aiModelUrls ?? []).includes(val)) {
                    updateField('aiModelUrls', [...(form.aiModelUrls ?? []), val]);
                    (e.target as HTMLInputElement).value = ''
                  }
                }
              }}
            />
            <div className="space-y-1 mt-2">
              {(form.aiModelUrls ?? []).map((url) => (
                <div key={url} className="flex items-center gap-2 group">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline flex-1 truncate">{url}</a>
                  <button type="button" onClick={() => updateField('aiModelUrls', (form.aiModelUrls ?? []).filter((u) => u !== url))} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100">×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Datasets */}
          <div>
            <label className="label">Test dataset references</label>
            <p className="text-xs text-gray-400 mb-1.5">HuggingFace or GitHub URLs for datasets used.</p>
            <input
              type="url"
              placeholder="https://huggingface.co/datasets/... or https://github.com/..."
              className="input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const val = (e.target as HTMLInputElement).value.trim()
                  if (val && !(form.datasetUrls ?? []).includes(val)) {
                    updateField('datasetUrls', [...(form.datasetUrls ?? []), val]);
                    (e.target as HTMLInputElement).value = ''
                  }
                }
              }}
            />
            <div className="space-y-1 mt-2">
              {(form.datasetUrls ?? []).map((url) => (
                <div key={url} className="flex items-center gap-2 group">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline flex-1 truncate">{url}</a>
                  <button type="button" onClick={() => updateField('datasetUrls', (form.datasetUrls ?? []).filter((u) => u !== url))} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100">×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Open source flag + publication date */}
          <div className="flex gap-6 items-start">
            <div>
              <label className="label">Component types</label>
              <div className="flex items-center gap-3 mt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => updateField('isOpenSource', true)}
                    className="w-9 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0"
                    style={{ backgroundColor: form.isOpenSource ? '#1E1B4B' : '#D1D5DB' }}
                  >
                    <div
                      className="w-4 h-4 bg-white rounded-full shadow-sm transition-transform mt-0.5"
                      style={{ transform: form.isOpenSource ? 'translateX(16px)' : 'translateX(2px)' }}
                    />
                  </div>
                  <span className="text-sm text-gray-700">
                    {form.isOpenSource ? 'All open-source components' : 'Includes paid / proprietary services'}
                  </span>
                </label>
              </div>
              <button
                type="button"
                onClick={() => updateField('isOpenSource', !form.isOpenSource)}
                className="text-xs text-indigo-500 hover:underline mt-1"
              >
                Toggle
              </button>
            </div>
            <div className="flex-1">
              <label className="label" htmlFor="publishedAt">Publication date</label>
              <input
                id="publishedAt"
                type="date"
                value={form.publishedAt ?? ''}
                onChange={(e) => updateField('publishedAt', e.target.value)}
                className="input"
              />
            </div>
          </div>
        </div>
      )}

      {activeSection === 'requirements' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3">Requirements</h2>
            <RequirementEditor
              requirements={form.requirements}
              onChange={(reqs: RequirementFormData[]) => updateField('requirements', reqs)}
            />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3">Dependency graph</h2>
            <DepGraph requirements={form.requirements} />
          </div>
        </div>
      )}

      {/* Footer actions */}
      <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={() => handleSubmit(true)}
          disabled={saving || !form.name.trim()}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          style={{ backgroundColor: '#F59E0B', color: '#1E1B4B' }}
        >
          {saving ? 'Publishing...' : mode === 'edit' ? 'Save changes' : 'Publish package'}
        </button>
        <button
          onClick={() => handleSubmit(false)}
          disabled={saving || !form.name.trim()}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Save as draft
        </button>
        <button
          onClick={() => router.back()}
          className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
