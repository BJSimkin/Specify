import type { Prisma } from '@prisma/client'

export type { User, Package, Requirement, SubRequirement, Comment, Star, Fork, Certification, Tag, Notification, UserPreference, PackageVersion } from '@prisma/client'
export { Obligation, CertifierType, TagCategory, NotificationType } from '@prisma/client'

export type PackageWithRelations = Prisma.PackageGetPayload<{
  include: {
    author: true
    requirements: {
      include: {
        subRequirements: true
        comments: {
          include: { author: true }
        }
      }
    }
    certifications: {
      include: { grantedBy: true }
    }
    tags: true
    versions: {
      include: { publishedBy: true }
    }
    forkedFrom: {
      include: {
        author: true
        requirements: true
      }
    }
    forks: {
      include: { author: true }
    }
    contributors: {
      include: {
        user: {
          select: { id: true; name: true; username: true; image: true; org: true }
        }
      }
    }
    _count: {
      select: { stars: true; forks: true; comments: true }
    }
  }
}>

export type PackageCard = Prisma.PackageGetPayload<{
  include: {
    author: true
    certifications: true
    tags: true
    _count: {
      select: { stars: true; forks: true; comments: true; versions: true }
    }
  }
}>

export type CommentWithAuthor = Prisma.CommentGetPayload<{
  include: { author: true }
}>

export type NotificationWithActor = Prisma.NotificationGetPayload<{
  include: {
    user: true
  }
}>

// ─── Full taxonomy ─────────────────────────────────────────────────────────────

export const TAXONOMY = {
  useCase: {
    label: 'Use Case',
    groups: {
      market: {
        label: 'Market',
        values: ['US', 'Canada', 'UK', 'EU', 'China'],
      },
      organisation: {
        label: 'Organisation',
        values: ['Association', 'Corporation', 'Public sector', 'Startup', 'Research Institution'],
      },
      industry: {
        label: 'Industry',
        values: [
          'Agriculture', 'Mining', 'Politics', 'Manufacturing', 'Electricity',
          'Water supply', 'Construction', 'Transportation', 'Financial',
          'Real estate activities', 'Education', 'Healthcare', 'Entertainment',
        ],
      },
      businessFunction: {
        label: 'Business function',
        values: [
          'Human Resources', 'Marketing', 'Customer Service & Support', 'Sales',
          'Accounting & Finance', 'Supply chain management and distribution',
          'Research & Development', 'Production', 'Operations', 'IT & Security',
          'Purchasing and Procurement', 'Legal & Compliance', 'Enterprise Intelligence',
          'Cross-functional',
        ],
      },
      deploymentScale: {
        label: 'Deployment scale',
        values: ['Widespread deployment', 'Broad deployment', 'Narrow deployment', 'Pilot project'],
      },
      automation: {
        label: 'Automation',
        values: ['Autonomous', 'Human-in-command', 'Human-in-the-loop', 'Human-on-the-loop'],
      },
    },
  },
  model: {
    label: 'Model',
    groups: {
      task: {
        label: 'Task',
        values: [
          'Regression', 'Classification', 'Clustering', 'Computer vision',
          'Dimensionality reduction', 'Image recognition', 'Natural language processing',
          'Recommender system', 'Drug discovery', 'Deepfake', 'Semantic segmentation',
          'Anomaly detection', 'Similarity search', 'Biometric identification', 'Emotion recognition',
        ],
      },
      modelArchitecture: {
        label: 'Model architecture',
        values: [
          'AdaBoost', 'Adam optimization', 'Agglomerative clustering', 'ARMA / ARIMA',
          'Generative adversarial network', 'Transformer', 'Bayesian network',
          'Capsule network', 'Convolutional neural network', 'Decision tree',
          'Deep boltzmann machine', 'Diffusion model', 'K-means clustering',
          'Language model', 'Linear regression', 'Logistic regression',
          'Long short-term memory network', 'Neural radiance field', 'Random forest',
          'Support vector machine', 'Structured perceptron', 'Variational Autoencoders',
        ],
      },
      learningParadigm: {
        label: 'Learning paradigm',
        values: [
          'Active learning', 'Constitutional AI', 'Continuous learning', 'Contrastive learning',
          'Ensemble learning', 'Federated learning', 'Fine-tuning', 'Reinforcement learning',
          'Reinforcement learning from human feedback', 'Imitation learning',
          'Self supervised learning', 'Self alignment', 'Supervised learning',
          'Transfer learning', 'Unsupervised learning', 'Grounding',
          'Retrieval augmented generation',
        ],
      },
      dataSource: {
        label: 'Data source',
        values: [
          'Data collected by humans', 'Data from automated sensors',
          'Derived data', 'Observed data', 'Synthetic data',
        ],
      },
      dataProperties: {
        label: 'Data properties',
        values: ['Personal data', 'Proprietary data', 'Public data'],
      },
      dataStructure: {
        label: 'Data structure',
        values: ['Complex data structure', 'Structured data', 'Unstructured data', 'Semi-structured data'],
      },
      dataType: {
        label: 'Data type',
        values: ['Qualitative data', 'Quantitative data'],
      },
      datasetSize: {
        label: 'Dataset size',
        values: ['Very large dataset', 'Large dataset', 'Medium dataset', 'Small dataset'],
      },
      dataFormat: {
        label: 'Data format',
        values: ['Audio', 'Code', 'Geospatial', 'Graph', 'Tabular', 'Image', 'Text', 'Video', 'Multimodal'],
      },
    },
  },
  aiSystem: {
    label: 'AI System',
    groups: {
      learningLocation: {
        label: 'Learning location',
        values: [
          'Model trained at edge',
          'Model trained in the cloud',
          'Model trained in the cloud and the edge',
        ],
      },
      learningTime: {
        label: 'Learning time',
        values: ['Offline learning', 'Online learning'],
      },
      dataSpeed: {
        label: 'Data speed',
        values: ['Static data', 'Batch data', 'Continuous data', 'Real-time data'],
      },
      infrastructure: {
        label: 'Infrastructure',
        values: ['Cloud computing', 'Edge computing'],
      },
      computingFramework: {
        label: 'Computing framework',
        values: ['Centralised', 'Decentralised', 'Distributed'],
      },
      hardware: {
        label: 'Hardware',
        values: ['ASIC', 'CPU', 'FPGA', 'GPU'],
      },
    },
  },
} as const

export type TaxonomyData = {
  [type in 'useCase' | 'model' | 'aiSystem']?: {
    [group: string]: string[]
  }
}

export const COMPLIANCE_OPTIONS = [
  'EU AI Act - High Risk AI System',
  'EU AI Act - GPAI',
  'EU AI Act - GPAISR',
  'NIST Risk Management Framework',
  'ISO 42001',
] as const

export const CERTIFIERS = ['TÜV SÜD', 'BSI', 'EU AI Office'] as const

export const CERTIFIER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'TÜV SÜD': { bg: '#FEF3C7', text: '#78350F', border: '#F59E0B' },
  BSI: { bg: '#EFF6FF', text: '#1D4ED8', border: '#93C5FD' },
  'EU AI Office': { bg: '#ECFDF5', text: '#065F46', border: '#6EE7B7' },
}

export const CERTIFIER_DB_MAP: Record<string, string> = {
  'TÜV SÜD': 'TUV_SUD',
  BSI: 'BSI',
  'EU AI Office': 'EU_AI_OFFICE',
}

export const CERTIFIER_DISPLAY_MAP: Record<string, string> = {
  TUV_SUD: 'TÜV SÜD',
  BSI: 'BSI',
  EU_AI_OFFICE: 'EU AI Office',
}

export const LICENSES = ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'CC-BY-4.0', 'Proprietary'] as const

// Legacy constants kept for search/filter compatibility
export const USE_CASES = [
  'rag-pipeline', 'agent', 'classifier', 'fine-tuned-model', 'embedding',
  'multimodal', 'guardrails', 'evaluation', 'observability', 'code-generation', 'search',
] as const

export const INDUSTRIES = [
  'technology', 'finance', 'healthcare', 'legal', 'retail',
  'government', 'education', 'energy', 'insurance', 'defence',
] as const

export const MODEL_TYPES = [
  'llm', 'slm', 'vlm', 'embedding', 'diffusion', 'speech', 'code', 'reasoning', 'multimodal', 'reranker',
] as const

export const DEPLOYMENT_ENVS = ['cloud', 'on-prem', 'edge', 'hybrid'] as const
export const RISK_TIERS = ['minimal', 'limited', 'high', 'unacceptable'] as const

export const REQ_TAG_TYPES = [
  'functional', 'performance', 'security', 'privacy', 'fairness',
  'explainability', 'robustness', 'governance', 'data', 'monitoring',
] as const

export type UseCase = (typeof USE_CASES)[number]
export type Industry = (typeof INDUSTRIES)[number]
export type ModelType = (typeof MODEL_TYPES)[number]
export type DeploymentEnv = (typeof DEPLOYMENT_ENVS)[number]
export type RiskTier = (typeof RISK_TIERS)[number]
export type Certifier = (typeof CERTIFIERS)[number]
export type License = (typeof LICENSES)[number]

// ─── AI Model reference with purpose and model types ──────────────────────────
export interface AIModelRef {
  url: string
  name: string
  purpose: string
  modelTypes: string[] // from model.task + model.modelArchitecture
}

export interface DatasetRef {
  url: string
  name: string
  purpose: string
}

export interface VendorRef {
  name: string
  url: string
  purpose: string
}

export interface PackageFormData {
  name: string
  description: string
  version: string
  license: string
  // New taxonomy (replaces useCases/industries/modelTypes/deploymentEnvs/riskTier)
  taxonomyData: TaxonomyData
  customTaxonomyTags: string[]
  // AI models with purpose
  aiModels: AIModelRef[]
  // Datasets with purpose
  datasetRefs: DatasetRef[]
  // Vendors
  vendorList: VendorRef[]
  // Compliance
  complianceTargets: string[]
  otherCompliance: string
  // Open source flag
  isOpenSource: boolean
  // Publication date
  publishedAt: string
  // Legacy (kept for backward compat with existing packages)
  customTags: string[]
  requirements: RequirementFormData[]
}

export interface RequirementFormData {
  id: string
  title: string
  tags: string[]
  obligation: 'shall' | 'should'
  body: string
  dependsOn: string[]
  subRequirements: SubRequirementFormData[]
}

export interface SubRequirementFormData {
  id: string
  title: string
  obligation: 'shall' | 'should'
  body: string
}

export interface VendorCategory {
  evals?: VendorEntry[]
  monitoring?: VendorEntry[]
  data?: VendorEntry[]
  inference?: VendorEntry[]
  security?: VendorEntry[]
}

export interface VendorEntry {
  name: string
  url: string
  purpose: string
  verified?: boolean
}

export interface GovernanceData {
  riskTier: string
  nistFunctions?: string[]
  compliance?: ComplianceEntry[]
  piiHandled?: boolean
  privacyFrameworks?: string[]
}

export interface ComplianceEntry {
  standard: string
  status: 'compliant' | 'in-progress' | 'not-applicable'
}

export interface FilterState {
  useCases: string[]
  industries: string[]
  certifiers: string[]
  verifiedOnly: boolean
}

export interface SearchParams {
  q?: string
  uc?: string
  ind?: string
  cert?: string
  sort?: 'stars' | 'forks' | 'recent' | 'downloads'
  page?: string
}
