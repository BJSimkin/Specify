'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import HazardsClient from '../hazards/hazards-client'
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

// ─── Hazard type sources per category (links to /hazards) ─────────────────────
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
      {/* Chart — only shown after user has voted to prevent anchoring bias */}
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

      {/* Pre-vote nudge */}
      {!isLoading && !hasVoted && (
        <div className="text-xs text-gray-400 italic px-1">
          Cast your vote below to reveal how the community has rated this risk.
        </div>
      )}

      {/* Vote buttons */}
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
                title={`Score ${i}`}
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

// ─── Hazard sources section ────────────────────────────────────────────────────
function HazardSourcesSection({ category }: { category: string }) {
  const types = CATEGORY_HAZARD_TYPES[category] ?? []
  if (types.length === 0) return null

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Hazard sources</h4>
      <p className="text-xs text-gray-400 mb-2">
        View the underlying hazard types and their control mappings.
      </p>
      <div className="flex flex-wrap gap-2">
        {types.map((type) => (
          <a
            key={type}
            href={`/hazards`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all hover:border-red-300 hover:bg-red-50"
            style={{ borderColor: '#FCA5A5', color: '#991B1B', backgroundColor: '#FEF2F2' }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            {type}
          </a>
        ))}
      </div>
    </div>
  )
}

// ─── Risk Row ──────────────────────────────────────────────────────────────────
function RiskRow({ risk, rank }: { risk: Risk; rank?: number }) {
  const [expanded, setExpanded] = useState(false)
  const col = CAT_COLORS[risk.category] ?? { bg: '#F9FAFB', text: '#374151', border: '#E5E7EB' }
  const hasScore = risk.voteAvg !== null && risk.voteCount > 0
  const scoreColor = hasScore
    ? risk.voteAvg! >= 7.5 ? '#DC2626' : risk.voteAvg! >= 5 ? '#D97706' : '#16A34A'
    : '#9CA3AF'

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-2">
      {/* Header row */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
      >
        {/* Rank / risk number */}
        <div className="flex flex-col items-center flex-shrink-0 mt-0.5 w-8">
          {rank !== undefined ? (
            <span className="text-xs font-bold" style={{ color: rank === 0 ? '#92400E' : rank === 1 ? '#374151' : rank === 2 ? '#78350F' : '#9CA3AF' }}>
              #{rank + 1}
            </span>
          ) : (
            <span className="text-xs font-mono text-gray-400">#{risk.riskNum}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className="inline-block px-2 py-0.5 rounded-full text-xs font-medium border"
              style={{ backgroundColor: col.bg, color: col.text, borderColor: col.border }}
            >
              {risk.category}
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-900">{risk.title}</p>
        </div>

        {/* Score + vote info */}
        <div className="flex items-center gap-3 ml-2 flex-shrink-0">
          {hasScore ? (
            <div className="text-right">
              <span className="text-base font-bold" style={{ color: scoreColor }}>{risk.voteAvg}</span>
              <span className="text-xs text-gray-400">/10</span>
              <div className="text-xs text-gray-400">{risk.voteCount}v</div>
            </div>
          ) : (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
              {risk._count?.votes ?? 0}
            </span>
          )}
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" /></svg>
            {risk._count?.comments ?? 0}
          </span>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
            className="text-gray-400 transition-transform flex-shrink-0"
            style={{ transform: expanded ? 'rotate(90deg)' : 'none', color: '#9CA3AF' }}
          >
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </div>
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div className="px-4 pb-5 border-t border-gray-100 bg-white">
          {/* Risk description — only shown here, not in collapsed header */}
          <p className="text-sm text-gray-700 mt-4 leading-relaxed">{risk.description}</p>

          {/* Hazard sources */}
          <HazardSourcesSection category={risk.category} />

          {/* Benchmarks */}
          <BenchmarksSection category={risk.category} />

          {/* Voting + Comments */}
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VotingWidget riskId={risk.id} />
            <CommentsSection riskId={risk.id} />
          </div>
        </div>
      )}
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
      <p className="text-xs text-gray-400 mb-4">Propose a risk for inclusion in the next version. Submissions are reviewed before being added to the repository.</p>

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
  const [activeTab, setActiveTab] = useState<'risks' | 'submit' | 'hazards' | 'graph'>('risks')
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null)
  const [selectedHazardTypes, setSelectedHazardTypes] = useState<string[]>([])

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

  // Sort by community vote average (high → low); unvoted risks go to bottom
  const sortedRisks = [...risks].sort((a, b) => {
    if (a.voteAvg === null && b.voteAvg === null) return 0
    if (a.voteAvg === null) return 1
    if (b.voteAvg === null) return -1
    return b.voteAvg - a.voteAvg
  })

  const controlConcepts = useMemo(() => {
    if (selectedHazardTypes.length === 0) return []
    const hazardIds = HAZARDS.filter(h => selectedHazardTypes.includes(h.type ?? '')).map(h => h.id)
    const controlIds = new Set(hazardIds.flatMap(hId => HAZARD_CONTROLS[hId] ?? []))
    const concepts = new Set([...controlIds].map(cId => CONTROL_MAP[cId]?.concept).filter(Boolean) as string[])
    return [...concepts].sort()
  }, [selectedHazardTypes])

  // Effective category set: union of manual picks + task-implied categories
  const taskCategories = selectedTask
    ? (MODEL_TASKS.find((t) => t.label === selectedTask)?.categories ?? [])
    : []

  const effectiveCategories = selectedCategories.length > 0
    ? selectedCategories
    : taskCategories

  // Apply filters
  const filtered = sortedRisks.filter((r) => {
    const matchCat = effectiveCategories.length === 0 || effectiveCategories.includes(r.category)
    const q = search.toLowerCase()
    const matchSearch = !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  function selectTask(label: string) {
    if (selectedTask === label) {
      setSelectedTask(null)
    } else {
      setSelectedTask(label)
      setSelectedCategories([]) // clear manual picks; task drives the filter
    }
  }

  const currentVersion = versions.find((v) => v.id === currentVersionId)
  const prevVersion = currentVersion
    ? versions[versions.findIndex((v) => v.id === currentVersionId) - 1]
    : undefined

  const catCounts: Record<string, number> = {}
  for (const r of risks) catCounts[r.category] = (catCounts[r.category] ?? 0) + 1

  const votedRisks = risks.filter((r) => r.voteAvg !== null).length

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
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              <strong>How severity is calculated:</strong> Community members rate each risk after reviewing its definition — voting is blinded so that individual judgements remain independent. The aggregate score uses the arithmetic mean of all submitted votes. The distribution chart (visible after you vote) shows the full spread with interquartile range and median, giving a richer picture than a single number. Risks are ordered by descending average score so the most severe concerns surface first.
            </p>
            <div className="flex gap-4 mt-3 text-xs text-gray-400">
              <span><strong className="text-gray-700">{risks.length}</strong> risks tracked</span>
              <span><strong className="text-gray-700">{votedRisks}</strong> with community ratings</span>
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
          { id: 'hazards', label: 'Hazards & Controls' },
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

      {activeTab === 'hazards' && (
        <div>
          <HazardsClient />
        </div>
      )}

      {activeTab === 'graph' && (
        <div className="py-2">
          <KnowledgeGraph />
        </div>
      )}

      {activeTab === 'risks' && (
        <div className="border border-gray-200 rounded-xl overflow-hidden flex" style={{ height: '70vh', minHeight: 500 }}>
          {/* Panel 1 — Risk tree */}
          <div className="w-56 flex-shrink-0 border-r border-gray-200 flex flex-col bg-gray-50">
            <div className="p-3 border-b border-gray-200">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search risks…"
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-400 bg-white"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {CATEGORIES.map(cat => {
                const q = search.toLowerCase()
                const catRisks = sortedRisks.filter(r =>
                  r.category === cat &&
                  (!q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q))
                )
                return (
                  <div key={cat}>
                    <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100 border-b border-gray-200 flex items-center justify-between">
                      <span className="truncate">{cat.split(' ').slice(0, 2).join(' ')}</span>
                      <span className="ml-1 text-gray-400 flex-shrink-0">({catCounts[cat] ?? 0})</span>
                    </div>
                    {catRisks.map(risk => (
                      <div
                        key={risk.id}
                        onClick={() => { setSelectedRisk(risk); setSelectedHazardTypes([]) }}
                        className="px-3 py-2 cursor-pointer border-b border-gray-100 hover:bg-white transition-colors"
                        style={selectedRisk?.id === risk.id
                          ? { backgroundColor: '#EEF2FF', borderLeft: '2px solid #4338CA' }
                          : { borderLeft: '2px solid transparent' }
                        }
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono text-gray-400">R-{String(risk.riskNum).padStart(3, '0')}</span>
                          {risk.voteAvg !== null && (
                            <span className="ml-auto text-xs font-bold" style={{ color: risk.voteAvg >= 7 ? '#991B1B' : risk.voteAvg >= 4 ? '#92400E' : '#166534' }}>
                              {risk.voteAvg.toFixed(1)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-700 mt-0.5 leading-snug line-clamp-2">{risk.title}</p>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Panel 2 — Risk detail + hazard types */}
          <div className="w-80 flex-shrink-0 border-r border-gray-200 overflow-y-auto">
            {selectedRisk ? (
              <div className="p-4 space-y-4">
                <div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium border"
                    style={CAT_COLORS[selectedRisk.category] ?? { backgroundColor: '#F9FAFB', color: '#374151', borderColor: '#E5E7EB' }}
                  >
                    {selectedRisk.category}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 mt-2">{selectedRisk.title}</h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{selectedRisk.description}</p>
                </div>
                <VotingWidget riskId={selectedRisk.id} />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Linked hazard types</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(CATEGORY_HAZARD_TYPES[selectedRisk.category] ?? []).map(type => {
                      const active = selectedHazardTypes.includes(type)
                      const colors = TYPE_COLORS[type] ?? { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' }
                      return (
                        <button
                          key={type}
                          onClick={() => setSelectedHazardTypes(prev => active ? prev.filter(t => t !== type) : [...prev, type])}
                          className="px-2.5 py-1 rounded-full text-xs font-medium border transition-all"
                          style={active
                            ? { backgroundColor: colors.bg, color: colors.text, borderColor: colors.border, boxShadow: '0 0 0 1.5px ' + colors.border }
                            : { backgroundColor: 'white', color: '#6B7280', borderColor: '#D1D5DB' }
                          }
                        >
                          {type}
                        </button>
                      )
                    })}
                  </div>
                  {selectedHazardTypes.length > 0 && (
                    <p className="text-xs text-gray-400 mt-2">See definitions and controls →</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-6">
                <p className="text-xs text-gray-400 text-center">Select a risk from the list to explore linked hazard types</p>
              </div>
            )}
          </div>

          {/* Panel 3 — Hazard definitions */}
          <div className="flex-1 min-w-[280px] border-r border-gray-200 overflow-y-auto">
            <div className="sticky top-0 px-4 py-2 bg-white border-b border-gray-200 z-10">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Hazard Definitions{selectedHazardTypes.length > 0 && <span> ({selectedHazardTypes.length})</span>}
              </p>
            </div>
            {selectedHazardTypes.length > 0 ? (
              <div className="p-4 space-y-3">
                {selectedHazardTypes.map(type => {
                  const colors = TYPE_COLORS[type] ?? { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' }
                  return (
                    <div key={type} className="rounded-xl border p-3" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold" style={{ color: colors.text }}>{type}</span>
                        <button
                          onClick={() => setSelectedHazardTypes(prev => prev.filter(t => t !== type))}
                          className="text-xs opacity-50 hover:opacity-100"
                          style={{ color: colors.text }}
                        >
                          × Remove
                        </button>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: colors.text, opacity: 0.85 }}>
                        {HAZARD_TYPE_DEFS[type] ?? 'No definition available.'}
                      </p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-6">
                <p className="text-xs text-gray-400 text-center">Select hazard types from the middle panel to see their definitions here</p>
              </div>
            )}
          </div>

          {/* Panel 4 — Control concepts */}
          <div className="w-72 flex-shrink-0 overflow-y-auto">
            <div className="sticky top-0 px-4 py-2 bg-white border-b border-gray-200 z-10">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Controls{controlConcepts.length > 0 && <span> ({controlConcepts.length})</span>}
              </p>
            </div>
            {controlConcepts.length > 0 ? (
              <div className="p-4 space-y-2">
                {controlConcepts.map(concept => (
                  <div key={concept} className="rounded-lg border border-green-200 p-3" style={{ backgroundColor: '#F0FDF4' }}>
                    <p className="text-xs font-semibold text-green-900">{concept}</p>
                    {CONCEPT_DEFS[concept] && (
                      <p className="text-xs text-green-700 mt-1 leading-relaxed opacity-80">{CONCEPT_DEFS[concept]}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-6">
                <p className="text-xs text-gray-400 text-center">Controls appear when hazard types are selected</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
