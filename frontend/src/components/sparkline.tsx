import React from 'react'

interface SparklineProps {
  data: number[]
  color?: string
  height?: number
  fill?: boolean
}

export function Sparkline({
  data,
  color = 'var(--aurora-cyan)',
  height = 40,
  fill = true,
}: SparklineProps) {
  if (data.length === 0) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = height - ((val - min) / range) * (height - 2) - 1
    return `${x},${y}`
  })

  const polylinePoints = points.join(' ')
  const polygonPoints = `0,${height} ${polylinePoints} 100,${height}`

  const gradientId = `sparkline-fill-${Math.random().toString(36).slice(2, 9)}`

  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      width="100%"
      height={height}
      className="block"
    >
      {fill && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
      )}

      {fill && (
        <polygon
          points={polygonPoints}
          fill={`url(#${gradientId})`}
        />
      )}

      <polyline
        points={polylinePoints}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
