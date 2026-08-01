'use client'

import { useState, useRef } from 'react'
import type { RequirementFormData, SubRequirementFormData, RequirementMedia } from '@/types'
import { REQ_TAG_TYPES } from '@/types'

interface RequirementEditorProps {
  requirements: RequirementFormData[]
  onChange: (requirements: RequirementFormData[]) => void
}

const TAG_COLORS: Record<string, { bg: string; text: string; activeBg: string; activeText: string }> = {
  data: { bg: '#EFF6FF', text: '#1D4ED8', activeBg: '#1D4ED8', activeText: 'white' },
  model: { bg: '#F5F3FF', text: '#6D28D9', activeBg: '#6D28D9', activeText: 'white' },
  system: { bg: '#ECFDF5', text: '#065F46', activeBg: '#065F46', activeText: 'white' },
  infrastructure: { bg: '#FEF3C7', text: '#92400E', activeBg: '#92400E', activeText: 'white' },
}

function nextReqId(requirements: RequirementFormData[]): string {
  const ids = requirements
    .map((r) => {
      const match = r.id.match(/REQ-(\d+)/)
      return match ? parseInt(match[1]) : 0
    })
    .filter(Boolean)
  const max = ids.length > 0 ? Math.max(...ids) : 0
  return `REQ-${String(max + 1).padStart(3, '0')}`
}

function nextSubId(req: RequirementFormData): string {
  const existing = req.subRequirements.map((s) => {
    const match = s.id.match(/\.(\d+)$/)
    return match ? parseInt(match[1]) : 0
  })
  const max = existing.length > 0 ? Math.max(...existing) : 0
  return `${req.id}.${max + 1}`
}

function emptyRequirement(id: string): RequirementFormData {
  return {
    id,
    title: '',
    tags: ['system'],
    obligation: 'shall',
    body: '',
    dependsOn: [],
    subRequirements: [],
    media: [],
  }
}

function SubRequirementEditor({
  sub,
  onChange,
  onRemove,
}: {
  sub: SubRequirementFormData
  onChange: (sub: SubRequirementFormData) => void
  onRemove: () => void
}) {
  return (
    <div className="ml-6 pl-4 border-l-2 border-indigo-100 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono font-semibold text-indigo-400">{sub.id}</span>
        <input
          type="text"
          value={sub.title}
          onChange={(e) => onChange({ ...sub, title: e.target.value })}
          placeholder="Sub-requirement title"
          className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-300"
        />
        <select
          value={sub.obligation}
          onChange={(e) => onChange({ ...sub, obligation: e.target.value as 'shall' | 'should' })}
          className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none"
        >
          <option value="shall">shall</option>
          <option value="should">should</option>
        </select>
        <button onClick={onRemove} className="text-gray-400 hover:text-red-500 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>
      </div>
      <textarea
        value={sub.body}
        onChange={(e) => onChange({ ...sub, body: e.target.value })}
        placeholder="Requirement body (Markdown supported)"
        rows={2}
        className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-300 resize-y"
      />
    </div>
  )
}

function RequirementItem({
  req,
  allRequirements,
  onChange,
  onRemove,
}: {
  req: RequirementFormData
  allRequirements: RequirementFormData[]
  onChange: (req: RequirementFormData) => void
  onRemove: () => void
}) {
  const [expanded, setExpanded] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function toggleTag(tag: string) {
    const hasTag = req.tags.includes(tag)
    onChange({
      ...req,
      tags: hasTag ? req.tags.filter((t) => t !== tag) : [...req.tags, tag],
    })
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        const media: RequirementMedia = { url: data.url, type: data.type, caption: '' }
        onChange({ ...req, media: [...(req.media ?? []), media] })
      }
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function updateMediaCaption(idx: number, caption: string) {
    const updated = (req.media ?? []).map((m, i) => i === idx ? { ...m, caption } : m)
    onChange({ ...req, media: updated })
  }

  function removeMedia(idx: number) {
    onChange({ ...req, media: (req.media ?? []).filter((_, i) => i !== idx) })
  }

  function addSubRequirement() {
    const subId = nextSubId(req)
    onChange({
      ...req,
      subRequirements: [
        ...req.subRequirements,
        { id: subId, title: '', obligation: 'shall', body: '' },
      ],
    })
  }

  function updateSub(index: number, sub: SubRequirementFormData) {
    const subs = [...req.subRequirements]
    subs[index] = sub
    onChange({ ...req, subRequirements: subs })
  }

  function removeSub(index: number) {
    onChange({
      ...req,
      subRequirements: req.subRequirements.filter((_, i) => i !== index),
    })
  }

  const availableDeps = allRequirements
    .filter((r) => r.id !== req.id)
    .map((r) => r.id)

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50"
        style={{ backgroundColor: '#FAFAFA' }}
        onClick={() => setExpanded((e) => !e)}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-gray-400 flex-shrink-0 transition-transform"
          style={{ transform: expanded ? 'rotate(90deg)' : 'none' }}
        >
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        </svg>
        <span className="text-xs font-mono font-bold" style={{ color: '#1E1B4B' }}>
          {req.id}
        </span>
        <span className="flex-1 text-sm font-medium text-gray-700 truncate">
          {req.title || 'Untitled requirement'}
        </span>
        <span
          className="text-xs px-1.5 py-0.5 rounded font-medium"
          style={{
            backgroundColor: req.obligation === 'shall' ? '#EEF2FF' : '#FEF3C7',
            color: req.obligation === 'shall' ? '#3730A3' : '#92400E',
          }}
        >
          {req.obligation}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="text-gray-400 hover:text-red-500 transition-colors ml-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>
      </div>

      {expanded && (
        <div className="p-3 space-y-3 border-t border-gray-100">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
            <input
              type="text"
              value={req.title}
              onChange={(e) => onChange({ ...req, title: e.target.value })}
              placeholder="Requirement title"
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-300"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Tags + Obligation row */}
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Type tags</label>
              <div className="flex items-center gap-1">
                {REQ_TAG_TYPES.map((tag) => {
                  const colors = TAG_COLORS[tag]
                  const active = req.tags.includes(tag)
                  return (
                    <button
                      key={tag}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleTag(tag)
                      }}
                      className="px-2 py-0.5 rounded-full text-xs font-medium border transition-colors"
                      style={{
                        backgroundColor: active ? colors.activeBg : colors.bg,
                        color: active ? colors.activeText : colors.text,
                        borderColor: active ? colors.activeBg : 'transparent',
                      }}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Obligation</label>
              <div className="flex items-center gap-1">
                {(['shall', 'should'] as const).map((obl) => (
                  <label key={obl} className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name={`obligation-${req.id}`}
                      value={obl}
                      checked={req.obligation === obl}
                      onChange={() => onChange({ ...req, obligation: obl })}
                      onClick={(e) => e.stopPropagation()}
                      className="accent-indigo-600"
                    />
                    <span className="text-xs font-medium capitalize">{obl}</span>
                  </label>
                ))}
              </div>
            </div>

            {availableDeps.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Depends on</label>
                <select
                  multiple
                  value={req.dependsOn}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions).map((o) => o.value)
                    onChange({ ...req, dependsOn: selected })
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-300"
                  size={Math.min(availableDeps.length, 3)}
                >
                  {availableDeps.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Body{' '}
              <span className="text-gray-400 font-normal">(Markdown supported)</span>
            </label>
            <textarea
              value={req.body}
              onChange={(e) => onChange({ ...req, body: e.target.value })}
              placeholder="Describe the requirement in detail..."
              rows={3}
              onClick={(e) => e.stopPropagation()}
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-300 resize-y font-mono"
            />
          </div>

          {/* Media attachments */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-500">
                Media <span className="font-normal text-gray-400">(images &amp; videos)</span>
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50"
              >
                {uploading ? (
                  <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                )}
                {uploading ? 'Uploading…' : 'Upload file'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            {(req.media ?? []).length > 0 && (
              <div className="space-y-2">
                {(req.media ?? []).map((m, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-2 flex gap-2">
                    {m.type === 'image' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.url} alt={m.caption || 'attachment'} className="w-16 h-16 object-cover rounded flex-shrink-0" />
                    ) : (
                      <video src={m.url} className="w-16 h-16 object-cover rounded flex-shrink-0" controls={false} />
                    )}
                    <div className="flex-1 min-w-0 space-y-1">
                      <input
                        type="text" value={m.caption}
                        onChange={(e) => updateMediaCaption(idx, e.target.value)}
                        placeholder="Caption (optional)"
                        className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-300"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <a href={m.url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-indigo-500 hover:underline truncate block">
                        {m.url.split('/').pop()}
                      </a>
                    </div>
                    <button type="button" onClick={() => removeMedia(idx)}
                      className="text-gray-400 hover:text-red-500 flex-shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sub-requirements */}
          {req.subRequirements.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-500">Sub-requirements</label>
              {req.subRequirements.map((sub, idx) => (
                <SubRequirementEditor
                  key={sub.id}
                  sub={sub}
                  onChange={(updated) => updateSub(idx, updated)}
                  onRemove={() => removeSub(idx)}
                />
              ))}
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation()
              addSubRequirement()
            }}
            className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            Add sub-requirement
          </button>
        </div>
      )}
    </div>
  )
}

export function RequirementEditor({ requirements, onChange }: RequirementEditorProps) {
  function addRequirement() {
    const id = nextReqId(requirements)
    onChange([...requirements, emptyRequirement(id)])
  }

  function updateRequirement(index: number, req: RequirementFormData) {
    const next = [...requirements]
    next[index] = req
    onChange(next)
  }

  function removeRequirement(index: number) {
    onChange(requirements.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      {requirements.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
          No requirements yet. Add your first one below.
        </div>
      )}

      {requirements.map((req, idx) => (
        <RequirementItem
          key={req.id}
          req={req}
          allRequirements={requirements}
          onChange={(updated) => updateRequirement(idx, updated)}
          onRemove={() => removeRequirement(idx)}
        />
      ))}

      <button
        onClick={addRequirement}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors font-medium"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
        Add requirement
      </button>
    </div>
  )
}
