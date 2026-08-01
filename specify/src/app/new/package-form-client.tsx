'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { RequirementEditor } from '@/components/requirement-editor'
import { DepGraph } from '@/components/dep-graph'
import type { PackageFormData, RequirementFormData, AIModelRef, DatasetRef, VendorRef, TaxonomyData } from '@/types'
import { TAXONOMY, COMPLIANCE_OPTIONS, LICENSES } from '@/types'

// ─── Contributor types ─────────────────────────────────────────────────────────
interface UserResult {
  id: string
  name: string | null
  username: string | null
  image: string | null
  org: string | null
}

// ─── Contributor search component ──────────────────────────────────────────────
function ContributorSearch({
  contributors,
  onChange,
}: {
  contributors: UserResult[]
  onChange: (c: UserResult[]) => void
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UserResult[]>([])
  const [loading, setLoading] = useState(false)
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current)
    if (query.trim().length < 2) { setResults([]); return }
    debounce.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(query.trim())}`)
        if (res.ok) {
          const data: UserResult[] = await res.json()
          setResults(data.filter((u) => !contributors.find((c) => c.id === u.id)))
        }
      } finally { setLoading(false) }
    }, 300)
  }, [query, contributors])

  function add(user: UserResult) {
    onChange([...contributors, user])
    setQuery('')
    setResults([])
  }

  function remove(id: string) {
    onChange(contributors.filter((c) => c.id !== id))
  }

  const initials = (name: string | null) =>
    (name ?? '?').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div>
      <label className="label">Contributors</label>
      <p className="text-xs text-gray-400 mb-2">Tag other Specify users who contributed to this package.</p>

      {/* Current contributors */}
      {contributors.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {contributors.map((c) => (
            <span
              key={c.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
              style={{ backgroundColor: '#EEF2FF', color: '#3730A3', borderColor: '#C7D2FE' }}
            >
              {c.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image} alt="" className="w-4 h-4 rounded-full" />
              ) : (
                <span className="w-4 h-4 rounded-full bg-indigo-400 text-white flex items-center justify-center text-xs font-bold" style={{ fontSize: 8 }}>
                  {initials(c.name)}
                </span>
              )}
              {c.name ?? c.username}
              <button type="button" onClick={() => remove(c.id)} className="hover:text-red-500 ml-0.5">×</button>
            </span>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or username…"
          className="input w-full"
        />
        {loading && (
          <svg className="animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        )}
        {results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 max-h-48 overflow-y-auto">
            {results.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => add(u)}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 text-left"
              >
                {u.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={u.image} alt="" className="w-7 h-7 rounded-full flex-shrink-0" />
                ) : (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: '#4338CA', color: 'white' }}>
                    {initials(u.name)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-800">{u.name ?? u.username}</p>
                  {u.username && <p className="text-xs text-gray-400">@{u.username}{u.org ? ` · ${u.org}` : ''}</p>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const defaultFormData: PackageFormData = {
  name: '',
  description: '',
  version: '0.1.0',
  license: 'MIT',
  taxonomyData: {},
  customTaxonomyTags: [],
  aiModels: [],
  datasetRefs: [],
  vendorList: [],
  complianceTargets: [],
  otherCompliance: '',
  isOpenSource: true,
  publishedAt: '',
  customTags: [],
  requirements: [],
}

interface PackageFormClientProps {
  initialData?: PackageFormData
  packageId?: string
  editSlug?: string
  mode?: 'new' | 'edit'
}

// ─── Reusable chip-select with custom input ────────────────────────────────────
function ChipGroup({
  label,
  options,
  selected,
  onChange,
  allowCustom = true,
}: {
  label: string
  options: readonly string[]
  selected: string[]
  onChange: (v: string[]) => void
  allowCustom?: boolean
}) {
  const [customInput, setCustomInput] = useState('')
  function toggle(opt: string) {
    onChange(selected.includes(opt) ? selected.filter((v) => v !== opt) : [...selected, opt])
  }
  function addCustom() {
    const val = customInput.trim()
    if (val && !selected.includes(val)) onChange([...selected, val])
    setCustomInput('')
  }
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className="px-2.5 py-1 rounded-full text-xs font-medium border transition-colors"
            style={
              selected.includes(opt)
                ? { backgroundColor: '#1E1B4B', color: 'white', borderColor: '#1E1B4B' }
                : { backgroundColor: 'white', color: '#6B7280', borderColor: '#D1D5DB' }
            }
          >
            {opt}
          </button>
        ))}
        {/* custom tags already selected */}
        {selected.filter((s) => !options.includes(s as any)).map((s) => (
          <span
            key={s}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border"
            style={{ backgroundColor: '#EEF2FF', color: '#3730A3', borderColor: '#C7D2FE' }}
          >
            {s}
            <button type="button" onClick={() => onChange(selected.filter((v) => v !== s))} className="hover:text-red-500">×</button>
          </span>
        ))}
      </div>
      {allowCustom && (
        <div className="flex gap-1.5 mt-1.5">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom() } }}
            placeholder="Add custom…"
            className="px-2.5 py-1 text-xs border border-dashed border-gray-300 rounded-full focus:outline-none focus:border-indigo-400 bg-white"
            style={{ minWidth: 120 }}
          />
          <button
            type="button"
            onClick={addCustom}
            className="px-2 py-1 text-xs text-indigo-600 hover:underline"
          >
            + Add
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Taxonomy section accordion ───────────────────────────────────────────────
function TaxonomySection({
  typeKey,
  typeLabel,
  groups,
  data,
  onChange,
}: {
  typeKey: string
  typeLabel: string
  groups: Record<string, { label: string; values: readonly string[] }>
  data: Record<string, string[]>
  onChange: (group: string, values: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const totalSelected = Object.values(data).reduce((s, v) => s + v.length, 0)

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
            className="text-gray-400 transition-transform"
            style={{ transform: open ? 'rotate(90deg)' : 'none' }}
          >
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
          <span className="text-sm font-semibold text-gray-800">{typeLabel}</span>
        </div>
        {totalSelected > 0 && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: '#EEF2FF', color: '#3730A3' }}
          >
            {totalSelected} selected
          </span>
        )}
      </button>
      {open && (
        <div className="px-4 py-4 space-y-1 bg-white">
          {Object.entries(groups).map(([groupKey, { label, values }]) => (
            <ChipGroup
              key={groupKey}
              label={label}
              options={values}
              selected={data[groupKey] ?? []}
              onChange={(v) => onChange(groupKey, v)}
            />
          ))}
        </div>
      )}
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
  const [contributors, setContributors] = useState<UserResult[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<'metadata' | 'taxonomy' | 'models' | 'requirements'>('metadata')

  function updateField<K extends keyof PackageFormData>(key: K, value: PackageFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function updateTaxonomy(typeKey: string, group: string, values: string[]) {
    setForm((prev) => ({
      ...prev,
      taxonomyData: {
        ...prev.taxonomyData,
        [typeKey]: {
          ...(prev.taxonomyData[typeKey as keyof TaxonomyData] ?? {}),
          [group]: values,
        },
      },
    }))
  }

  // ── AI Model helpers ────────────────────────────────────────────────────────
  function addAIModel() {
    updateField('aiModels', [...form.aiModels, { url: '', name: '', purpose: '', modelTypes: [] }])
  }
  function updateAIModel(i: number, field: keyof AIModelRef, value: any) {
    const updated = form.aiModels.map((m, idx) => idx === i ? { ...m, [field]: value } : m)
    updateField('aiModels', updated)
  }
  function removeAIModel(i: number) {
    updateField('aiModels', form.aiModels.filter((_, idx) => idx !== i))
  }

  // ── Dataset helpers ─────────────────────────────────────────────────────────
  function addDataset() {
    updateField('datasetRefs', [...form.datasetRefs, { url: '', name: '', purpose: '' }])
  }
  function updateDataset(i: number, field: keyof DatasetRef, value: string) {
    const updated = form.datasetRefs.map((d, idx) => idx === i ? { ...d, [field]: value } : d)
    updateField('datasetRefs', updated)
  }
  function removeDataset(i: number) {
    updateField('datasetRefs', form.datasetRefs.filter((_, idx) => idx !== i))
  }

  // ── Vendor helpers ──────────────────────────────────────────────────────────
  function addVendor() {
    updateField('vendorList', [...form.vendorList, { name: '', url: '', purpose: '' }])
  }
  function updateVendor(i: number, field: keyof VendorRef, value: string) {
    const updated = form.vendorList.map((v, idx) => idx === i ? { ...v, [field]: value } : v)
    updateField('vendorList', updated)
  }
  function removeVendor(i: number) {
    updateField('vendorList', form.vendorList.filter((_, idx) => idx !== i))
  }

  // ── Compliance helpers ──────────────────────────────────────────────────────
  function toggleCompliance(val: string) {
    const targets = form.complianceTargets
    updateField('complianceTargets', targets.includes(val) ? targets.filter((v) => v !== val) : [...targets, val])
  }

  async function handleSubmit(isPublished: boolean) {
    setSaving(true)
    setError(null)
    try {
      const payload = { ...form, isPublished, contributorIds: contributors.map((c) => c.id) }
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
      router.push(`/packages/${pkg.slug}`)
    } catch {
      setError('Network error — please try again')
    } finally {
      setSaving(false)
    }
  }

  const SECTIONS = [
    { id: 'metadata', label: 'Metadata' },
    { id: 'taxonomy', label: 'Classification' },
    { id: 'models', label: 'Models & Data' },
    { id: 'requirements', label: `Requirements (${form.requirements.length})` },
  ] as const

  // All model types from taxonomy for AI model type chips
  const allModelTasks = TAXONOMY.model.groups.task.values
  const allModelArchitectures = TAXONOMY.model.groups.modelArchitecture.values

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#1E1B4B' }}>
          {mode === 'edit' ? `Edit ${editSlug}` : 'New package'}
        </h1>
        {mode === 'edit' && editSlug && (
          <a href={`/packages/${editSlug}`} className="text-sm text-gray-500 hover:text-indigo-600">
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
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id as any)}
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

      {/* ── Metadata ── */}
      {activeSection === 'metadata' && (
        <div className="max-w-2xl space-y-5">
          <div>
            <label className="label" htmlFor="name">Package name *</label>
            <input
              id="name" type="text" value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g. rag-customer-support"
              className="input" required
            />
            <p className="mt-1 text-xs text-gray-400">
              Lowercase, hyphens allowed. Published as{' '}
              <span className="font-mono">username/{form.name || 'package-name'}</span>
            </p>
          </div>

          <div>
            <label className="label" htmlFor="description">Description</label>
            <textarea
              id="description" value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Brief description of your AI system requirements package"
              rows={3} className="input resize-none"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="label" htmlFor="version">Version</label>
              <input id="version" type="text" value={form.version}
                onChange={(e) => updateField('version', e.target.value)}
                placeholder="0.1.0" className="input" />
            </div>
            <div className="flex-1">
              <label className="label" htmlFor="license">License</label>
              <select id="license" value={form.license}
                onChange={(e) => updateField('license', e.target.value)} className="input">
                {LICENSES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <label className="label" htmlFor="publishedAt">Publication date</label>
              <input id="publishedAt" type="date" value={form.publishedAt ?? ''}
                onChange={(e) => updateField('publishedAt', e.target.value)} className="input" />
            </div>
            <div className="flex-1">
              <label className="label">Component types</label>
              <button
                type="button"
                onClick={() => updateField('isOpenSource', !form.isOpenSource)}
                className="flex items-center gap-2 mt-1"
              >
                <div
                  className="w-10 h-6 rounded-full transition-colors flex-shrink-0"
                  style={{ backgroundColor: form.isOpenSource ? '#1E1B4B' : '#D1D5DB' }}
                >
                  <div className="w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5"
                    style={{ transform: form.isOpenSource ? 'translateX(18px)' : 'translateX(2px)' }} />
                </div>
                <span className="text-sm text-gray-700">
                  {form.isOpenSource ? 'All open-source components' : 'Includes paid / proprietary services'}
                </span>
              </button>
            </div>
          </div>

          {/* Compliance */}
          <div>
            <label className="label">Intended compliance</label>
            <p className="text-xs text-gray-400 mb-2">Select all frameworks this package is designed to support.</p>
            <div className="space-y-2 mb-3">
              {COMPLIANCE_OPTIONS.map((opt) => (
                <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => toggleCompliance(opt)}
                    className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer"
                    style={
                      form.complianceTargets.includes(opt)
                        ? { backgroundColor: '#1E1B4B', borderColor: '#1E1B4B' }
                        : { backgroundColor: 'white', borderColor: '#D1D5DB' }
                    }
                  >
                    {form.complianceTargets.includes(opt) && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Other regulations or standards</label>
              <input
                type="text"
                value={form.otherCompliance}
                onChange={(e) => updateField('otherCompliance', e.target.value)}
                placeholder="e.g. UK Product Security and Telecoms Infrastructure Act"
                className="input"
              />
            </div>
          </div>

          {/* Contributors */}
          <ContributorSearch contributors={contributors} onChange={setContributors} />
        </div>
      )}

      {/* ── Classification / Taxonomy ── */}
      {activeSection === 'taxonomy' && (
        <div className="max-w-3xl">
          <p className="text-sm text-gray-500 mb-5">
            Select all that apply. You can also type custom values in each category.
          </p>
          {Object.entries(TAXONOMY).map(([typeKey, { label, groups }]) => (
            <TaxonomySection
              key={typeKey}
              typeKey={typeKey}
              typeLabel={label}
              groups={groups as any}
              data={(form.taxonomyData[typeKey as keyof TaxonomyData] ?? {}) as Record<string, string[]>}
              onChange={(group, values) => updateTaxonomy(typeKey, group, values)}
            />
          ))}
        </div>
      )}

      {/* ── Models & Data ── */}
      {activeSection === 'models' && (
        <div className="max-w-3xl space-y-8">

          {/* AI Models */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900">AI model references</h2>
                <p className="text-xs text-gray-400">Add HuggingFace or GitHub URLs for each model used.</p>
              </div>
              <button type="button" onClick={addAIModel}
                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                + Add model
              </button>
            </div>
            {form.aiModels.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-sm text-gray-400">
                No models added yet. Click &quot;Add model&quot; to start.
              </div>
            ) : (
              <div className="space-y-4">
                {form.aiModels.map((model, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Model {i + 1}</span>
                      <button type="button" onClick={() => removeAIModel(i)}
                        className="text-xs text-gray-400 hover:text-red-500">Remove</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">Name / identifier</label>
                        <input type="text" value={model.name}
                          onChange={(e) => updateAIModel(i, 'name', e.target.value)}
                          placeholder="e.g. GPT-4o" className="input text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">URL (HuggingFace / GitHub)</label>
                        <input type="url" value={model.url}
                          onChange={(e) => updateAIModel(i, 'url', e.target.value)}
                          placeholder="https://huggingface.co/..." className="input text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">Purpose</label>
                      <input type="text" value={model.purpose}
                        onChange={(e) => updateAIModel(i, 'purpose', e.target.value)}
                        placeholder="e.g. Main language model for response generation"
                        className="input text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-2">Model types (task & architecture)</label>
                      <div className="flex flex-wrap gap-1.5">
                        {[...allModelTasks, ...allModelArchitectures].map((t) => (
                          <button key={t} type="button"
                            onClick={() => {
                              const current = model.modelTypes
                              updateAIModel(i, 'modelTypes', current.includes(t) ? current.filter((v) => v !== t) : [...current, t])
                            }}
                            className="px-2 py-0.5 rounded-full text-xs font-medium border transition-colors"
                            style={
                              model.modelTypes.includes(t)
                                ? { backgroundColor: '#1E1B4B', color: 'white', borderColor: '#1E1B4B' }
                                : { backgroundColor: 'white', color: '#6B7280', borderColor: '#D1D5DB' }
                            }
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Datasets */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Test dataset references</h2>
                <p className="text-xs text-gray-400">Add HuggingFace or GitHub URLs for datasets used in testing/evaluation.</p>
              </div>
              <button type="button" onClick={addDataset}
                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                + Add dataset
              </button>
            </div>
            {form.datasetRefs.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-sm text-gray-400">
                No datasets added yet. Click &quot;Add dataset&quot; to start.
              </div>
            ) : (
              <div className="space-y-3">
                {form.datasetRefs.map((ds, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Dataset {i + 1}</span>
                      <button type="button" onClick={() => removeDataset(i)}
                        className="text-xs text-gray-400 hover:text-red-500">Remove</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">Name</label>
                        <input type="text" value={ds.name}
                          onChange={(e) => updateDataset(i, 'name', e.target.value)}
                          placeholder="e.g. MMLU" className="input text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">URL</label>
                        <input type="url" value={ds.url}
                          onChange={(e) => updateDataset(i, 'url', e.target.value)}
                          placeholder="https://huggingface.co/datasets/..." className="input text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">Purpose</label>
                      <input type="text" value={ds.purpose}
                        onChange={(e) => updateDataset(i, 'purpose', e.target.value)}
                        placeholder="e.g. Benchmark for reasoning capability"
                        className="input text-sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vendors */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Vendors</h2>
                <p className="text-xs text-gray-400">List third-party vendors or services used in this AI system.</p>
              </div>
              <button type="button" onClick={addVendor}
                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                + Add vendor
              </button>
            </div>
            {form.vendorList.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-sm text-gray-400">
                No vendors added yet. Click &quot;Add vendor&quot; to start.
              </div>
            ) : (
              <div className="space-y-3">
                {form.vendorList.map((v, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Vendor {i + 1}</span>
                      <button type="button" onClick={() => removeVendor(i)}
                        className="text-xs text-gray-400 hover:text-red-500">Remove</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">Vendor name</label>
                        <input type="text" value={v.name}
                          onChange={(e) => updateVendor(i, 'name', e.target.value)}
                          placeholder="e.g. OpenAI" className="input text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">Website URL</label>
                        <input type="url" value={v.url}
                          onChange={(e) => updateVendor(i, 'url', e.target.value)}
                          placeholder="https://openai.com" className="input text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">Purpose / role</label>
                      <input type="text" value={v.purpose}
                        onChange={(e) => updateVendor(i, 'purpose', e.target.value)}
                        placeholder="e.g. LLM inference provider"
                        className="input text-sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Requirements ── */}
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
        <button onClick={() => router.back()} className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700">
          Cancel
        </button>
      </div>
    </div>
  )
}
