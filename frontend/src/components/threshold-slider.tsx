import React from 'react'

interface ThresholdSliderProps {
  value: number
  onChange: (val: number) => void
  min?: number
  max?: number
}

export function ThresholdSlider({
  value,
  onChange,
  min = 0,
  max = 100,
}: ThresholdSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="w-full">
      <div className="relative h-2 rounded-full overflow-hidden">
        {/* Gradient bar */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(to right, #ff6b8b, #ffd166, #5af7c4)',
          }}
        />

        {/* Indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] -ml-2 z-10"
          style={{ left: `${percentage}%` }}
        />

        {/* Hidden range input */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2 text-[10px] font-mono text-white/30">
        <span>0% — never</span>
        <span>50% — selective</span>
        <span>100% — only certain</span>
      </div>
    </div>
  )
}
