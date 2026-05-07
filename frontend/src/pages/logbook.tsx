import { GlassCard } from '@/components/glass-card'
import { SectionHeader } from '@/components/section-header'
import { cn } from '@/lib/utils'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { Plus, Trophy, Sparkles, AlertTriangle, Moon, Camera, Cloud } from 'lucide-react'

interface LogbookEntry {
  id: string
  date: string
  location: string
  kp: number
  duration: string
  note: string
  gradientFrom: string
  gradientTo: string
}

const defaultEntries: LogbookEntry[] = [
  {
    id: '1',
    date: 'Mar 11, 2026',
    location: 'Sommaroey',
    kp: 6.7,
    duration: '2h 40m',
    note: 'Strongest of my life. Full corona overhead with reds and purples dancing.',
    gradientFrom: 'rgba(90,247,196,0.6)',
    gradientTo: 'rgba(183,141,255,0.4)',
  },
  {
    id: '2',
    date: 'Feb 27, 2026',
    location: 'Ersfjord',
    kp: 5.0,
    duration: '1h 15m',
    note: 'Faint band, then a sudden burst of green curtains sweeping east to west.',
    gradientFrom: 'rgba(122,215,255,0.5)',
    gradientTo: 'rgba(90,247,196,0.3)',
  },
  {
    id: '3',
    date: 'Feb 14, 2026',
    location: 'Kvaloeya',
    kp: 4.3,
    duration: '45 min',
    note: 'Quiet but persistent green arc. Romantic Valentine\'s night under the lights.',
    gradientFrom: 'rgba(90,247,196,0.4)',
    gradientTo: 'rgba(122,215,255,0.2)',
  },
  {
    id: '4',
    date: 'Jan 29, 2026',
    location: 'Telegrafbukta',
    kp: 5.5,
    duration: '1h 30m',
    note: 'Visible through city light pollution. Surprisingly vivid greens even from town.',
    gradientFrom: 'rgba(183,141,255,0.5)',
    gradientTo: 'rgba(255,126,185,0.3)',
  },
]

const achievements = [
  { name: 'First sighting', description: 'Welcome to the club', icon: Sparkles, got: true },
  { name: 'Kp 7+', description: 'Witnessed a major storm', icon: AlertTriangle, got: true },
  { name: '5 nights', description: '5 sightings this season', icon: Moon, got: true },
  { name: 'Photographer', description: 'Shared 10 photos', icon: Camera, got: false },
  { name: 'Marathon', description: 'Hunted past 03:00', icon: Trophy, got: true },
  { name: 'All weather', description: 'Sighting in every month', icon: Cloud, got: false },
]

export default function LogbookPage() {
  const [entries] = useLocalStorage<LogbookEntry[]>('nlh:logbook-entries', defaultEntries)

  return (
    <div className="animate-fade-up space-y-6">
      <SectionHeader
        title="Your"
        highlight="logbook"
        subtitle="Every aurora you've witnessed, logged and remembered."
      />

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-4">
        <GlassCard>
          <span className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2">
            Sightings this season
          </span>
          <span className="font-display text-4xl text-white">14</span>
          <span className="block mt-1.5 text-[11px] text-aurora-green">
            &uarr; 6 vs last year
          </span>
        </GlassCard>

        <GlassCard>
          <span className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2">
            Best Kp witnessed
          </span>
          <span className="font-display text-4xl text-white">7.3</span>
          <span className="block mt-1.5 text-[11px] text-white/40">
            Feb 11, 2026
          </span>
        </GlassCard>

        <GlassCard>
          <span className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2">
            Hours hunted
          </span>
          <span className="font-display text-4xl text-white">38</span>
          <span className="block mt-1.5 text-[11px] text-white/40">
            Total this season
          </span>
        </GlassCard>

        <GlassCard>
          <span className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2">
            Hit rate
          </span>
          <span className="font-display text-4xl text-white">64%</span>
          <span className="block mt-1.5 text-[11px] text-white/40">
            Sightings / nights out
          </span>
        </GlassCard>
      </div>

      {/* Main grid: diary + achievements */}
      <div className="flex gap-4">
        {/* Left: Sighting diary */}
        <div className="flex-1">
          <GlassCard>
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1">
                  Sighting diary
                </span>
                <h3 className="font-display text-xl text-white">Recent entries</h3>
              </div>
              <button className="flex items-center gap-2 h-[36px] px-4 rounded-[10px] bg-[image:var(--aurora-gradient)] text-ink font-semibold text-sm hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" />
                Log a sighting
              </button>
            </div>

            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="grid gap-4 p-3 rounded-xl border border-[var(--hairline)] bg-ink/40"
                  style={{ gridTemplateColumns: '100px 1fr' }}
                >
                  {/* Thumbnail */}
                  <div
                    className="rounded-lg h-full min-h-[80px]"
                    style={{
                      background: `linear-gradient(135deg, ${entry.gradientFrom}, ${entry.gradientTo})`,
                    }}
                  />

                  {/* Content */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[12px] text-white/50">
                      <span>{entry.location}</span>
                      <span className="text-white/20">&middot;</span>
                      <span>{entry.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-aurora-green/10 text-aurora-green border border-aurora-green/20">
                        Kp {entry.kp}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-ink-3 text-white/50 border border-[var(--hairline)]">
                        {entry.duration}
                      </span>
                    </div>
                    <p className="text-[13px] text-white/60 italic leading-relaxed">
                      &ldquo;{entry.note}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right column */}
        <div className="w-[360px] flex flex-col gap-3">
          {/* Current streak */}
          <GlassCard className="border-aurora-warm/20 bg-ink-2/80">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-aurora-warm" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-aurora-warm/70">
                Current streak
              </span>
            </div>
            <div className="font-display text-7xl text-aurora-warm leading-none mb-2">
              3 nights
            </div>
            <p className="text-[12px] text-white/40">
              Personal best: 7 nights (Feb 8-14, 2026)
            </p>
          </GlassCard>

          {/* Achievements */}
          <GlassCard>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-4">
              Achievements
            </span>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement, idx) => {
                const Icon = achievement.icon
                return (
                  <div
                    key={idx}
                    className={cn(
                      'flex flex-col items-center text-center p-3 border rounded-[10px] transition-all',
                      achievement.got
                        ? 'opacity-100 border-aurora-warm/20 bg-aurora-warm/5'
                        : 'opacity-40 border-[var(--hairline)] bg-transparent'
                    )}
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center mb-2',
                        achievement.got
                          ? 'bg-gradient-to-br from-aurora-warm/30 to-aurora-green/20'
                          : 'bg-ink-3'
                      )}
                    >
                      <Icon className="w-4 h-4 text-white/80" />
                    </div>
                    <span className="text-[11px] font-medium text-white/80 leading-tight">
                      {achievement.name}
                    </span>
                    <span className="text-[10px] text-white/40 mt-0.5">
                      {achievement.description}
                    </span>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
