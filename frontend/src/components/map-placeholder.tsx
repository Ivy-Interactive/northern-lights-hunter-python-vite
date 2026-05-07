import React from 'react'
import { cn } from '@/lib/utils'

interface MapPlaceholderProps {
  height?: number
  children?: React.ReactNode
  showOval?: boolean
  className?: string
}

export function MapPlaceholder({
  height = 320,
  children,
  showOval = false,
  className,
}: MapPlaceholderProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border border-[--hairline] bg-ink-2/80 overflow-hidden',
        className
      )}
      style={{ height }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(160,180,240,0.05)"
              strokeWidth="0.5"
            />
          </pattern>
          <linearGradient id="oval-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5af7c4" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#7ad7ff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#b78dff" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Grid */}
        <rect width="800" height="500" fill="url(#map-grid)" />

        {/* Latitude lines */}
        <line x1="0" y1="125" x2="800" y2="125" stroke="rgba(160,180,240,0.06)" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="0" y1="200" x2="800" y2="200" stroke="rgba(160,180,240,0.06)" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="0" y1="275" x2="800" y2="275" stroke="rgba(160,180,240,0.06)" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="0" y1="350" x2="800" y2="350" stroke="rgba(160,180,240,0.06)" strokeWidth="0.5" strokeDasharray="4 4" />

        {/* North America */}
        <path
          d="M 80 180 Q 100 160 130 155 Q 160 150 180 160 Q 200 170 210 190 Q 220 210 215 240 Q 210 260 195 275 Q 180 290 160 295 Q 140 300 120 290 Q 100 280 90 260 Q 80 240 75 220 Q 70 200 80 180 Z"
          fill="rgba(160,180,240,0.06)"
          stroke="rgba(160,180,240,0.12)"
          strokeWidth="0.8"
        />

        {/* Greenland */}
        <path
          d="M 260 100 Q 280 90 300 95 Q 320 100 330 115 Q 340 130 335 150 Q 330 165 315 170 Q 300 175 280 170 Q 265 165 258 150 Q 252 135 255 120 Q 258 105 260 100 Z"
          fill="rgba(160,180,240,0.06)"
          stroke="rgba(160,180,240,0.12)"
          strokeWidth="0.8"
        />

        {/* Iceland */}
        <path
          d="M 320 145 Q 330 140 340 142 Q 350 145 352 152 Q 354 160 348 165 Q 342 168 332 167 Q 322 165 318 158 Q 316 152 320 145 Z"
          fill="rgba(160,180,240,0.06)"
          stroke="rgba(160,180,240,0.12)"
          strokeWidth="0.8"
        />

        {/* British Isles */}
        <path
          d="M 365 200 Q 370 192 378 190 Q 385 188 388 195 Q 390 202 387 210 Q 384 218 378 220 Q 372 222 368 215 Q 364 208 365 200 Z"
          fill="rgba(160,180,240,0.06)"
          stroke="rgba(160,180,240,0.12)"
          strokeWidth="0.8"
        />

        {/* Europe / Scandinavia */}
        <path
          d="M 390 150 Q 400 140 415 135 Q 430 130 445 140 Q 460 150 465 165 Q 470 180 460 200 Q 450 220 435 230 Q 420 240 400 235 Q 385 230 380 215 Q 375 200 378 180 Q 380 160 390 150 Z"
          fill="rgba(160,180,240,0.06)"
          stroke="rgba(160,180,240,0.12)"
          strokeWidth="0.8"
        />

        {/* Russia */}
        <path
          d="M 470 130 Q 510 120 560 125 Q 610 130 650 140 Q 690 150 720 155 Q 740 160 750 170 Q 760 180 750 195 Q 740 210 710 215 Q 680 220 640 215 Q 600 210 560 200 Q 520 190 490 180 Q 470 170 465 155 Q 460 140 470 130 Z"
          fill="rgba(160,180,240,0.06)"
          stroke="rgba(160,180,240,0.12)"
          strokeWidth="0.8"
        />

        {/* Aurora oval */}
        {showOval && (
          <>
            <ellipse
              cx="400"
              cy="160"
              rx="320"
              ry="80"
              fill="url(#oval-gradient)"
              stroke="rgba(90,247,196,0.3)"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
            <ellipse
              cx="400"
              cy="160"
              rx="280"
              ry="60"
              fill="none"
              stroke="rgba(122,215,255,0.2)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          </>
        )}
      </svg>

      {/* Children rendered on top */}
      {children && (
        <div className="absolute inset-0 z-10">
          {children}
        </div>
      )}
    </div>
  )
}
