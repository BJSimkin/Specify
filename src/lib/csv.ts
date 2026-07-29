import type { Requirement, SubRequirement } from '@/types'

type RequirementWithSubs = Requirement & {
  subRequirements: SubRequirement[]
}

function escapeField(value: string): string {
  // If the field contains commas, newlines, or double quotes, wrap in double quotes
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function toRow(fields: string[]): string {
  return fields.map(escapeField).join(',')
}

export function generateCsv(requirements: RequirementWithSubs[]): string {
  const header = ['ID', 'Title', 'Tags', 'Obligation', 'Body', 'Depends On', 'Sub-requirements']

  const rows: string[][] = []

  for (const req of requirements) {
    const subReqSummary = req.subRequirements
      .map((sub) => `${sub.subId}: ${sub.title}`)
      .join('; ')

    rows.push([
      req.reqId,
      req.title,
      req.tags.join('; '),
      req.obligation.toLowerCase(),
      req.body ?? '',
      req.dependsOn.join('; '),
      subReqSummary,
    ])

    // Also add sub-requirements as their own rows (indented)
    for (const sub of req.subRequirements) {
      rows.push([
        `  ${sub.subId}`,
        sub.title,
        '',
        sub.obligation.toLowerCase(),
        sub.body ?? '',
        '',
        '',
      ])
    }
  }

  const lines = [toRow(header), ...rows.map(toRow)]
  return lines.join('\n')
}
