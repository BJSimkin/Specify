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
      include: { author: true }
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

// Tag vocabulary constants
export const USE_CASES = [
  'rag-pipeline',
  'agent',
  'classifier',
  'fine-tuned-model',
  'embedding',
  'multimodal',
  'guardrails',
  'evaluation',
  'observability',
  'code-generation',
  'search',
] as const

export const INDUSTRIES = [
  'technology',
  'finance',
  'healthcare',
  'legal',
  'retail',
  'government',
  'education',
  'energy',
  'insurance',
  'defence',
] as const

export const MODEL_TYPES = [
  'llm',
  'slm',
  'vlm',
  'embedding',
  'diffusion',
  'speech',
  'code',
  'reasoning',
  'multimodal',
  'reranker',
] as const

export const DEPLOYMENT_ENVS = ['cloud', 'on-prem', 'edge', 'hybrid'] as const

export const RISK_TIERS = ['minimal', 'limited', 'high', 'unacceptable'] as const

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

export const REQ_TAG_TYPES = ['data', 'model', 'system', 'infrastructure'] as const

export type UseCase = (typeof USE_CASES)[number]
export type Industry = (typeof INDUSTRIES)[number]
export type ModelType = (typeof MODEL_TYPES)[number]
export type DeploymentEnv = (typeof DEPLOYMENT_ENVS)[number]
export type RiskTier = (typeof RISK_TIERS)[number]
export type Certifier = (typeof CERTIFIERS)[number]
export type License = (typeof LICENSES)[number]

export interface PackageFormData {
  name: string
  description: string
  version: string
  license: string
  useCases: string[]
  industries: string[]
  modelTypes: string[]
  deploymentEnvs: string[]
  riskTier: string
  customTags: string[]
  requirements: RequirementFormData[]
  vendors?: VendorCategory
  governance?: GovernanceData
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
