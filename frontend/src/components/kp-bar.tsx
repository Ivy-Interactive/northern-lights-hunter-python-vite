import React from 'react'

interface KpBarProps {
  value: number
}

export function KpBar({ value }: KpBarProps) {
  const segments = 9

  function getSegmentColor(index: number): string {
    if (index < 3) return '#5af7c4'  // aurora-green
    if (index < 5) return '#ffd166'  // aurora-warm
    return '#ff6b8b'                  // bad / red-pink
  }

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: segments }, (_, i) => {
        const filled = i < value
        return (
          <div
            key={i}
            className="flex-1 h-1.5 rounded-full"
            style={{
              backgroundColor: filled
                ? getSegmentColor(i)
                : 'rgba(160,180,240,0.1)',
            }}
          />
        )
      })}
    </div>
  )
}
