'use client'

import { USE_CASES, INDUSTRIES, CERTIFIERS } from '@/types'
import type { FilterState } from '@/types'

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
      <span className="text-sm text-gray-700 group-hover:text-gray-900 capitalize">
        {label}
      </span>
    </label>
  )
}

export function Filters({ filters, onChange }: FiltersProps) {
  function toggleUseCase(value: string) {
    const next = filters.useCases.includes(value)
      ? filters.useCases.filter((v) => v !== value)
      : [...filters.useCases, value]
    onChange({ ...filters, useCases: next })
  }

  function toggleIndustry(value: string) {
    const next = filters.industries.includes(value)
      ? filters.industries.filter((v) => v !== value)
      : [...filters.industries, value]
    onChange({ ...filters, industries: next })
  }

  function toggleCertifier(value: string) {
    const next = filters.certifiers.includes(value)
      ? filters.certifiers.filter((v) => v !== value)
      : [...filters.certifiers, value]
    onChange({ ...filters, certifiers: next })
  }

  const activeCount =
    filters.useCases.length +
    filters.industries.length +
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
                onChange({ useCases: [], industries: [], certifiers: [], verifiedOnly: false })
              }
              className="text-xs text-indigo-600 hover:text-indigo-800"
            >
              Clear all ({activeCount})
            </button>
          )}
        </div>

        <FilterSection title="Use case">
          {USE_CASES.map((uc) => (
            <FilterCheckbox
              key={uc}
              label={uc}
              checked={filters.useCases.includes(uc)}
              onChange={() => toggleUseCase(uc)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Industry">
          {INDUSTRIES.map((ind) => (
            <FilterCheckbox
              key={ind}
              label={ind}
              checked={filters.industries.includes(ind)}
              onChange={() => toggleIndustry(ind)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Certified by">
          {CERTIFIERS.map((cert) => (
            <FilterCheckbox
              key={cert}
              label={cert}
              checked={filters.certifiers.includes(cert)}
              onChange={() => toggleCertifier(cert)}
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
