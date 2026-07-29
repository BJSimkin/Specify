import React from 'react'

interface LogoProps {
  size?: number
}

export function Logo({ size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Specify logo"
    >
      {/* Background rounded square */}
      <rect width="32" height="32" rx="7" fill="#1E1B4B" />
      {/* Amber top accent bar */}
      <rect x="0" y="0" width="32" height="3.5" rx="1.75" fill="#F59E0B" />
      {/* Left bracket [ */}
      <path
        d="M6 9 L6 23 L9.5 23 L9.5 21.5 L7.5 21.5 L7.5 10.5 L9.5 10.5 L9.5 9 Z"
        fill="#F59E0B"
      />
      {/* Right bracket ] */}
      <path
        d="M26 9 L22.5 9 L22.5 10.5 L24.5 10.5 L24.5 21.5 L22.5 21.5 L22.5 23 L26 23 Z"
        fill="#F59E0B"
      />
      {/* S letterform */}
      <path
        d="M19.5 11.5 C19.5 11.5 18.5 10 16 10 C13.5 10 12 11.5 12 13.2 C12 14.9 13.2 15.8 15.5 16.3 L17 16.7 C18.5 17.1 19.2 17.8 19.2 19 C19.2 20.4 17.9 21.5 16 21.5 C13.8 21.5 12.5 20 12.5 20 L11.5 21.2 C11.5 21.2 13.1 23 16 23 C18.9 23 21 21.2 21 19 C21 17 19.6 15.9 17.3 15.3 L15.8 14.9 C14.5 14.5 13.8 13.9 13.8 12.9 C13.8 11.7 14.8 11 16 11 C17.7 11 18.5 12.2 18.5 12.2 Z"
        fill="white"
      />
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
          color: 'white',
          letterSpacing: '-0.02em',
          fontFamily: 'Inter, system-ui, sans-serif',
          lineHeight: 1,
        }}
      >
        sp
        <span style={{ color: '#F59E0B' }}>ec</span>
        ify
      </span>
    </div>
  )
}
