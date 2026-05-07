import { GlassCard } from '@/components/glass-card'
import { SectionHeader } from '@/components/section-header'
import { cn } from '@/lib/utils'
import { MapPin, Calendar, ArrowRight } from 'lucide-react'

// Mock week data: arrays of integers 1-8 representing aurora score
const marchWeeks = [
  [3, 2, 5, 6, 7, 8, 6],
  [4, 3, 2, 3, 5, 6, 4],
  [5, 6, 7, 5, 4, 3, 4],
  [3, 4, 5, 6, 5, 4, 3],
]

const aprilWeeks = [
  [2, 3, 4, 5, 6, 4, 3],
  [3, 4, 5, 7, 6, 5, 4],
  [2, 2, 3, 4, 3, 2, 2],
  [4, 5, 6, 5, 4, 3, 3],
]

// March 2026 starts on Sunday (day 1 = index 0 of week 1)
const marchDayStart = 0 // Sunday
const marchDays = 31

// April 2026 starts on Wednesday (day 1 = index 3 of week 1)
const aprilDayStart = 3
const aprilDays = 30

function getAuroraGradientBg(score: number): string {
  const intensity = score / 8
  if (score <= 2) return `rgba(90, 247, 196, ${intensity * 0.3})`
  if (score <= 4) return `rgba(122, 215, 255, ${intensity * 0.4})`
  if (score <= 6) return `rgba(183, 141, 255, ${intensity * 0.5})`
  return `rgba(255, 126, 185, ${intensity * 0.6})`
}

function DayCell({
  day,
  score,
  isTrip,
}: {
  day: number | null
  score: number
  isTrip: boolean
}) {
  if (day === null) {
    return <div className="aspect-square" />
  }

  return (
    <div
      className={cn(
        'aspect-square rounded-md border relative flex flex-col justify-between p-1',
        isTrip
          ? 'border-aurora-cyan shadow-[0_0_8px_rgba(122,215,255,0.3)]'
          : 'border-[var(--hairline)]'
      )}
      style={{ backgroundColor: getAuroraGradientBg(score) }}
    >
      <span className="font-mono text-[10px] text-white/70">{day}</span>
      <span className="font-mono text-[9px] text-white/50 self-end">
        {Math.round((score / 8) * 100)}%
      </span>
    </div>
  )
}

function MonthCalendar({
  title,
  bestNight,
  weeks,
  dayStart,
  totalDays,
  tripRange,
}: {
  title: string
  bestNight: string
  weeks: number[][]
  dayStart: number
  totalDays: number
  tripRange?: [number, number]
}) {
  const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  let dayCounter = 1

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <h4 className="font-display italic text-lg text-white">{title}</h4>
        <span className="font-mono text-[11px] uppercase text-aurora-green tracking-wider">
          {bestNight}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayHeaders.map((d, i) => (
          <div
            key={i}
            className="text-center font-mono text-[10px] uppercase text-white/40"
          >
            {d}
          </div>
        ))}
      </div>

      {weeks.map((week, weekIdx) => (
        <div key={weekIdx} className="grid grid-cols-7 gap-1 mb-1">
          {week.map((score, dayIdx) => {
            // First week: skip cells before dayStart
            if (weekIdx === 0 && dayIdx < dayStart) {
              return <DayCell key={dayIdx} day={null} score={0} isTrip={false} />
            }
            if (dayCounter > totalDays) {
              return <DayCell key={dayIdx} day={null} score={0} isTrip={false} />
            }
            const currentDay = dayCounter
            dayCounter++
            const isTrip = tripRange
              ? currentDay >= tripRange[0] && currentDay <= tripRange[1]
              : false
            return (
              <DayCell
                key={dayIdx}
                day={currentDay}
                score={score}
                isTrip={isTrip}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default function PlanningPage() {
  return (
    <div className="animate-fade-up space-y-6">
      <SectionHeader
        title="Plan a"
        highlight="trip"
        subtitle="Check aurora prospects for any location and date range. We combine historical weather, geomagnetic activity, and dark-hour data."
      />

      {/* Lookup bar */}
      <GlassCard className="p-[18px]">
        <div className="grid gap-4" style={{ gridTemplateColumns: '1.5fr 1fr 1fr auto' }}>
          {/* Destination */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">
              Destination
            </label>
            <div className="flex items-center gap-2 border border-[var(--hairline)] rounded-[10px] h-[42px] px-3">
              <MapPin className="w-4 h-4 text-white/40 shrink-0" />
              <span className="text-sm text-white/80">Tromsoe, Norway</span>
            </div>
          </div>

          {/* From */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">
              From
            </label>
            <div className="flex items-center gap-2 border border-[var(--hairline)] rounded-[10px] h-[42px] px-3">
              <Calendar className="w-4 h-4 text-white/40 shrink-0" />
              <span className="text-sm text-white/80">Mar 18, 2026</span>
            </div>
          </div>

          {/* To */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">
              To
            </label>
            <div className="flex items-center gap-2 border border-[var(--hairline)] rounded-[10px] h-[42px] px-3">
              <Calendar className="w-4 h-4 text-white/40 shrink-0" />
              <span className="text-sm text-white/80">Mar 24, 2026</span>
            </div>
          </div>

          {/* Button */}
          <button className="self-end h-[42px] px-5 rounded-[10px] bg-[image:var(--aurora-gradient)] text-ink font-semibold text-sm hover:opacity-90 transition-opacity">
            Get report
          </button>
        </div>
      </GlassCard>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4">
        <GlassCard>
          <span className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2">
            Expected clear nights
          </span>
          <span className="font-display text-5xl text-aurora-green">4/7</span>
          <span className="block mt-2 text-[12px] text-white/40">
            Avg. for Tromsoe in March
          </span>
        </GlassCard>

        <GlassCard>
          <span className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2">
            Kp &ge; 4 probability
          </span>
          <span className="font-display text-5xl text-aurora-cyan">67%</span>
          <span className="block mt-2 text-[12px] text-white/40">
            At least one night during stay
          </span>
        </GlassCard>

        <GlassCard>
          <span className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2">
            Dark hours per night
          </span>
          <span className="font-display text-5xl text-aurora-violet">9.5h</span>
          <span className="block mt-2 text-[12px] text-white/40">
            Astronomical twilight
          </span>
        </GlassCard>
      </div>

      {/* Calendar card */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="w-3.5 h-3.5 text-aurora-cyan" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
            Best nights calendar
          </span>
        </div>
        <h3 className="font-display text-xl text-white mb-1">Aurora probability by night</h3>
        <p className="text-[13px] text-white/50 mb-6">
          Based on historical geomagnetic data, cloud cover averages, and astronomical darkness for Tromsoe.
        </p>

        <div className="grid grid-cols-2 gap-8">
          <MonthCalendar
            title="March 2026"
            bestNight="Best: night of Mar 7"
            weeks={marchWeeks}
            dayStart={marchDayStart}
            totalDays={marchDays}
            tripRange={[18, 24]}
          />
          <MonthCalendar
            title="April 2026"
            bestNight="Best: night of Apr 4"
            weeks={aprilWeeks}
            dayStart={aprilDayStart}
            totalDays={aprilDays}
          />
        </div>

        <hr className="border-[var(--hairline)] my-5" />

        <div className="flex items-center gap-2 text-[12px] text-white/40">
          <ArrowRight className="w-3.5 h-3.5" />
          <span>
            Historical context: March in Tromsoe averages 12 clear nights and Kp &ge; 4 on 8 of 31 nights.
          </span>
        </div>
      </GlassCard>
    </div>
  )
}
