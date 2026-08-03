'use client'

import { useState, useMemo } from 'react'
import { HAZARDS, CONTROLS, HAZARD_CONTROLS, CONTROL_MAP } from '@/lib/hazards-data'

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORY_HAZARD_TYPES: Record<string, string[]> = {
  'Harmful Knowledge & Capability Uplift': ['Exploitation attacks', 'Adversarial attacks', 'Evasion attacks'],
  'Autonomous & Agentic Harm': ['Operational hazards', 'System complexity', 'System dependencies'],
  'Manipulation, Deception & Societal Harm': ['Cognitive bias', 'Lack of transparency', 'Social and behavioral hazards'],
  'Loss of Control & Alignment Failure': ['Functional insufficiencies', 'Generalisation issues', 'Epistemic uncertainty'],
  'Cyber Offence & Security': ['Adversarial attacks', 'Exploitation attacks', 'Inference attacks', 'Poisoning attack'],
  'Systemic & Civilisational Risks': ['System complexity', 'Resource limitations', 'Computational resource'],
  'Content Harms': ['Unfair behaviour', 'Social and behavioral hazards', 'User experience'],
  'Privacy, Discrimination & Rights Violations': ['Privacy violation', 'Inference attacks', 'Unfair behaviour', 'Data quality issues'],
}

const CAT_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  'Harmful Knowledge & Capability Uplift':    { bg: '#FEF3C7', border: '#FCD34D', text: '#92400E' },
  'Autonomous & Agentic Harm':                { bg: '#FEE2E2', border: '#FCA5A5', text: '#991B1B' },
  'Manipulation, Deception & Societal Harm':  { bg: '#EDE9FE', border: '#C4B5FD', text: '#5B21B6' },
  'Loss of Control & Alignment Failure':      { bg: '#FFF7ED', border: '#FDBA74', text: '#9A3412' },
  'Cyber Offence & Security':                 { bg: '#F0FDF4', border: '#86EFAC', text: '#166534' },
  'Systemic & Civilisational Risks':          { bg: '#FDF2F8', border: '#F0ABFC', text: '#86198F' },
  'Content Harms':                            { bg: '#FFF1F2', border: '#FDA4AF', text: '#9F1239' },
  'Privacy, Discrimination & Rights Violations': { bg: '#EFF6FF', border: '#93C5FD', text: '#1D4ED8' },
}

const CATEGORIES = Object.keys(CATEGORY_HAZARD_TYPES)

const NODE_H = 38
const NODE_GAP = 8

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getControlConcepts(hazardType: string): string[] {
  const hazardIds = HAZARDS.filter((h) => h.type === hazardType).map((h) => h.id)
  const controlIds = new Set(hazardIds.flatMap((hId) => HAZARD_CONTROLS[hId] ?? []))
  const concepts = new Set([...controlIds].map((cId) => CONTROL_MAP[cId]?.concept).filter(Boolean) as string[])
  return [...concepts].sort()
}

function getHazardCounts(hazardType: string): number {
  return HAZARDS.filter((h) => h.type === hazardType).length
}

// ─── Column component ─────────────────────────────────────────────────────────
function Column({
  title, subtitle, nodes, selectedNode, onSelect, colorFn, emptyMsg,
}: {
  title: string
  subtitle: string
  nodes: string[]
  selectedNode: string | null
  onSelect: (n: string | null) => void
  colorFn?: (n: string) => { bg: string; border: string; text: string }
  emptyMsg?: string
}) {
  return (
    <div className="flex flex-col min-w-0">
      <div className="mb-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>
      {nodes.length === 0 ? (
        <div className="flex-1 flex items-start pt-6">
          <p className="text-xs text-gray-300 italic px-2">{emptyMsg ?? 'Select a node to explore'}</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {nodes.map((n) => {
            const colors = colorFn?.(n)
            const active = selectedNode === n
            return (
              <button
                key={n}
                onClick={() => onSelect(active ? null : n)}
                className="w-full text-left px-3 py-2 rounded-lg border text-xs font-medium transition-all leading-snug"
                style={
                  active
                    ? {
                        backgroundColor: colors?.bg ?? '#EEF2FF',
                        borderColor: colors?.border ?? '#818CF8',
                        color: colors?.text ?? '#1E1B4B',
                        boxShadow: '0 0 0 2px ' + (colors?.border ?? '#818CF8'),
                      }
                    : {
                        backgroundColor: colors?.bg ?? '#F9FAFB',
                        borderColor: colors?.border ?? '#E5E7EB',
                        color: colors?.text ?? '#374151',
                        opacity: selectedNode && !active ? 0.5 : 1,
                      }
                }
              >
                {n}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export function KnowledgeGraph() {
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const hazardTypes = useMemo<string[]>(() => {
    if (!selectedCat) return []
    return CATEGORY_HAZARD_TYPES[selectedCat] ?? []
  }, [selectedCat])

  const controlConcepts = useMemo<string[]>(() => {
    if (!selectedType) return []
    return getControlConcepts(selectedType)
  }, [selectedType])

  // Breadcrumb trail
  const trail = [selectedCat, selectedType].filter(Boolean) as string[]

  // Stats
  const allHazardTypes = [...new Set(Object.values(CATEGORY_HAZARD_TYPES).flat())]
  const allConcepts = [...new Set(CONTROLS.map((c) => c.concept).filter(Boolean))]

  return (
    <div>
      {/* Stats row */}
      <div className="flex items-center gap-6 mb-6 text-sm">
        {[
          { label: 'Risk categories', value: CATEGORIES.length, color: '#92400E' },
          { label: 'Hazard types', value: allHazardTypes.length, color: '#1E1B4B' },
          { label: 'Control concepts', value: allConcepts.length, color: '#166534' },
          { label: 'Hazard instances', value: HAZARDS.length, color: '#6B7280' },
        ].map((s) => (
          <div key={s.label}>
            <span className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</span>
            <span className="text-xs text-gray-500 ml-1">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Breadcrumb */}
      {trail.length > 0 && (
        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          <button
            onClick={() => { setSelectedCat(null); setSelectedType(null) }}
            className="text-xs text-indigo-600 hover:underline"
          >
            All categories
          </button>
          {selectedCat && (
            <>
              <span className="text-gray-300">›</span>
              <button
                onClick={() => setSelectedType(null)}
                className="text-xs font-medium text-gray-700 hover:text-indigo-600"
              >
                {selectedCat}
              </button>
            </>
          )}
          {selectedType && (
            <>
              <span className="text-gray-300">›</span>
              <span className="text-xs font-medium text-gray-900">{selectedType}</span>
            </>
          )}
          <button
            onClick={() => { setSelectedCat(null); setSelectedType(null) }}
            className="ml-1 text-xs text-gray-400 hover:text-gray-600"
          >
            ✕ Clear
          </button>
        </div>
      )}

      {/* Hint */}
      {!selectedCat && (
        <div className="mb-4 px-3 py-2 rounded-lg text-xs text-indigo-700 border border-indigo-100" style={{ backgroundColor: '#EEF2FF' }}>
          Click a risk category to explore its hazard types and associated controls.
        </div>
      )}

      {/* Three-column layout */}
      <div className="grid grid-cols-3 gap-4">
        {/* Column 1 — Risk Categories */}
        <Column
          title="Risk Categories"
          subtitle={`${CATEGORIES.length} categories`}
          nodes={CATEGORIES}
          selectedNode={selectedCat}
          onSelect={(cat) => { setSelectedCat(cat); setSelectedType(null) }}
          colorFn={(cat) => CAT_COLORS[cat] ?? { bg: '#F9FAFB', border: '#E5E7EB', text: '#374151' }}
        />

        {/* Column 2 — Hazard Types */}
        <Column
          title="Hazard Types"
          subtitle={selectedCat ? `${hazardTypes.length} types in this category` : 'Select a category'}
          nodes={hazardTypes}
          selectedNode={selectedType}
          onSelect={setSelectedType}
          colorFn={() => ({ bg: '#FFF7ED', border: '#FED7AA', text: '#7C2D12' })}
          emptyMsg="Select a risk category to see its hazard types"
        />

        {/* Column 3 — Control Concepts */}
        <div className="flex flex-col min-w-0">
          <div className="mb-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Control Concepts</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {selectedType
                ? `${controlConcepts.length} concepts, ${getHazardCounts(selectedType)} hazard instances`
                : 'Select a hazard type'}
            </p>
          </div>
          {controlConcepts.length === 0 ? (
            <p className="text-xs text-gray-300 italic px-2 pt-6">
              {selectedType ? 'No controls mapped yet' : 'Select a hazard type to see associated controls'}
            </p>
          ) : (
            <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
              {controlConcepts.map((concept) => (
                <div
                  key={concept}
                  className="px-3 py-2 rounded-lg border text-xs font-medium"
                  style={{ backgroundColor: '#F0FDF4', borderColor: '#86EFAC', color: '#166534' }}
                >
                  {concept}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Connector visual */}
      {selectedCat && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Category pill */}
            <div
              className="px-3 py-1.5 rounded-lg border text-xs font-semibold"
              style={{
                backgroundColor: CAT_COLORS[selectedCat]?.bg,
                borderColor: CAT_COLORS[selectedCat]?.border,
                color: CAT_COLORS[selectedCat]?.text,
              }}
            >
              {selectedCat}
            </div>

            {/* Arrow + hazard type pills */}
            <svg width="20" height="16" viewBox="0 0 20 16"><path d="M0 8h16M10 2l8 6-8 6" stroke="#9CA3AF" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>

            <div className="flex flex-wrap gap-1.5">
              {hazardTypes.map((t) => (
                <div
                  key={t}
                  className="px-2.5 py-1 rounded-lg border text-xs font-medium cursor-pointer transition-all"
                  onClick={() => setSelectedType(selectedType === t ? null : t)}
                  style={
                    selectedType === t
                      ? { backgroundColor: '#FED7AA', borderColor: '#F97316', color: '#7C2D12' }
                      : { backgroundColor: '#FFF7ED', borderColor: '#FED7AA', color: '#7C2D12' }
                  }
                >
                  {t}
                </div>
              ))}
            </div>

            {/* Arrow + control concept pills (if type selected) */}
            {selectedType && controlConcepts.length > 0 && (
              <>
                <svg width="20" height="16" viewBox="0 0 20 16"><path d="M0 8h16M10 2l8 6-8 6" stroke="#9CA3AF" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div className="flex flex-wrap gap-1.5 max-w-sm">
                  {controlConcepts.slice(0, 8).map((c) => (
                    <div
                      key={c}
                      className="px-2.5 py-1 rounded-lg border text-xs font-medium"
                      style={{ backgroundColor: '#F0FDF4', borderColor: '#86EFAC', color: '#166534' }}
                    >
                      {c}
                    </div>
                  ))}
                  {controlConcepts.length > 8 && (
                    <div className="px-2.5 py-1 rounded-lg border text-xs font-medium text-gray-500 border-gray-200">
                      +{controlConcepts.length - 8} more
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
