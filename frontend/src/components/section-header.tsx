import React from 'react'

interface SectionHeaderProps {
  title: string
  highlight: string
  subtitle?: string
}

export function SectionHeader({ title, highlight, subtitle }: SectionHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="font-display text-4xl font-normal tracking-tight text-white">
        {title}{' '}
        <em
          className="not-italic"
          style={{
            background: 'var(--aurora-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontStyle: 'italic',
          }}
        >
          {highlight}
        </em>
      </h1>
      {subtitle && (
        <p className="text-[--text-dim] text-[15px] max-w-[60ch] text-white/50">
          {subtitle}
        </p>
      )}
    </div>
  )
}
