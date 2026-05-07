import { cn } from '@/lib/utils'
import { GlassCard } from '@/components/GlassCard'
import { SectionHeader } from '@/components/SectionHeader'
import { Cloud, Moon, Eye, Check, MapPin } from 'lucide-react'
import { useAuroraData } from '@/hooks/use-aurora-data'

// Dark hours: 22:00 - 05:00 (indices relative to 18:00 start)
function isDarkHour(hourIndex: number): boolean {
  // 18:00 = index 0, 22:00 = index 4, 05:00 = index 11
  return hourIndex >= 4 && hourIndex <= 11
}

function generateCloudData() {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: (18 + i) % 24,
    cloud: Math.max(0, Math.min(100, Math.round(80 - 70 * Math.sin((i - 2) / 24 * Math.PI)))),
  }))
}

const cloudData = generateCloudData()

// Bortle scale colors
const bortleColors = [
  '#000000', // 1
  '#0a0a2e', // 2
  '#141450', // 3
  '#1e3a5f', // 4
  '#3d6b4f', // 5
  '#7a8c3c', // 6
  '#b8952e', // 7
  '#d46a20', // 8
  '#ff4444', // 9
]

function BortleScale({ value }: { value: number }) {
  return (
    <div className="mt-4">
      <div className="flex gap-[2px] h-6 rounded-md overflow-hidden">
        {bortleColors.map((color, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 transition-all',
              i + 1 === value && 'ring-2 ring-aurora-cyan ring-offset-1 ring-offset-ink-2 shadow-[0_0_8px_rgba(122,215,255,0.4)] scale-y-110 rounded-sm'
            )}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[9.5px] font-mono text-white/40">1 &middot; pristine</span>
        <span className="text-[9.5px] font-mono text-white/40">9 &middot; inner-city</span>
      </div>
    </div>
  )
}

function DarknessTimeline() {
  return (
    <div className="mt-4">
      <div className="relative h-8 rounded-full overflow-hidden">
        {/* Gradient bar: warm -> violet -> dark -> dark -> violet -> warm */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, #ffd166 0%, #b78dff 15%, #0a0a2e 30%, #000000 40%, #000000 60%, #0a0a2e 70%, #b78dff 85%, #ffd166 100%)',
          }}
        />
        {/* Best window highlight */}
        <div
          className="absolute top-0 bottom-0 border-2 border-aurora-green/60 rounded-md"
          style={{ left: '40%', width: '20%' }}
        >
          <div className="absolute inset-0 bg-aurora-green/10 rounded-md" />
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-aurora-green whitespace-nowrap">
            Best window
          </span>
        </div>
        {/* NOW indicator */}
        <div className="absolute top-0 bottom-0" style={{ left: '20%' }}>
          <div className="w-0.5 h-full bg-white/80" />
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-white/60">
            NOW
          </span>
        </div>
      </div>
      {/* Time labels */}
      <div className="flex justify-between mt-5 px-1">
        {['18:00', '21:00', '00:00', '03:00', '06:00'].map((t) => (
          <span key={t} className="text-[9.5px] font-mono text-white/40">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function ConditionsPage() {
  const _auroraData = useAuroraData()

  return (
    <div className="animate-fade-up space-y-6">
      <SectionHeader
        title="Local"
        highlight="conditions"
        subtitle="Aurora visibility depends on more than space weather — clouds, darkness, and light pollution all play a role."
      />

      {/* CLOUD COVER CARD */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <Cloud className="w-3.5 h-3.5 text-white/40" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
            Cloud cover &middot; next 24h
          </span>
        </div>
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="text-lg font-display font-medium text-white">
            Clear-sky window opens at 22:00
          </h3>
          <span className="text-xs font-mono text-white/40">
            <MapPin className="inline w-3 h-3 mr-1" />
            Troms&oslash; &middot; ECMWF
          </span>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-[3px] h-[100px]">
          {cloudData.map((d, i) => {
            const heightPercent = Math.max(4, d.cloud)
            const isAurora = d.cloud < 30 && isDarkHour(i)
            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                <div
                  className={cn('w-full rounded-sm transition-all', isAurora ? 'opacity-90' : 'opacity-60')}
                  style={{
                    height: `${heightPercent}%`,
                    background: isAurora
                      ? 'linear-gradient(to top, #5af7c4, #7ad7ff)'
                      : 'linear-gradient(to top, rgba(100,120,180,0.3), rgba(100,120,180,0.5))',
                  }}
                />
              </div>
            )
          })}
        </div>
        {/* Hour labels */}
        <div className="flex gap-[3px] mt-2">
          {cloudData.map((d, i) => (
            <div key={i} className="flex-1 text-center">
              <span
                className={cn(
                  'text-[9.5px] font-mono',
                  isDarkHour(i) ? 'text-aurora-green' : 'text-white/30'
                )}
              >
                {String(d.hour).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* 2-COLUMN GRID: DARKNESS + LIGHT POLLUTION */}
      <div className="grid grid-cols-2 gap-6">
        {/* DARKNESS WINDOW */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <Moon className="w-3.5 h-3.5 text-white/40" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
              Darkness window
            </span>
          </div>

          <DarknessTimeline />

          {/* Time grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-6">
            <div>
              <span className="text-[10px] font-mono text-white/40 block">Sunset</span>
              <span className="text-sm font-mono text-white">17:48</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-white/40 block">Sunrise</span>
              <span className="text-sm font-mono text-white">06:32</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-white/40 block">Moonset</span>
              <span className="text-sm font-mono text-white">21:02</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-white/40 block">Astro. dark</span>
              <span className="text-sm font-mono text-white">22:14 &ndash; 03:48</span>
            </div>
          </div>
        </GlassCard>

        {/* LIGHT POLLUTION */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-3.5 h-3.5 text-white/40" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
              Light pollution
            </span>
          </div>
          <h3 className="text-lg font-display font-medium text-white mt-2">
            Bortle 4 &middot; Rural transition
          </h3>
          <p className="text-sm text-white/50 mt-2 leading-relaxed">
            The Milky Way is visible but not prominent. Light domes visible on the horizon from nearby towns. Moving 15-20 km from the city center would improve conditions significantly.
          </p>

          <BortleScale value={4} />

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--hairline)]">
            <span className="text-xs font-mono text-white/40">
              SQM: <span className="text-white/70">20.5 mag/arcsec&sup2;</span>
            </span>
            <a href="#" className="text-xs text-aurora-cyan hover:text-aurora-cyan/80 transition-colors">
              Find darker spot &rarr;
            </a>
          </div>
        </GlassCard>
      </div>

      {/* VIEWING WINDOW CARD */}
      <GlassCard variant="aurora" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-3.5 h-3.5 text-aurora-cyan" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-aurora-cyan/70">
            Synthesized viewing window
          </span>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Left: big time display */}
          <div className="flex items-center">
            <span
              className="font-display text-6xl font-semibold bg-clip-text text-transparent"
              style={{ backgroundImage: 'var(--aurora-gradient)' }}
            >
              23:40 &ndash; 01:10
            </span>
          </div>

          {/* Right: checklist */}
          <div className="space-y-0">
            {[
              { label: 'Geomagnetic activity', value: 'Kp 5.3 sustained' },
              { label: 'Cloud cover', value: '5-15%, mostly clear' },
              { label: 'Astronomical darkness', value: 'from 22:14 to 03:48' },
              { label: 'Moon', value: 'Set at 21:02 — out of sky' },
            ].map((row, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-center gap-3 py-3',
                  i > 0 && 'border-t border-[var(--hairline)]'
                )}
              >
                <Check className="w-4 h-4 text-aurora-green shrink-0" />
                <span className="text-sm text-white/70 flex-1">{row.label}</span>
                <span className="text-sm font-mono text-white">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
