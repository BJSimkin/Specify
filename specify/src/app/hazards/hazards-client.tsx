'use client'

import { useState, useMemo } from 'react'
import { HAZARDS, CONTROLS, HAZARD_TYPES, HAZARD_CONTROLS, CONTROL_MAP } from '@/lib/hazards-data'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Control {
  id: string
  attribute: string | null
  concept: string | null
  module: string | null
  component: string | null
}

// ─── Definitions for hazard types ─────────────────────────────────────────────
const HAZARD_TYPE_DEFS: Record<string, string> = {
  'Adversarial attacks': 'Deliberate inputs crafted to deceive or destabilise an AI system, causing incorrect outputs or unexpected behaviour.',
  'Cognitive bias': 'Systematic errors in AI reasoning or outputs that stem from biases in training data, design choices, or human-in-the-loop decisions.',
  'Computational resource': 'Constraints or demands related to the processing power, memory, and infrastructure required to train or run an AI system.',
  'Data quality issues': 'Problems with the data used to train or operate an AI system, including noise, errors, imbalance, or coverage gaps.',
  'Distribution shift': 'Divergence between the data distribution seen during training and the distribution encountered during deployment, degrading performance.',
  'Epistemic uncertainty': 'Uncertainty arising from incomplete knowledge or lack of information, affecting the reliability of model predictions.',
  'Evasion attacks': 'Inputs designed to cause a deployed model to misclassify or produce incorrect outputs without being detected.',
  'Exploitation attacks': 'Attacks that exploit known vulnerabilities in an AI system or its supporting infrastructure to cause harm.',
  'Functional insufficiencies': 'Limitations in the capability or coverage of an AI system that prevent it from fulfilling its intended function reliably.',
  'Generalisation issues': 'Failure of a model to perform well on data or tasks outside its training distribution, leading to poor real-world performance.',
  'Hardware limitations': 'Physical constraints of compute hardware (memory, latency, throughput) that limit AI system performance or deployment options.',
  'Inference attacks': 'Attacks that extract sensitive information about training data or model parameters by querying the model.',
  'Insufficient knowledge': 'Cases where the AI system lacks the domain knowledge needed to respond correctly or safely.',
  'Lack of transparency': 'Inability to explain or interpret how an AI system reached a particular output, reducing trust and auditability.',
  'Model instability': 'Sensitivity of model outputs to small perturbations in input, leading to unpredictable or inconsistent behaviour.',
  'Operational hazards': 'Risks arising from how an AI system is deployed and operated in real-world environments, including misuse and edge cases.',
  'Performance insufficiency': 'Failure to meet required accuracy, speed, or reliability standards for the intended use case.',
  'Poisoning attack': 'Injection of malicious data into training or fine-tuning pipelines to manipulate model behaviour at inference time.',
  'Privacy violation': 'Unauthorised disclosure or inference of personally identifiable or sensitive information from model outputs or training data.',
  'Resource limitations': 'Constraints on available data, compute, time, or expertise that limit the quality or safety of an AI system.',
  'Social and behavioral hazards': 'Risks arising from AI system influence on human behaviour, social norms, or interpersonal dynamics.',
  'System complexity': 'Risks that emerge from the interactions between many components in a large AI system, making behaviour hard to predict.',
  'System dependencies': 'Risks arising from reliance on external services, libraries, APIs, or data pipelines that may fail or change.',
  'Unfair behaviour': 'Outputs that systematically disadvantage certain groups due to biases in training data or model design.',
  'User experience': 'Risks arising from poor usability, unclear interfaces, or misalignment between AI outputs and user expectations.',
}

// ─── Concept definitions ───────────────────────────────────────────────────────
const CONCEPT_DEFS: Record<string, string> = {
  'Access control': 'Mechanisms that restrict who can interact with an AI system or its underlying data and infrastructure.',
  'Adversarial robustness': 'The ability of a model to maintain correct behaviour when inputs are intentionally perturbed to cause errors.',
  'Algorithm selection': 'The process of choosing appropriate machine learning algorithms for a given task and dataset.',
  'Anomaly detection': 'Methods for identifying inputs or outputs that deviate significantly from expected patterns.',
  'Data analysis': 'Techniques for examining datasets to extract insights, validate quality, and inform model design.',
  'Data augmentation': 'Methods for artificially expanding training data diversity through transformations or synthetic generation.',
  'Data collection': 'Processes for gathering data from various sources for AI system training or operation.',
  'Data enrichment': 'Adding supplementary information to existing datasets to improve model coverage and accuracy.',
  'Data governance': 'Policies and processes for managing data quality, lineage, access, and compliance.',
  'Data labelling': 'The process of annotating raw data with ground-truth labels for supervised learning.',
  'Data minimisation': 'Collecting and retaining only the minimum data necessary for the intended purpose.',
  'Data privacy': 'Protections that prevent unauthorised access to or inference of sensitive personal information from data.',
  'Data quality': 'Measures to ensure training and inference data is accurate, complete, consistent, and timely.',
  'Data sampling': 'Methods for selecting representative subsets of data for training, evaluation, or analysis.',
  'Fairness': 'Ensuring AI system outputs do not systematically disadvantage individuals based on protected characteristics.',
  'Human machine interface': 'The design of interactions between human operators and AI systems, including dashboards and controls.',
  'Human oversight': 'Mechanisms for humans to monitor, review, and intervene in AI system decisions.',
  'In-use monitoring': 'Continuous observation of AI system behaviour and performance during deployment.',
  'Interpretability': 'Methods that make AI decision-making processes understandable to humans.',
  'Model documentation': 'Structured records describing an AI model\'s design, training, intended use, and limitations.',
  'Model explanations': 'Techniques that provide human-understandable reasons for individual model predictions.',
  'Model testing': 'Evaluation of model behaviour against defined requirements before and during deployment.',
  'Model validation': 'Formal verification that a model meets its specifications across relevant conditions.',
  'Privacy by design': 'Embedding privacy protections into AI system architecture from the outset.',
  'Red teaming': 'Structured adversarial testing to identify vulnerabilities and failure modes in AI systems.',
  'Risk assessment': 'Systematic evaluation of potential harms, their likelihood, and severity across the AI lifecycle.',
  'Secure coding': 'Development practices that minimise security vulnerabilities in AI system software.',
  'Security testing': 'Evaluation of AI system resistance to attacks, misuse, and unauthorised access.',
  'Supply chain security': 'Measures to ensure the integrity and safety of third-party components used in AI systems.',
  'Transparency': 'Providing clear information about AI system capabilities, limitations, and decision-making processes.',
  'User training': 'Education and guidance for users on safe and effective interaction with AI systems.',
  'Workload scheduling': 'Management of computational tasks to optimise resource use and system performance.',
}

// ─── Colour palette ─────────────────────────────────────────────────────────
const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Adversarial attacks':           { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
  'Cognitive bias':                { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  'Computational resource':        { bg: '#EDE9FE', text: '#5B21B6', border: '#C4B5FD' },
  'Data quality issues':           { bg: '#FFF7ED', text: '#9A3412', border: '#FDBA74' },
  'Distribution shift':            { bg: '#F0FDF4', text: '#166534', border: '#86EFAC' },
  'Epistemic uncertainty':         { bg: '#EFF6FF', text: '#1D4ED8', border: '#93C5FD' },
  'Evasion attacks':               { bg: '#FDF4FF', text: '#86198F', border: '#E879F9' },
  'Exploitation attacks':          { bg: '#FFF1F2', text: '#9F1239', border: '#FDA4AF' },
  'Functional insufficiencies':    { bg: '#F8FAFC', text: '#334155', border: '#CBD5E1' },
  'Generalisation issues':         { bg: '#ECFDF5', text: '#065F46', border: '#6EE7B7' },
  'Hardware limitations':          { bg: '#F1F5F9', text: '#1E293B', border: '#94A3B8' },
  'Inference attacks':             { bg: '#FEF9C3', text: '#713F12', border: '#FDE047' },
  'Insufficient knowledge':        { bg: '#FDF2F8', text: '#9D174D', border: '#F9A8D4' },
  'Lack of transparency':          { bg: '#F5F3FF', text: '#4C1D95', border: '#DDD6FE' },
  'Model instability':             { bg: '#FFF8F1', text: '#7C2D12', border: '#FED7AA' },
  'Operational hazards':           { bg: '#F0F9FF', text: '#0C4A6E', border: '#7DD3FC' },
  'Performance insufficiency':     { bg: '#FFFBEB', text: '#78350F', border: '#FDE68A' },
  'Poisoning attack':              { bg: '#FEF2F2', text: '#7F1D1D', border: '#FCA5A5' },
  'Privacy violation':             { bg: '#EFF6FF', text: '#1E3A5F', border: '#BFDBFE' },
  'Resource limitations':          { bg: '#F3F4F6', text: '#111827', border: '#D1D5DB' },
  'Social and behavioral hazards': { bg: '#ECFDF5', text: '#14532D', border: '#A7F3D0' },
  'System complexity':             { bg: '#FAF5FF', text: '#581C87', border: '#D8B4FE' },
  'System dependencies':           { bg: '#FFF7ED', text: '#7C2D12', border: '#FDBA74' },
  'Unfair behaviour':              { bg: '#FEF3C7', text: '#78350F', border: '#FCD34D' },
  'User experience':               { bg: '#F0FDFA', text: '#134E4A', border: '#99F6E4' },
}

const ATTR_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'AI System': { bg: '#EEF2FF', text: '#3730A3', dot: '#4338CA' },
  'Data':      { bg: '#F0F9FF', text: '#0C4A6E', dot: '#0891B2' },
  'Model':     { bg: '#FAF5FF', text: '#581C87', dot: '#7C3AED' },
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function HazardsClient() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedHazard, setSelectedHazard] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [controlSearch, setControlSearch] = useState('')

  // Detail panels
  const [hazardDetail, setHazardDetail] = useState<typeof HAZARDS[0] | null>(null)
  const [controlDetail, setControlDetail] = useState<Control | null>(null)

  const filteredHazards = useMemo(() => {
    return HAZARDS.filter((h) => {
      const matchType = !selectedType || h.type === selectedType
      const q = search.toLowerCase()
      const matchSearch = !q || h.name.toLowerCase().includes(q) || (h.type ?? '').toLowerCase().includes(q)
      return matchType && matchSearch
    })
  }, [selectedType, search])

  const activeHazard = selectedHazard ? HAZARDS.find((h) => h.id === selectedHazard) : null

  // Controls for selected hazard, deduplicated by concept within attribute
  const controlsGrouped = useMemo(() => {
    if (!selectedHazard) return {}
    const ids = HAZARD_CONTROLS[selectedHazard] ?? []
    const controls = ids.map((id) => CONTROL_MAP[id]).filter(Boolean) as Control[]

    // Apply filter
    const filtered = controls.filter((c) => {
      if (!controlSearch) return true
      const q = controlSearch.toLowerCase()
      return (c.concept ?? '').toLowerCase().includes(q) ||
             (c.module ?? '').toLowerCase().includes(q) ||
             (c.component ?? '').toLowerCase().includes(q) ||
             (c.attribute ?? '').toLowerCase().includes(q)
    })

    // Group: attribute → concept → modules[]
    const grouped: Record<string, Record<string, Control[]>> = {}
    for (const c of filtered) {
      const attr = c.attribute ?? 'Other'
      const concept = c.concept ?? 'General'
      if (!grouped[attr]) grouped[attr] = {}
      if (!grouped[attr][concept]) grouped[attr][concept] = []
      grouped[attr][concept].push(c)
    }
    return grouped
  }, [selectedHazard, controlSearch])

  const totalControlCount = useMemo(() => {
    if (!selectedHazard) return 0
    // Count unique concepts (deduplicated view)
    return Object.values(controlsGrouped).reduce((sum, concepts) => sum + Object.keys(concepts).length, 0)
  }, [selectedHazard, controlsGrouped])

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
      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#1E1B4B' }}>Hazards &amp; Controls</h1>
        <p className="text-sm text-gray-600 max-w-3xl mb-2">
          An interactive mapping of AI system hazards to their corresponding controls and mitigations,
          drawn from a structured hazard taxonomy. Click any hazard or control for its definition.
        </p>
        {/* Crowdsourced note */}
        <div className="inline-flex items-start gap-2.5 px-4 py-3 rounded-xl border max-w-3xl"
          style={{ backgroundColor: '#FFFBEB', borderColor: '#FCD34D' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#D97706" className="flex-shrink-0 mt-0.5">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          <p className="text-xs text-amber-900 leading-relaxed">
            <strong>Community-driven mapping.</strong> The hazard-to-control mappings on this page are influenced by the requirements packages published on Sequel. As practitioners submit packages tagging specific hazards and controls, the mapping and reference counts below update to reflect collective real-world experience.
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex gap-6 mb-5 text-sm">
        {[
          { label: 'Hazard types', value: HAZARD_TYPES.length },
          { label: 'Hazards', value: HAZARDS.length },
          { label: 'Controls', value: CONTROLS.length },
          { label: 'Mappings', value: 793 },
        ].map((s) => (
          <div key={s.label}>
            <span className="text-xl font-bold" style={{ color: '#1E1B4B' }}>{s.value}</span>
            <span className="text-gray-400 ml-1 text-xs">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-5">
        {/* Left: Type filter */}
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
              {selectedType && <> · <span className="font-medium text-gray-600">{selectedType}</span></>}
            </p>
            <div className="space-y-1 max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
              {filteredHazards.map((h) => {
                const col = TYPE_COLORS[h.type ?? ''] ?? { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' }
                const controlCount = (HAZARD_CONTROLS[h.id] ?? []).length
                const isSelected = selectedHazard === h.id
                return (
                  <div
                    key={h.id}
                    className="rounded-xl border transition-all"
                    style={isSelected
                      ? { borderColor: '#818CF8', backgroundColor: '#EEF2FF' }
                      : { borderColor: '#E5E7EB', backgroundColor: 'white' }
                    }
                  >
                    <button
                      onClick={() => setSelectedHazard(h.id)}
                      className="w-full text-left px-3 py-2.5"
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
                    {/* Info button */}
                    <div className="px-3 pb-2 -mt-1 flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); setHazardDetail(h); setControlDetail(null) }}
                        className="text-xs text-indigo-500 hover:text-indigo-700 flex items-center gap-1"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                        </svg>
                        Definition
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right: Controls or definition panel */}
        <div className="flex-1 min-w-0">

          {/* Hazard definition panel */}
          {hazardDetail && (
            <div className="mb-4 border border-indigo-200 rounded-xl p-5 bg-indigo-50">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-indigo-400">{hazardDetail.id}</span>
                    {hazardDetail.type && (
                      <span className="text-xs px-2 py-0.5 rounded-full border font-medium"
                        style={{ ...(TYPE_COLORS[hazardDetail.type] ?? {}), backgroundColor: (TYPE_COLORS[hazardDetail.type] ?? { bg: '#F3F4F6' }).bg, borderColor: (TYPE_COLORS[hazardDetail.type] ?? { border: '#D1D5DB' }).border }}>
                        {hazardDetail.type}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{hazardDetail.name}</h3>
                  {hazardDetail.type && HAZARD_TYPE_DEFS[hazardDetail.type] && (
                    <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Type: </span>{HAZARD_TYPE_DEFS[hazardDetail.type]}</p>
                  )}
                </div>
                <button onClick={() => setHazardDetail(null)} className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-4">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
              </div>
            </div>
          )}

          {/* Control definition panel */}
          {controlDetail && (
            <div className="mb-4 border border-purple-200 rounded-xl p-5 bg-purple-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-purple-400">{controlDetail.id}</span>
                    {controlDetail.attribute && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: (ATTR_COLORS[controlDetail.attribute] ?? { bg: '#F3F4F6' }).bg, color: (ATTR_COLORS[controlDetail.attribute] ?? { text: '#374151' }).text }}>
                        {controlDetail.attribute}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{controlDetail.concept}</h3>
                  {controlDetail.module && (
                    <p className="text-sm text-gray-600 mb-0.5"><span className="font-medium">Module: </span>{controlDetail.module}</p>
                  )}
                  {controlDetail.component && (
                    <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Component: </span>{controlDetail.component}</p>
                  )}
                  {controlDetail.concept && CONCEPT_DEFS[controlDetail.concept] && (
                    <p className="text-sm text-gray-500 mt-2 pt-2 border-t border-purple-200">{CONCEPT_DEFS[controlDetail.concept]}</p>
                  )}
                  {/* Package reference counter */}
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                    <span>Referenced by <strong className="text-gray-600">0</strong> requirements packages — grows as practitioners submit packages tagging this control</span>
                  </div>
                </div>
                <button onClick={() => setControlDetail(null)} className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-4">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
              </div>
            </div>
          )}

          {!activeHazard ? (
            <div className="flex flex-col items-center justify-center py-24 text-center text-gray-400">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="mb-3 opacity-30">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              <p className="text-sm">Select a hazard to see its controls</p>
              <p className="text-xs mt-1 text-gray-300">Click the Definition link on any hazard for its description</p>
            </div>
          ) : (
            <div>
              {/* Hazard header */}
              <div className="border border-gray-200 rounded-xl p-5 mb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-400">{activeHazard.id}</span>
                      {activeHazard.type && (
                        <span className="text-xs px-2 py-0.5 rounded-full border font-medium"
                          style={{ backgroundColor: (TYPE_COLORS[activeHazard.type] ?? { bg: '#F3F4F6' }).bg, color: (TYPE_COLORS[activeHazard.type] ?? { text: '#374151' }).text, borderColor: (TYPE_COLORS[activeHazard.type] ?? { border: '#D1D5DB' }).border }}>
                          {activeHazard.type}
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">{activeHazard.name}</h2>
                    {activeHazard.type && HAZARD_TYPE_DEFS[activeHazard.type] && (
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">{HAZARD_TYPE_DEFS[activeHazard.type]}</p>
                    )}
                  </div>
                  <button
                    onClick={() => { setHazardDetail(activeHazard); setControlDetail(null) }}
                    className="flex-shrink-0 text-xs text-indigo-500 hover:text-indigo-700 flex items-center gap-1 px-2 py-1 rounded-lg border border-indigo-200 hover:bg-indigo-50"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    Definition
                  </button>
                </div>
                <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
                  <span><strong className="text-gray-900">{(HAZARD_CONTROLS[activeHazard.id] ?? []).length}</strong> raw mappings</span>
                  <span><strong className="text-gray-900">{totalControlCount}</strong> unique controls</span>
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

              {Object.keys(controlsGrouped).length === 0 ? (
                <div className="text-center py-10 text-sm text-gray-400">
                  {(HAZARD_CONTROLS[activeHazard.id] ?? []).length === 0
                    ? 'No controls mapped to this hazard yet.'
                    : 'No controls match your filter.'}
                </div>
              ) : (
                <div className="space-y-5">
                  {Object.entries(controlsGrouped).map(([attr, concepts]) => {
                    const attrStyle = ATTR_COLORS[attr] ?? { bg: '#F3F4F6', text: '#374151', dot: '#6B7280' }
                    return (
                      <div key={attr}>
                        {/* Attribute header */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: attrStyle.dot }} />
                          <span className="text-xs font-bold uppercase tracking-wider"
                            style={{ color: attrStyle.dot }}>
                            {attr}
                          </span>
                          <span className="text-xs text-gray-400">
                            {Object.keys(concepts).length} control{Object.keys(concepts).length !== 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* Concept cards — one per concept, with modules listed inside */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {Object.entries(concepts).map(([concept, controls]) => {
                            // Use the first control for the ID (for clicking)
                            const primaryControl = controls[0]
                            const hasModules = controls.some(c => c.module)
                            return (
                              <div
                                key={concept}
                                className="border border-gray-200 rounded-xl px-4 py-3 bg-white hover:border-indigo-200 transition-colors cursor-pointer"
                                onClick={() => { setControlDetail(primaryControl); setHazardDetail(null) }}
                              >
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <div className="flex-1 min-w-0">
                                    <span className="text-xs font-mono text-gray-400">{primaryControl.id}</span>
                                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{concept}</p>
                                  </div>
                                  <div className="flex items-center gap-1.5 flex-shrink-0">
                                    {controls.length > 1 && (
                                      <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                                        style={{ backgroundColor: attrStyle.bg, color: attrStyle.dot }}>
                                        {controls.length}
                                      </span>
                                    )}
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#9CA3AF">
                                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                                    </svg>
                                  </div>
                                </div>

                                {/* Sub-modules as compact pills */}
                                {hasModules && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {controls.map((c, i) => (
                                      c.module && (
                                        <span key={i} className="text-xs px-2 py-0.5 rounded-md border"
                                          style={{ backgroundColor: attrStyle.bg, color: attrStyle.text, borderColor: 'transparent' }}>
                                          {c.component ?? c.module}
                                        </span>
                                      )
                                    ))}
                                  </div>
                                )}

                                {/* Package reference count */}
                                <div className="mt-2 flex items-center gap-1 text-xs text-gray-300">
                                  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                                  0 packages reference this mapping
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
