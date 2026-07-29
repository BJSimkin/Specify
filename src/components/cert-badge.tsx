import { CERTIFIER_COLORS, CERTIFIER_DISPLAY_MAP } from '@/types'

interface CertBadgeProps {
  certifier: string // DB enum value or display name
  size?: 'sm' | 'md'
}

export function CertBadge({ certifier, size = 'md' }: CertBadgeProps) {
  // Accept both DB enum values and display names
  const displayName = CERTIFIER_DISPLAY_MAP[certifier] ?? certifier
  const colors = CERTIFIER_COLORS[displayName] ?? {
    bg: '#F3F4F6',
    text: '#374151',
    border: '#D1D5DB',
  }

  const isSmall = size === 'sm'

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full font-medium border"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border,
        fontSize: isSmall ? 11 : 12,
        padding: isSmall ? '1px 7px' : '2px 10px',
      }}
    >
      {/* Certificate icon */}
      <svg
        width={isSmall ? 10 : 12}
        height={isSmall ? 10 : 12}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
      </svg>
      {displayName}
    </span>
  )
}
