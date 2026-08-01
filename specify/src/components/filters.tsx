'use client'

import { TAXONOMY, CERTIFIERS } from '@/types'
import type { FilterState } from '@/types'

const INDUSTRIES = TAXONOMY.useCase.groups.industry.values
const BUSINESS_FUNCTIONS = TAXONOMY.useCase.groups.businessFunction.values
const WORKFLOWS = TAXONOMY.useCase.groups.workflow.values
const MODEL_TASKS = TAXONOMY.model.groups.task.values

interface FiltersProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
}

function FilterSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-5">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <div
        className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors"
        style={{
          backgroundColor: checked ? '#1E1B4B' : 'white',
          borderColor: checked ? '#1E1B4B' : '#D1D5DB',
        }}
        onClick={() => onChange(!checked)}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="white">
            <path d="M1.5 6l3 3 6-6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className="text-sm text-gray-700 group-hover:text-gray-900">
        {label}
      </span>
    </label>
  )
}

// "ANY" row — checked when the group array is empty
function AnyCheckbox({ active, onClear }: { active: boolean; onClear: () => void }) {
  return (
    <FilterCheckbox
      label="ANY"
      checked={active}
      onChange={(checked) => { if (checked) onClear() }}
    />
  )
}

export function Filters({ filters, onChange }: FiltersProps) {
  function toggle(key: keyof Pick<FilterState, 'industries' | 'businessFunctions' | 'workflows' | 'modelTasks' | 'certifiers'>, value: string) {
    const current = filters[key] as string[]
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onChange({ ...filters, [key]: next })
  }

  const activeCount =
    filters.industries.length +
    filters.businessFunctions.length +
    filters.workflows.length +
    filters.modelTasks.length +
    filters.certifiers.length +
    (filters.verifiedOnly ? 1 : 0)

  return (
    <div className="w-56 flex-shrink-0">
      <div className="sticky top-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
          {activeCount > 0 && (
            <button
              onClick={() =>
                onChange({
                  industries: [],
                  businessFunctions: [],
                  workflows: [],
                  modelTasks: [],
                  certifiers: [],
                  verifiedOnly: false,
                })
              }
              className="text-xs text-indigo-600 hover:text-indigo-800"
            >
              Clear all ({activeCount})
            </button>
          )}
        </div>

        <FilterSection title="Industry">
          <AnyCheckbox active={filters.industries.length === 0} onClear={() => onChange({ ...filters, industries: [] })} />
          {INDUSTRIES.map((v) => (
            <FilterCheckbox
              key={v}
              label={v}
              checked={filters.industries.includes(v)}
              onChange={() => toggle('industries', v)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Business function">
          <AnyCheckbox active={filters.businessFunctions.length === 0} onClear={() => onChange({ ...filters, businessFunctions: [] })} />
          {BUSINESS_FUNCTIONS.map((v) => (
            <FilterCheckbox
              key={v}
              label={v}
              checked={filters.businessFunctions.includes(v)}
              onChange={() => toggle('businessFunctions', v)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Workflow">
          <AnyCheckbox active={filters.workflows.length === 0} onClear={() => onChange({ ...filters, workflows: [] })} />
          {WORKFLOWS.map((v) => (
            <FilterCheckbox
              key={v}
              label={v}
              checked={filters.workflows.includes(v)}
              onChange={() => toggle('workflows', v)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Model task">
          <AnyCheckbox active={filters.modelTasks.length === 0} onClear={() => onChange({ ...filters, modelTasks: [] })} />
          {MODEL_TASKS.map((v) => (
            <FilterCheckbox
              key={v}
              label={v}
              checked={filters.modelTasks.includes(v)}
              onChange={() => toggle('modelTasks', v)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Certified by">
          <AnyCheckbox active={filters.certifiers.length === 0} onClear={() => onChange({ ...filters, certifiers: [] })} />
          {CERTIFIERS.map((cert) => (
            <FilterCheckbox
              key={cert}
              label={cert}
              checked={filters.certifiers.includes(cert)}
              onChange={() => toggle('certifiers', cert)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Other">
          <FilterCheckbox
            label="Verified authors only"
            checked={filters.verifiedOnly}
            onChange={(checked) => onChange({ ...filters, verifiedOnly: checked })}
          />
        </FilterSection>
      </div>
    </div>
  )
}
