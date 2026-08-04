'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { KnowledgeGraph } from './knowledge-graph'
import { HAZARDS, HAZARD_CONTROLS, CONTROL_MAP } from '@/lib/hazards-data'

// ─── Types ─────────────────────────────────────────────────────────────────────
interface RiskVersion {
  id: string
  version: string
  label: string | null
  notes: string | null
  createdAt: string
  _count?: { risks: number }
}

interface Risk {
  id: string
  riskNum: number
  category: string
  title: string
  description: string
  versionId: string
  _count?: { votes: number; comments: number }
  voteAvg: number | null
  voteCount: number
}

interface VoteData {
  distribution: Record<string, number>
  count: number
  mean: number
  median: number
  q1: number
  q3: number
  userVote: number | null
}

interface Comment {
  id: string
  body: string
  createdAt: string
  user: { id: string; name: string | null; username: string | null; image: string | null }
}

interface DiffResult {
  added: Risk[]
  removed: Risk[]
  modified: { before: Risk; after: Risk }[]
  unchanged: number
}

type SortMode = 'severity-desc' | 'severity-asc' | 'votes-desc' | 'alpha' | 'risknum'
type MitigationStatus = 'unmitigated' | 'partial' | 'mitigated'

// ─── Category colours ──────────────────────────────────────────────────────────
const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Harmful Knowledge & Capability Uplift': { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  'Autonomous & Agentic Harm':             { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
  'Manipulation, Deception & Societal Harm': { bg: '#EDE9FE', text: '#5B21B6', border: '#C4B5FD' },
  'Loss of Control & Alignment Failure':   { bg: '#FFF7ED', text: '#9A3412', border: '#FDBA74' },
  'Cyber Offence & Security':              { bg: '#F0FDF4', text: '#166534', border: '#86EFAC' },
  'Systemic & Civilisational Risks':       { bg: '#FDF2F8', text: '#86198F', border: '#F0ABFC' },
  'Content Harms':                         { bg: '#FFF1F2', text: '#9F1239', border: '#FDA4AF' },
  'Privacy, Discrimination & Rights Violations': { bg: '#EFF6FF', text: '#1D4ED8', border: '#93C5FD' },
}

const CATEGORIES = Object.keys(CAT_COLORS)

// Maps risk categories → self-audit category IDs
const RISK_TO_AUDIT_CAT: Record<string, string> = {
  'Harmful Knowledge & Capability Uplift': 'harmful-knowledge-uplift',
  'Autonomous & Agentic Harm':             'autonomous-harmful-action',
  'Cyber Offence & Security':              'cyber-capability-uplift-publishing-cod',
  'Manipulation, Deception & Societal Harm': 'manipulation-and-mass-influence-genera',
  'Content Harms':                         'content-safety-harmful-content',
  'Privacy, Discrimination & Rights Violations': 'privacy-violation-revealing-personal-i',
}

// ─── Benchmarks per category ───────────────────────────────────────────────────
const CATEGORY_BENCHMARKS: Record<string, { name: string; url: string }[]> = {
  'Harmful Knowledge & Capability Uplift': [
    { name: 'HarmBench', url: 'https://www.harmbench.org' },
    { name: 'WMDP', url: 'https://www.wmdp.ai' },
    { name: 'CyberSecEval', url: 'https://github.com/meta-llama/PurpleLlama' },
    { name: 'StrongREJECT', url: 'https://strongreject.com' },
  ],
  'Autonomous & Agentic Harm': [
    { name: 'AgentBench', url: 'https://github.com/THUDM/AgentBench' },
    { name: 'AgentHarm', url: 'https://huggingface.co/datasets/ai-safety-institute/AgentHarm' },
    { name: 'GAIA', url: 'https://huggingface.co/spaces/gaia-benchmark/leaderboard' },
  ],
  'Manipulation, Deception & Societal Harm': [
    { name: 'TruthfulQA', url: 'https://github.com/sylinrl/TruthfulQA' },
    { name: 'SycophancyBench', url: 'https://github.com/anthropics/evals/tree/main/sycophancy' },
    { name: 'FACTS Grounding', url: 'https://deepmind.google/research/publications/facts-grounding' },
  ],
  'Loss of Control & Alignment Failure': [
    { name: 'MACHIAVELLI', url: 'https://aypan17.github.io/machiavelli' },
    { name: 'Sandbagging Evals', url: 'https://arxiv.org/abs/2406.07358' },
    { name: 'Specification Gaming', url: 'https://deepmind.com/research/publications/specification-gaming-list' },
  ],
  'Cyber Offence & Security': [
    { name: 'CyberSecEval 2', url: 'https://ai.meta.com/research/publications/cyberseceval-2' },
    { name: 'CTFBench', url: 'https://github.com/thu-coai/CTFBench' },
    { name: 'InterCode', url: 'https://intercode-benchmark.github.io' },
  ],
  'Systemic & Civilisational Risks': [
    { name: 'GPQA', url: 'https://github.com/idavidrein/gpqa' },
    { name: 'MMLU-Pro', url: 'https://huggingface.co/datasets/TIGER-Lab/MMLU-Pro' },
  ],
  'Content Harms': [
    { name: 'BBQ', url: 'https://github.com/nyu-mll/BBQ' },
    { name: 'SafetyBench', url: 'https://github.com/thu-coai/SafetyBench' },
    { name: 'ToxiGen', url: 'https://github.com/microsoft/TOXIGEN' },
  ],
  'Privacy, Discrimination & Rights Violations': [
    { name: 'WinoBias', url: 'https://uclanlp.github.io/corefBias/overview' },
    { name: 'PrivacyLens', url: 'https://github.com/SALT-NLP/PrivacyLens' },
    { name: 'FairBench', url: 'https://github.com/mitre/fairbench' },
  ],
}

// ─── Model task → relevant risk categories ────────────────────────────────────
const MODEL_TASKS: { label: string; emoji: string; categories: string[] }[] = [
  {
    label: 'Text generation',
    emoji: '✍️',
    categories: [
      'Harmful Knowledge & Capability Uplift',
      'Manipulation, Deception & Societal Harm',
      'Content Harms',
      'Privacy, Discrimination & Rights Violations',
    ],
  },
  {
    label: 'Image/video generation',
    emoji: '🖼️',
    categories: [
      'Content Harms',
      'Privacy, Discrimination & Rights Violations',
      'Manipulation, Deception & Societal Harm',
    ],
  },
  {
    label: 'Image/video editing',
    emoji: '✂️',
    categories: [
      'Content Harms',
      'Privacy, Discrimination & Rights Violations',
      'Manipulation, Deception & Societal Harm',
    ],
  },
  {
    label: 'Robot actuation',
    emoji: '🤖',
    categories: [
      'Autonomous & Agentic Harm',
      'Loss of Control & Alignment Failure',
      'Harmful Knowledge & Capability Uplift',
    ],
  },
  {
    label: 'Embedding',
    emoji: '🔢',
    categories: [
      'Privacy, Discrimination & Rights Violations',
      'Cyber Offence & Security',
    ],
  },
  {
    label: 'Classification',
    emoji: '🏷️',
    categories: [
      'Privacy, Discrimination & Rights Violations',
      'Content Harms',
    ],
  },
  {
    label: 'Visual reasoning',
    emoji: '👁️',
    categories: [
      'Autonomous & Agentic Harm',
      'Content Harms',
      'Privacy, Discrimination & Rights Violations',
    ],
  },
  {
    label: 'Computer vision',
    emoji: '📷',
    categories: [
      'Autonomous & Agentic Harm',
      'Privacy, Discrimination & Rights Violations',
      'Cyber Offence & Security',
    ],
  },
  {
    label: 'Biological design',
    emoji: '🧬',
    categories: [
      'Harmful Knowledge & Capability Uplift',
      'Systemic & Civilisational Risks',
    ],
  },
  {
    label: 'Clustering',
    emoji: '🗂️',
    categories: [
      'Privacy, Discrimination & Rights Violations',
      'Content Harms',
    ],
  },
]

// ─── Hazard type sources per category ─────────────────────────────────────────
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

// ─── Hazard type definitions ───────────────────────────────────────────────────
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
  'Inference attacks': 'Attacks that extract sensitive information about training data or model parameters by querying the model.',
  'Lack of transparency': 'Inability to explain or interpret how an AI system reached a particular output, reducing trust and auditability.',
  'Operational hazards': 'Risks arising from how an AI system is deployed and operated in real-world environments, including misuse and edge cases.',
  'Poisoning attack': 'Injection of malicious data into training or fine-tuning pipelines to manipulate model behaviour at inference time.',
  'Privacy violation': 'Unauthorised disclosure or inference of personally identifiable or sensitive information from model outputs or training data.',
  'Resource limitations': 'Constraints on available data, compute, time, or expertise that limit the quality or safety of an AI system.',
  'Social and behavioral hazards': 'Risks arising from AI system influence on human behaviour, social norms, or interpersonal dynamics.',
  'System complexity': 'Risks that emerge from the interactions between many components in a large AI system, making behaviour hard to predict.',
  'System dependencies': 'Risks arising from reliance on external services, libraries, APIs, or data pipelines that may fail or change.',
  'Unfair behaviour': 'Outputs that systematically disadvantage certain groups due to biases in training data or model design.',
  'User experience': 'Risks arising from poor usability, unclear interfaces, or misalignment between AI outputs and user expectations.',
}

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
  'Model documentation': "Structured records describing an AI model's design, training, intended use, and limitations.",
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

// ─── Control derivation ────────────────────────────────────────────────────────
function getControlsForRisk(risk: Risk): string[] {
  const hazardTypes = CATEGORY_HAZARD_TYPES[risk.category] ?? []
  const hazardIds = HAZARDS.filter(h => hazardTypes.includes(h.type ?? '')).map(h => h.id)
  const controlIds = new Set(hazardIds.flatMap(hId => HAZARD_CONTROLS[hId] ?? []))
  const concepts = new Set([...controlIds].map(cId => CONTROL_MAP[cId]?.concept).filter(Boolean) as string[])
  return [...concepts].sort()
}

function getMitigationStatus(riskControls: string[], selectedControls: Set<string>): MitigationStatus {
  if (riskControls.length === 0) return 'mitigated'
  const implemented = riskControls.filter(c => selectedControls.has(c))
  if (implemented.length === 0) return 'unmitigated'
  if (implemented.length === riskControls.length) return 'mitigated'
  return 'partial'
}

// ─── Distribution Chart (SVG) ──────────────────────────────────────────────────
function DistributionChart({ data }: { data: VoteData }) {
  const W = 260, H = 90, PAD_L = 20, PAD_R = 8, PAD_T = 8, PAD_B = 24
  const chartW = W - PAD_L - PAD_R
  const chartH = H - PAD_T - PAD_B
  const maxVal = Math.max(...Object.values(data.distribution), 1)
  const barW = chartW / 11 - 2

  const bars = Array.from({ length: 11 }, (_, i) => {
    const count = data.distribution[i] ?? 0
    const h = (count / maxVal) * chartH
    const x = PAD_L + i * (chartW / 11)
    const y = PAD_T + chartH - h
    return { i, count, h, x, y }
  })

  const xOf = (v: number) => PAD_L + v * (chartW / 10)

  return (
    <svg width={W} height={H} className="overflow-visible">
      {bars.map(({ i, h, x, y, count }) => (
        <g key={i}>
          <rect
            x={x + 1} y={y} width={barW} height={Math.max(h, 1)} rx={2}
            fill={i <= 3 ? '#86EFAC' : i <= 6 ? '#FCD34D' : '#FCA5A5'}
            opacity={count === 0 ? 0.25 : 0.85}
          />
          {count > 0 && h > 14 && (
            <text x={x + 1 + barW / 2} y={y + 10} textAnchor="middle" fontSize={8} fill="#374151">{count}</text>
          )}
        </g>
      ))}
      {data.count > 0 && (
        <rect x={xOf(data.q1)} y={PAD_T} width={xOf(data.q3) - xOf(data.q1)} height={chartH}
          fill="#1E1B4B" opacity={0.07} rx={2} />
      )}
      {data.count > 0 && (
        <line x1={xOf(data.median)} y1={PAD_T - 2} x2={xOf(data.median)} y2={PAD_T + chartH + 2}
          stroke="#1E1B4B" strokeWidth={1.5} strokeDasharray="3,2" />
      )}
      {data.count > 0 && (
        <>
          <text x={xOf(data.q1)} y={H - 2} textAnchor="middle" fontSize={8} fill="#6B7280">Q1={data.q1}</text>
          <text x={xOf(data.median)} y={H - 2} textAnchor="middle" fontSize={8} fill="#1E1B4B" fontWeight="bold">M={data.median}</text>
          <text x={xOf(data.q3)} y={H - 2} textAnchor="middle" fontSize={8} fill="#6B7280">Q3={data.q3}</text>
        </>
      )}
      <text x={PAD_L} y={H} textAnchor="middle" fontSize={8} fill="#9CA3AF">0</text>
      <text x={W - PAD_R} y={H} textAnchor="middle" fontSize={8} fill="#9CA3AF">10</text>
    </svg>
  )
}

// ─── Voting widget ─────────────────────────────────────────────────────────────
function VotingWidget({ riskId, onVoted }: { riskId: string; onVoted?: () => void }) {
  const { data: session } = useSession()
  const [voteData, setVoteData] = useState<VoteData | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch(`/api/risks/${riskId}/votes`)
    if (res.ok) setVoteData(await res.json())
  }, [riskId])

  useEffect(() => { load() }, [load])

  async function castVote(score: number) {
    if (!session) { setMessage('Sign in to vote'); return }
    if (voteData?.userVote !== null && voteData?.userVote !== undefined) return
    setSubmitting(true); setMessage(null)
    try {
      const res = await fetch(`/api/risks/${riskId}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(data.error ?? 'Failed to vote')
      } else {
        setMessage('Vote recorded!')
        await load()
        onVoted?.()
      }
    } finally { setSubmitting(false) }
  }

  const hasVoted = voteData !== null && voteData.userVote !== null && voteData.userVote !== undefined
  const isLoading = voteData === null

  return (
    <div className="space-y-3">
      {!isLoading && hasVoted && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Risk severity distribution</span>
            <span className="text-xs text-gray-400">
              {voteData!.count} vote{voteData!.count !== 1 ? 's' : ''}{voteData!.count > 0 ? ` · avg ${voteData!.mean}` : ''}
            </span>
          </div>
          {voteData!.count === 0 ? (
            <div className="text-xs text-gray-400 italic py-2">No votes yet — be the first to rate this risk.</div>
          ) : (
            <DistributionChart data={voteData!} />
          )}
        </div>
      )}
      {!isLoading && !hasVoted && (
        <div className="text-xs text-gray-400 italic px-1">
          Cast your vote below to reveal how the community has rated this risk.
        </div>
      )}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          {hasVoted ? `Your vote: ${voteData!.userVote}/10` : 'Rate severity (0 = negligible, 10 = catastrophic)'}
        </p>
        <div className="flex gap-1 flex-wrap">
          {Array.from({ length: 11 }, (_, i) => {
            const isSelected = hasVoted && voteData!.userVote === i
            const isHovered = !hasVoted && hovered === i
            return (
              <button
                key={i}
                onClick={() => !hasVoted && castVote(i)}
                onMouseEnter={() => !hasVoted && setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                disabled={submitting || hasVoted}
                className="w-8 h-8 rounded-md text-xs font-bold border transition-all"
                style={
                  isSelected
                    ? { backgroundColor: '#1E1B4B', color: 'white', borderColor: '#1E1B4B' }
                    : isHovered
                    ? { backgroundColor: '#EEF2FF', color: '#1E1B4B', borderColor: '#818CF8' }
                    : { backgroundColor: 'white', color: '#6B7280', borderColor: '#E5E7EB', cursor: hasVoted ? 'default' : 'pointer' }
                }
              >
                {i}
              </button>
            )
          })}
        </div>
        {message && (
          <p className={`text-xs mt-1.5 ${message.includes('recorded') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>
        )}
        {!session && (
          <p className="text-xs text-gray-400 mt-1">
            <a href="/auth/signin" className="text-indigo-600 hover:underline">Sign in</a> to cast your vote.
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Comments section ──────────────────────────────────────────────────────────
function CommentsSection({ riskId }: { riskId: string }) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/risks/${riskId}/comments`).then((r) => r.json()).then(setComments)
  }, [riskId])

  async function submit() {
    if (!body.trim()) return
    setSubmitting(true); setError(null)
    try {
      const res = await fetch(`/api/risks/${riskId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setComments((prev) => [...prev, data])
      setBody('')
    } finally { setSubmitting(false) }
  }

  const initials = (name: string | null) => (name ?? '?').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
  const timeAgo = (d: string) => {
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
    if (s < 60) return 'just now'
    if (s < 3600) return `${Math.floor(s / 60)}m ago`
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`
    return `${Math.floor(s / 86400)}d ago`
  }

  return (
    <div className="mt-5 border-t border-gray-100 pt-4 space-y-4">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Comments ({comments.length})</h4>
      {comments.length === 0 && <p className="text-xs text-gray-400 italic">No comments yet.</p>}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: '#EEF2FF', color: '#3730A3' }}>
              {c.user.image
                ? <img src={c.user.image} alt="" className="w-7 h-7 rounded-full" />
                : initials(c.user.name)
              }
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-semibold text-gray-800">{c.user.name ?? c.user.username ?? 'User'}</span>
                <span className="text-xs text-gray-400">{timeAgo(c.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-700 mt-0.5">{c.body}</p>
            </div>
          </div>
        ))}
      </div>
      {session ? (
        <div className="flex gap-2 pt-1">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add a comment…"
            rows={2}
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-indigo-400"
          />
          <button
            onClick={submit}
            disabled={submitting || !body.trim()}
            className="px-3 py-1 rounded-lg text-sm font-semibold self-end transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#1E1B4B', color: 'white' }}
          >
            {submitting ? '…' : 'Post'}
          </button>
        </div>
      ) : (
        <p className="text-xs text-gray-400"><a href="/auth/signin" className="text-indigo-600 hover:underline">Sign in</a> to comment.</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ─── Benchmarks section ────────────────────────────────────────────────────────
function BenchmarksSection({ category }: { category: string }) {
  const benchmarks = CATEGORY_BENCHMARKS[category] ?? []
  if (benchmarks.length === 0) return null

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Evaluation benchmarks</h4>
      <div className="flex flex-wrap gap-2">
        {benchmarks.map((b) => (
          <a
            key={b.name}
            href={b.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:border-indigo-400 hover:bg-indigo-50"
            style={{ borderColor: '#E5E7EB', color: '#374151', backgroundColor: 'white' }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-400 flex-shrink-0">
              <path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
            </svg>
            {b.name}
          </a>
        ))}
      </div>
    </div>
  )
}

// ─── Risk Card ─────────────────────────────────────────────────────────────────
function RiskCard({
  risk,
  inScope,
  onToggleScope,
}: {
  risk: Risk
  inScope: boolean
  onToggleScope: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const col = CAT_COLORS[risk.category] ?? { bg: '#F9FAFB', text: '#374151', border: '#E5E7EB' }
  const hasScore = risk.voteAvg !== null && risk.voteCount > 0
  const scoreColor = hasScore
    ? risk.voteAvg! >= 7.5 ? '#DC2626' : risk.voteAvg! >= 5 ? '#D97706' : '#16A34A'
    : '#9CA3AF'

  return (
    <div
      className="border rounded-xl overflow-hidden mb-2 transition-all"
      style={inScope
        ? { borderColor: '#A5B4FC', boxShadow: '0 0 0 1px #A5B4FC' }
        : { borderColor: '#E5E7EB' }
      }
    >
      {/* Card header */}
      <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex-1 flex items-start gap-3 text-left min-w-0"
        >
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-mono text-gray-400">R-{String(risk.riskNum).padStart(3, '0')}</span>
              <span
                className="inline-block px-2 py-0.5 rounded-full text-xs font-medium border"
                style={{ backgroundColor: col.bg, color: col.text, borderColor: col.border }}
              >
                {risk.category}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-900 leading-snug">{risk.title}</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 ml-1">
            {hasScore ? (
              <div className="text-right">
                <span className="text-base font-bold" style={{ color: scoreColor }}>{risk.voteAvg}</span>
                <span className="text-xs text-gray-400">/10</span>
                <div className="text-xs text-gray-400">{risk.voteCount}v</div>
              </div>
            ) : (
              <span className="text-xs text-gray-400">unrated</span>
            )}
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
              className="flex-shrink-0 transition-transform"
              style={{ transform: expanded ? 'rotate(90deg)' : 'none', color: '#9CA3AF' }}
            >
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </div>
        </button>
        {/* Scope toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleScope() }}
          className="flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all"
          style={inScope
            ? { backgroundColor: '#EEF2FF', color: '#3730A3', borderColor: '#A5B4FC' }
            : { backgroundColor: 'white', color: '#6B7280', borderColor: '#D1D5DB' }
          }
          title={inScope ? 'Remove from project scope' : 'Add to project scope'}
        >
          {inScope ? '✓ In scope' : '+ Scope'}
        </button>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="px-4 pb-5 border-t border-gray-100 bg-white">
          <p className="text-sm text-gray-700 mt-4 leading-relaxed">{risk.description}</p>

          {/* Hazard types */}
          {(CATEGORY_HAZARD_TYPES[risk.category] ?? []).length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Hazard types</h4>
              <div className="space-y-2">
                {(CATEGORY_HAZARD_TYPES[risk.category] ?? []).map(type => (
                  <div key={type} className="rounded-lg border border-gray-200 px-3 py-2">
                    <p className="text-xs font-semibold text-gray-700">{type}</p>
                    {HAZARD_TYPE_DEFS[type] && (
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{HAZARD_TYPE_DEFS[type]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <BenchmarksSection category={risk.category} />

          {RISK_TO_AUDIT_CAT[risk.category] && (
            <div className="mt-4">
              <a
                href={`/self-audit?cat=${RISK_TO_AUDIT_CAT[risk.category]}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                </svg>
                View test cases in Self Audit
              </a>
            </div>
          )}

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VotingWidget riskId={risk.id} />
            <CommentsSection riskId={risk.id} />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Project Scope Panel ───────────────────────────────────────────────────────
function ProjectScopePanel({
  scopedRisks,
  selectedControls,
  onToggleControl,
  onRemoveRisk,
  onClear,
}: {
  scopedRisks: Risk[]
  selectedControls: Set<string>
  onToggleControl: (concept: string) => void
  onRemoveRisk: (riskId: string) => void
  onClear: () => void
}) {
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<'controls' | 'risks'>('controls')

  const allControls = useMemo(() => {
    const set = new Set<string>()
    scopedRisks.forEach(r => getControlsForRisk(r).forEach(c => set.add(c)))
    return [...set].sort()
  }, [scopedRisks])

  const statusCounts = useMemo(() => {
    let unmitigated = 0, partial = 0, mitigated = 0
    scopedRisks.forEach(r => {
      const controls = getControlsForRisk(r)
      const s = getMitigationStatus(controls, selectedControls)
      if (s === 'unmitigated') unmitigated++
      else if (s === 'partial') partial++
      else mitigated++
    })
    return { unmitigated, partial, mitigated }
  }, [scopedRisks, selectedControls])

  const implementedCount = allControls.filter(c => selectedControls.has(c)).length

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-bold" style={{ color: '#1E1B4B' }}>Project scope</h3>
            <p className="text-xs text-gray-400 mt-0.5">{scopedRisks.length} risk{scopedRisks.length !== 1 ? 's' : ''} · {implementedCount}/{allControls.length} controls</p>
          </div>
          <button
            onClick={onClear}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors mt-0.5"
          >
            Clear
          </button>
        </div>

        {/* Mitigation summary */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="rounded-lg px-2 py-2 text-center bg-red-50 border border-red-200">
            <p className="text-lg font-bold text-red-700">{statusCounts.unmitigated}</p>
            <p className="text-xs text-red-600 leading-tight">Unmitigated</p>
          </div>
          <div className="rounded-lg px-2 py-2 text-center bg-amber-50 border border-amber-200">
            <p className="text-lg font-bold text-amber-700">{statusCounts.partial}</p>
            <p className="text-xs text-amber-600 leading-tight">Partial</p>
          </div>
          <div className="rounded-lg px-2 py-2 text-center bg-green-50 border border-green-200">
            <p className="text-lg font-bold text-green-700">{statusCounts.mitigated}</p>
            <p className="text-xs text-green-600 leading-tight">Mitigated</p>
          </div>
        </div>

        {/* Section tabs */}
        <div className="flex gap-1 mt-3 border border-gray-200 rounded-lg p-0.5 bg-gray-50">
          <button
            onClick={() => setActiveSection('controls')}
            className="flex-1 py-1 text-xs font-semibold rounded-md transition-all"
            style={activeSection === 'controls'
              ? { backgroundColor: 'white', color: '#1E1B4B', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }
              : { color: '#6B7280' }
            }
          >
            Controls ({allControls.length})
          </button>
          <button
            onClick={() => setActiveSection('risks')}
            className="flex-1 py-1 text-xs font-semibold rounded-md transition-all"
            style={activeSection === 'risks'
              ? { backgroundColor: 'white', color: '#1E1B4B', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }
              : { color: '#6B7280' }
            }
          >
            Risks ({scopedRisks.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeSection === 'controls' && (
          <div className="px-4 py-3 space-y-1">
            {allControls.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-2">No controls mapped to selected risks.</p>
            ) : (
              <>
                <p className="text-xs text-gray-400 mb-3">Tick the controls your system implements to track mitigation coverage.</p>
                {allControls.map(concept => {
                  const implemented = selectedControls.has(concept)
                  // Which scoped risks does this control help?
                  const coveredRisks = scopedRisks.filter(r => getControlsForRisk(r).includes(concept))
                  return (
                    <label
                      key={concept}
                      className="flex items-start gap-2.5 cursor-pointer py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <input
                        type="checkbox"
                        checked={implemented}
                        onChange={() => onToggleControl(concept)}
                        className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300 flex-shrink-0 accent-indigo-600"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold leading-tight ${implemented ? 'text-green-800' : 'text-gray-800'}`}>
                          {implemented && <span className="mr-1 text-green-600">✓</span>}
                          {concept}
                        </p>
                        {CONCEPT_DEFS[concept] && (
                          <p className="text-xs text-gray-400 mt-0.5 leading-tight">{CONCEPT_DEFS[concept]}</p>
                        )}
                        {coveredRisks.length > 0 && (
                          <p className="text-xs text-indigo-500 mt-0.5">
                            Covers {coveredRisks.length} risk{coveredRisks.length !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </label>
                  )
                })}
              </>
            )}
          </div>
        )}

        {activeSection === 'risks' && (
          <div className="px-4 py-3 space-y-2">
            {scopedRisks.map(risk => {
              const controls = getControlsForRisk(risk)
              const status = getMitigationStatus(controls, selectedControls)
              const expanded = expandedRisk === risk.id
              const s = {
                unmitigated: {
                  bg: '#FEF2F2', text: '#991B1B', border: '#FECACA',
                  label: 'Unmitigated', badge: '⚠️ Heightened risk',
                  badgeBg: '#FEF2F2', badgeText: '#991B1B',
                },
                partial: {
                  bg: '#FFFBEB', text: '#92400E', border: '#FDE68A',
                  label: 'Partially mitigated', badge: '◑ Partial coverage',
                  badgeBg: '#FFFBEB', badgeText: '#92400E',
                },
                mitigated: {
                  bg: '#F0FDF4', text: '#166534', border: '#BBF7D0',
                  label: 'Mitigated', badge: '✓ Mitigated',
                  badgeBg: '#F0FDF4', badgeText: '#166534',
                },
              }[status]

              return (
                <div key={risk.id} className="rounded-xl border overflow-hidden" style={{ borderColor: s.border }}>
                  <div className="px-3 py-2.5" style={{ backgroundColor: s.bg }}>
                    <div className="flex items-start gap-2">
                      <button
                        onClick={() => setExpandedRisk(expanded ? null : risk.id)}
                        className="flex-1 text-left min-w-0"
                      >
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full border"
                            style={{ backgroundColor: s.badgeBg, color: s.badgeText, borderColor: s.border }}
                          >
                            {s.badge}
                          </span>
                          <span className="text-xs font-mono text-gray-400">R-{String(risk.riskNum).padStart(3, '0')}</span>
                        </div>
                        <p className="text-xs font-semibold text-gray-800 leading-snug">{risk.title}</p>
                        {!expanded && controls.length > 0 && (
                          <p className="text-xs mt-1" style={{ color: s.text, opacity: 0.7 }}>
                            {controls.filter(c => selectedControls.has(c)).length}/{controls.length} controls implemented · tap to view
                          </p>
                        )}
                      </button>
                      <button
                        onClick={() => onRemoveRisk(risk.id)}
                        className="text-xs flex-shrink-0 opacity-40 hover:opacity-80 transition-opacity mt-0.5"
                        style={{ color: s.text }}
                        title="Remove from scope"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {expanded && (
                    <div className="border-t px-3 py-2.5 bg-white" style={{ borderColor: s.border }}>
                      {controls.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No controls mapped for this risk category.</p>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Required controls</p>
                          {controls.map(c => {
                            const done = selectedControls.has(c)
                            return (
                              <label key={c} className="flex items-center gap-2 cursor-pointer py-1 group">
                                <input
                                  type="checkbox"
                                  checked={done}
                                  onChange={() => onToggleControl(c)}
                                  className="h-3.5 w-3.5 rounded border-gray-300 flex-shrink-0 accent-indigo-600"
                                />
                                <span className={`text-xs ${done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{c}</span>
                              </label>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Submit risk form ──────────────────────────────────────────────────────────
function SubmitRiskForm() {
  const [form, setForm] = useState({ category: '', title: '', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; id?: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true); setResult(null)
    try {
      const res = await fetch('/api/risks/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setResult({ success: false, message: data.error ?? 'Submission failed' })
      } else {
        setResult({ success: true, message: data.message, id: data.submission.id })
        setForm({ category: '', title: '', description: '' })
      }
    } finally { setSubmitting(false) }
  }

  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-1">Submit a new risk</h3>
      <p className="text-xs text-gray-400 mb-4">Propose a risk for inclusion in the next version. Submissions are reviewed before being added.</p>

      {result && (
        <div
          className="mb-4 px-4 py-3 rounded-lg text-sm font-medium border"
          style={result.success
            ? { backgroundColor: '#F0FDF4', borderColor: '#86EFAC', color: '#166534' }
            : { backgroundColor: '#FEF2F2', borderColor: '#FECACA', color: '#991B1B' }
          }
        >
          {result.message}
          {result.success && result.id && (
            <span className="block text-xs mt-1 opacity-70">Reference ID: {result.id}</span>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Category *</label>
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 bg-white"
            required
          >
            <option value="">Select a category…</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Risk title *</label>
          <input
            type="text" value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Adversarial fine-tuning attacks"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
            required minLength={5}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Describe the risk clearly, including how it arises and what harm it causes…"
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-indigo-400"
            required minLength={20}
          />
        </div>
        <button
          type="submit" disabled={submitting}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
          style={{ backgroundColor: '#1E1B4B', color: 'white' }}
        >
          {submitting ? 'Submitting…' : 'Submit risk'}
        </button>
      </form>
    </div>
  )
}

// ─── Version diff panel ────────────────────────────────────────────────────────
function VersionDiff({ fromId, toId }: { fromId: string; toId: string }) {
  const [diff, setDiff] = useState<DiffResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/risks/diff?from=${fromId}&to=${toId}`)
      .then((r) => r.json())
      .then((d) => { setDiff(d); setLoading(false) })
  }, [fromId, toId])

  if (loading) return <div className="text-sm text-gray-400 py-4 text-center">Loading diff…</div>
  if (!diff) return null

  return (
    <div className="border border-gray-200 rounded-xl p-5 mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Version changes</h3>
      <div className="flex gap-4 text-sm mb-4">
        <span className="text-green-700 font-medium">+{diff.added.length} added</span>
        <span className="text-red-600 font-medium">−{diff.removed.length} removed</span>
        <span className="text-amber-600 font-medium">~{diff.modified.length} modified</span>
        <span className="text-gray-400">{diff.unchanged} unchanged</span>
      </div>
      {diff.added.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">Added</p>
          <div className="space-y-1">
            {diff.added.map((r) => (
              <div key={r.id} className="text-xs px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-green-900">
                <span className="font-medium">#{r.riskNum}</span> {r.title}
              </div>
            ))}
          </div>
        </div>
      )}
      {diff.removed.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">Removed</p>
          <div className="space-y-1">
            {diff.removed.map((r) => (
              <div key={r.id} className="text-xs px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-red-900">
                <span className="font-medium">#{r.riskNum}</span> {r.title}
              </div>
            ))}
          </div>
        </div>
      )}
      {diff.modified.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Modified</p>
          <div className="space-y-2">
            {diff.modified.map(({ before, after }) => (
              <div key={after.id} className="text-xs px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="font-semibold text-amber-900">#{after.riskNum} {after.title}</p>
                {before.title !== after.title && (
                  <p className="mt-1 text-amber-700">Title: <span className="line-through opacity-60">{before.title}</span> → {after.title}</p>
                )}
                {before.description !== after.description && (
                  <p className="mt-1 text-amber-700">Description updated</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function RiskClient() {
  const [versions, setVersions] = useState<RiskVersion[]>([])
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null)
  const [compareVersionId, setCompareVersionId] = useState<string | null>(null)
  const [showDiff, setShowDiff] = useState(false)
  const [risks, setRisks] = useState<Risk[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortMode, setSortMode] = useState<SortMode>('severity-desc')
  const [activeTab, setActiveTab] = useState<'risks' | 'submit' | 'graph'>('risks')
  const [scopeRiskIds, setScopeRiskIds] = useState<Set<string>>(new Set())
  const [selectedControls, setSelectedControls] = useState<Set<string>>(new Set())

  void compareVersionId

  // Load versions
  useEffect(() => {
    fetch('/api/risks/versions').then((r) => r.json()).then((v: RiskVersion[]) => {
      setVersions(v)
      if (v.length > 0) setCurrentVersionId(v[v.length - 1].id)
    })
  }, [])

  // Load risks when version changes
  useEffect(() => {
    if (!currentVersionId) return
    setLoading(true)
    fetch(`/api/risks?versionId=${currentVersionId}`)
      .then((r) => r.json())
      .then(({ risks }) => { setRisks(risks ?? []); setLoading(false) })
  }, [currentVersionId])

  // Sort
  const sortedRisks = useMemo(() => {
    const arr = [...risks]
    switch (sortMode) {
      case 'severity-desc':
        return arr.sort((a, b) => {
          if (a.voteAvg === null && b.voteAvg === null) return 0
          if (a.voteAvg === null) return 1
          if (b.voteAvg === null) return -1
          return b.voteAvg - a.voteAvg
        })
      case 'severity-asc':
        return arr.sort((a, b) => {
          if (a.voteAvg === null && b.voteAvg === null) return 0
          if (a.voteAvg === null) return 1
          if (b.voteAvg === null) return -1
          return a.voteAvg - b.voteAvg
        })
      case 'votes-desc':
        return arr.sort((a, b) => b.voteCount - a.voteCount)
      case 'alpha':
        return arr.sort((a, b) => a.title.localeCompare(b.title))
      case 'risknum':
        return arr.sort((a, b) => a.riskNum - b.riskNum)
      default:
        return arr
    }
  }, [risks, sortMode])

  // Effective categories: manual picks OR task-implied
  const taskCategories = selectedTask
    ? (MODEL_TASKS.find((t) => t.label === selectedTask)?.categories ?? [])
    : []

  const effectiveCategories = selectedCategories.length > 0
    ? selectedCategories
    : taskCategories

  // Filter
  const filtered = useMemo(() => sortedRisks.filter((r) => {
    const matchCat = effectiveCategories.length === 0 || effectiveCategories.includes(r.category)
    const q = search.toLowerCase()
    const matchSearch = !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
    return matchCat && matchSearch
  }), [sortedRisks, effectiveCategories, search])

  function toggleCategory(cat: string) {
    setSelectedTask(null)
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  function selectTask(label: string) {
    if (selectedTask === label) {
      setSelectedTask(null)
    } else {
      setSelectedTask(label)
      setSelectedCategories([])
    }
  }

  function toggleScope(riskId: string) {
    setScopeRiskIds(prev => {
      const next = new Set(prev)
      if (next.has(riskId)) next.delete(riskId)
      else next.add(riskId)
      return next
    })
  }

  function toggleControl(concept: string) {
    setSelectedControls(prev => {
      const next = new Set(prev)
      if (next.has(concept)) next.delete(concept)
      else next.add(concept)
      return next
    })
  }

  const currentVersion = versions.find((v) => v.id === currentVersionId)
  const prevVersion = currentVersion
    ? versions[versions.findIndex((v) => v.id === currentVersionId) - 1]
    : undefined

  const catCounts: Record<string, number> = {}
  for (const r of risks) catCounts[r.category] = (catCounts[r.category] ?? 0) + 1

  const votedRisks = risks.filter((r) => r.voteAvg !== null).length
  const scopedRisks = risks.filter(r => scopeRiskIds.has(r.id))

  const hasActiveFilters = selectedCategories.length > 0 || selectedTask !== null || search.length > 0

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="flex-1 min-w-0 max-w-3xl">
            <h1 className="text-2xl font-bold" style={{ color: '#1E1B4B' }}>Risk Repository</h1>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              A community-maintained catalogue of AI system risks, organised across eight harm categories. Each risk is independently rated by the community on a <strong>0–10 severity scale</strong>, where 0 represents negligible impact and 10 represents catastrophic, potentially irreversible harm.
            </p>
            <div className="flex gap-4 mt-3 text-xs text-gray-400">
              <span><strong className="text-gray-700">{risks.length}</strong> risks tracked</span>
              <span><strong className="text-gray-700">{votedRisks}</strong> with community ratings</span>
              {scopeRiskIds.size > 0 && (
                <span className="text-indigo-600 font-semibold">
                  <strong>{scopeRiskIds.size}</strong> in project scope
                </span>
              )}
            </div>
          </div>

          {/* Version selector */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Version</label>
            <select
              value={currentVersionId ?? ''}
              onChange={(e) => { setCurrentVersionId(e.target.value); setShowDiff(false) }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400 bg-white"
            >
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  v{v.version}{v.label ? ` — ${v.label}` : ''} ({v._count?.risks ?? '?'} risks)
                </option>
              ))}
            </select>
            {prevVersion && (
              <button
                onClick={() => setShowDiff((s) => !s)}
                className="px-3 py-1.5 text-xs font-semibold border rounded-lg transition-colors"
                style={showDiff
                  ? { backgroundColor: '#1E1B4B', color: 'white', borderColor: '#1E1B4B' }
                  : { backgroundColor: 'white', color: '#374151', borderColor: '#D1D5DB' }
                }
              >
                {showDiff ? 'Hide diff' : `Diff vs v${prevVersion.version}`}
              </button>
            )}
          </div>
        </div>

        {currentVersion?.notes && (
          <div className="mt-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 border border-gray-200 bg-gray-50">
            {currentVersion.notes}
          </div>
        )}
      </div>

      {/* Diff panel */}
      {showDiff && prevVersion && currentVersionId && (
        <VersionDiff fromId={prevVersion.id} toId={currentVersionId} />
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-5 flex-wrap">
        {[
          { id: 'risks', label: `Risk list (${risks.length})` },
          { id: 'graph', label: 'Knowledge Graph' },
          { id: 'submit', label: 'Submit a risk' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as typeof activeTab)}
            className="px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px"
            style={activeTab === t.id
              ? { color: '#1E1B4B', borderColor: '#1E1B4B' }
              : { color: '#6B7280', borderColor: 'transparent' }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'submit' && (
        <div className="max-w-2xl">
          <SubmitRiskForm />
        </div>
      )}

      {activeTab === 'graph' && (
        <div className="py-2">
          <KnowledgeGraph />
        </div>
      )}

      {activeTab === 'risks' && (
        <div>
          {/* Filter bar */}
          <div className="border border-gray-200 rounded-xl p-4 mb-5 space-y-4 bg-gray-50">
            {/* Search + sort row */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title or description…"
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm bg-white focus:outline-none focus:border-indigo-400"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">Sort by</label>
                <select
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-indigo-400"
                >
                  <option value="severity-desc">Severity: High → Low</option>
                  <option value="severity-asc">Severity: Low → High</option>
                  <option value="votes-desc">Most voted</option>
                  <option value="alpha">A → Z</option>
                  <option value="risknum">Risk number</option>
                </select>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={() => { setSelectedCategories([]); setSelectedTask(null); setSearch('') }}
                  className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors whitespace-nowrap"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Category chips */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Filter by category</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setSelectedCategories([]); setSelectedTask(null) }}
                  className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
                  style={selectedCategories.length === 0 && selectedTask === null
                    ? { backgroundColor: '#1E1B4B', color: 'white', borderColor: '#1E1B4B' }
                    : { backgroundColor: 'white', color: '#6B7280', borderColor: '#D1D5DB' }
                  }
                >
                  All ({risks.length})
                </button>
                {CATEGORIES.map(cat => {
                  const col = CAT_COLORS[cat]
                  const active = selectedCategories.includes(cat)
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
                      style={active
                        ? { backgroundColor: col.bg, color: col.text, borderColor: col.border, boxShadow: `0 0 0 1.5px ${col.border}` }
                        : { backgroundColor: 'white', color: '#6B7280', borderColor: '#D1D5DB' }
                      }
                    >
                      {/* Short label: first 3 words */}
                      {cat.split(' ').slice(0, 3).join(' ')} ({catCounts[cat] ?? 0})
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Capability chips */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Filter by model capability</p>
              <div className="flex flex-wrap gap-2">
                {MODEL_TASKS.map(task => {
                  const active = selectedTask === task.label
                  return (
                    <button
                      key={task.label}
                      onClick={() => selectTask(task.label)}
                      className="px-3 py-1 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5"
                      style={active
                        ? { backgroundColor: '#1E1B4B', color: 'white', borderColor: '#1E1B4B' }
                        : { backgroundColor: 'white', color: '#6B7280', borderColor: '#D1D5DB' }
                      }
                    >
                      <span>{task.emoji}</span>
                      {task.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Main area: risk list + scope panel */}
          <div className="flex gap-5 items-start">
            {/* Risk list */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-500">
                  <strong className="text-gray-900">{filtered.length}</strong> of {risks.length} risks
                  {selectedTask && (
                    <span className="ml-2 text-indigo-600 font-medium">
                      {MODEL_TASKS.find(t => t.label === selectedTask)?.emoji} {selectedTask}
                    </span>
                  )}
                  {selectedCategories.length > 0 && (
                    <span className="ml-2 text-indigo-600 font-medium">
                      {selectedCategories.length} categor{selectedCategories.length === 1 ? 'y' : 'ies'}
                    </span>
                  )}
                </p>
                {scopeRiskIds.size > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                      style={{ backgroundColor: '#EEF2FF', color: '#3730A3', borderColor: '#A5B4FC' }}>
                      {scopeRiskIds.size} in scope
                    </span>
                  </div>
                )}
              </div>

              {loading ? (
                <div className="text-sm text-gray-400 py-12 text-center">Loading risks…</div>
              ) : filtered.length === 0 ? (
                <div className="text-sm text-gray-400 py-12 text-center border border-gray-200 rounded-xl">
                  No risks match your current filters.
                  <button onClick={() => { setSelectedCategories([]); setSelectedTask(null); setSearch('') }}
                    className="block mx-auto mt-2 text-indigo-600 hover:underline text-xs">
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div>
                  {filtered.map(risk => (
                    <RiskCard
                      key={risk.id}
                      risk={risk}
                      inScope={scopeRiskIds.has(risk.id)}
                      onToggleScope={() => toggleScope(risk.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Project scope panel (sticky) */}
            {scopeRiskIds.size > 0 && (
              <div
                className="flex-shrink-0 border border-gray-200 rounded-xl overflow-hidden"
                style={{ width: 320, position: 'sticky', top: '1rem', maxHeight: 'calc(100vh - 120px)' }}
              >
                <ProjectScopePanel
                  scopedRisks={scopedRisks}
                  selectedControls={selectedControls}
                  onToggleControl={toggleControl}
                  onRemoveRisk={(riskId) => {
                    setScopeRiskIds(prev => {
                      const next = new Set(prev)
                      next.delete(riskId)
                      return next
                    })
                  }}
                  onClear={() => { setScopeRiskIds(new Set()); setSelectedControls(new Set()) }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
