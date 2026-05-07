import React from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'highlight' | 'aurora'
  padding?: string
}

export function GlassCard({
  children,
  className,
  variant = 'default',
  padding,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-[18px] backdrop-blur-xl relative overflow-hidden',
        variant === 'default' &&
          'border border-[--hairline] bg-gradient-to-b from-ink-3/60 to-ink-2/60',
        variant === 'highlight' &&
          'border border-aurora-cyan/20 bg-gradient-to-b from-ink-3/60 to-ink-2/60',
        variant === 'aurora' &&
          'border border-aurora-green/25 bg-gradient-to-br from-aurora-green/[0.08] to-aurora-cyan/[0.04]',
        padding ?? 'p-6',
        className
      )}
    >
      {variant === 'highlight' && (
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ background: 'var(--aurora-gradient-soft)' }}
        />
      )}
      {children}
    </div>
  )
}
