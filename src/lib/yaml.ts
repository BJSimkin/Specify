import yaml from 'js-yaml'
import type { PackageFormData, RequirementFormData, SubRequirementFormData } from '@/types'

interface SpecifyYamlShape {
  specify_version?: string
  metadata?: {
    name?: string
    version?: string
    description?: string
    license?: string
    authors?: Array<{ name?: string; org?: string; profile?: string }>
    created?: string
    updated?: string
    forked_from?: { package?: string; version?: string; url?: string }
    tags?: {
      use_case?: string[]
      industry?: string[]
      model_type?: string[]
      deployment_env?: string[]
      risk_tier?: string[]
      custom?: string[]
    }
  }
  requirements?: Array<{
    id?: string
    title?: string
    tags?: string[]
    obligation?: string
    body?: string
    depends_on?: string[]
    sub_requirements?: Array<{
      id?: string
      title?: string
      obligation?: string
      body?: string
    }>
  }>
  vendors?: Record<string, Array<{ name?: string; url?: string; purpose?: string; verified?: boolean }>>
  governance?: {
    risk_tier?: string
    nist_ai_rmf?: { functions?: string[] }
    compliance?: Array<{ standard?: string; status?: string }>
    data_privacy?: { pii_handled?: boolean; frameworks?: string[] }
  }
}

export function generateYaml(data: PackageFormData): string {
  const doc: SpecifyYamlShape = {
    specify_version: '0.1',
    metadata: {
      name: data.name,
      version: data.version,
      description: data.description,
      license: data.license,
      created: new Date().toISOString().split('T')[0],
      updated: new Date().toISOString().split('T')[0],
      tags: {
        use_case: data.useCases,
        industry: data.industries,
        model_type: data.modelTypes,
        deployment_env: data.deploymentEnvs,
        risk_tier: data.riskTier ? [data.riskTier] : [],
        custom: data.customTags,
      },
    },
    requirements: data.requirements.map((req) => ({
      id: req.id,
      title: req.title,
      tags: req.tags,
      obligation: req.obligation,
      body: req.body,
      depends_on: req.dependsOn,
      sub_requirements: req.subRequirements.map((sub) => ({
        id: sub.id,
        title: sub.title,
        obligation: sub.obligation,
        body: sub.body,
      })),
    })),
  }

  if (data.vendors && Object.keys(data.vendors).length > 0) {
    doc.vendors = {}
    for (const [category, entries] of Object.entries(data.vendors)) {
      if (entries && entries.length > 0) {
        doc.vendors[category] = entries
      }
    }
  }

  if (data.governance) {
    doc.governance = {
      risk_tier: data.governance.riskTier,
      nist_ai_rmf: data.governance.nistFunctions
        ? { functions: data.governance.nistFunctions }
        : undefined,
      compliance: data.governance.compliance?.map((c) => ({
        standard: c.standard,
        status: c.status,
      })),
      data_privacy: {
        pii_handled: data.governance.piiHandled ?? false,
        frameworks: data.governance.privacyFrameworks ?? [],
      },
    }
  }

  return yaml.dump(doc, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
    quotingType: '"',
  })
}

export function parseYaml(content: string): PackageFormData {
  const doc = yaml.load(content) as SpecifyYamlShape

  const meta = doc.metadata ?? {}
  const tags = meta.tags ?? {}

  const requirements: RequirementFormData[] = (doc.requirements ?? []).map((req) => ({
    id: req.id ?? '',
    title: req.title ?? '',
    tags: req.tags ?? [],
    obligation: (req.obligation as 'shall' | 'should') ?? 'shall',
    body: req.body ?? '',
    dependsOn: req.depends_on ?? [],
    subRequirements: (req.sub_requirements ?? []).map(
      (sub): SubRequirementFormData => ({
        id: sub.id ?? '',
        title: sub.title ?? '',
        obligation: (sub.obligation as 'shall' | 'should') ?? 'shall',
        body: sub.body ?? '',
      })
    ),
  }))

  return {
    name: meta.name ?? '',
    description: meta.description ?? '',
    version: meta.version ?? '0.1.0',
    license: meta.license ?? 'MIT',
    useCases: tags.use_case ?? [],
    industries: tags.industry ?? [],
    modelTypes: tags.model_type ?? [],
    deploymentEnvs: tags.deployment_env ?? [],
    riskTier: tags.risk_tier?.[0] ?? '',
    customTags: tags.custom ?? [],
    requirements,
    vendors: doc.vendors as PackageFormData['vendors'],
    governance: doc.governance
      ? {
          riskTier: doc.governance.risk_tier ?? '',
          nistFunctions: doc.governance.nist_ai_rmf?.functions ?? [],
          compliance: (doc.governance.compliance ?? []).map((c) => ({
            standard: c.standard ?? '',
            status: (c.status as 'compliant' | 'in-progress' | 'not-applicable') ?? 'in-progress',
          })),
          piiHandled: doc.governance.data_privacy?.pii_handled ?? false,
          privacyFrameworks: doc.governance.data_privacy?.frameworks ?? [],
        }
      : undefined,
  }
}

export function validateYaml(content: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  let doc: SpecifyYamlShape
  try {
    doc = yaml.load(content) as SpecifyYamlShape
  } catch (e) {
    return { valid: false, errors: [`YAML parse error: ${(e as Error).message}`] }
  }

  if (!doc || typeof doc !== 'object') {
    return { valid: false, errors: ['Document is not a valid YAML object'] }
  }

  if (!doc.specify_version) {
    errors.push('Missing required field: specify_version')
  }

  if (!doc.metadata) {
    errors.push('Missing required section: metadata')
  } else {
    if (!doc.metadata.name) errors.push('metadata.name is required')
    if (!doc.metadata.version) errors.push('metadata.version is required')
  }

  if (doc.requirements) {
    if (!Array.isArray(doc.requirements)) {
      errors.push('requirements must be an array')
    } else {
      doc.requirements.forEach((req, i) => {
        if (!req.id) errors.push(`requirements[${i}].id is required`)
        if (!req.title) errors.push(`requirements[${i}].title is required`)
        if (req.obligation && !['shall', 'should'].includes(req.obligation)) {
          errors.push(`requirements[${i}].obligation must be "shall" or "should"`)
        }
      })
    }
  }

  return { valid: errors.length === 0, errors }
}
