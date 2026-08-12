import React from 'react'

interface LogoProps {
  size?: number
}

export function Logo({ size = 32 }: LogoProps) {
  const s = size / 48
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Sequel logo"
      style={{ display: 'block' }}
    >
      <rect width="48" height="48" rx="10" fill="#2C4A3A"/>
      <rect x="5" y="5"  width="38" height="8" rx="1.5" fill="#3A6048" opacity="0.65"/>
      <rect x="5" y="15" width="38" height="8"           fill="#304E3E" opacity="0.8"/>
      <rect x="5" y="25" width="38" height="8"           fill="#264234" opacity="0.9"/>
      <rect x="5" y="35" width="38" height="8" rx="1.5" fill="#1C3628"/>
      <line x1="5"  y1="15" x2="43" y2="15" stroke="#4A7458" strokeWidth="0.6" opacity="0.5"/>
      <line x1="5"  y1="25" x2="43" y2="25" stroke="#405E4A" strokeWidth="0.6" opacity="0.4"/>
      <line x1="5"  y1="35" x2="43" y2="35" stroke="#365240" strokeWidth="0.6" opacity="0.35"/>
      <line x1="32" y1="5"  x2="32" y2="43" stroke="#E8622A" strokeWidth="0.8" strokeDasharray="2 3.5" opacity="0.45"/>
      <circle cx="32" cy="7" r="3" fill="#E8622A"/>
    </svg>
  )
}

export function LogoWithWordmark({ size = 32 }: LogoProps) {
  const textSize = Math.round(size * 0.56)
  const gap = Math.round(size * 0.28)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap }}>
      <Logo size={size} />
      <span
        style={{
          fontSize: textSize,
          fontWeight: 700,
          color: '#F0ECE4',
          letterSpacing: '-0.025em',
          fontFamily: "'Playfair Display', Georgia, serif",
          lineHeight: 1,
        }}
      >
        sequel
      </span>
    </div>
  )
}
