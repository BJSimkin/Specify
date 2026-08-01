'use client'

import { useState } from 'react'

// ─── Template data ─────────────────────────────────────────────────────────────

type Field = { label: string; placeholder: string }
type Section = { section: string; fields: Field[] }

const SYSTEM_CARD: Section[] = [
  { section: 'System ID', fields: [
    { label: 'Name', placeholder: 'e.g. Isaac localisation' },
    { label: 'Model version', placeholder: 'e.g. version 1.2' },
    { label: 'Release date', placeholder: 'e.g. MM/DD/YYYY' },
    { label: 'Deployment (Geography)', placeholder: 'e.g. global, US, UK, China, EU-27' },
    { label: 'Objective', placeholder: 'e.g. person classification in image data' },
    { label: 'Use case', placeholder: 'e.g. no specific industry, politics, transportation, financial, healthcare' },
    { label: 'Publication', placeholder: 'e.g. link to publication' },
  ]},
  { section: 'Legal', fields: [
    { label: 'Usage policies', placeholder: 'e.g. End user license agreements, terms of service' },
    { label: 'Licensing', placeholder: 'e.g. commercial use, non-commercial use' },
    { label: 'Release management', placeholder: 'e.g. disclose source code, restrict source code, restrict output dissemination' },
  ]},
  { section: 'Benefits', fields: [
    { label: 'Sustainable development goals', placeholder: 'e.g. no poverty, zero hunger, quality education, reduced inequalities' },
  ]},
  { section: 'Resource Control', fields: [
    { label: 'Resource optimisation', placeholder: 'e.g. parallel processing, sustainable energy sources' },
    { label: 'Resource management', placeholder: 'e.g. load balancing, workload scheduling' },
  ]},
  { section: 'System Architecture', fields: [
    { label: 'Automation level', placeholder: 'e.g. Autonomous, partial automation, assistant' },
    { label: 'Human oversight', placeholder: 'e.g. human confirmation, iterative human feedback, human performance monitoring' },
    { label: 'Fail operation', placeholder: 'e.g. limited functionality, limited performance' },
    { label: 'Fail safe', placeholder: 'e.g. emergency override, transfer to non-AI system' },
  ]},
  { section: 'System Design', fields: [
    { label: 'Adaptability', placeholder: 'e.g. domain adaptation, periodic updates' },
    { label: 'Learning frequency', placeholder: 'e.g. online learning, offline learning' },
    { label: 'Label AI content', placeholder: 'e.g. explicit watermark, implicit watermark' },
    { label: 'Content moderation', placeholder: 'e.g. automated moderation, distributed moderation, reactive moderation' },
    { label: 'Human machine interface', placeholder: 'e.g. multi-modal interfaces, user alert prioritisation, challenge-response protocol, rate limiting' },
    { label: 'User information', placeholder: 'e.g. clear method for deactivation, user alert' },
    { label: 'In-use monitoring', placeholder: 'e.g. misuse detection, ODD monitoring, OOD monitoring, anomaly detection, bias detection' },
    { label: 'System health monitoring', placeholder: 'e.g. error messages, uptime tracking' },
  ]},
  { section: 'AI Models', fields: [
    { label: 'Model number', placeholder: 'e.g. single model, multiple models' },
    { label: 'Link to model cards', placeholder: 'e.g. URL' },
    { label: 'Limitations in datasets', placeholder: 'e.g. low model quality across adversarial inputs' },
  ]},
  { section: 'Software Architecture', fields: [
    { label: 'Power consumption control', placeholder: 'e.g. reduce precision, sparsity, throttling down' },
    { label: 'Library / framework', placeholder: 'e.g. PyTorch, TensorFlow, Keras, Pandas' },
    { label: 'Language', placeholder: 'e.g. Python, Java, C' },
    { label: 'Operating system', placeholder: 'e.g. Windows, Linux' },
  ]},
  { section: 'Software Requirements', fields: [
    { label: 'Latency', placeholder: 'e.g. 400ms' },
    { label: 'Precision', placeholder: 'e.g. FP32' },
  ]},
  { section: 'Hardware Architecture', fields: [
    { label: 'Infrastructure', placeholder: 'e.g. cloud computing, edge computing' },
    { label: 'Computing framework', placeholder: 'e.g. centralised, decentralised' },
    { label: 'Hardware', placeholder: 'e.g. ASIC, FPGA, CPU, GPU' },
    { label: 'Hardware redundancy', placeholder: 'e.g. cold redundancy, warm redundancy, hot redundancy' },
    { label: 'Data movement control', placeholder: 'e.g. accelerator, advanced memory technologies' },
    { label: 'Heat dissipation', placeholder: 'e.g. active cooling systems, passive cooling system' },
  ]},
  { section: 'Hardware Requirements', fields: [
    { label: 'Compute performance', placeholder: 'e.g. 50 TFLOPS' },
    { label: 'Cores', placeholder: 'e.g. 8000' },
    { label: 'Memory bandwidth', placeholder: 'e.g. 1200 GB/s' },
    { label: 'RAM / VRAM', placeholder: 'e.g. 48 GB' },
    { label: 'Thermal design power', placeholder: 'e.g. 400 Watts' },
  ]},
  { section: 'Assessment', fields: [
    { label: 'System quality', placeholder: 'e.g. key quality metrics' },
  ]},
  { section: 'Ethics', fields: [
    { label: 'Ethical considerations', placeholder: 'Insert statement from your legal/ethics team' },
  ]},
]

const MODEL_CARD: Section[] = [
  { section: 'Model ID', fields: [
    { label: 'Name', placeholder: 'e.g. PeopleNet' },
    { label: 'NSPECT ID', placeholder: 'e.g. NSPECT-7WIP-NP84' },
    { label: 'Model version', placeholder: 'e.g. version 1.2' },
    { label: 'Release date', placeholder: 'e.g. MM/DD/YYYY' },
    { label: 'Intended use', placeholder: 'e.g. person classification in image data' },
    { label: 'Owner', placeholder: 'e.g. Internal, 3rd party' },
    { label: 'Deployment', placeholder: 'e.g. global, US, UK, China, EU-27' },
    { label: 'Intended use case', placeholder: 'e.g. no specific industry, politics, transportation, financial, healthcare' },
    { label: 'Publication', placeholder: 'e.g. link to publication' },
    { label: 'Licensing', placeholder: 'e.g. commercial use, non-commercial use' },
  ]},
  { section: 'Model Design', fields: [
    { label: 'Model task', placeholder: 'e.g. regression, classification, clustering, data synthesis' },
    { label: 'General logic', placeholder: 'e.g. important features' },
    { label: 'Model parameter size', placeholder: 'e.g. 7B parameters' },
    { label: 'Optimisation', placeholder: 'e.g. accuracy, latency, fairness' },
    { label: 'Parameter function', placeholder: 'e.g. relevance of the different parameters' },
    { label: 'Model architecture', placeholder: 'e.g. CNN, Conformer, Transformer' },
    { label: 'Output type', placeholder: 'e.g. predictive, descriptive, generative' },
    { label: 'Input data modality', placeholder: 'e.g. audio, code, geospatial, image, text' },
    { label: 'Output data modality', placeholder: 'e.g. audio, code, video, image, text' },
  ]},
  { section: 'Infrastructure', fields: [
    { label: 'Supported hardware', placeholder: 'e.g. Hopper, Ampere' },
    { label: 'Supported operating system', placeholder: 'e.g. Linux, Windows' },
  ]},
  { section: 'Model Training', fields: [
    { label: 'Learning paradigm', placeholder: 'e.g. supervised learning, unsupervised learning, reinforcement learning' },
    { label: 'Dataset number', placeholder: 'e.g. single dataset, multiple datasets' },
    { label: 'Training/testing datasets intersect', placeholder: 'e.g. yes, no' },
    { label: 'Estimated training/testing compute', placeholder: 'e.g. GPU-hours' },
    { label: 'Link to dataset cards', placeholder: 'e.g. URL' },
    { label: 'Dataset size', placeholder: 'e.g. very large, large, medium, small' },
    { label: 'Limitations in datasets', placeholder: 'e.g. low coverage in night conditions' },
  ]},
  { section: 'AI Model Quality', fields: [
    { label: 'Key quality metric', placeholder: 'e.g. accuracy, precision, recall' },
    { label: 'Performance drivers (bias)', placeholder: 'e.g. model quality is impacted by height and age of data subjects' },
    { label: 'Model weakness (bias)', placeholder: 'e.g. model quality is insufficient for people under 100cm' },
    { label: 'Performance drivers (safety)', placeholder: 'e.g. model quality is impacted by ambient light and weather conditions' },
    { label: 'Model weakness (safety)', placeholder: 'e.g. model quality is insufficient in snowy conditions' },
    { label: 'Public benchmark results', placeholder: 'e.g. 0.7 recall achieved on CityScape Test' },
    { label: 'Inference performance', placeholder: 'e.g. FPS, ms' },
    { label: 'Computational efficiency', placeholder: 'e.g. computational resources used to develop, train, test and validate the AI system' },
  ]},
  { section: 'Ethics', fields: [
    { label: 'Ethical considerations', placeholder: 'Insert statement from your legal/ethics team' },
  ]},
]

const DATASET_CARD: Section[] = [
  { section: 'Dataset ID', fields: [
    { label: 'Name', placeholder: 'e.g. Crowd Human' },
    { label: 'NSPECT ID', placeholder: 'e.g. NSPECT-7WIP-NP84' },
    { label: 'Datacard URL', placeholder: 'e.g. URL' },
    { label: 'Original purpose', placeholder: 'e.g. traffic sign recognition' },
    { label: 'Publication', placeholder: 'e.g. link to publication' },
  ]},
  { section: 'Legal', fields: [
    { label: 'License', placeholder: 'e.g. commercial use, public domain, internal only' },
    { label: 'Permission', placeholder: 'e.g. Attribution, Consent' },
  ]},
  { section: 'Data Source', fields: [
    { label: 'Owner', placeholder: 'e.g. Internal, 3rd party' },
    { label: 'Origin', placeholder: 'e.g. provided data, observed data, derived data, synthetic data, web-scraped data' },
    { label: 'Pre-existing annotation', placeholder: 'e.g. metadata, labels' },
    { label: 'Data structure', placeholder: 'e.g. complex, unstructured, semi-structured, structured' },
    { label: 'Data domain', placeholder: 'e.g. domain-specific data, generic data' },
    { label: 'Data type', placeholder: 'e.g. audio, code, geospatial, graph, image, text, video' },
    { label: 'Data format', placeholder: 'e.g. JPEG, WAV, .csv, PNG' },
  ]},
  { section: 'Data Provisioning', fields: [
    { label: 'Provisioning methods', placeholder: 'e.g. streaming, replication, federation' },
    { label: 'Data storage hardware', placeholder: 'e.g. cloud - public, cloud - private, local' },
    { label: 'Data storage location', placeholder: 'e.g. AWS S3, Azure Blob' },
  ]},
  { section: 'Data Quality Model', fields: [
    { label: 'Properties', placeholder: 'e.g. Personal data, Toxic content, Intellectual property' },
    { label: 'Data currentness (bias)', placeholder: 'e.g. 90% of data samples are less than [X] months old' },
    { label: 'Data balance (bias)', placeholder: 'e.g. Number of data samples per class do not exceed [X]% of average class size' },
    { label: 'Data size (safety / robustness)', placeholder: 'e.g. [X] data samples' },
    { label: 'Data identifiability (privacy)', placeholder: 'e.g. [X]% of the data samples contain PII' },
    { label: 'Data credibility (security)', placeholder: 'e.g. [X]% of data samples confirmed to have no signs of corruption' },
  ]},
  { section: 'Decommissioning', fields: [
    { label: 'Data decommissioning strategy', placeholder: 'e.g. data deletion, data archiving, data transfer, data restriction' },
  ]},
]

const PROVENANCE_RECORD: Section[] = [
  { section: 'Dataset ID', fields: [
    { label: 'Name', placeholder: 'e.g. Crowd Human with PII removed' },
    { label: 'NSPECT ID', placeholder: 'e.g. NSPECT-7WIP-NP84' },
    { label: 'Datacard URL', placeholder: 'e.g. URL' },
    { label: 'Original dataset', placeholder: 'e.g. URL of source dataset' },
    { label: 'Intended purpose', placeholder: 'e.g. note targeted model' },
    { label: 'Key adaptations', placeholder: 'e.g. removing of PII' },
    { label: 'Publication', placeholder: 'e.g. link to publication' },
  ]},
  { section: 'Legal', fields: [
    { label: 'License', placeholder: 'e.g. commercial use, public domain, internal only' },
  ]},
  { section: 'Data Provisioning', fields: [
    { label: 'Provisioning methods', placeholder: 'e.g. streaming, replication, federation' },
    { label: 'Data storage hardware', placeholder: 'e.g. cloud - public, cloud - private, local' },
    { label: 'Data storage location', placeholder: 'e.g. AWS S3, Azure Blob' },
  ]},
  { section: 'Data Sanitisation', fields: [
    { label: 'Data sanitisation techniques', placeholder: 'e.g. cleaning, anonymisation, encryption, encoding' },
  ]},
  { section: 'Data Enrichment', fields: [
    { label: 'Data enrichment techniques', placeholder: 'e.g. imputation, aggregation, augmentation, metadata' },
    { label: 'Additional data labels', placeholder: 'e.g. categorical variable, continuous variable, bounding box, mask, metadata' },
    { label: 'Data labelling tools', placeholder: 'e.g. human, automated' },
    { label: 'Data labelling guidelines', placeholder: 'e.g. summary of labelling guidelines' },
  ]},
  { section: 'Data Optimisation', fields: [
    { label: 'Data sampling techniques', placeholder: 'e.g. random, clustered, subjective, convenience' },
    { label: 'Data compression techniques', placeholder: 'e.g. lossless, lossy' },
  ]},
  { section: 'Data Quality Model', fields: [
    { label: 'Properties', placeholder: 'e.g. Personal data, Toxic content, Intellectual property' },
    { label: 'Data currentness (bias)', placeholder: 'e.g. 90% of data samples are less than [X] months old' },
    { label: 'Data balance (bias)', placeholder: 'e.g. Number of data samples per class do not exceed [X]% of average class size' },
    { label: 'Data size (safety / robustness)', placeholder: 'e.g. [X] data samples' },
    { label: 'Data identifiability (privacy)', placeholder: 'e.g. [X]% of the data samples contain PII' },
    { label: 'Data credibility (security)', placeholder: 'e.g. [X]% of data samples confirmed to have no signs of corruption' },
  ]},
  { section: 'Decommissioning', fields: [
    { label: 'Data decommissioning strategy', placeholder: 'e.g. data deletion, data archiving, data transfer, data restriction' },
  ]},
]

const CARD_TYPES = [
  {
    id: 'system-card',
    label: 'System Card',
    icon: '🏗️',
    description: 'Document your full AI system: architecture, infrastructure, governance, and deployment context.',
    template: SYSTEM_CARD,
  },
  {
    id: 'model-card',
    label: 'Model Card',
    icon: '🤖',
    description: 'Capture model design, training details, quality metrics, and ethical considerations.',
    template: MODEL_CARD,
  },
  {
    id: 'dataset-card',
    label: 'Dataset Card',
    icon: '🗃️',
    description: 'Describe dataset composition, provenance, quality properties, and lifecycle management.',
    template: DATASET_CARD,
  },
  {
    id: 'provenance-record',
    label: 'Provenance Record',
    icon: '🔍',
    description: 'Track data transformations, sanitisation, enrichment, and optimisation applied to a derived dataset.',
    template: PROVENANCE_RECORD,
  },
] as const

// ─── Template table view ───────────────────────────────────────────────────────
function TemplateTable({ sections }: { sections: Section[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="w-full text-sm border-collapse">
        <tbody>
          {sections.map((sec) =>
            sec.fields.map((field, fi) => (
              <tr key={`${sec.section}-${fi}`} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                {fi === 0 && (
                  <td
                    rowSpan={sec.fields.length}
                    className="w-36 px-4 py-2.5 text-xs font-semibold text-white align-top border-r border-indigo-700 whitespace-nowrap"
                    style={{ backgroundColor: '#1E1B4B', verticalAlign: 'top' }}
                  >
                    <div className="sticky top-0">{sec.section}</div>
                  </td>
                )}
                <td className="w-48 px-4 py-2.5 text-xs font-medium text-gray-600 border-r border-gray-100 whitespace-nowrap align-top">
                  {field.label}
                </td>
                <td className="px-4 py-2.5 text-xs text-gray-400 italic">
                  {field.placeholder}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

// ─── Main client component ─────────────────────────────────────────────────────
export default function CardsClient({ initialCounts }: { initialCounts: Record<string, number> }) {
  const [activeTab, setActiveTab] = useState<string>('system-card')
  const [counts, setCounts] = useState(initialCounts)
  const [downloading, setDownloading] = useState<string | null>(null)

  const active = CARD_TYPES.find((c) => c.id === activeTab)!

  async function handleDownload(cardId: string, label: string) {
    setDownloading(cardId)
    try {
      // Increment counter
      const res = await fetch(`/api/cards/${cardId}/download`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setCounts((prev) => ({ ...prev, [cardId]: data.downloadCount }))
      }

      // Generate and download CSV template (works without server-side DOCX generation)
      const card = CARD_TYPES.find((c) => c.id === cardId)!
      const rows = [['Section', 'Field', 'Value']]
      for (const sec of card.template) {
        for (const f of sec.fields) {
          rows.push([sec.section, f.label, ''])
        }
      }
      const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${cardId}-template.csv`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#1E1B4B' }}>Cards &amp; Templates</h1>
        <p className="text-sm text-gray-500 mt-1">
          Standardised transparency templates based on AI governance best practice. View online or download as CSV.
        </p>
      </div>

      {/* Tab strip */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        {CARD_TYPES.map((card) => (
          <button
            key={card.id}
            onClick={() => setActiveTab(card.id)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px"
            style={
              activeTab === card.id
                ? { color: '#1E1B4B', borderColor: '#1E1B4B' }
                : { color: '#6B7280', borderColor: 'transparent' }
            }
          >
            <span>{card.icon}</span>
            {card.label}
          </button>
        ))}
      </div>

      {/* Active card */}
      <div>
        {/* Card meta + download */}
        <div className="flex items-start justify-between mb-5 gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span>{active.icon}</span>
              {active.label}
            </h2>
            <p className="text-sm text-gray-500 mt-1 max-w-xl">{active.description}</p>
          </div>
          <button
            onClick={() => handleDownload(active.id, active.label)}
            disabled={downloading === active.id}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
            style={{ backgroundColor: '#F59E0B', color: '#1E1B4B' }}
          >
            {downloading === active.id ? (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
              </svg>
            )}
            Download CSV
            <span
              className="ml-1 px-1.5 py-0.5 rounded text-xs font-bold"
              style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
            >
              {counts[active.id] ?? 0}
            </span>
          </button>
        </div>

        {/* Template table */}
        <TemplateTable sections={active.template as unknown as Section[]} />

        {/* Field count */}
        <p className="text-xs text-gray-400 mt-3 text-right">
          {active.template.reduce((n, s) => n + s.fields.length, 0)} fields across {active.template.length} sections
        </p>
      </div>
    </div>
  )
}
