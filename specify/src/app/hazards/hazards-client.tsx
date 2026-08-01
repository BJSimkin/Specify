'use client'

import { useState, useMemo } from 'react'
import { HAZARDS, CONTROLS, HAZARD_TYPES, HAZARD_CONTROLS, CONTROL_MAP } from '@/lib/hazards-data'

// ─── Colour palette for hazard types ──────────────────────────────────────────
const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Adversarial attacks':         { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
  'Cognitive bias':              { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  'Computational resource':      { bg: '#EDE9FE', text: '#5B21B6', border: '#C4B5FD' },
  'Data quality issues':         { bg: '#FFF7ED', text: '#9A3412', border: '#FDBA74' },
  'Distribution shift':          { bg: '#F0FDF4', text: '#166534', border: '#86EFAC' },
  'Epistemic uncertainty':       { bg: '#EFF6FF', text: '#1D4ED8', border: '#93C5FD' },
  'Evasion attacks':             { bg: '#FDF4FF', text: '#86198F', border: '#E879F9' },
  'Exploitation attacks':        { bg: '#FFF1F2', text: '#9F1239', border: '#FDA4AF' },
  'Functional insufficiencies':  { bg: '#F8FAFC', text: '#334155', border: '#CBD5E1' },
  'Generalisation issues':       { bg: '#ECFDF5', text: '#065F46', border: '#6EE7B7' },
  'Hardware limitations':        { bg: '#F1F5F9', text: '#1E293B', border: '#94A3B8' },
  'Inference attacks':           { bg: '#FEF9C3', text: '#713F12', border: '#FDE047' },
  'Insufficient knowledge':      { bg: '#FDF2F8', text: '#9D174D', border: '#F9A8D4' },
  'Lack of transparency':        { bg: '#F5F3FF', text: '#4C1D95', border: '#DDD6FE' },
  'Model instability':           { bg: '#FFF8F1', text: '#7C2D12', border: '#FED7AA' },
  'Operational hazards':         { bg: '#F0F9FF', text: '#0C4A6E', border: '#7DD3FC' },
  'Performance insufficiency':   { bg: '#FFFBEB', text: '#78350F', border: '#FDE68A' },
  'Poisoning attack':            { bg: '#FEF2F2', text: '#7F1D1D', border: '#FCA5A5' },
  'Privacy violation':           { bg: '#EFF6FF', text: '#1E3A5F', border: '#BFDBFE' },
  'Resource limitations':        { bg: '#F3F4F6', text: '#111827', border: '#D1D5DB' },
  'Social and behavioral hazards': { bg: '#ECFDF5', text: '#14532D', border: '#A7F3D0' },
  'System complexity':           { bg: '#FAF5FF', text: '#581C87', border: '#D8B4FE' },
  'System dependencies':         { bg: '#FFF7ED', text: '#7C2D12', border: '#FDBA74' },
  'Unfair behaviour':            { bg: '#FEF3C7', text: '#78350F', border: '#FCD34D' },
  'User experience':             { bg: '#F0FDFA', text: '#134E4A', border: '#99F6E4' },
}

const ATTR_COLORS: Record<string, string> = {
  'AI System': '#4338CA',
  'Data':      '#0891B2',
  'Model':     '#7C3AED',
}

export default function HazardsClient() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedHazard, setSelectedHazard] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [controlSearch, setControlSearch] = useState('')

  const filteredHazards = useMemo(() => {
    return HAZARDS.filter((h) => {
      const matchType = !selectedType || h.type === selectedType
      const q = search.toLowerCase()
      const matchSearch = !q || h.name.toLowerCase().includes(q) || (h.type ?? '').toLowerCase().includes(q)
      return matchType && matchSearch
    })
  }, [selectedType, search])

  const activeHazard = selectedHazard ? HAZARDS.find((h) => h.id === selectedHazard) : null

  const hazardControls = useMemo(() => {
    if (!selectedHazard) return []
    const ids = HAZARD_CONTROLS[selectedHazard] ?? []
    return ids.map((id) => CONTROL_MAP[id]).filter(Boolean).filter((c) => {
      if (!controlSearch) return true
      const q = controlSearch.toLowerCase()
      return (c.concept ?? '').toLowerCase().includes(q) ||
             (c.module ?? '').toLowerCase().includes(q) ||
             (c.component ?? '').toLowerCase().includes(q) ||
             (c.attribute ?? '').toLowerCase().includes(q)
    })
  }, [selectedHazard, controlSearch])

  // Group controls by attribute
  const controlsByAttr = useMemo(() => {
    const groups: Record<string, typeof hazardControls> = {}
    for (const c of hazardControls) {
      const key = c.attribute ?? 'Other'
      groups[key] = groups[key] ?? []
      groups[key].push(c)
    }
    return groups
  }, [hazardControls])

  // Type counts
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const h of HAZARDS) {
      if (h.type) counts[h.type] = (counts[h.type] ?? 0) + 1
    }
    return counts
  }, [])

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#1E1B4B' }}>Hazards &amp; Controls</h1>
        <p className="text-sm text-gray-500 max-w-2xl">
          An interactive mapping of AI system hazards to their corresponding controls and mitigations, drawn from a structured hazard taxonomy.
          Select a hazard type, then a specific hazard to explore the controls that address it.
        </p>
      </div>

      {/* Stats bar */}
      <div className="flex gap-6 mb-6 text-sm">
        {[
          { label: 'Hazard types', value: HAZARD_TYPES.length },
          { label: 'Hazards', value: HAZARDS.length },
          { label: 'Controls', value: CONTROLS.length },
          { label: 'Mappings', value: 793 },
        ].map((s) => (
          <div key={s.label}>
            <span className="text-xl font-bold" style={{ color: '#1E1B4B' }}>{s.value}</span>
            <span className="text-gray-400 ml-1">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-5">
        {/* Left: Hazard type filter */}
        <div className="w-52 flex-shrink-0">
          <div className="sticky top-16">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Hazard type</p>
            <div className="space-y-0.5">
              <button
                onClick={() => { setSelectedType(null); setSelectedHazard(null) }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-sm transition-colors flex items-center justify-between"
                style={!selectedType ? { backgroundColor: '#EEF2FF', color: '#3730A3', fontWeight: 600 } : { color: '#374151' }}
              >
                <span>All types</span>
                <span className="text-xs text-gray-400">{HAZARDS.length}</span>
              </button>
              {HAZARD_TYPES.map((type) => {
                const col = TYPE_COLORS[type] ?? { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' }
                const active = selectedType === type
                return (
                  <button
                    key={type}
                    onClick={() => { setSelectedType(type); setSelectedHazard(null) }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between"
                    style={active ? { backgroundColor: col.bg, color: col.text, fontWeight: 600 } : { color: '#374151' }}
                  >
                    <span className="truncate">{type}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-1">{typeCounts[type] ?? 0}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Middle: Hazard list */}
        <div className="w-72 flex-shrink-0">
          <div className="sticky top-16">
            <div className="mb-3">
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSelectedHazard(null) }}
                placeholder="Search hazards…"
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400"
              />
            </div>
            <p className="text-xs text-gray-400 mb-2">
              {filteredHazards.length} hazard{filteredHazards.length !== 1 ? 's' : ''}
              {selectedType && <> in <span className="font-medium text-gray-600">{selectedType}</span></>}
            </p>
            <div className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {filteredHazards.map((h) => {
                const col = TYPE_COLORS[h.type ?? ''] ?? { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' }
                const controlCount = (HAZARD_CONTROLS[h.id] ?? []).length
                const isSelected = selectedHazard === h.id
                return (
                  <button
                    key={h.id}
                    onClick={() => setSelectedHazard(h.id)}
                    className="w-full text-left px-3 py-2.5 rounded-xl border transition-all"
                    style={isSelected
                      ? { borderColor: '#818CF8', backgroundColor: '#EEF2FF' }
                      : { borderColor: '#E5E7EB', backgroundColor: 'white' }
                    }
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-mono text-gray-400">{h.id}</span>
                        <p className="text-sm font-medium text-gray-900 mt-0.5 leading-snug">{h.name}</p>
                      </div>
                      {controlCount > 0 && (
                        <span className="flex-shrink-0 text-xs font-semibold px-1.5 py-0.5 rounded-full mt-0.5"
                          style={{ backgroundColor: col.bg, color: col.text }}>
                          {controlCount}
                        </span>
                      )}
                    </div>
                    {h.type && !selectedType && (
                      <span className="inline-block mt-1 text-xs px-1.5 py-0.5 rounded border"
                        style={{ backgroundColor: col.bg, color: col.text, borderColor: col.border }}>
                        {h.type}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right: Controls for selected hazard */}
        <div className="flex-1 min-w-0">
          {!activeHazard ? (
            <div className="flex flex-col items-center justify-center py-24 text-center text-gray-400">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="mb-3 opacity-30">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              <p className="text-sm">Select a hazard to see its controls</p>
            </div>
          ) : (
            <div>
              {/* Hazard header */}
              <div className="border border-gray-200 rounded-xl p-5 mb-4">
                <div className="flex items-start gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-400">{activeHazard.id}</span>
                      {activeHazard.type && (
                        <span className="text-xs px-2 py-0.5 rounded-full border font-medium"
                          style={{ ...(TYPE_COLORS[activeHazard.type] ?? { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' }), backgroundColor: (TYPE_COLORS[activeHazard.type] ?? {bg:'#F3F4F6'}).bg, borderColor: (TYPE_COLORS[activeHazard.type] ?? {border:'#D1D5DB'}).border }}>
                          {activeHazard.type}
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">{activeHazard.name}</h2>
                  </div>
                </div>
                <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
                  <span><strong className="text-gray-900">{(HAZARD_CONTROLS[activeHazard.id] ?? []).length}</strong> controls mapped</span>
                </div>
              </div>

              {/* Control search */}
              <div className="mb-3">
                <input
                  type="text"
                  value={controlSearch}
                  onChange={(e) => setControlSearch(e.target.value)}
                  placeholder="Filter controls…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400"
                />
              </div>

              {hazardControls.length === 0 ? (
                <div className="text-center py-10 text-sm text-gray-400">
                  {(HAZARD_CONTROLS[activeHazard.id] ?? []).length === 0
                    ? 'No controls mapped to this hazard yet.'
                    : 'No controls match your filter.'}
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(controlsByAttr).map(([attr, controls]) => (
                    <div key={attr}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: ATTR_COLORS[attr] ?? '#6B7280' }}>
                          {attr}
                        </span>
                        <span className="text-xs text-gray-400">{controls.length} control{controls.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {controls.map((c) => (
                          <div key={c.id} className="border border-gray-200 rounded-xl px-4 py-3 bg-white hover:border-indigo-200 transition-colors">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-mono text-gray-400">{c.id}</span>
                                <p className="text-sm font-semibold text-gray-900 mt-0.5">{c.concept ?? '—'}</p>
                                {c.module && (
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {c.module}{c.component ? ` › ${c.component}` : ''}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
