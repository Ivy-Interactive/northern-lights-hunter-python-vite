import React from 'react'
import { cn } from '@/lib/utils'
import { GlassCard } from './glass-card'
import { Sparkline } from './sparkline'
import { Sparkles, Cloud, Moon, Eye } from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  sparkles: Sparkles,
  cloud: Cloud,
  moon: Moon,
  eye: Eye,
}

interface StatCardProps {
  eyebrow: string
  value: string
  unit?: string
  label: string
  color?: string
  chart?: number[]
  icon?: string
}

export function StatCard({
  eyebrow,
  value,
  unit,
  label,
  color = '#7ad7ff',
  chart,
  icon,
}: StatCardProps) {
  return (
    <GlassCard padding="p-4">
      <div className="flex flex-col gap-2">
        {/* Eyebrow */}
        <div className="flex items-center gap-1.5">
          {icon && iconMap[icon] && (
            React.createElement(iconMap[icon], { className: 'w-3 h-3 text-white/40' })
          )}
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
            {eyebrow}
          </span>
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-1">
          <span
            className="font-display text-4xl font-light"
            style={{ color }}
          >
            {value}
          </span>
          {unit && (
            <span className="text-base text-white/40">
              {unit}
            </span>
          )}
        </div>

        {/* Label */}
        <span className="text-xs text-white/40">
          {label}
        </span>

        {/* Optional chart */}
        {chart && chart.length > 0 && (
          <div className="mt-2">
            <Sparkline data={chart} color={color} height={32} />
          </div>
        )}
      </div>
    </GlassCard>
  )
}
