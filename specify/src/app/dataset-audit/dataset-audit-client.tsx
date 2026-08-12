'use client'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type DataModality = 'text' | 'image' | 'video' | 'audio'

interface DatasetItem {
  id: string
  filename: string
  modality: DataModality
  content: string
  size: number
}

interface AnnotationTemplate {
  id: string
  name: string
  description: string
  prompt: string
  modalities: DataModality[]
}

interface AnnotationConfig {
  id: string
  templateId: string
  customPrompt: string
  label: string
}

interface ItemAnnotation {
  itemId: string
  label: string
  result: string
  confidence: number
  humanVerdict: 'confirmed' | 'denied' | null
}

interface AuditRun {
  id: string
  startedAt: string
  totalItems: number
  scannedItems: number
  annotations: ItemAnnotation[]
  status: 'running' | 'complete' | 'error'
}

interface RunConfig {
  coveragePct: number
  provider: 'openrouter' | 'groq'
  modelId: string
  apiKey: string
  annotations: AnnotationConfig[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MODALITY_ICONS: Record<DataModality, string> = {
  text: '📄',
  image: '🖼️',
  video: '🎬',
  audio: '🎵',
}

const ANNOTATION_TEMPLATES: AnnotationTemplate[] = [
  {
    id: 'pii',
    name: 'PII Detection',
    description: 'Detects personally identifiable information',
    modalities: ['text', 'image'],
    prompt: `Analyze the following content for personally identifiable information (PII). PII includes: names, email addresses, phone numbers, physical addresses, social security numbers, dates of birth, financial account numbers, passport/ID numbers, IP addresses, and biometric identifiers.\n\nRespond with a JSON object: { "detected": true/false, "types": ["list of PII types found"], "severity": "low/medium/high", "summary": "brief description" }`,
  },
  {
    id: 'content_safety',
    name: 'Content Safety',
    description: 'Flags hate speech, violence, adult content',
    modalities: ['text', 'image', 'video', 'audio'],
    prompt: `Analyze the following content for safety violations. Check for: hate speech, explicit violence, adult/sexual content, self-harm content, harassment, and dangerous instructions.\n\nRespond with a JSON object: { "violation": true/false, "categories": ["list of violation categories"], "severity": "low/medium/high/critical", "summary": "brief description" }`,
  },
  {
    id: 'cbrn',
    name: 'CBRN Detection',
    description: 'Chemical, biological, radiological, nuclear content',
    modalities: ['text'],
    prompt: `Analyze the following content for information related to chemical, biological, radiological, or nuclear (CBRN) materials, synthesis, weaponization, or attack methods.\n\nRespond with a JSON object: { "detected": true/false, "cbrn_type": "chemical/biological/radiological/nuclear/none", "risk_level": "low/medium/high/critical", "summary": "brief description" }`,
  },
  {
    id: 'bias',
    name: 'Bias & Fairness',
    description: 'Identifies demographic bias or stereotypes',
    modalities: ['text', 'image'],
    prompt: `Analyze the following content for demographic bias, stereotypes, or unfair representations related to race, gender, age, religion, nationality, disability, or sexual orientation.\n\nRespond with a JSON object: { "bias_detected": true/false, "bias_types": ["list of bias categories"], "severity": "low/medium/high", "summary": "brief description" }`,
  },
  {
    id: 'misinformation',
    name: 'Misinformation',
    description: 'Flags potentially false or misleading claims',
    modalities: ['text'],
    prompt: `Analyze the following content for potential misinformation, false claims, conspiracy theories, or deliberately misleading information.\n\nRespond with a JSON object: { "flagged": true/false, "claim_types": ["list of flagged claim types"], "confidence": "low/medium/high", "summary": "brief description" }`,
  },
]

const OPENROUTER_MODELS = [
  { id: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B' },
  { id: 'anthropic/claude-3.5-haiku', label: 'Claude 3.5 Haiku' },
  { id: 'google/gemini-2.0-flash-001', label: 'Gemini 2.0 Flash' },
  { id: 'meta-llama/llama-3.2-90b-vision-instruct', label: 'Llama 3.2 90B Vision' },
]

const GROQ_MODELS = [
  { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B' },
  { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B' },
]

const DEFAULT_RUN_CONFIG: RunConfig = {
  coveragePct: 100,
  provider: 'openrouter',
  modelId: 'meta-llama/llama-3.3-70b-instruct',
  apiKey: '',
  annotations: [
    { id: '1', templateId: 'content_safety', customPrompt: '', label: 'Content Safety' },
  ],
}

const BRAND = '#1E1B4B'
const BRAND_LIGHT = '#EEF0FB'
const PAGE_SIZE = 20

// ─── Helpers ──────────────────────────────────────────────────────────────────

function wilsonCI(k: number, n: number, z = 1.96): [number, number] {
  if (n === 0) return [0, 1]
  const p = k / n
  const denom = 1 + (z * z) / n
  const centre = (p + (z * z) / (2 * n)) / denom
  const margin =
    (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / denom
  return [Math.max(0, centre - margin), Math.min(1, centre + margin)]
}

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function detectModality(filename: string): DataModality {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext))
    return 'image'
  if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)) return 'video'
  if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(ext)) return 'audio'
  return 'text'
}

function parseAnnotationResult(result: string): {
  flagged: boolean
  summary: string
  raw: Record<string, unknown>
} {
  try {
    const match = result.match(/\{[\s\S]*\}/)
    if (match) {
      const obj = JSON.parse(match[0]) as Record<string, unknown>
      const flagged = Boolean(
        obj.detected || obj.violation || obj.flagged || obj.bias_detected
      )
      const summary = (obj.summary as string) ?? result.slice(0, 120)
      return { flagged, summary, raw: obj }
    }
  } catch {
    /**/
  }
  return { flagged: false, summary: result.slice(0, 120), raw: {} }
}

function fmt(n: number, digits = 0) {
  return (n * 100).toFixed(digits) + '%'
}

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / (1024 * 1024)).toFixed(1)} MB`
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ value, max, color = BRAND }: { value: number; max: number; color?: string }) {
  const pct = max === 0 ? 0 : Math.min(100, (value / max) * 100)
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
      <div
        className="h-2 rounded-full transition-all duration-300"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  )
}

function Badge({ children, variant = 'neutral' }: { children: React.ReactNode; variant?: 'neutral' | 'danger' | 'success' | 'warn' }) {
  const styles: Record<string, string> = {
    neutral: 'bg-gray-100 text-gray-600',
    danger: 'bg-red-100 text-red-700',
    success: 'bg-green-100 text-green-700',
    warn: 'bg-amber-100 text-amber-700',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DatasetAuditClient() {
  const [items, setItems] = useState<DatasetItem[]>([])
  const [runConfig, setRunConfig] = useState<RunConfig>(() => {
    if (typeof window === 'undefined') return DEFAULT_RUN_CONFIG
    try {
      const saved = localStorage.getItem('specifyDatasetAuditConfig')
      return saved ? { ...DEFAULT_RUN_CONFIG, ...JSON.parse(saved) } : DEFAULT_RUN_CONFIG
    } catch {
      return DEFAULT_RUN_CONFIG
    }
  })
  const [activeRun, setActiveRun] = useState<AuditRun | null>(null)
  const [runs, setRuns] = useState<AuditRun[]>([])
  const [activeTab, setActiveTab] = useState<'upload' | 'configure' | 'results' | 'review'>('upload')
  const [filterLabel, setFilterLabel] = useState<string | null>(null)
  const [runProgress, setRunProgress] = useState<{ done: number; total: number } | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)
  const [reviewPage, setReviewPage] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const cancelRef = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Persist config to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('specifyDatasetAuditConfig', JSON.stringify(runConfig))
    } catch {
      /**/
    }
  }, [runConfig])

  // ── File upload handler ──────────────────────────────────────────────────

  const handleFiles = useCallback(async (fileList: FileList) => {
    const newItems: DatasetItem[] = []
    for (const file of Array.from(fileList)) {
      const modality = detectModality(file.name)
      const content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        if (modality === 'text') {
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsText(file)
        } else {
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        }
      })
      newItems.push({
        id: uid(),
        filename: file.name,
        modality,
        content,
        size: file.size,
      })
    }
    setItems(prev => [...prev, ...newItems])
  }, [])

  // ── Run audit ────────────────────────────────────────────────────────────

  async function startRun() {
    const shuffled = [...items].sort(() => Math.random() - 0.5)
    const toScan = shuffled.slice(0, Math.ceil((items.length * runConfig.coveragePct) / 100))
    cancelRef.current = false

    const run: AuditRun = {
      id: uid(),
      startedAt: new Date().toISOString(),
      totalItems: items.length,
      scannedItems: toScan.length,
      annotations: [],
      status: 'running',
    }
    setActiveRun(run)
    setActiveTab('results')

    let done = 0
    for (const item of toScan) {
      if (cancelRef.current) break
      for (const annConfig of runConfig.annotations) {
        const template = ANNOTATION_TEMPLATES.find(t => t.id === annConfig.templateId)
        const prompt =
          annConfig.templateId === 'custom'
            ? annConfig.customPrompt
            : (template?.prompt ?? '')
        try {
          const res = await fetch('/api/annotate-dataset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              item: {
                content: item.content,
                modality: item.modality,
                filename: item.filename,
              },
              annotationPrompt: prompt,
              provider: runConfig.provider,
              modelId: runConfig.modelId,
              apiKey: runConfig.apiKey,
            }),
          })
          const data = await res.json()
          run.annotations.push({
            itemId: item.id,
            label: annConfig.label,
            result: data.result ?? '',
            confidence: data.confidence ?? 0.8,
            humanVerdict: null,
          })
          setActiveRun({ ...run, annotations: [...run.annotations] })
        } catch {
          /**/
        }
      }
      done++
      setRunProgress({ done, total: toScan.length })
    }

    const completed = { ...run, status: 'complete' as const }
    setActiveRun(completed)
    setRuns(prev => [completed, ...prev])
    setRunProgress(null)
  }

  // ── Human verdict ────────────────────────────────────────────────────────

  function setVerdict(itemId: string, label: string, verdict: 'confirmed' | 'denied') {
    setActiveRun(prev => {
      if (!prev) return prev
      return {
        ...prev,
        annotations: prev.annotations.map(a =>
          a.itemId === itemId && a.label === label ? { ...a, humanVerdict: verdict } : a
        ),
      }
    })
  }

  // ── Derived data ─────────────────────────────────────────────────────────

  const uniqueLabels = useMemo(() => {
    if (!activeRun) return []
    return [...new Set(activeRun.annotations.map(a => a.label))]
  }, [activeRun])

  const canRun =
    items.length > 0 &&
    !!runConfig.apiKey &&
    runConfig.annotations.length > 0 &&
    (!activeRun || activeRun.status !== 'running')

  const models =
    runConfig.provider === 'openrouter' ? OPENROUTER_MODELS : GROQ_MODELS

  // When provider changes, reset to first available model
  function handleProviderChange(provider: 'openrouter' | 'groq') {
    const firstModel =
      provider === 'openrouter' ? OPENROUTER_MODELS[0].id : GROQ_MODELS[0].id
    setRunConfig(prev => ({ ...prev, provider, modelId: firstModel }))
  }

  // ── Annotation config helpers ────────────────────────────────────────────

  function addAnnotation() {
    setRunConfig(prev => ({
      ...prev,
      annotations: [
        ...prev.annotations,
        { id: uid(), templateId: 'content_safety', customPrompt: '', label: 'Content Safety' },
      ],
    }))
  }

  function removeAnnotation(id: string) {
    setRunConfig(prev => ({
      ...prev,
      annotations: prev.annotations.filter(a => a.id !== id),
    }))
  }

  function updateAnnotation(id: string, patch: Partial<AnnotationConfig>) {
    setRunConfig(prev => ({
      ...prev,
      annotations: prev.annotations.map(a => (a.id === id ? { ...a, ...patch } : a)),
    }))
  }

  function handleTemplateChange(id: string, templateId: string) {
    const template = ANNOTATION_TEMPLATES.find(t => t.id === templateId)
    updateAnnotation(id, {
      templateId,
      label: template?.name ?? 'Custom',
      customPrompt: '',
    })
  }

  // ── Drag-and-drop handlers ───────────────────────────────────────────────

  function onDragEnter(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }
  function onDragLeave(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }
  function onDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
  }
  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files)
  }

  // ── Review tab data ──────────────────────────────────────────────────────

  const reviewItems = useMemo(() => {
    if (!activeRun) return []
    const filtered = filterLabel
      ? activeRun.annotations.filter(a => a.label === filterLabel)
      : activeRun.annotations
    return filtered
  }, [activeRun, filterLabel])

  const reviewPageItems = useMemo(() => {
    const start = reviewPage * PAGE_SIZE
    return reviewItems.slice(start, start + PAGE_SIZE)
  }, [reviewItems, reviewPage])

  const totalReviewPages = Math.ceil(reviewItems.length / PAGE_SIZE)

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: BRAND }}>
          Dataset Audit
        </h1>
        <p className="text-sm text-gray-600 max-w-2xl">
          Upload a dataset, configure AI annotation strategies, and review results with
          human-in-the-loop verification and confidence intervals.
        </p>
        {items.length > 0 && (
          <div className="flex gap-4 mt-2 text-xs text-gray-400 flex-wrap">
            <span>
              <strong className="text-gray-700">{items.length}</strong> items loaded
            </span>
            {(['text', 'image', 'video', 'audio'] as DataModality[]).map(m => {
              const count = items.filter(i => i.modality === m).length
              return count > 0 ? (
                <span key={m}>
                  {MODALITY_ICONS[m]}{' '}
                  <strong className="text-gray-700">{count}</strong> {m}
                </span>
              ) : null
            })}
          </div>
        )}
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-6 flex-wrap">
        {(['upload', 'configure', 'results', 'review'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px capitalize"
            style={
              activeTab === tab
                ? { color: BRAND, borderColor: BRAND }
                : { color: '#6B7280', borderColor: 'transparent' }
            }
          >
            {tab === 'upload'
              ? `📁 Upload${items.length > 0 ? ` (${items.length})` : ''}`
              : tab === 'configure'
              ? '⚙️ Configure'
              : tab === 'results'
              ? `📊 Results${activeRun ? ` (${activeRun.annotations.length})` : ''}`
              : '👁 Review'}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* UPLOAD TAB                                                          */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          {/* Drop zone */}
          <div
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            className="rounded-xl border-2 border-dashed transition-colors p-12 text-center cursor-pointer"
            style={{
              borderColor: dragActive ? BRAND : '#D1D5DB',
              backgroundColor: dragActive ? BRAND_LIGHT : '#FAFAFA',
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-4xl mb-3">📂</div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Drop files here or click to browse
            </p>
            <p className="text-xs text-gray-400">
              Supports text, images (JPG/PNG/WebP/GIF), video (MP4/WebM), audio (MP3/WAV)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".txt,.md,.csv,.json,.jsonl,.xml,.html,.py,.js,.ts,.jpg,.jpeg,.png,.gif,.webp,.svg,.bmp,.mp4,.webm,.mov,.avi,.mkv,.mp3,.wav,.ogg,.flac,.m4a"
              className="hidden"
              onChange={e => {
                if (e.target.files) handleFiles(e.target.files)
                e.target.value = ''
              }}
            />
          </div>

          {/* Item list */}
          {items.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-700">
                  Loaded items ({items.length})
                </h2>
                <button
                  onClick={() => setItems([])}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        File
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Type
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Size
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Preview
                      </th>
                      <th className="px-4 py-2.5" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2.5 font-medium text-gray-800 max-w-[200px] truncate">
                          {item.filename}
                        </td>
                        <td className="px-4 py-2.5">
                          <Badge>
                            {MODALITY_ICONS[item.modality]} {item.modality}
                          </Badge>
                        </td>
                        <td className="px-4 py-2.5 text-gray-500 text-xs">
                          {fmtBytes(item.size)}
                        </td>
                        <td className="px-4 py-2.5 text-gray-400 text-xs max-w-[300px] truncate font-mono">
                          {item.modality === 'text'
                            ? item.content.slice(0, 80).replace(/\s+/g, ' ')
                            : item.modality === 'image'
                            ? '[image data]'
                            : `[${item.modality} file]`}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <button
                            onClick={() =>
                              setItems(prev => prev.filter(i => i.id !== item.id))
                            }
                            className="text-gray-300 hover:text-red-500 transition-colors text-sm"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setActiveTab('configure')}
                  className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: BRAND }}
                >
                  Configure audit →
                </button>
              </div>
            </div>
          )}

          {items.length === 0 && (
            <div className="text-center py-4 text-xs text-gray-400">
              No items loaded yet. Drop files above to get started.
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* CONFIGURE TAB                                                       */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'configure' && (
        <div className="space-y-6 max-w-3xl">
          {/* Model config */}
          <section className="rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold mb-4" style={{ color: BRAND }}>
              Model Configuration
            </h2>
            {/* Provider */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Provider
              </label>
              <div className="flex gap-3">
                {(['openrouter', 'groq'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => handleProviderChange(p)}
                    className="px-4 py-2 rounded-lg text-sm font-medium border transition-all"
                    style={
                      runConfig.provider === p
                        ? { backgroundColor: BRAND, color: '#fff', borderColor: BRAND }
                        : {
                            backgroundColor: '#fff',
                            color: '#374151',
                            borderColor: '#D1D5DB',
                          }
                    }
                  >
                    {p === 'openrouter' ? 'OpenRouter' : 'Groq'}
                  </button>
                ))}
              </div>
            </div>
            {/* Model */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Model
              </label>
              <select
                value={runConfig.modelId}
                onChange={e =>
                  setRunConfig(prev => ({ ...prev, modelId: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                {models.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            {/* API Key */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={runConfig.apiKey}
                  onChange={e =>
                    setRunConfig(prev => ({ ...prev, apiKey: e.target.value }))
                  }
                  placeholder={`Enter your ${runConfig.provider === 'openrouter' ? 'OpenRouter' : 'Groq'} API key`}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-12 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 font-mono"
                />
                <button
                  onClick={() => setShowApiKey(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  {showApiKey ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Keys are stored in localStorage and never sent to Sequel servers.
              </p>
            </div>
          </section>

          {/* Coverage */}
          <section className="rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold mb-4" style={{ color: BRAND }}>
              Coverage
            </h2>
            <div className="flex gap-2 flex-wrap mb-3">
              {[25, 50, 75, 100].map(pct => (
                <button
                  key={pct}
                  onClick={() => setRunConfig(prev => ({ ...prev, coveragePct: pct }))}
                  className="px-4 py-2 rounded-lg text-sm font-medium border transition-all"
                  style={
                    runConfig.coveragePct === pct
                      ? { backgroundColor: BRAND, color: '#fff', borderColor: BRAND }
                      : {
                          backgroundColor: '#fff',
                          color: '#374151',
                          borderColor: '#D1D5DB',
                        }
                  }
                >
                  {pct}%
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Will scan{' '}
              <strong className="text-gray-700">
                {Math.ceil((items.length * runConfig.coveragePct) / 100)}
              </strong>{' '}
              of <strong className="text-gray-700">{items.length}</strong> items
              {items.length === 0 && ' (upload items first)'}
            </p>
          </section>

          {/* Annotations */}
          <section className="rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold mb-4" style={{ color: BRAND }}>
              Annotation Strategies
            </h2>
            <div className="space-y-4">
              {runConfig.annotations.map(ann => (
                <div
                  key={ann.id}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-4 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2 flex-wrap">
                        <div className="flex-1 min-w-[160px]">
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Template
                          </label>
                          <select
                            value={ann.templateId}
                            onChange={e =>
                              handleTemplateChange(ann.id, e.target.value)
                            }
                            className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                          >
                            {ANNOTATION_TEMPLATES.map(t => (
                              <option key={t.id} value={t.id}>
                                {t.name}
                              </option>
                            ))}
                            <option value="custom">Custom</option>
                          </select>
                        </div>
                        <div className="flex-1 min-w-[120px]">
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Label
                          </label>
                          <input
                            type="text"
                            value={ann.label}
                            onChange={e =>
                              updateAnnotation(ann.id, { label: e.target.value })
                            }
                            className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                          />
                        </div>
                      </div>
                      {ann.templateId !== 'custom' && (
                        <p className="text-xs text-gray-400">
                          {ANNOTATION_TEMPLATES.find(t => t.id === ann.templateId)
                            ?.description}
                        </p>
                      )}
                      {ann.templateId === 'custom' && (
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Custom prompt
                          </label>
                          <textarea
                            value={ann.customPrompt}
                            onChange={e =>
                              updateAnnotation(ann.id, { customPrompt: e.target.value })
                            }
                            rows={4}
                            placeholder="Write your annotation prompt. Ask the model to respond with JSON containing a summary field."
                            className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 font-mono resize-y"
                          />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeAnnotation(ann.id)}
                      className="mt-5 text-gray-300 hover:text-red-500 transition-colors text-sm shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addAnnotation}
              className="mt-3 text-sm font-medium transition-colors"
              style={{ color: BRAND }}
            >
              + Add annotation
            </button>
          </section>

          {/* Run button */}
          <div className="space-y-3">
            {runProgress && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Running…</span>
                  <span>
                    {runProgress.done} / {runProgress.total}
                  </span>
                </div>
                <ProgressBar value={runProgress.done} max={runProgress.total} />
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={startRun}
                disabled={!canRun}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-40"
                style={{ backgroundColor: BRAND }}
              >
                {activeRun?.status === 'running' ? '⏳ Running…' : '▶ Run Audit'}
              </button>
              {activeRun?.status === 'running' && (
                <button
                  onClick={() => {
                    cancelRef.current = true
                  }}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
            {!runConfig.apiKey && (
              <p className="text-xs text-amber-600">
                ⚠ Enter an API key above to enable the run.
              </p>
            )}
            {items.length === 0 && (
              <p className="text-xs text-amber-600">
                ⚠ Upload items first before running.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* RESULTS TAB                                                         */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          {!activeRun ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-sm">No audit run yet.</p>
              <button
                onClick={() => setActiveTab('configure')}
                className="mt-4 text-sm font-medium transition-colors"
                style={{ color: BRAND }}
              >
                Configure and run an audit →
              </button>
            </div>
          ) : (
            <>
              {/* Run summary */}
              <div className="rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-800 mb-1">
                      Audit Run
                    </h2>
                    <p className="text-xs text-gray-500">
                      {activeRun.scannedItems} of {activeRun.totalItems} items scanned
                      &middot; {activeRun.annotations.length} annotations generated
                      &middot;{' '}
                      <span className="font-medium">
                        {new Date(activeRun.startedAt).toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <Badge
                    variant={
                      activeRun.status === 'running'
                        ? 'warn'
                        : activeRun.status === 'complete'
                        ? 'success'
                        : 'danger'
                    }
                  >
                    {activeRun.status === 'running'
                      ? '⏳ Running'
                      : activeRun.status === 'complete'
                      ? '✓ Complete'
                      : '✗ Error'}
                  </Badge>
                </div>
                {runProgress && (
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>
                        {runProgress.done} / {runProgress.total}
                      </span>
                    </div>
                    <ProgressBar value={runProgress.done} max={runProgress.total} />
                  </div>
                )}
              </div>

              {/* Per-label summary cards */}
              {uniqueLabels.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold text-gray-700">
                    Annotation Results
                  </h2>
                  {uniqueLabels.map(label => {
                    const labelAnns = activeRun.annotations.filter(
                      a => a.label === label
                    )
                    const total = labelAnns.length
                    const flagged = labelAnns.filter(
                      a => parseAnnotationResult(a.result).flagged
                    ).length
                    const flaggedPct = total === 0 ? 0 : flagged / total
                    const [ciLow, ciHigh] = wilsonCI(flagged, total)

                    const reviewed = labelAnns.filter(a => a.humanVerdict !== null)
                    const confirmed = labelAnns.filter(
                      a => a.humanVerdict === 'confirmed'
                    ).length
                    const denied = labelAnns.filter(
                      a => a.humanVerdict === 'denied'
                    ).length
                    const calRate =
                      reviewed.length === 0 ? null : confirmed / reviewed.length
                    const [calLow, calHigh] = wilsonCI(
                      confirmed,
                      reviewed.length
                    )

                    return (
                      <div
                        key={label}
                        className="rounded-xl border border-gray-200 p-5"
                      >
                        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-800">{label}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {total} annotations · {flagged} flagged
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setFilterLabel(label)
                              setReviewPage(0)
                              setActiveTab('review')
                            }}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:opacity-80"
                            style={{ color: BRAND, borderColor: BRAND }}
                          >
                            View samples
                          </button>
                        </div>

                        {/* Flag rate bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Flag rate</span>
                            <span className="font-medium text-gray-700">
                              {fmt(flaggedPct, 1)} ({flagged}/{total})
                            </span>
                          </div>
                          <div className="relative h-2 rounded-full overflow-hidden bg-gray-100">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${flaggedPct * 100}%`,
                                backgroundColor: flaggedPct > 0.3 ? '#DC2626' : BRAND,
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                            <span>
                              95% CI: [{fmt(ciLow, 1)}, {fmt(ciHigh, 1)}]
                            </span>
                          </div>
                        </div>

                        {/* Human calibration */}
                        {reviewed.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Human calibration</span>
                              <span className="font-medium text-gray-700">
                                {confirmed} confirmed · {denied} denied ·{' '}
                                {reviewed.length} reviewed
                              </span>
                            </div>
                            <div className="relative h-2 rounded-full overflow-hidden bg-gray-100">
                              <div
                                className="h-2 rounded-full bg-green-500"
                                style={{
                                  width: `${(calRate ?? 0) * 100}%`,
                                }}
                              />
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Agreement: {fmt(calRate ?? 0, 1)} · 95% CI: [
                              {fmt(calLow, 1)}, {fmt(calHigh, 1)}]
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Overall calibration summary */}
              {activeRun.annotations.some(a => a.humanVerdict !== null) && (
                <div
                  className="rounded-xl border p-5"
                  style={{ borderColor: BRAND_LIGHT, backgroundColor: BRAND_LIGHT }}
                >
                  <h2 className="text-sm font-semibold mb-3" style={{ color: BRAND }}>
                    Overall Calibration Summary
                  </h2>
                  {(() => {
                    const reviewed = activeRun.annotations.filter(
                      a => a.humanVerdict !== null
                    )
                    const confirmed = reviewed.filter(
                      a => a.humanVerdict === 'confirmed'
                    ).length
                    const [ciLow, ciHigh] = wilsonCI(confirmed, reviewed.length)
                    return (
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>
                          <strong>{reviewed.length}</strong> of{' '}
                          <strong>{activeRun.annotations.length}</strong> annotations
                          reviewed by a human.
                        </p>
                        <p>
                          Human agreement rate:{' '}
                          <strong>{fmt(confirmed / reviewed.length, 1)}</strong>
                        </p>
                        <p className="text-xs text-gray-500">
                          95% Wilson CI: [{fmt(ciLow, 1)}, {fmt(ciHigh, 1)}]
                        </p>
                      </div>
                    )
                  })()}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* REVIEW TAB                                                          */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'review' && (
        <div className="space-y-5">
          {!activeRun ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">👁</div>
              <p className="text-sm">Run an audit first to review annotations.</p>
            </div>
          ) : (
            <>
              {/* Filter buttons */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setFilterLabel(null)
                    setReviewPage(0)
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                  style={
                    filterLabel === null
                      ? { backgroundColor: BRAND, color: '#fff', borderColor: BRAND }
                      : { color: '#374151', borderColor: '#D1D5DB' }
                  }
                >
                  All ({activeRun.annotations.length})
                </button>
                {uniqueLabels.map(label => {
                  const count = activeRun.annotations.filter(
                    a => a.label === label
                  ).length
                  return (
                    <button
                      key={label}
                      onClick={() => {
                        setFilterLabel(label)
                        setReviewPage(0)
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                      style={
                        filterLabel === label
                          ? {
                              backgroundColor: BRAND,
                              color: '#fff',
                              borderColor: BRAND,
                            }
                          : { color: '#374151', borderColor: '#D1D5DB' }
                      }
                    >
                      {label} ({count})
                    </button>
                  )
                })}
              </div>

              {/* Annotation cards */}
              <div className="space-y-3">
                {reviewPageItems.length === 0 && (
                  <div className="text-center py-12 text-gray-400 text-sm">
                    No annotations match this filter.
                  </div>
                )}
                {reviewPageItems.map((ann, idx) => {
                  const item = items.find(i => i.id === ann.itemId)
                  const parsed = parseAnnotationResult(ann.result)
                  return (
                    <div
                      key={`${ann.itemId}-${ann.label}-${idx}`}
                      className="rounded-xl border border-gray-200 p-4"
                    >
                      <div className="flex items-start gap-3 flex-wrap">
                        {/* Item info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-lg">
                              {item ? MODALITY_ICONS[item.modality] : '📄'}
                            </span>
                            <span className="text-sm font-medium text-gray-800 truncate">
                              {item?.filename ?? ann.itemId}
                            </span>
                            <Badge>{ann.label}</Badge>
                            {parsed.flagged ? (
                              <Badge variant="danger">⚑ Flagged</Badge>
                            ) : (
                              <Badge variant="success">✓ Clean</Badge>
                            )}
                          </div>
                          {/* Content preview */}
                          {item && item.modality === 'text' && (
                            <p className="text-xs text-gray-500 font-mono bg-gray-50 rounded p-2 mb-2 line-clamp-2">
                              {item.content.slice(0, 200)}
                            </p>
                          )}
                          {item && item.modality === 'image' && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.content}
                              alt={item.filename}
                              className="h-20 w-auto rounded border border-gray-200 mb-2 object-cover"
                            />
                          )}
                          {/* Annotation result */}
                          <p className="text-xs text-gray-600">{parsed.summary}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Confidence: {Math.round(ann.confidence * 100)}%
                          </p>
                        </div>

                        {/* Human verdict */}
                        <div className="flex flex-col gap-2 items-end shrink-0">
                          {ann.humanVerdict ? (
                            <div className="text-xs font-medium">
                              {ann.humanVerdict === 'confirmed' ? (
                                <Badge variant="success">✓ Confirmed</Badge>
                              ) : (
                                <Badge variant="danger">✗ Denied</Badge>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400">Awaiting review</p>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                setVerdict(ann.itemId, ann.label, 'confirmed')
                              }
                              className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                              style={
                                ann.humanVerdict === 'confirmed'
                                  ? {
                                      backgroundColor: '#16A34A',
                                      color: '#fff',
                                      borderColor: '#16A34A',
                                    }
                                  : {
                                      color: '#16A34A',
                                      borderColor: '#16A34A',
                                    }
                              }
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() =>
                                setVerdict(ann.itemId, ann.label, 'denied')
                              }
                              className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                              style={
                                ann.humanVerdict === 'denied'
                                  ? {
                                      backgroundColor: '#DC2626',
                                      color: '#fff',
                                      borderColor: '#DC2626',
                                    }
                                  : {
                                      color: '#DC2626',
                                      borderColor: '#DC2626',
                                    }
                              }
                            >
                              Deny
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination */}
              {totalReviewPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <button
                    disabled={reviewPage === 0}
                    onClick={() => setReviewPage(p => p - 1)}
                    className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  >
                    ← Previous
                  </button>
                  <span className="text-xs text-gray-500">
                    Page {reviewPage + 1} of {totalReviewPages}
                  </span>
                  <button
                    disabled={reviewPage >= totalReviewPages - 1}
                    onClick={() => setReviewPage(p => p + 1)}
                    className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
