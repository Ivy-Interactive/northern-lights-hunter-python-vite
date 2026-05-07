import React from 'react'
import { cn } from '@/lib/utils'
import { X, Navigation } from './icon'

interface AlertOverlayProps {
  onClose: () => void
  score?: number
  kp?: number
}

export function AlertOverlay({ onClose, score, kp }: AlertOverlayProps) {
  const now = new Date()
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

  return (
    <div className="fixed inset-0 z-[1000] bg-black/88 backdrop-blur-xl grid place-items-center animate-fade-up">
      {/* Aurora swirl background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse-glow"
          style={{ background: 'radial-gradient(circle, rgba(90,247,196,0.15) 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[100px] animate-pulse-glow"
          style={{
            background: 'radial-gradient(circle, rgba(122,215,255,0.12) 0%, transparent 70%)',
            animationDelay: '1s',
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full blur-[80px] animate-pulse-glow"
          style={{
            background: 'radial-gradient(circle, rgba(183,141,255,0.1) 0%, transparent 70%)',
            animationDelay: '2s',
          }}
        />
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors"
      >
        <X size={20} />
      </button>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
        {/* Pill badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-aurora-green/30 bg-aurora-green/10 backdrop-blur-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-aurora-green animate-pulse-dot" />
          <span className="font-mono text-xs uppercase tracking-wider text-aurora-green">
            Aurora Alert · {timeStr}
          </span>
        </div>

        {/* Main headline */}
        <h1
          className="font-display text-6xl font-light mb-4"
          style={{
            background: 'var(--aurora-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Go outside now.
        </h1>

        {/* Description */}
        <p className="text-white/60 text-lg mb-10 max-w-md">
          Aurora activity is peaking in your area.
          {score !== undefined && ` Chance: ${score}%.`}
          {kp !== undefined && ` Kp index: ${kp}.`}
          {' '}Clear skies and dark conditions detected.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium text-sm transition-all"
            style={{
              background: 'var(--aurora-gradient)',
              color: '#04060d',
            }}
          >
            <Navigation size={16} />
            Navigate to spot
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[--hairline-strong] bg-white/5 text-white/80 hover:bg-white/10 font-medium text-sm transition-colors">
            I'm already outside
          </button>
        </div>
      </div>
    </div>
  )
}
