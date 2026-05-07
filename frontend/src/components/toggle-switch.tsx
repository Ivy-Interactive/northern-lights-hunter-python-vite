import React from 'react'
import { cn } from '@/lib/utils'

interface ToggleSwitchProps {
  value: boolean
  onChange: (val: boolean) => void
}

export function ToggleSwitch({ value, onChange }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurora-cyan/50',
        value ? 'bg-aurora-cyan' : 'bg-[rgba(160,180,240,0.15)]'
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out mt-0.5',
          value ? 'translate-x-[22px] ml-0.5' : 'translate-x-0.5'
        )}
      />
    </button>
  )
}
