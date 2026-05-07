import { Heart, Navigation, Camera } from 'lucide-react'
import { GlassCard } from '@/components/glass-card'
import { MapPlaceholder } from '@/components/map-placeholder'
import { SectionHeader } from '@/components/section-header'

interface SightingReport {
  name: string
  location: string
  distance: string
  timeAgo: string
  kp: number
  quote: string
  gradient: string
}

const sightingReports: SightingReport[] = [
  {
    name: 'Sigrid K.',
    location: 'Sommaroy',
    distance: '47km',
    timeAgo: '12 min ago',
    kp: 5.4,
    quote: 'Bright green band stretching across the northern sky...',
    gradient: 'linear-gradient(135deg, #5af7c4, #7ad7ff)',
  },
  {
    name: 'Mikael O.',
    location: 'Ersfjord',
    distance: '23km',
    timeAgo: '28 min ago',
    kp: 5.2,
    quote: 'Faint glow appearing on the horizon, building slowly...',
    gradient: 'linear-gradient(135deg, #7ad7ff, #b78dff)',
  },
  {
    name: 'Aino L.',
    location: 'Kvaloya',
    distance: '62km',
    timeAgo: '1 hour ago',
    kp: 5.4,
    quote: 'Pillars rising overhead, incredible movement tonight...',
    gradient: 'linear-gradient(160deg, #5af7c4, #b78dff)',
  },
  {
    name: 'Erik T.',
    location: 'Tromso harbor',
    distance: '2km',
    timeAgo: '1.5 hours ago',
    kp: 5.0,
    quote: 'Subtle but visible with the naked eye from the docks...',
    gradient: 'linear-gradient(145deg, #b78dff, #ff7eb9)',
  },
]

const photoGradients = [
  'linear-gradient(135deg, #5af7c4, #7ad7ff)',
  'linear-gradient(160deg, #7ad7ff, #b78dff)',
  'linear-gradient(180deg, #5af7c4, #b78dff)',
  'linear-gradient(200deg, #b78dff, #ff7eb9)',
]

export default function ActivityPage() {
  const activeCount = 12

  return (
    <div className="animate-fade-up space-y-6">
      <SectionHeader
        title="Live"
        highlight="sightings"
        subtitle={`${activeCount} people near you are seeing the aurora right now...`}
      />

      {/* Main grid: left content + right panel */}
      <div className="flex gap-4">
        {/* Left side */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Sighting heatmap card */}
          <GlassCard padding="p-0" className="overflow-hidden">
            <div className="p-4 pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-aurora-green animate-pulse-dot" />
                  <span className="text-[11px] font-medium uppercase tracking-wider text-white/50">
                    Sighting Heatmap — Last 2 Hours
                  </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-aurora-green/10 text-aurora-green border border-aurora-green/20">
                  12 active reports
                </span>
              </div>
              <h3 className="text-lg font-display font-semibold text-white mb-3">
                Where people are seeing it
              </h3>
            </div>
            <MapPlaceholder height={280} className="rounded-none border-0">
              {/* Heatmap blobs */}
              <div className="absolute top-[20%] left-[30%] w-20 h-20 rounded-full bg-aurora-green/30 blur-xl" />
              <div className="absolute top-[40%] left-[55%] w-16 h-16 rounded-full bg-aurora-green/25 blur-lg" />
              <div className="absolute top-[30%] left-[70%] w-24 h-24 rounded-full bg-aurora-green/20 blur-xl" />
              <div className="absolute top-[60%] left-[20%] w-14 h-14 rounded-full bg-aurora-green/15 blur-lg" />
              <div className="absolute top-[50%] left-[45%] w-18 h-18 rounded-full bg-aurora-green/25 blur-xl" />

              {/* User position dot */}
              <div className="absolute top-[55%] left-[50%] -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 rounded-full bg-white border-2 border-aurora-cyan shadow-[0_0_12px_rgba(122,215,255,0.6)]" />
              </div>

              {/* Status badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink/80 border border-[var(--hairline)] backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-aurora-green animate-pulse-dot" />
                <span className="text-[10px] text-white/70 font-medium">activity strong</span>
              </div>
            </MapPlaceholder>
          </GlassCard>

          {/* Feed */}
          <div className="flex flex-col gap-3">
            {sightingReports.map((report, i) => (
              <GlassCard key={i} padding="p-4">
                <div className="flex gap-3">
                  {/* Thumbnail */}
                  <div className="relative w-[100px] h-[100px] rounded-lg overflow-hidden shrink-0">
                    <div className="absolute inset-0" style={{ background: report.gradient }} />
                    <div className="absolute bottom-1.5 left-1.5 text-[10px] text-white/80 bg-ink/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
                      📷 from {report.name.split(' ')[0]}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{report.name}</span>
                        <span className="text-xs text-white/40">{report.location}</span>
                      </div>
                      <span className="text-xs text-white/40">{report.timeAgo}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <span>{report.distance}</span>
                      <span className="text-white/20">·</span>
                      <span>Kp {report.kp}</span>
                    </div>
                    <p className="text-sm text-white/60 mt-1 italic">"{report.quote}"</p>
                    <div className="flex items-center gap-2 mt-auto pt-2">
                      <button className="flex items-center gap-1 text-xs text-white/40 hover:text-aurora-magenta transition-colors">
                        <Heart className="w-3.5 h-3.5" />
                        <span>Like</span>
                      </button>
                      <button className="flex items-center gap-1 text-xs text-white/40 hover:text-aurora-cyan transition-colors">
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Navigate</span>
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="w-[360px] flex flex-col gap-3">
          {/* CONFIRMATION SIGNAL */}
          <GlassCard variant="aurora" className="border-aurora-green/30">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-aurora-green animate-pulse-dot" />
              <span className="text-[11px] font-medium uppercase tracking-wider text-aurora-green">
                Confirmation Signal
              </span>
            </div>
            <p className="text-base text-white/80 mb-3">
              <strong className="text-aurora-green">12 people</strong> within 60 km are seeing it right now.
            </p>
            <p className="text-xs text-white/40 mb-4">
              Multiple independent confirmations from different locations increase confidence that aurora is visible tonight.
            </p>
            <button className="w-full px-4 py-2.5 rounded-lg bg-aurora-green/15 border border-aurora-green/30 text-aurora-green text-sm font-medium hover:bg-aurora-green/25 transition-colors">
              Take me to the closest spot
            </button>
          </GlassCard>

          {/* SHARE A SIGHTING */}
          <GlassCard>
            <span className="text-[11px] font-medium uppercase tracking-wider text-white/50 block mb-2">
              Share a Sighting
            </span>
            <p className="text-xs text-white/40 mb-4">
              Help the community by reporting what you see. Your sighting helps others decide whether to head out.
            </p>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-aurora-cyan/10 border border-aurora-cyan/30 text-aurora-cyan text-sm font-medium hover:bg-aurora-cyan/20 transition-colors">
              <Camera className="w-4 h-4" />
              Report what you see
            </button>
          </GlassCard>

          {/* TONIGHT'S BEST PHOTOS */}
          <GlassCard>
            <span className="text-[11px] font-medium uppercase tracking-wider text-white/50 block mb-3">
              Tonight's Best Photos
            </span>
            <div className="grid grid-cols-2 gap-2">
              {photoGradients.map((gradient, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg"
                  style={{ background: gradient }}
                />
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
