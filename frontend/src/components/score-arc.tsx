import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface ScoreArcProps {
  value: number
  size?: number
  label?: string
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function ScoreArc({
  value,
  size = 300,
  label = "TONIGHT'S CHANCE",
}: ScoreArcProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const duration = 1600
    const startTime = performance.now()

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutCubic(progress)
      setAnimatedValue(easedProgress * value)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value])

  const strokeWidth = 10
  const glowStrokeWidth = 20
  const radius = (size - glowStrokeWidth * 2) / 2
  const center = size / 2

  // 3/4 circle: starts at 135deg, ends at 45deg (270deg arc)
  const startAngle = 135
  const endAngle = 405 // 135 + 270
  const totalArc = 270

  const toRad = (deg: number) => (deg * Math.PI) / 180

  const arcPath = (startDeg: number, endDeg: number) => {
    const start = {
      x: center + radius * Math.cos(toRad(startDeg)),
      y: center + radius * Math.sin(toRad(startDeg)),
    }
    const end = {
      x: center + radius * Math.cos(toRad(endDeg)),
      y: center + radius * Math.sin(toRad(endDeg)),
    }
    const largeArc = endDeg - startDeg > 180 ? 1 : 0
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`
  }

  const progressAngle = startAngle + (animatedValue / 100) * totalArc
  const trackPath = arcPath(startAngle, endAngle)
  const progressPath =
    animatedValue > 0 ? arcPath(startAngle, progressAngle) : ''

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0">
        <defs>
          <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5af7c4" />
            <stop offset="33%" stopColor="#7ad7ff" />
            <stop offset="66%" stopColor="#b78dff" />
            <stop offset="100%" stopColor="#ff7eb9" />
          </linearGradient>
          <filter id="arc-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <path
          d={trackPath}
          fill="none"
          stroke="rgba(160,180,240,0.10)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Glow arc */}
        {progressPath && (
          <path
            d={progressPath}
            fill="none"
            stroke="url(#arc-gradient)"
            strokeWidth={glowStrokeWidth}
            strokeLinecap="round"
            opacity={0.3}
            filter="url(#arc-glow)"
          />
        )}

        {/* Main progress arc */}
        {progressPath && (
          <path
            d={progressPath}
            fill="none"
            stroke="url(#arc-gradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        )}
      </svg>

      {/* Center content */}
      <div className="relative flex flex-col items-center justify-center text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">
          {label}
        </span>
        <span
          className="font-display text-7xl font-light"
          style={{
            background: 'var(--aurora-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {Math.round(animatedValue)}%
        </span>
      </div>
    </div>
  )
}
