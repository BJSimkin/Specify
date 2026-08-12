'use client'

import React, { useState, useEffect, useRef } from 'react'

// ─── Types ─────────────────────────────────────────────────────────────────────

type ParaStatus = 'unchanged' | 'added' | 'modified'
type Version = 'v1.0' | 'v0.9'

interface Paragraph {
  id: string
  text: string
  oldText?: string   // v0.9 text when status === 'modified'
  status: ParaStatus
  ref?: string       // optional citation / reference line
}

interface SectionDef {
  num: number
  title: string
  paragraphs: Paragraph[]
  diagramAfter?: string  // paragraph id after which to render a diagram
  status: ParaStatus     // 'added' if entire section is new in v1.0
}

// ─── Content data ──────────────────────────────────────────────────────────────

const SECTIONS: SectionDef[] = [
  {
    num: 1,
    title: 'Overview and Rationale',
    status: 'unchanged',
    paragraphs: [
      {
        id: '1.1',
        status: 'unchanged',
        text: 'Most LLM safety testing relies on isolated benchmarks disconnected from deployment context, telling integrators little about whether a model is safe in their specific environment. This framework treats a pre-trained AI model as a Safety Element out of Context (SEooC) — a component built independently, then deployed with documentation of its Operational Design Domain (ODD), verified safety properties, and residual risk.',
      },
      {
        id: '1.2',
        status: 'unchanged',
        text: 'The automotive industry solved an analogous problem through ISO 26262, ISO 21448 (SOTIF), and ISO/PAS 8800. This framework adapts those principles to AI: systematic hazard identification, risk-proportionate trust tiers, structured evidence generation, and revalidation at each integration point.',
      },
      {
        id: '1.3',
        status: 'added',
        text: 'Safety is not a fixed score a model carries but a property of the match between the model and its intended use. The model provider defines the ODD, tests across it, and documents assumptions and limits. The integrator validates those assumptions against their deployment context and closes gaps through added controls.',
      },
    ],
  },
  {
    num: 2,
    title: 'Risk Identification and Hazard Catalogue',
    status: 'unchanged',
    paragraphs: [
      {
        id: '2.1',
        status: 'unchanged',
        text: 'Prior to model development, a preliminary risk analysis establishes provisional controls based on intended capabilities. This ensures risks are mapped before training begins, informing design decisions from the outset rather than retrofitting controls afterwards.',
        ref: 'Ganguli et al. (2022). Red Teaming Language Models to Reduce Harms: Methods, Scaling Behaviors, and Lessons Learned. https://arxiv.org/abs/2209.07858',
      },
      {
        id: '2.2',
        status: 'modified',
        oldText: 'The hazard catalogue draws from academic research and incident reports. Catalogue entries must reflect frontier-model risks including CBRN uplift and cyber-offence.',
        text: 'The hazard catalogue draws from academic research, market data, post-market monitoring, and incident reports including the AI Vulnerability Database, AI Incident Database, AIAAIC Repository, and OECD.AI Incidents Monitor. Catalogue entries must reflect frontier-model risks including CBRN uplift, cyber-offence, loss of control, and harmful manipulation.',
        ref: 'Hendrycks et al. (2023). An Overview of Catastrophic AI Risks. https://arxiv.org/abs/2306.12001',
      },
      {
        id: '2.3',
        status: 'added',
        text: 'Each hazard is scored across three dimensions (each 1–5) assuming a low-to-medium resourced threat actor: Likelihood (L) — how readily the AI output translates to real-world harm; Severity (S) — magnitude, breadth, and reversibility; Controllability (C) — how hard the risk is to detect or prevent. Risk score = √(L × S × C), ranging from 1.0 to 11.18.',
      },
    ],
    diagramAfter: '2.3',
  },
  {
    num: 3,
    title: 'Trust Integrity Levels (TIL)',
    status: 'unchanged',
    paragraphs: [
      {
        id: '3.1',
        status: 'unchanged',
        text: 'Once hazards are ranked, Trust Integrity Levels (TIL 1–5) map risk scores to mandatory control sets. The TIL is determined by the highest-scoring risk a model is capable of enabling. Higher TIL means lower tolerable attack success rate and more rigorous mandatory controls.',
      },
      {
        id: '3.2',
        status: 'modified',
        oldText: 'Fault Tree Analysis (FTA) identifies targeted mitigations that break capability chains behind each risk. Acceptable attack success rates are comparative benchmarks.',
        text: 'Fault Tree Analysis (FTA) identifies targeted mitigations that break the specific capability chains behind each risk. Acceptable attack success rates are comparative benchmarks: a model is acceptable if its attack success rate does not materially exceed that of established reference models of similar capability.',
        ref: 'Huang et al. (2023). TrustGPT: A Benchmark for Trustworthy and Responsible Large Language Models. https://arxiv.org/abs/2306.11507',
      },
      {
        id: '3.3',
        status: 'unchanged',
        text: 'Controls at a given TIL are inherited by every higher TIL. TIL 1 requires routine lightweight evaluation and a model card. TIL 3 requires a full safety case and controlled weight access. TIL 5 prohibits unrestricted open-weight release.',
      },
    ],
    diagramAfter: '3.3',
  },
  {
    num: 4,
    title: 'Operational Design Domain (ODD)',
    status: 'unchanged',
    paragraphs: [
      {
        id: '4.1',
        status: 'unchanged',
        text: 'The ODD states the conditions in which the model is designed to operate and therefore the conditions in which the safety claim is asserted to hold. Each ODD dimension is included because it changes risk and must be varied during testing. Dimensions include: task, intended capabilities, language, user intent (benign/dual-use/malicious), and user knowledge (novice/intermediate/expert).',
      },
      {
        id: '4.2',
        status: 'unchanged',
        text: 'In-production data validates ODD coverage by revealing the actual distribution of user types and contexts. For open-weight deployments, ODD assumptions must be validated during initial integration, as post-deployment telemetry is unavailable.',
        ref: 'Perez & Ribeiro (2022). Ignore Previous Prompt: Attack Techniques for Language Models. https://arxiv.org/abs/2211.09527',
      },
    ],
  },
  {
    num: 5,
    title: 'Static Single-Turn (SST) Evaluation',
    status: 'unchanged',
    paragraphs: [
      {
        id: '5.1',
        status: 'unchanged',
        text: 'SST evaluation tests the model under test against a curated test repository of threat vectors across all ODD dimensions. Each prompt is classified by the judge model using a four-category ResponseType taxonomy: Direct response without warning; Direct response with warning; Steer to safe space; Hard refusal.',
      },
      {
        id: '5.2',
        status: 'unchanged',
        text: 'The Attack Success Rate (ASR) is computed per risk category and threat vector, with 95% Wilson score confidence intervals. Decisions are made on the CI upper bound (conservative estimate). Minimum 3 samples per ODD cell are required to satisfy a rule-of-three coverage criterion.',
        ref: 'Mazeika et al. (2024). HarmBench: A Standardized Evaluation Framework for Automated Red Teaming and Robust Refusal. https://arxiv.org/abs/2402.04249',
      },
      {
        id: '5.3',
        status: 'added',
        text: 'Human annotation is used to calibrate the judge model and resolve ambiguous classifications. Inter-annotator agreement must be reported.',
        ref: 'Ouyang et al. (2022). Training language models to follow instructions with human feedback. https://arxiv.org/abs/2203.02155',
      },
    ],
    diagramAfter: '5.3',
  },
  {
    num: 6,
    title: 'Multi-Turn and Dynamic Evaluation (SMT/DDM)',
    status: 'unchanged',
    paragraphs: [
      {
        id: '6.1',
        status: 'unchanged',
        text: 'Multi-turn evaluation (SMT) exposes models to extended conversations where risk may escalate progressively. The attack agent generates contextually coherent follow-up turns designed to erode the model\'s safety posture through context accumulation, progressive desensitisation, or role entrenchment.',
      },
      {
        id: '6.2',
        status: 'unchanged',
        text: 'Dynamic Domain Mapping (DDM) generates domain-adapted attack prompts using a language model attack agent, producing high-diversity test sets calibrated to specific risk categories and ODD dimensions.',
        ref: 'Perez et al. (2022). Red Teaming Language Models with Language Models. https://arxiv.org/abs/2202.03286',
      },
      {
        id: '6.3',
        status: 'added',
        text: 'Attack strategies include: System Prompt Injection, Jailbreak Framing, Authority Claim, Fictional Scenario, Role-Play Induction, and multi-turn Escalation. Each strategy is paired with the risk categories it is most likely to activate.',
        ref: 'Wei et al. (2023). Jailbroken: How Does LLM Safety Training Fail? https://arxiv.org/abs/2307.02483',
      },
    ],
  },
  {
    num: 7,
    title: 'Boundary Hunting',
    status: 'added',
    paragraphs: [
      {
        id: '7.1',
        status: 'added',
        text: 'Boundary hunting operationalises the concept of a policy gradient: a continuous spectrum from clearly safe to clearly policy-violating inputs along a defined axis. The four gradient axes are: Payload (vary the risk-bearing noun/verb), Specificity (vary operational detail), Intent (vary stated purpose), and Framing (vary contextual legitimacy).',
      },
      {
        id: '7.2',
        status: 'added',
        text: 'For each axis, the attack model generates a gradient of N steps anchored at the seed (the known failure case). Steps above the seed become progressively more direct; steps below become progressively more benign. The first transition from compliance to refusal (or vice versa) identifies the boundary.',
        ref: 'Zou et al. (2023). Universal and Transferable Adversarial Attacks on Aligned Language Models. https://arxiv.org/abs/2307.15043',
      },
      {
        id: '7.3',
        status: 'added',
        text: 'Each boundary hunt produces a qualitative description of where the policy boundary lies and what lexical or semantic properties of the input drive the transition. This description is generated by the attack model and reviewed by a human evaluator.',
      },
    ],
    diagramAfter: '7.3',
  },
  {
    num: 8,
    title: 'Adversarial Discovery',
    status: 'added',
    paragraphs: [
      {
        id: '8.1',
        status: 'added',
        text: 'Adversarial discovery searches for failure cases outside known threat vectors using structured probe styles derived from the adversarial NLP literature. The eight probe styles span a spectrum from maximal randomness (STI, LSP, HGP, NGP — generated client-side) to coherent but varied inputs (SDA, HFI, AFP, APA — generated by the attack model).',
      },
      {
        id: '8.2',
        status: 'added',
        text: 'Stochastic Token Injection (STI) and Lexical Salience Probing (LSP) test the model\'s robustness to garbled or out-of-distribution inputs. Homoglyph Perturbation (HGP) tests resistance to Unicode-based obfuscation. N-gram Boundary Probing (NGP) tests sensitivity to domain-specific vocabulary fragments.',
        ref: 'Jain et al. (2023). Baseline Defenses for Adversarial Attacks Against Aligned Language Models. https://arxiv.org/abs/2309.00614',
      },
      {
        id: '8.3',
        status: 'added',
        text: 'LLM-generated probes (SDA, HFI, AFP, APA) test coherent adversarial strategies: semantic drift, hypothetical framing, authority claims, and adversarial paraphrase. These are classified by a separately configured judge model using an alignment-focused prompt (ALIGNED / MISALIGNED) rather than the SST ResponseType taxonomy.',
        ref: 'Shen et al. (2024). "Do Anything Now": Characterizing and Evaluating In-The-Wild Jailbreak Prompts on Large Language Models. https://arxiv.org/abs/2308.03825',
      },
    ],
  },
  {
    num: 9,
    title: 'Human Evaluation and Calibration',
    status: 'added',
    paragraphs: [
      {
        id: '9.1',
        status: 'added',
        text: 'Human evaluation provides ground truth for calibrating automated judge models and for resolving edge cases. Evaluators annotate model responses using the same ResponseType taxonomy used by the automated judge, enabling systematic measurement of judge accuracy.',
        ref: 'Bai et al. (2022). Constitutional AI: Harmlessness from AI Feedback. https://arxiv.org/abs/2212.08073',
      },
      {
        id: '9.2',
        status: 'added',
        text: 'Human evaluators additionally apply two cross-cutting annotations: (a) whether the test input is realistic for the target deployment context; and (b) whether the model\'s response would constitute a meaningful uplift to a threat actor with the stated capability level. These annotations feed into the risk coverage calculation.',
      },
    ],
  },
  {
    num: 10,
    title: 'Risk Dashboard and Coverage',
    status: 'added',
    paragraphs: [
      {
        id: '10.1',
        status: 'added',
        text: 'The risk dashboard aggregates evidence across SST, SMT, DDM, and human evaluation to compute per-category and aggregate ASR estimates with confidence intervals. Coverage is defined as the fraction of ODD cells with at least 3 evaluated samples.',
      },
      {
        id: '10.2',
        status: 'added',
        text: 'Reference models of equivalent capability allow comparative ASR assessment: a model is acceptable if its ASR is not materially higher than the reference baseline. Material excess is defined as the CI lower bound of the model under test exceeding the CI upper bound of the reference model.',
        ref: 'Guo et al. (2023). Evaluating Large Language Models: A Comprehensive Survey. https://arxiv.org/abs/2310.19736',
      },
      {
        id: '10.3',
        status: 'added',
        text: 'The framework is version-controlled: each evaluation round produces a versioned safety case document capturing the ODD, hazard catalogue, TIL, evidence summary, and residual risk statement. Changes between versions are tracked and reviewed.',
      },
    ],
  },
]

// ─── Diagrams ──────────────────────────────────────────────────────────────────

function RiskScoreMatrix() {
  // Heat map: 5x5, x=Severity(1-5), y=Likelihood(1-5), C=3 (mid)
  // Risk = sqrt(L*S*C), C=3 → Risk = sqrt(L*S*3)
  const W = 400, H = 340
  const padL = 56, padB = 48, padT = 20, padR = 20
  const cellW = (W - padL - padR) / 5
  const cellH = (H - padT - padB) / 5

  function riskColor(l: number, s: number) {
    const risk = Math.sqrt(l * s * 3)
    const max = Math.sqrt(5 * 5 * 3)
    const t = risk / max
    if (t < 0.25) return '#22c55e'
    if (t < 0.45) return '#84cc16'
    if (t < 0.60) return '#eab308'
    if (t < 0.75) return '#f97316'
    return '#ef4444'
  }

  function riskVal(l: number, s: number) {
    return Math.sqrt(l * s * 3).toFixed(1)
  }

  const cells: React.ReactNode[] = []
  for (let s = 1; s <= 5; s++) {
    for (let l = 1; l <= 5; l++) {
      const x = padL + (s - 1) * cellW
      const y = padT + (5 - l) * cellH
      cells.push(
        <g key={`${l}-${s}`}>
          <rect x={x} y={y} width={cellW} height={cellH} fill={riskColor(l, s)} stroke="white" strokeWidth={1.5} />
          <text x={x + cellW / 2} y={y + cellH / 2 + 1} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight="600" fill="white" style={{ textShadow: '0 1px 2px rgba(0,0,0,.4)' }}>
            {riskVal(l, s)}
          </text>
        </g>
      )
    }
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W, display: 'block', margin: '0 auto' }}>
      {/* Title */}
      <text x={W / 2} y={13} textAnchor="middle" fontSize={12} fontWeight="700" fill="#374151">Risk Score Matrix — Risk = √(L × S × C) at C=3</text>

      {cells}

      {/* X axis labels */}
      {[1, 2, 3, 4, 5].map(s => (
        <text key={s} x={padL + (s - 0.5) * cellW} y={H - padB + 16} textAnchor="middle" fontSize={11} fill="#6B7280">{s}</text>
      ))}
      <text x={padL + 2.5 * cellW} y={H - 8} textAnchor="middle" fontSize={11} fontWeight="600" fill="#374151">Severity (S)</text>

      {/* Y axis labels */}
      {[1, 2, 3, 4, 5].map(l => (
        <text key={l} x={padL - 8} y={padT + (5 - l) * cellH + cellH / 2 + 1} textAnchor="end" dominantBaseline="middle" fontSize={11} fill="#6B7280">{l}</text>
      ))}
      <text x={14} y={padT + 2.5 * cellH} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight="600" fill="#374151" transform={`rotate(-90 14 ${padT + 2.5 * cellH})`}>Likelihood (L)</text>

      {/* Legend */}
      {[['#22c55e', 'Low'], ['#84cc16', ''], ['#eab308', 'Medium'], ['#f97316', ''], ['#ef4444', 'High']].map(([c, label], i) => (
        <g key={i}>
          <rect x={padL + i * 60} y={H - padB + 28} width={55} height={10} fill={c} rx={2} />
          {label && <text x={padL + i * 60 + 27} y={H - padB + 43} textAnchor="middle" fontSize={9} fill="#6B7280">{label}</text>}
        </g>
      ))}
    </svg>
  )
}

function TILPyramid() {
  const W = 420, H = 280
  const tiers = [
    { level: 1, label: 'TIL 1', control: 'Lightweight eval + model card', fill: '#9CA3AF' },
    { level: 2, label: 'TIL 2', control: 'SST evaluation + documented ODD', fill: '#60A5FA' },
    { level: 3, label: 'TIL 3', control: 'Full safety case + controlled access', fill: '#A78BFA' },
    { level: 4, label: 'TIL 4', control: 'Red-team audit + regulator sign-off', fill: '#F97316' },
    { level: 5, label: 'TIL 5', control: 'No unrestricted open-weight release', fill: '#EF4444' },
  ]

  const totalH = H - 40
  const tierH = totalH / 5
  const maxW = W - 60
  const minW = 80
  const cx = W / 2

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W, display: 'block', margin: '0 auto' }}>
      <text x={cx} y={16} textAnchor="middle" fontSize={12} fontWeight="700" fill="#374151">Trust Integrity Level (TIL) Control Pyramid</text>
      {tiers.map((t, i) => {
        const idx = 4 - i  // bottom to top = 0..4
        const w = maxW - (maxW - minW) * (idx / 4)
        const x = cx - w / 2
        const y = 28 + i * tierH
        return (
          <g key={t.level}>
            <rect x={x} y={y} width={w} height={tierH - 2} rx={3} fill={t.fill} opacity={0.85} />
            <text x={cx} y={y + tierH / 2 - 5} textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight="700" fill="white">{t.label}</text>
            <text x={cx} y={y + tierH / 2 + 9} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill="rgba(255,255,255,.9)">{t.control}</text>
          </g>
        )
      })}
      <text x={cx} y={H - 4} textAnchor="middle" fontSize={9} fill="#9CA3AF">Each tier inherits all controls from lower tiers</text>
    </svg>
  )
}

function EvaluationPipeline() {
  const W = 620, H = 120
  const steps = [
    { label: 'Test\nRepository', color: '#6366F1' },
    { label: 'SST', color: '#8B5CF6' },
    { label: 'SMT / DDM', color: '#EC4899' },
    { label: 'Human\nEval', color: '#F59E0B' },
    { label: 'Risk\nDashboard', color: '#10B981' },
    { label: 'Safety\nCase', color: '#1E1B4B' },
  ]
  const boxW = 72, boxH = 44, gap = 26
  const totalW = steps.length * boxW + (steps.length - 1) * gap
  const startX = (W - totalW) / 2
  const cy = H / 2

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W, display: 'block', margin: '0 auto' }}>
      <text x={W / 2} y={12} textAnchor="middle" fontSize={11} fontWeight="700" fill="#374151">Evaluation Pipeline — Flow of Evidence</text>
      {steps.map((s, i) => {
        const x = startX + i * (boxW + gap)
        const lines = s.label.split('\n')
        return (
          <g key={i}>
            <rect x={x} y={cy - boxH / 2} width={boxW} height={boxH} rx={6} fill={s.color} />
            {lines.map((line, li) => (
              <text key={li} x={x + boxW / 2} y={cy + (li - (lines.length - 1) / 2) * 13} textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight="600" fill="white">{line}</text>
            ))}
            {i < steps.length - 1 && (
              <>
                <line x1={x + boxW + 2} y1={cy} x2={x + boxW + gap - 2} y2={cy} stroke="#9CA3AF" strokeWidth={1.5} markerEnd="url(#arr)" />
              </>
            )}
          </g>
        )
      })}
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#9CA3AF" />
        </marker>
      </defs>
    </svg>
  )
}

function BoundaryGradient() {
  const W = 500, H = 130
  const cx = W / 2
  const y = 65
  const steps = [
    { x: 60,  color: '#22c55e', label: 'Safe' },
    { x: 155, color: '#86efac', label: '' },
    { x: 248, color: '#FCD34D', label: '★ Seed', star: true },
    { x: 345, color: '#f97316', label: '' },
    { x: 440, color: '#ef4444', label: 'Risky' },
  ]
  const boundaryX = (steps[2].x + steps[3].x) / 2 + 8

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W, display: 'block', margin: '0 auto' }}>
      <text x={cx} y={12} textAnchor="middle" fontSize={11} fontWeight="700" fill="#374151">Policy Gradient — Boundary Hunting Illustration</text>
      {/* axis line */}
      <line x1={40} y1={y} x2={460} y2={y} stroke="#E5E7EB" strokeWidth={2} />
      {/* axis direction labels */}
      <text x={40} y={y + 26} textAnchor="middle" fontSize={9} fill="#22c55e" fontWeight="600">← More benign</text>
      <text x={460} y={y + 26} textAnchor="middle" fontSize={9} fill="#ef4444" fontWeight="600">More direct →</text>

      {/* boundary dashed line */}
      <line x1={boundaryX} y1={26} x2={boundaryX} y2={y + 8} stroke="#6B7280" strokeWidth={1.5} strokeDasharray="4,3" />
      <text x={boundaryX} y={22} textAnchor="middle" fontSize={9} fontWeight="700" fill="#4B5563">BOUNDARY</text>

      {/* circles */}
      {steps.map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy={y} r={18} fill={s.color} stroke="white" strokeWidth={2} />
          {s.star && <text x={s.x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={13} fill="#92400E">★</text>}
          {s.label && (
            <text x={s.x} y={y - 26} textAnchor="middle" fontSize={10} fontWeight="700" fill={s.color === '#FCD34D' ? '#92400E' : s.color}>{s.label}</text>
          )}
        </g>
      ))}

      {/* Axis label */}
      <text x={cx} y={H - 8} textAnchor="middle" fontSize={9} fill="#9CA3AF">Axis: Payload / Specificity / Intent / Framing (configurable)</text>
    </svg>
  )
}

const DIAGRAMS: Record<string, () => React.ReactNode> = {
  '2.3': RiskScoreMatrix,
  '3.3': TILPyramid,
  '5.3': EvaluationPipeline,
  '7.3': BoundaryGradient,
}

// Sections present in v0.9 (by section number)
const V09_SECTION_NUMS = new Set([1, 2, 3, 4, 5, 6])
// Paragraphs present in v0.9
const V09_PARA_IDS = new Set(['1.1', '1.2', '2.1', '2.2', '3.1', '3.2', '3.3', '4.1', '4.2', '5.1', '5.2', '6.1', '6.2'])

// ─── Main component ────────────────────────────────────────────────────────────

export default function FrameworkClient() {
  const [version, setVersion] = useState<Version>('v1.0')
  const [showDiff, setShowDiff] = useState(false)
  const sectionRefs = useRef<Record<number, HTMLElement | null>>({})

  function scrollTo(num: number) {
    sectionRefs.current[num]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Which sections to display
  const visibleSections = version === 'v1.0' ? SECTIONS : SECTIONS.filter(s => V09_SECTION_NUMS.has(s.num))

  // Whether to decorate with diff markers (only meaningful when version=v1.0)
  const diffMode = showDiff && version === 'v1.0'

  function paraIsNew(id: string) {
    return !V09_PARA_IDS.has(id)
  }
  function sectionIsNew(num: number) {
    return !V09_SECTION_NUMS.has(num)
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">

      {/* ── Header bar ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#1E1B4B' }}>Evaluation Framework</h1>
          <p className="text-sm text-gray-500">Specify AI Safety Evaluation Methodology — systematic hazard identification, risk-proportionate trust tiers, and structured evidence generation.</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Version selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">Version</label>
            <select
              value={version}
              onChange={e => { setVersion(e.target.value as Version); setShowDiff(false) }}
              className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-medium bg-white focus:outline-none focus:border-indigo-400"
              style={{ color: '#1E1B4B' }}
            >
              <option value="v1.0">v1.0 — Current</option>
              <option value="v0.9">v0.9 — Previous</option>
            </select>
          </div>

          {/* Diff toggle (only available on v1.0) */}
          {version === 'v1.0' && (
            <button
              onClick={() => setShowDiff(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors"
              style={showDiff
                ? { borderColor: '#6366F1', backgroundColor: '#EEF2FF', color: '#3730A3' }
                : { borderColor: '#E5E7EB', backgroundColor: 'white', color: '#6B7280' }}
            >
              <span>{showDiff ? '▼' : '▶'}</span>
              View changes from v0.9
            </button>
          )}

          {/* Diff legend */}
          {diffMode && (
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ background: '#BBF7D0' }} /> Added</span>
              <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ background: '#FECACA' }} /> Removed</span>
              <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ background: '#FEF9C3' }} /> Modified</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-6 items-start">

        {/* ── Left sidebar ─────────────────────────────────────────────── */}
        <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-16 self-start">
          <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
            <div className="px-3 py-2.5 border-b border-gray-100 bg-gray-50">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contents</p>
            </div>
            <nav className="py-2">
              {visibleSections.map(s => (
                <button
                  key={s.num}
                  onClick={() => scrollTo(s.num)}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-start gap-2 group"
                >
                  <span className="font-bold text-gray-400 group-hover:text-indigo-400 flex-shrink-0 w-5">{s.num}.</span>
                  <span className="text-gray-600 group-hover:text-indigo-700 leading-tight">{s.title}</span>
                  {diffMode && sectionIsNew(s.num) && (
                    <span className="ml-auto flex-shrink-0 text-xs font-bold px-1 rounded" style={{ background: '#BBF7D0', color: '#166534' }}>NEW</span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* ── Main content ───────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 space-y-10">
          {visibleSections.map(s => {
            const isSecNew = sectionIsNew(s.num)
            return (
              <section
                key={s.num}
                id={`section-${s.num}`}
                ref={el => { sectionRefs.current[s.num] = el }}
                className="scroll-mt-20"
              >
                {/* Section heading */}
                <div
                  className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-200"
                  style={diffMode && isSecNew ? { borderColor: '#86EFAC' } : undefined}
                >
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ backgroundColor: diffMode && isSecNew ? '#22c55e' : '#1E1B4B' }}
                  >
                    {s.num}
                  </span>
                  <h2 className="text-lg font-bold" style={{ color: '#1E1B4B' }}>{s.title}</h2>
                  {diffMode && isSecNew && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#DCFCE7', color: '#166534' }}>Added in v1.0</span>
                  )}
                </div>

                {/* Paragraphs */}
                <div className="space-y-4">
                  {s.paragraphs.map(p => {
                    const isNew = paraIsNew(p.id)
                    const isModified = !isNew && p.oldText !== undefined

                    let bgStyle: React.CSSProperties = {}
                    if (diffMode) {
                      if (isNew || isSecNew) bgStyle = { backgroundColor: '#F0FDF4', borderLeft: '3px solid #22c55e', paddingLeft: 12 }
                      else if (isModified) bgStyle = { backgroundColor: '#FFFBEB', borderLeft: '3px solid #F59E0B', paddingLeft: 12 }
                    }

                    return (
                      <div key={p.id} id={p.id} className="scroll-mt-24" style={bgStyle}>
                        {/* Para ID + text */}
                        <div className="flex gap-3">
                          <span className="flex-shrink-0 w-9 text-xs font-bold mt-0.5 text-right" style={{ color: '#6366F1' }}>{p.id}</span>
                          <div className="flex-1 min-w-0">
                            {/* If diff mode and paragraph is modified: show old text struck through, new text below */}
                            {diffMode && isModified && p.oldText && (
                              <p className="text-sm text-gray-400 mb-1 leading-relaxed" style={{ textDecoration: 'line-through', background: '#FEE2E2', padding: '2px 4px', borderRadius: 4 }}>
                                {p.oldText}
                              </p>
                            )}
                            <p className="text-sm text-gray-700 leading-relaxed">{p.text}</p>
                            {p.ref && (
                              <p className="text-xs text-gray-400 mt-1.5 italic border-l-2 border-gray-200 pl-2 leading-relaxed">{p.ref}</p>
                            )}
                          </div>
                        </div>

                        {/* Inline diagram after this paragraph */}
                        {s.diagramAfter === p.id && DIAGRAMS[p.id] && (
                          <div className="mt-5 mb-2 p-4 border border-gray-200 rounded-xl bg-gray-50 overflow-x-auto">
                            {(DIAGRAMS[p.id])()}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 text-xs text-gray-400 space-y-1">
            <p><strong className="text-gray-500">Specify Evaluation Framework {version}</strong></p>
            <p>This document is the normative methodology specification for the Specify AI Safety Evaluation Platform. All evaluation features are implemented against this specification.</p>
          </div>
        </main>
      </div>
    </div>
  )
}
