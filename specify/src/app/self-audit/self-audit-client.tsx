'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { AUDIT_CATEGORIES, type RiskCategory } from '@/lib/scenarios-data'

// ─── Types ────────────────────────────────────────────────────────────────────
type AlignmentLevel = 'Fully Allow' | 'Conditional' | 'Restricted' | 'Prohibited'
type SortCriteria = 'confirmations' | 'complexity' | 'explicitness' | 'risk'

interface AttackConfig {
  turn: string | null
  language: string | null
  injection: string | null
  misalignment: string | null
  perturbation: string | null
}

// ─── Source badge colours ─────────────────────────────────────────────────────
const SOURCE_COLORS: Record<string, { bg: string; text: string }> = {
  'WMDP':             { bg: '#FEF3C7', text: '#92400E' },
  'HarmBench':        { bg: '#FEE2E2', text: '#991B1B' },
  'SafeScience':      { bg: '#F0FDF4', text: '#166534' },
  'AgentHarm':        { bg: '#EDE9FE', text: '#5B21B6' },
  'MH-Crisis':        { bg: '#FDF2F8', text: '#9D174D' },
  'Gretel':           { bg: '#EFF6FF', text: '#1D4ED8' },
  'INTIMA':           { bg: '#FFF7ED', text: '#9A3412' },
  'SocialHarm Bench': { bg: '#F0FDF4', text: '#065F46' },
  'PentestEval':      { bg: '#F8FAFC', text: '#334155' },
  'DarkBench':        { bg: '#1F2937', text: '#F9FAFB' },
  'FORTRESS':         { bg: '#FEF9C3', text: '#713F12' },
  'Aegis':            { bg: '#FAF5FF', text: '#581C87' },
}

const RISK_LINKS: Record<string, string> = {
  'Harmful Knowledge Uplift':          '/risk-repository',
  'Autonomous Harmful Action':         '/risk-repository',
  'Cyber Capability Uplift':           '/risk-repository',
  'Security':                          '/risk-repository',
  'Inadvertent Discrimination':        '/risk-repository',
  'Privacy Violation':                 '/risk-repository',
  'Mental Health':                     '/risk-repository',
  'Opaque Decision-Making':            '/risk-repository',
  'Manipulation & Mass Influence':     '/risk-repository',
  'IP & Confidentiality':              '/risk-repository',
  'Fraud & Social Engineering':        '/risk-repository',
  'Misinformation':                    '/risk-repository',
  'Persuasion':                        '/risk-repository',
  'Content Safety — Harmful Content':  '/risk-repository',
  'Content Safety — Illicit Behaviour':'/risk-repository',
}

// ─── Alignment domains ───────────────────────────────────────────────────────
const ALIGNMENT_DOMAINS = [
  { id: 'creative',   label: 'Creative & fiction writing',   desc: 'Stories, roleplay, fictional scenarios including dark themes' },
  { id: 'medical',    label: 'Medical & health information', desc: 'Clinical guidance, drug interactions, procedures, diagnoses' },
  { id: 'legal',      label: 'Legal advice',                 desc: 'Legal strategies, case analysis, regulatory interpretation' },
  { id: 'security',   label: 'Cybersecurity & hacking',      desc: 'Vulnerability research, exploitation techniques, pen testing' },
  { id: 'political',  label: 'Political & controversial',    desc: 'Political opinions, divisive topics, persuasion, propaganda' },
  { id: 'privacy',    label: 'Privacy & personal data',      desc: 'PII handling, surveillance methods, data extraction' },
  { id: 'cbrn',       label: 'CBRN / hazardous materials',   desc: 'Chemical, biological, radiological, nuclear subject matter' },
  { id: 'selfharm',   label: 'Self-harm & suicide',          desc: 'Content involving self-harm methods or suicide planning' },
  { id: 'violence',   label: 'Violence & graphic content',   desc: 'Explicit violence, graphic harm, torture descriptions' },
  { id: 'financial',  label: 'Financial & investment advice', desc: 'Trading strategies, financial recommendations, market calls' },
  { id: 'adult',      label: 'Adult / sexual content',        desc: 'Explicit sexual content and scenarios involving adults' },
  { id: 'misinfo',    label: 'Misinformation & fake news',   desc: 'Generating false claims, conspiracy content, propaganda' },
]

const ALIGNMENT_LEVELS: AlignmentLevel[] = ['Fully Allow', 'Conditional', 'Restricted', 'Prohibited']

const LEVEL_COLORS: Record<AlignmentLevel, { bg: string; text: string; border: string }> = {
  'Fully Allow':  { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
  'Conditional':  { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  'Restricted':   { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
  'Prohibited':   { bg: '#1F2937', text: '#F9FAFB', border: '#374151' },
}

// Mocked community aggregate data
const COMMUNITY_ALIGNMENT: Record<string, Record<AlignmentLevel, number>> = {
  creative:   { 'Fully Allow': 312, 'Conditional': 189, 'Restricted': 45, 'Prohibited': 12 },
  medical:    { 'Fully Allow': 89,  'Conditional': 287, 'Restricted': 152, 'Prohibited': 31 },
  legal:      { 'Fully Allow': 104, 'Conditional': 241, 'Restricted': 98, 'Prohibited': 22 },
  security:   { 'Fully Allow': 38,  'Conditional': 156, 'Restricted': 218, 'Prohibited': 147 },
  political:  { 'Fully Allow': 67,  'Conditional': 193, 'Restricted': 145, 'Prohibited': 88 },
  privacy:    { 'Fully Allow': 29,  'Conditional': 112, 'Restricted': 241, 'Prohibited': 176 },
  cbrn:       { 'Fully Allow': 11,  'Conditional': 34,  'Restricted': 87, 'Prohibited': 425 },
  selfharm:   { 'Fully Allow': 8,   'Conditional': 47,  'Restricted': 122, 'Prohibited': 381 },
  violence:   { 'Fully Allow': 22,  'Conditional': 98,  'Restricted': 187, 'Prohibited': 251 },
  financial:  { 'Fully Allow': 78,  'Conditional': 294, 'Restricted': 133, 'Prohibited': 29 },
  adult:      { 'Fully Allow': 44,  'Conditional': 83,  'Restricted': 174, 'Prohibited': 257 },
  misinfo:    { 'Fully Allow': 15,  'Conditional': 61,  'Restricted': 148, 'Prohibited': 334 },
}

const DEFAULT_ALIGNMENT: Record<string, AlignmentLevel> = {
  creative: 'Conditional', medical: 'Conditional', legal: 'Conditional',
  security: 'Restricted', political: 'Restricted', privacy: 'Restricted',
  cbrn: 'Prohibited', selfharm: 'Prohibited', violence: 'Restricted',
  financial: 'Conditional', adult: 'Restricted', misinfo: 'Prohibited',
}

// ─── Attack strategies ───────────────────────────────────────────────────────
const ATTACK_STRATEGY_DEFS: Record<keyof AttackConfig, {
  label: string; icon: string; groups: Record<string, string[]>
}> = {
  turn: {
    label: 'Turn structure', icon: '🔄',
    groups: {
      'Single turn': ['Direct request', 'Indirect via tool/document'],
      'Multi-turn': ['Progressive escalation', 'Role establish → attack', 'Distraction then pivot', 'Persona maintenance'],
    }
  },
  language: {
    label: 'Language', icon: '🌐',
    groups: {
      'Natural language': ['English', 'Spanish', 'French', 'Mandarin', 'Arabic', 'Russian', 'Hindi', 'Portuguese'],
      'Code-switching': ['English + Spanish', 'English + Mandarin', 'English + Arabic'],
      'Obfuscated': ['Transliterated', 'Reversed text', 'Base64 encoded', 'Leetspeak'],
    }
  },
  injection: {
    label: 'Prompt injection', icon: '💉',
    groups: {
      'Direct injection': ['Role override', 'Jailbreak template (DAN)', 'Token manipulation', 'Context override'],
      'Indirect injection': ['Document-embedded', 'Web content injection', 'Code comment injection'],
      'Stored injection': ['Database field injection', 'Tool output injection'],
    }
  },
  misalignment: {
    label: 'Content/intent misalignment', icon: '🎭',
    groups: {
      'Framing': ['Educational', 'Research / academic', 'Hypothetical', 'Fictional / narrative', 'Professional / legal'],
      'Roleplay': ['Character persona', 'System role assumption', 'Emotional manipulation'],
      'Dual-use': ['Benign surface + harmful intent', 'Partial information request'],
    }
  },
  perturbation: {
    label: 'Perturbation', icon: '🔀',
    groups: {
      'Character-level': ['Typos / misspellings', 'Leetspeak substitution', 'Unicode lookalikes', 'Invisible characters'],
      'Word-level': ['Synonym substitution', 'Paraphrase', 'Split words'],
      'Semantic': ['Abstract rephrasing', 'Metaphorical encoding', 'Euphemism substitution'],
      'Structural': ['Whitespace injection', 'Markdown abuse', 'Nested quotes'],
    }
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function downloadDataset(format: 'csv' | 'json') {
  const rows: object[] = []
  for (const cat of AUDIT_CATEGORIES) {
    for (const vec of cat.vectors) {
      for (let i = 0; i < vec.samples.length; i++) {
        const s = vec.samples[i]
        rows.push({
          category_id: cat.id, category: cat.shortName, threat_vector: vec.name, sample_index: i,
          prompt: s.text, source: s.source ?? '', quality_rating: s.quality ?? '',
          complexity: null, explicitness: null, risk: null,
        })
      }
    }
  }
  if (format === 'json') {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'specify-self-audit-dataset.json'; a.click()
    URL.revokeObjectURL(url)
  } else {
    const headers = Object.keys(rows[0] as object)
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const csv = [headers.join(','), ...rows.map(r => headers.map(h => esc((r as Record<string, unknown>)[h])).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'specify-self-audit-dataset.csv'; a.click()
    URL.revokeObjectURL(url)
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function SourceBadge({ source }: { source: string | null }) {
  if (!source) return null
  const col = SOURCE_COLORS[source] ?? { bg: '#F3F4F6', text: '#374151' }
  return (
    <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
      style={{ backgroundColor: col.bg, color: col.text }}>{source}</span>
  )
}

function QualityDots({ quality }: { quality: number | null }) {
  if (!quality) return null
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: i <= quality ? '#4338CA' : '#E5E7EB' }} />
      ))}
    </div>
  )
}

function CriteriaPips({ value, color, label }: { value: number | null; color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-400 w-16">{label}</span>
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="w-2 h-2 rounded-sm"
            style={{ backgroundColor: value !== null && i <= value ? color : '#E5E7EB' }} />
        ))}
      </div>
      <span className="text-xs ml-0.5" style={{ color: value !== null ? '#374151' : '#9CA3AF' }}>
        {value !== null ? `${value}/5` : '—'}
      </span>
    </div>
  )
}

// ─── Alignment panel ─────────────────────────────────────────────────────────
function AlignmentPanel({ prefs, onChange }: {
  prefs: Record<string, AlignmentLevel>
  onChange: (domain: string, level: AlignmentLevel) => void
}) {
  const [savedMsg, setSavedMsg] = useState(false)

  function save() {
    try { localStorage.setItem('specifyAlignmentPrefs', JSON.stringify(prefs)) } catch { /* ignore */ }
    setSavedMsg(true)
    setTimeout(() => setSavedMsg(false), 2000)
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-gray-900">Model alignment parameters</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Configure how the model should respond across different risk domains.
            Compare your preferences to the aggregated community view.
          </p>
        </div>
        <button onClick={save}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          style={{ backgroundColor: savedMsg ? '#D1FAE5' : '#1E1B4B', color: savedMsg ? '#065F46' : 'white' }}
        >
          {savedMsg ? '✓ Saved' : 'Save preferences'}
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="text-xs text-gray-400 font-medium">Response policy:</span>
        {ALIGNMENT_LEVELS.map(level => {
          const col = LEVEL_COLORS[level]
          return (
            <span key={level} className="text-xs px-2.5 py-1 rounded-full font-semibold border"
              style={{ backgroundColor: col.bg, color: col.text, borderColor: col.border }}>
              {level}
            </span>
          )
        })}
      </div>

      <div className="space-y-4">
        {ALIGNMENT_DOMAINS.map(domain => {
          const communityData = COMMUNITY_ALIGNMENT[domain.id] ?? {}
          const totalVotes = Object.values(communityData).reduce((a, b) => a + b, 0)
          const myPref = prefs[domain.id] ?? 'Conditional'

          return (
            <div key={domain.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-6">
                {/* Domain info */}
                <div className="w-56 flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-900 leading-snug">{domain.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">{domain.desc}</p>
                </div>

                {/* My preference */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Your preference</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {ALIGNMENT_LEVELS.map(level => {
                      const col = LEVEL_COLORS[level]
                      const active = myPref === level
                      return (
                        <button key={level} onClick={() => onChange(domain.id, level)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                          style={active
                            ? { backgroundColor: col.bg, color: col.text, borderColor: col.border, boxShadow: '0 0 0 2px ' + col.border }
                            : { backgroundColor: 'white', color: '#9CA3AF', borderColor: '#E5E7EB' }
                          }
                        >
                          {level}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Community aggregate */}
                <div className="w-64 flex-shrink-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Community ({totalVotes.toLocaleString()} responses)
                  </p>
                  <div className="space-y-1">
                    {ALIGNMENT_LEVELS.map(level => {
                      const count = communityData[level] ?? 0
                      const pct = totalVotes > 0 ? (count / totalVotes) * 100 : 0
                      const col = LEVEL_COLORS[level]
                      return (
                        <div key={level} className="flex items-center gap-2">
                          <span className="text-xs w-20 text-gray-500 text-right">{level}</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all"
                              style={{ width: `${pct}%`, backgroundColor: col.border }} />
                          </div>
                          <span className="text-xs text-gray-500 w-8">{Math.round(pct)}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Attack builder ───────────────────────────────────────────────────────────
function AttackBuilder({
  basePrompt, config, onChange,
}: {
  basePrompt: string | null
  config: AttackConfig
  onChange: (key: keyof AttackConfig, value: string | null) => void
}) {
  const [expanded, setExpanded] = useState<Record<keyof AttackConfig, boolean>>({
    turn: true, language: false, injection: false, misalignment: false, perturbation: false,
  })

  const activeCount = Object.values(config).filter(Boolean).length

  return (
    <div className="border border-indigo-200 rounded-xl overflow-hidden mb-4" style={{ backgroundColor: '#FAFBFF' }}>
      <div className="px-4 py-3 flex items-center justify-between border-b border-indigo-100">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-indigo-900">⚡ Attack Builder</span>
          {activeCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ backgroundColor: '#EEF2FF', color: '#3730A3' }}>
              {activeCount} active
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={() => onChange('turn', null) || Object.keys(config).forEach(k => onChange(k as keyof AttackConfig, null))}
            className="text-xs text-red-500 hover:text-red-700 font-medium">
            Clear all
          </button>
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* Strategy selectors */}
        {(Object.keys(ATTACK_STRATEGY_DEFS) as (keyof AttackConfig)[]).map(key => {
          const def = ATTACK_STRATEGY_DEFS[key]
          const selected = config[key]
          const isOpen = expanded[key]
          return (
            <div key={key} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => setExpanded(prev => ({ ...prev, [key]: !prev[key] }))}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{def.icon}</span>
                  <span className="text-xs font-semibold text-gray-700">{def.label}</span>
                  {selected && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: '#EEF2FF', color: '#3730A3' }}>
                      {selected}
                    </span>
                  )}
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#9CA3AF"
                  className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>
              {isOpen && (
                <div className="px-3 pb-3 border-t border-gray-100 pt-2 space-y-2">
                  {Object.entries(def.groups).map(([group, options]) => (
                    <div key={group}>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">{group}</p>
                      <div className="flex flex-wrap gap-1">
                        {options.map(opt => {
                          const active = selected === opt
                          return (
                            <button key={opt}
                              onClick={() => onChange(key, active ? null : opt)}
                              className="px-2 py-1 rounded-md text-xs border transition-all"
                              style={active
                                ? { backgroundColor: '#EEF2FF', color: '#3730A3', borderColor: '#818CF8' }
                                : { backgroundColor: 'white', color: '#6B7280', borderColor: '#E5E7EB' }
                              }
                            >
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                  {selected && (
                    <button onClick={() => onChange(key, null)}
                      className="text-xs text-red-400 hover:text-red-600 mt-1">
                      × Clear {def.label.toLowerCase()}
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {/* Selected combination + augmented prompt */}
        {activeCount > 0 && (
          <div className="mt-3 space-y-3">
            <div className="border border-gray-200 rounded-lg p-3 bg-white">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Base prompt</p>
              {basePrompt ? (
                <p className="text-xs text-gray-700 leading-relaxed line-clamp-4">{basePrompt}</p>
              ) : (
                <p className="text-xs text-gray-400 italic">Click a sample below to set the base prompt</p>
              )}
            </div>
            <div className="border border-dashed border-indigo-200 rounded-lg p-3"
              style={{ backgroundColor: '#F5F7FF' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Augmented variant</p>
                <div className="flex flex-wrap gap-1">
                  {(Object.entries(config) as [keyof AttackConfig, string | null][])
                    .filter(([, v]) => v !== null)
                    .map(([k, v]) => (
                      <span key={k} className="text-xs px-1.5 py-0.5 rounded font-medium"
                        style={{ backgroundColor: '#EEF2FF', color: '#3730A3' }}>
                        {ATTACK_STRATEGY_DEFS[k].icon} {v}
                      </span>
                    ))}
                </div>
              </div>
              <p className="text-xs text-indigo-400 italic">
                Augmented prompts will be populated with precomputed values.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Submit form ──────────────────────────────────────────────────────────────
function SubmitForm() {
  const { data: session } = useSession()
  const [mode, setMode] = useState<'url' | 'prompt'>('prompt')
  const [url, setUrl] = useState('')
  const [prompt, setPrompt] = useState('')
  const [attribution, setAttribution] = useState('')
  const [category, setCategory] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: wire to API
    setSubmitted(true)
    setTimeout(() => { setSubmitted(false); setPrompt(''); setUrl(''); setAttribution('') }, 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="border border-amber-200 rounded-xl p-4 mb-5"
      style={{ backgroundColor: '#FFFBEB' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-amber-600">📤</span>
          <span className="text-sm font-bold text-amber-900">Contribute test samples</span>
          <span className="text-xs text-amber-600">— attribution provided</span>
        </div>
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
        {mode === 'prompt' ? (
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} required rows={2}
            placeholder="Enter a test prompt to contribute to the dataset…"
            className="border border-amber-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-amber-400 bg-white" />
        ) : (
          <input type="url" value={url} onChange={e => setUrl(e.target.value)} required
            placeholder="https://… (CSV or JSON with prompt column)"
            className="border border-amber-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white" />
        )}
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="border border-amber-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-amber-400">
          <option value="">Category (optional)</option>
          {AUDIT_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.shortName}</option>)}
        </select>
        <input value={attribution} onChange={e => setAttribution(e.target.value)}
          placeholder={session?.user?.name ?? 'Your name / org'}
          className="border border-amber-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white" />
      </div>

      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-amber-700">
          Submissions are reviewed before being added. You&apos;ll be credited as a contributor.
        </p>
        <button type="submit"
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex-shrink-0"
          style={submitted ? { backgroundColor: '#D1FAE5', color: '#065F46' } : { backgroundColor: '#92400E', color: 'white' }}>
          {submitted ? '✓ Submitted!' : 'Submit'}
        </button>
      </div>
    </form>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function SelfAuditClient() {
  const { data: session } = useSession()

  // Dataset navigation
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedVectorName, setSelectedVectorName] = useState<string | null>(null)
  const [sourceFilter, setSourceFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [showDownload, setShowDownload] = useState(false)

  // Quality voting
  const [qualityCounts, setQualityCounts] = useState<Record<string, number>>({})
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set())
  const [votingKey, setVotingKey] = useState<string | null>(null)

  // Criteria filters
  const [minComplexity, setMinComplexity] = useState(0)
  const [minExplicitness, setMinExplicitness] = useState(0)
  const [minRisk, setMinRisk] = useState(0)
  const [sortBy, setSortBy] = useState<SortCriteria>('confirmations')

  // Attack builder
  const [attackBase, setAttackBase] = useState<string | null>(null)
  const [attackConfig, setAttackConfig] = useState<AttackConfig>({
    turn: null, language: null, injection: null, misalignment: null, perturbation: null,
  })

  // Alignment preferences
  const [alignmentOpen, setAlignmentOpen] = useState(true)
  const [alignmentPrefs, setAlignmentPrefs] = useState<Record<string, AlignmentLevel>>(DEFAULT_ALIGNMENT)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('specifyAlignmentPrefs')
      if (saved) setAlignmentPrefs({ ...DEFAULT_ALIGNMENT, ...JSON.parse(saved) })
    } catch { /* ignore */ }
  }, [])

  const selectedCategory = useMemo(
    () => AUDIT_CATEGORIES.find(c => c.id === selectedCategoryId) ?? null,
    [selectedCategoryId]
  )
  const selectedVector = useMemo(
    () => selectedCategory?.vectors.find(v => v.name === selectedVectorName) ?? null,
    [selectedCategory, selectedVectorName]
  )

  const fetchQuality = useCallback(async (categoryId: string, vectorName: string) => {
    try {
      const res = await fetch(`/api/prompt-quality?categoryId=${encodeURIComponent(categoryId)}&vectorName=${encodeURIComponent(vectorName)}`)
      if (!res.ok) return
      const data = await res.json()
      setQualityCounts(prev => ({ ...prev, ...data.counts }))
      setUserVotes(prev => {
        const next = new Set(prev)
        for (const k of data.userVotes) next.add(k)
        return next
      })
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    if (selectedCategoryId && selectedVectorName) fetchQuality(selectedCategoryId, selectedVectorName)
  }, [selectedCategoryId, selectedVectorName, fetchQuality])

  async function toggleVote(promptKey: string) {
    if (!session) return
    setVotingKey(promptKey)
    try {
      const res = await fetch('/api/prompt-quality', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptKey }),
      })
      if (!res.ok) return
      const data = await res.json()
      setUserVotes(prev => {
        const next = new Set(prev)
        if (data.action === 'added') next.add(promptKey)
        else next.delete(promptKey)
        return next
      })
      setQualityCounts(prev => ({
        ...prev,
        [promptKey]: (prev[promptKey] ?? 0) + (data.action === 'added' ? 1 : -1),
      }))
    } finally { setVotingKey(null) }
  }

  const availableSources = useMemo(() => {
    if (!selectedCategory) return []
    const srcs = new Set<string>()
    for (const v of selectedCategory.vectors)
      for (const s of v.samples) { if (s.source) srcs.add(s.source) }
    return Array.from(srcs).sort()
  }, [selectedCategory])

  const samplesWithKeys = useMemo(() => {
    if (!selectedVector || !selectedCategoryId) return []
    return selectedVector.samples.map((s, i) => {
      const key = `${selectedCategoryId}:::${selectedVectorName}:::${i}`
      return {
        ...s,
        promptKey: key,
        confirmations: qualityCounts[key] ?? 0,
        // Criteria — null until precomputed values are provided
        complexity: null as number | null,
        explicitness: null as number | null,
        risk: null as number | null,
      }
    })
  }, [selectedVector, selectedCategoryId, selectedVectorName, qualityCounts])

  const filteredSamples = useMemo(() => {
    const base = samplesWithKeys.filter(s => {
      const matchSource = sourceFilter === 'ALL' || s.source === sourceFilter
      const q = search.toLowerCase()
      if (!matchSource || (q && !s.text.toLowerCase().includes(q))) return false
      if (s.complexity !== null && s.complexity < minComplexity) return false
      if (s.explicitness !== null && s.explicitness < minExplicitness) return false
      if (s.risk !== null && s.risk < minRisk) return false
      return true
    })
    return [...base].sort((a, b) => {
      if (sortBy === 'complexity')    return (b.complexity ?? -1) - (a.complexity ?? -1)
      if (sortBy === 'explicitness')  return (b.explicitness ?? -1) - (a.explicitness ?? -1)
      if (sortBy === 'risk')          return (b.risk ?? -1) - (a.risk ?? -1)
      return b.confirmations - a.confirmations
    })
  }, [samplesWithKeys, sourceFilter, search, minComplexity, minExplicitness, minRisk, sortBy])

  const categoryTotal = selectedCategory
    ? selectedCategory.vectors.reduce((s, v) => s + v.samples.length, 0) : 0

  const totalSamples = AUDIT_CATEGORIES.reduce(
    (s, c) => s + c.vectors.reduce((vs, v) => vs + v.samples.length, 0), 0
  )

  function handleCategorySelect(cat: RiskCategory) {
    setSelectedCategoryId(cat.id)
    setSelectedVectorName(null)
    setSourceFilter('ALL')
    setSearch('')
  }

  function copyToClipboard(text: string, idx: number) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 1500)
    })
  }

  function updateAttackConfig(key: keyof AttackConfig, value: string | null) {
    setAttackConfig(prev => ({ ...prev, [key]: value }))
  }

  function clearAttack() {
    setAttackConfig({ turn: null, language: null, injection: null, misalignment: null, perturbation: null })
    setAttackBase(null)
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">

      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#1E1B4B' }}>Self Audit</h1>
          <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">
            Test your AI system against curated risk scenarios. Configure alignment preferences,
            apply attack strategies to augment samples, and contribute new test inputs.
          </p>
          <div className="flex gap-4 mt-2 text-xs text-gray-400">
            <span><strong className="text-gray-700">{AUDIT_CATEGORIES.length}</strong> risk categories</span>
            <span><strong className="text-gray-700">{AUDIT_CATEGORIES.reduce((s, c) => s + c.vectors.length, 0)}</strong> threat vectors</span>
            <span><strong className="text-gray-700">{totalSamples.toLocaleString()}</strong> test samples</span>
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setShowDownload(s => !s)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: '#1E1B4B', color: 'white' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Download dataset
          </button>
          {showDownload && (
            <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-10">
              <button onClick={() => { downloadDataset('csv'); setShowDownload(false) }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <span className="text-green-600 text-xs font-bold">CSV</span> Download CSV
              </button>
              <button onClick={() => { downloadDataset('json'); setShowDownload(false) }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <span className="text-blue-600 text-xs font-bold">JSON</span> Download JSON
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Model alignment parameters ─────────────────────────────────────── */}
      <div className="border border-indigo-200 rounded-2xl overflow-hidden mb-5" style={{ backgroundColor: '#FAFBFF' }}>
        <button
          onClick={() => setAlignmentOpen(s => !s)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-indigo-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-lg flex-shrink-0">⚙️</span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-indigo-900">Model Alignment Parameters</p>
              <p className="text-xs text-indigo-500 mt-0.5">
                Configure response policies across risk domains · compare to community preferences
              </p>
            </div>
            {/* Mini colour strip of current prefs */}
            <div className="flex gap-1 ml-4 flex-wrap flex-shrink-0">
              {ALIGNMENT_DOMAINS.map(domain => {
                const level = alignmentPrefs[domain.id] ?? 'Conditional'
                const col = LEVEL_COLORS[level]
                return (
                  <span key={domain.id} className="w-2 h-2 rounded-full border"
                    title={`${domain.label}: ${level}`}
                    style={{ backgroundColor: col.bg, borderColor: col.border }} />
                )
              })}
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#6366F1"
            className={`transition-transform flex-shrink-0 ml-3 ${alignmentOpen ? 'rotate-180' : ''}`}>
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </button>
        {alignmentOpen && (
          <div className="border-t border-indigo-100 px-5">
            <AlignmentPanel prefs={alignmentPrefs} onChange={(domain, level) => {
              setAlignmentPrefs(prev => ({ ...prev, [domain]: level }))
            }} />
          </div>
        )}
      </div>

      {/* ── Submit test samples (always visible) ─────────────────────────── */}
      <SubmitForm />

      {/* ── Dataset explorer ─────────────────────────────────────────────── */}
      <div className="flex gap-5">

        {/* Left: categories */}
        <div className="w-56 flex-shrink-0">
          <div className="sticky top-16">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Risk category</p>
            <div className="space-y-1">
              {AUDIT_CATEGORIES.map(cat => {
                const total = cat.vectors.reduce((s, v) => s + v.samples.length, 0)
                const isActive = selectedCategoryId === cat.id
                return (
                  <button key={cat.id} onClick={() => handleCategorySelect(cat)}
                    className="w-full text-left px-3 py-2 rounded-xl border text-xs transition-all"
                    style={isActive
                      ? { borderColor: '#818CF8', backgroundColor: '#EEF2FF', color: '#3730A3', fontWeight: 600 }
                      : { borderColor: '#E5E7EB', backgroundColor: 'white', color: '#374151' }}>
                    <div className="flex items-start justify-between gap-1">
                      <span className="leading-snug flex-1">{cat.shortName}</span>
                      <span className="flex-shrink-0 font-bold" style={{ color: isActive ? '#3730A3' : '#9CA3AF' }}>{total}</span>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: isActive ? '#6366F1' : '#9CA3AF' }}>
                      {cat.vectors.length} vector{cat.vectors.length !== 1 ? 's' : ''}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Middle: threat vectors */}
        <div className="w-60 flex-shrink-0">
          {!selectedCategory ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="mb-2 opacity-20">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              <p className="text-sm">Select a risk category</p>
            </div>
          ) : (
            <div className="sticky top-16">
              <div className="mb-3 p-3 rounded-xl border border-gray-200 bg-gray-50">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">Selected</p>
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{selectedCategory.shortName}</p>
                  </div>
                  <Link href={RISK_LINKS[selectedCategory.shortName] ?? '/risk-repository'}
                    className="flex-shrink-0 text-xs text-indigo-600 hover:underline flex items-center gap-1 mt-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
                    Risk repo
                  </Link>
                </div>
                <div className="flex gap-3 mt-2 text-xs text-gray-400">
                  <span><strong className="text-gray-700">{categoryTotal}</strong> samples</span>
                  <span><strong className="text-gray-700">{selectedCategory.vectors.length}</strong> vectors</span>
                </div>
              </div>

              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Threat vectors</p>
              <div className="space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
                {selectedCategory.vectors.map(v => {
                  const count = v.samples.length
                  const isSelected = selectedVectorName === v.name
                  return (
                    <button key={v.name}
                      onClick={() => { setSelectedVectorName(v.name); setSourceFilter('ALL'); setSearch('') }}
                      className="w-full text-left px-3 py-2.5 rounded-xl border transition-all"
                      style={isSelected
                        ? { borderColor: '#818CF8', backgroundColor: '#EEF2FF' }
                        : { borderColor: '#E5E7EB', backgroundColor: 'white' }}>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium text-gray-900 leading-snug flex-1">{v.name}</p>
                        <span className="flex-shrink-0 text-xs font-bold px-1.5 py-0.5 rounded-full"
                          style={count > 0
                            ? { backgroundColor: '#EEF2FF', color: '#3730A3' }
                            : { backgroundColor: '#F3F4F6', color: '#9CA3AF' }}>
                          {count}
                        </span>
                      </div>
                      {count === 0 && <p className="text-xs text-gray-400 mt-0.5 italic">No samples yet</p>}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: attack builder + samples */}
        <div className="flex-1 min-w-0">
          {!selectedVector ? (
            <div className="flex flex-col items-center justify-center py-24 text-center text-gray-400">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="mb-3 opacity-20">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
              <p className="text-sm">Select a threat vector to browse test inputs</p>
            </div>
          ) : (
            <div>
              {/* Vector header */}
              <div className="border border-gray-200 rounded-xl p-4 mb-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Threat vector</p>
                    <h2 className="text-sm font-semibold text-gray-900 mb-1">{selectedVector.name}</h2>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span><strong className="text-gray-900">{selectedVector.samples.length}</strong> samples</span>
                      {!session && (
                        <span className="text-gray-400">
                          <a href="/auth/signin" className="text-indigo-600 hover:underline">Sign in</a> to vote and contribute
                        </span>
                      )}
                    </div>
                  </div>
                  {Object.values(attackConfig).some(Boolean) && (
                    <button onClick={clearAttack}
                      className="text-xs text-red-400 hover:text-red-600 font-medium flex-shrink-0">
                      Reset attack
                    </button>
                  )}
                </div>
              </div>

              {/* Attack builder — always visible */}
              <AttackBuilder basePrompt={attackBase} config={attackConfig} onChange={updateAttackConfig} />

              {selectedVector.samples.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl text-gray-400">
                  <p className="text-sm font-medium">No test samples for this vector yet</p>
                  <p className="text-xs mt-1">Check back as the dataset grows, or contribute one above.</p>
                </div>
              ) : (
                <>
                  {/* Filters + sort */}
                  <div className="border border-gray-200 rounded-xl p-3 mb-3 space-y-3">
                    <div className="flex gap-2 flex-wrap">
                      <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search samples…"
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400 flex-1 min-w-0" />
                      <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-indigo-400">
                        <option value="ALL">All sources</option>
                        {availableSources.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    {/* Criteria filters */}
                    <div className="grid grid-cols-3 gap-3 pt-1 border-t border-gray-100">
                      {([
                        { key: 'minComplexity',   label: 'Min complexity',   color: '#6366F1', val: minComplexity,   set: setMinComplexity },
                        { key: 'minExplicitness', label: 'Min explicitness', color: '#F59E0B', val: minExplicitness, set: setMinExplicitness },
                        { key: 'minRisk',         label: 'Min risk',         color: '#EF4444', val: minRisk,         set: setMinRisk },
                      ] as { key: string; label: string; color: string; val: number; set: (n: number) => void }[]).map(f => (
                        <div key={f.key}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">{f.label}</span>
                            <span className="text-xs font-semibold" style={{ color: f.color }}>
                              {f.val > 0 ? `≥ ${f.val}` : 'Any'}
                            </span>
                          </div>
                          <input type="range" min={0} max={5} value={f.val}
                            onChange={e => f.set(Number(e.target.value))}
                            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                            style={{ accentColor: f.color }} />
                          <div className="flex justify-between text-xs text-gray-300 mt-0.5">
                            <span>0</span><span>5</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                      <span className="text-xs text-gray-400">Sort by:</span>
                      {([
                        { v: 'confirmations', label: 'Quality votes' },
                        { v: 'complexity',    label: 'Complexity' },
                        { v: 'explicitness',  label: 'Explicitness' },
                        { v: 'risk',          label: 'Risk' },
                      ] as { v: SortCriteria; label: string }[]).map(opt => (
                        <button key={opt.v} onClick={() => setSortBy(opt.v)}
                          className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors"
                          style={sortBy === opt.v
                            ? { backgroundColor: '#1E1B4B', color: 'white' }
                            : { backgroundColor: 'transparent', color: '#9CA3AF' }}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mb-3">
                    Showing <strong className="text-gray-700">{filteredSamples.length}</strong> of {selectedVector.samples.length} samples
                    · sorted by <strong className="text-gray-700">{sortBy}</strong>
                  </p>

                  {/* Sample cards */}
                  <div className="space-y-2">
                    {filteredSamples.map((sample, idx) => {
                      const hasVoted = userVotes.has(sample.promptKey)
                      const isVoting = votingKey === sample.promptKey
                      const isAttackBase = attackBase === sample.text
                      return (
                        <div key={idx} className="border rounded-xl p-4 bg-white transition-all"
                          style={{ borderColor: isAttackBase ? '#818CF8' : sample.confirmations > 0 ? '#C7D2FE' : '#E5E7EB' }}>
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm text-gray-800 leading-relaxed flex-1">{sample.text}</p>
                            <div className="flex flex-col gap-1.5 flex-shrink-0">
                              <button onClick={() => copyToClipboard(sample.text, idx)}
                                className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                                title="Copy prompt">
                                {copiedIdx === idx ? (
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#16A34A"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                                ) : (
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#9CA3AF"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                                )}
                              </button>
                              <button
                                onClick={() => setAttackBase(isAttackBase ? null : sample.text)}
                                className="p-1.5 rounded-md border transition-colors"
                                title="Set as attack base prompt"
                                style={isAttackBase
                                  ? { borderColor: '#818CF8', backgroundColor: '#EEF2FF' }
                                  : { borderColor: '#E5E7EB', backgroundColor: 'white' }}>
                                <span className="text-xs">⚡</span>
                              </button>
                            </div>
                          </div>

                          {/* Criteria */}
                          <div className="mt-3 grid grid-cols-3 gap-2 pb-3 border-b border-gray-100">
                            <CriteriaPips value={sample.complexity}   color="#6366F1" label="Complexity" />
                            <CriteriaPips value={sample.explicitness} color="#F59E0B" label="Explicit" />
                            <CriteriaPips value={sample.risk}         color="#EF4444" label="Risk" />
                          </div>

                          <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                            <div className="flex items-center gap-3">
                              <SourceBadge source={sample.source} />
                              {sample.quality !== null && (
                                <div className="flex items-center gap-1.5">
                                  <QualityDots quality={sample.quality} />
                                  <span className="text-xs text-gray-400">{sample.quality}/5</span>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => session ? toggleVote(sample.promptKey) : undefined}
                              disabled={isVoting || !session}
                              title={session ? (hasVoted ? 'Remove quality confirmation' : 'Confirm prompt quality') : 'Sign in to confirm'}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all disabled:opacity-50"
                              style={hasVoted
                                ? { backgroundColor: '#EEF2FF', borderColor: '#818CF8', color: '#3730A3' }
                                : { backgroundColor: 'white', borderColor: '#E5E7EB', color: '#6B7280' }
                              }>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                              </svg>
                              {isVoting ? '…' : sample.confirmations > 0 ? `${sample.confirmations} confirmed` : 'Confirm quality'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
