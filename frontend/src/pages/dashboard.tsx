import { cn, getKpLabel, getKpColor } from '@/lib/utils'
import { useAuroraData } from '@/hooks/use-aurora-data'
import { GlassCard } from '@/components/glass-card'
import { ScoreArc } from '@/components/score-arc'
import { Sparkline } from '@/components/sparkline'
import { MapPlaceholder } from '@/components/map-placeholder'
import { StatCard } from '@/components/stat-card'
import { KpBar } from '@/components/kp-bar'
import { SectionHeader } from '@/components/section-header'
import {
  Sparkles,
  Calendar,
  Eye,
  Bell,
  Navigation,
  ChevronRight,
  MapPin,
} from 'lucide-react'

// ─── Mock / fallback data ────────────────────────────────────────────────────

const MOCK_KP_HISTORY = [1.7, 2.3, 3.1, 2.8, 4.2, 5.3, 4.8, 5.1, 4.6, 3.9, 4.1, 5.0]
const MOCK_CLOUD_CHART = [40, 35, 25, 12, 8, 15, 22, 30]
const MOCK_HOURLY_DATA = [
  { hour: '20:00', cloud: 40, dark: false },
  { hour: '21:00', cloud: 35, dark: false },
  { hour: '22:00', cloud: 25, dark: true },
  { hour: '23:00', cloud: 12, dark: true },
  { hour: '00:00', cloud: 8, dark: true },
  { hour: '01:00', cloud: 15, dark: true },
  { hour: '02:00', cloud: 22, dark: true },
  { hour: '03:00', cloud: 30, dark: true },
]
const MOCK_OUTLOOK = [
  { day: 'Tonight', date: 'May 6', kp: 5.3, chance: 78 },
  { day: 'Tomorrow', date: 'May 7', kp: 3.8, chance: 45 },
  { day: 'Thursday', date: 'May 8', kp: 2.1, chance: 18 },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getCurrentDay() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { kp, kpHistory, forecast, weather, sunMoon, score, isLoading, error } = useAuroraData()

  const currentScore = (score !== null && score > 0) ? score : 78
  const currentKp = (kp !== null && kp > 1) ? kp : 5.33
  const kpHistoryData = (kpHistory && (kpHistory as number[]).length > 0) ? (kpHistory as number[]) : MOCK_KP_HISTORY

  return (
    <div className="animate-fade-up space-y-6">
      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-8 pb-14">
        {/* Aurora ribbon flourish */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 opacity-60 mix-blend-screen filter blur-[40px]"
            style={{
              background:
                'radial-gradient(ellipse 60% 30% at 30% 50%, rgba(90,247,196,0.25), transparent 60%), radial-gradient(ellipse 40% 25% at 70% 30%, rgba(183,141,255,0.25), transparent 60%), radial-gradient(ellipse 50% 30% at 60% 70%, rgba(122,215,255,0.2), transparent 60%)',
            }}
          />
        </div>

        {/* Grid: left content + right ScoreArc */}
        <div className="relative grid grid-cols-[1fr_auto] gap-12 items-center">
          {/* Left side */}
          <div className="space-y-6">
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-widest text-white/70">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-aurora-green opacity-75 animate-pulse-dot" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-aurora-green" />
              </span>
              <span>Live Forecast &middot; {getCurrentDay()}</span>
            </div>

            {/* Headline */}
            <h1
              className="font-display font-light leading-[1.1] text-white"
              style={{ fontSize: 'clamp(40px, 5vw, 76px)' }}
            >
              {currentScore >= 70 ? (
                <>
                  The sky is{' '}
                  <em className="italic bg-gradient-to-r from-aurora-green via-aurora-cyan to-aurora-violet bg-clip-text text-transparent">
                    awake
                  </em>{' '}
                  tonight.
                </>
              ) : currentScore >= 50 ? (
                <>
                  A{' '}
                  <em className="italic text-aurora-cyan">quiet</em>{' '}
                  shimmer is possible.
                </>
              ) : (
                <>
                  Stay in. The sky is{' '}
                  <em className="italic text-white/40">asleep</em>.
                </>
              )}
            </h1>

            {/* Description */}
            <p className="text-lg text-white/70 max-w-[52ch] leading-relaxed">
              {currentScore >= 70
                ? 'Skies clear at 22:00, peak Kp 5.3 between 23:40 and 01:00. Excellent viewing conditions from northern latitudes with minimal moon interference.'
                : 'Cloud cover and modest geomagnetic activity suggest limited visibility tonight. Set an alert for when conditions improve.'}
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm text-void bg-gradient-to-r from-aurora-green to-aurora-cyan shadow-lg shadow-aurora-green/20 hover:shadow-aurora-green/30 transition-shadow">
                <Navigation className="w-4 h-4" />
                Find a viewing spot
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                <Bell className="w-4 h-4" />
                Alert me at peak
              </button>
            </div>
          </div>

          {/* Right side: Score Arc */}
          <div className="flex-shrink-0">
            <ScoreArc value={currentScore} size={300} label="TONIGHT'S CHANCE" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          KEY METRICS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-4 gap-4 mb-4">
        <StatCard
          eyebrow="KP INDEX"
          value={currentKp.toFixed(1)}
          unit={`/ 9`}
          label={getKpLabel(currentKp)}
          color={getKpColor(currentKp)}
          chart={kpHistoryData}
          icon="sparkles"
        />
        <StatCard
          eyebrow="CLOUD COVER"
          value="12"
          unit="%"
          label="Mostly clear"
          color="#5af7c4"
          chart={MOCK_CLOUD_CHART}
          icon="cloud"
        />
        <StatCard
          eyebrow="MOON"
          value="18"
          unit="%"
          label="Waxing crescent"
          color="#7ad7ff"
          chart={[45, 38, 30, 24, 18, 14, 12, 10]}
          icon="moon"
        />
        <StatCard
          eyebrow="DARKNESS"
          value="22:14"
          unit=""
          label="Astronomical twilight ends"
          color="#b78dff"
          chart={[60, 45, 30, 15, 5, 0, 0, 0]}
          icon="eye"
        />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          AURORA OVAL MAP
      ═══════════════════════════════════════════════════════════════════════ */}
      <section>
        <GlassCard variant="default" className="p-0 overflow-hidden">
          {/* Map header */}
          <div className="flex items-start justify-between p-5 pb-0">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                Aurora Oval &mdash; Live
              </span>
              <h3 className="font-display text-xl font-semibold text-white">
                Visible from where you stand?
              </h3>
              <p className="text-sm text-white/50">
                Current oval extent reaches <span className="text-aurora-green font-medium">62.4&deg;N</span> latitude
              </p>
            </div>

            {/* Legend tags */}
            <div className="flex items-center gap-3 pt-1">
              <span className="flex items-center gap-1.5 text-xs text-white/60">
                <span className="w-2.5 h-2.5 rounded-full bg-aurora-green" />
                Overhead
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/60">
                <span className="w-2.5 h-2.5 rounded-full bg-aurora-cyan" />
                Visible north
              </span>
            </div>
          </div>

          {/* Map area */}
          <div className="relative mt-4">
            <MapPlaceholder height={340} showOval={true}>
              {/* User location marker */}
              <div className="absolute top-[38%] left-[52%] flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-aurora-green opacity-60 animate-pulse-dot" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-aurora-green border-2 border-void" />
                </span>
                <span className="text-xs font-mono text-white bg-void/70 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
                  Troms&oslash; &middot; 69.6&deg;N
                </span>
              </div>
            </MapPlaceholder>

            {/* Updated badge */}
            <div className="absolute top-3 right-4 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-white/40 bg-void/60 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-aurora-green animate-pulse-dot" />
              Updated 14s ago
            </div>
          </div>
        </GlassCard>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          BOTTOM GRID
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-2 gap-4">
        {/* 3-DAY OUTLOOK */}
        <GlassCard variant="default">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  3-Day Outlook
                </span>
                <h3 className="font-display text-lg font-semibold text-white mt-0.5">
                  When to go out
                </h3>
              </div>
              <button className="flex items-center gap-1 text-xs text-aurora-cyan hover:text-aurora-cyan/80 transition-colors">
                <Calendar className="w-3.5 h-3.5" />
                Full forecast
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Outlook rows */}
            <div className="space-y-2">
              {MOCK_OUTLOOK.map((row, i) => (
                <div
                  key={row.day}
                  className={cn(
                    'flex items-center gap-4 px-3 py-2.5 rounded-lg transition-colors',
                    i === 0 ? 'bg-aurora-green/5 border border-aurora-green/15' : 'border border-transparent'
                  )}
                >
                  <div className="w-24 shrink-0">
                    <div className="text-sm font-medium text-white">{row.day}</div>
                    <div className="text-xs text-white/40">{row.date}</div>
                  </div>
                  <div className="flex-1">
                    <KpBar value={row.kp} />
                  </div>
                  <div className="w-14 text-right">
                    <span
                      className={cn(
                        'text-sm font-mono font-medium',
                        row.chance >= 70
                          ? 'text-aurora-green'
                          : row.chance >= 40
                            ? 'text-aurora-cyan'
                            : 'text-white/50'
                      )}
                    >
                      {row.chance}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* TONIGHT'S WINDOW */}
        <GlassCard variant="default">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  Tonight's Window
                </span>
                <h3 className="font-display text-lg font-semibold text-white mt-0.5">
                  Cloud cover by hour
                </h3>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono text-white/40 uppercase">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-white/20" /> Cloud
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-aurora-green" /> Dark
                </span>
              </div>
            </div>

            {/* Hourly chart (inline) */}
            <div className="flex items-end gap-2 h-32 pt-4">
              {MOCK_HOURLY_DATA.map((h) => (
                <div key={h.hour} className="flex-1 flex flex-col items-center gap-1.5">
                  {/* Bar */}
                  <div className="relative w-full flex flex-col items-center flex-1 justify-end">
                    <div
                      className={cn(
                        'w-full max-w-[28px] rounded-t-md transition-all',
                        h.dark ? 'bg-white/15' : 'bg-white/8'
                      )}
                      style={{ height: `${Math.max(h.cloud, 5)}%` }}
                    />
                  </div>
                  {/* Dark indicator */}
                  <div
                    className={cn(
                      'w-full max-w-[28px] h-1 rounded-full',
                      h.dark ? 'bg-aurora-green' : 'bg-transparent'
                    )}
                  />
                  {/* Hour label */}
                  <span className="text-[10px] font-mono text-white/40">{h.hour}</span>
                </div>
              ))}
            </div>

            {/* Best window highlight */}
            <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-aurora-green/10 to-aurora-cyan/10 border border-aurora-green/15">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-aurora-green/15">
                  <Sparkles className="w-4 h-4 text-aurora-green" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">
                    Best window: 23:00 &ndash; 01:30
                  </div>
                  <div className="text-xs text-white/50">
                    Clear skies align with peak geomagnetic activity
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  )
}
