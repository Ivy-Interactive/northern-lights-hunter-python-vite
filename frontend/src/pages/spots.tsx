import { useState } from 'react'
import { cn } from '@/lib/utils'
import { GlassCard } from '@/components/GlassCard'
import { SectionHeader } from '@/components/SectionHeader'
import { MapPlaceholder } from '@/components/MapPlaceholder'
import { MapPin, Star, Car, Navigation } from 'lucide-react'

// Light pollution legend colors (dark to bright)
const pollutionColors = [
  '#000000', '#0a0a2e', '#141450', '#1e3a5f', '#3d6b4f',
  '#7a8c3c', '#b8952e', '#d46a20', '#ff4444',
]

interface Spot {
  id: number
  name: string
  distance: string
  time: string
  bortle: number
  north: boolean
  rating: number
  reviews: number
  amenities: string[]
  markerPos: { top: string; left: string }
}

const spots: Spot[] = [
  {
    id: 1,
    name: 'Sommarøy Beach',
    distance: '47 km',
    time: '52 min',
    bortle: 2,
    north: true,
    rating: 4.8,
    reviews: 124,
    amenities: ['parking', 'shelter'],
    markerPos: { top: '25%', left: '30%' },
  },
  {
    id: 2,
    name: 'Ersfjord Lookout',
    distance: '23 km',
    time: '31 min',
    bortle: 3,
    north: true,
    rating: 4.6,
    reviews: 89,
    amenities: ['parking'],
    markerPos: { top: '45%', left: '55%' },
  },
  {
    id: 3,
    name: 'Kvaløya North Cape',
    distance: '62 km',
    time: '1h 04m',
    bortle: 1,
    north: true,
    rating: 4.9,
    reviews: 211,
    amenities: ['parking', 'shelter', 'wc'],
    markerPos: { top: '15%', left: '65%' },
  },
  {
    id: 4,
    name: 'Telegrafbukta Park',
    distance: '3 km',
    time: '8 min',
    bortle: 5,
    north: false,
    rating: 3.4,
    reviews: 56,
    amenities: ['parking', 'wc'],
    markerPos: { top: '70%', left: '45%' },
  },
]

function getBortleVariant(bortle: number): 'good' | 'default' | 'warn' {
  if (bortle <= 2) return 'good'
  if (bortle <= 4) return 'default'
  return 'warn'
}

function Tag({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'good' | 'default' | 'warn' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono',
        variant === 'good' && 'bg-aurora-green/10 text-aurora-green border border-aurora-green/20',
        variant === 'default' && 'bg-aurora-cyan/10 text-aurora-cyan border border-aurora-cyan/20',
        variant === 'warn' && 'bg-aurora-warm/10 text-aurora-warm border border-aurora-warm/20'
      )}
    >
      {children}
    </span>
  )
}

function AmenityBadge({ amenity }: { amenity: string }) {
  const labels: Record<string, string> = {
    parking: '\u{1f17f}️ Parking',
    shelter: '⛺ Shelter',
    wc: '\u{1f6bb} WC',
  }
  return (
    <span className="text-[10px] font-mono text-white/40 bg-ink-3/60 px-1.5 py-0.5 rounded">
      {labels[amenity] || amenity}
    </span>
  )
}

export default function SpotsPage() {
  const [selected, setSelected] = useState(0)

  return (
    <div className="animate-fade-up space-y-6">
      <SectionHeader
        title="Find a"
        highlight="dark spot"
        subtitle="Curated viewing locations near you, ranked by darkness, horizon, and accessibility."
      />

      <div className="flex gap-6">
        {/* LEFT: Map */}
        <div className="flex-1">
          <GlassCard className="p-0 overflow-hidden">
            <MapPlaceholder height={520}>
              {/* Spot markers */}
              {spots.map((spot, i) => (
                <button
                  key={spot.id}
                  onClick={() => setSelected(i)}
                  className="absolute z-10 group"
                  style={{ top: spot.markerPos.top, left: spot.markerPos.left }}
                >
                  <div
                    className={cn(
                      'flex items-center justify-center rounded-full font-mono text-xs font-bold transition-all',
                      i === selected
                        ? 'w-9 h-9 text-white shadow-[0_0_16px_rgba(90,247,196,0.4)]'
                        : 'w-7 h-7 bg-ink-3 border border-[var(--hairline-strong)] text-white/70 hover:border-aurora-cyan/40'
                    )}
                    style={
                      i === selected
                        ? { background: 'var(--aurora-gradient)' }
                        : undefined
                    }
                  >
                    {spot.id}
                  </div>
                  {/* Tooltip for selected */}
                  {i === selected && (
                    <div className="absolute left-1/2 -translate-x-1/2 -top-14 bg-ink-2/95 backdrop-blur-sm border border-[var(--hairline-strong)] rounded-lg px-3 py-1.5 whitespace-nowrap shadow-lg">
                      <span className="text-xs font-medium text-white">{spot.name}</span>
                      <span className="text-[10px] text-white/50 ml-2">
                        {spot.distance} &middot; Bortle {spot.bortle}
                      </span>
                    </div>
                  )}
                </button>
              ))}

              {/* User position marker */}
              <div className="absolute z-10" style={{ top: '55%', left: '42%' }}>
                <div className="relative">
                  <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-aurora-cyan shadow-[0_0_12px_rgba(122,215,255,0.5)]" />
                  <div className="absolute inset-0 w-3.5 h-3.5 rounded-full border border-aurora-cyan/40 animate-ping" />
                </div>
              </div>

              {/* Light pollution legend */}
              <div className="absolute bottom-4 left-4 z-10 bg-ink-2/90 backdrop-blur-sm border border-[var(--hairline)] rounded-lg px-3 py-2">
                <span className="text-[9px] font-mono uppercase tracking-wider text-white/40 block mb-1.5">
                  Light pollution
                </span>
                <div className="flex gap-[2px] h-3 rounded-sm overflow-hidden">
                  {pollutionColors.map((color, i) => (
                    <div key={i} className="w-3" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[8px] font-mono text-white/30">dark</span>
                  <span className="text-[8px] font-mono text-white/30">bright</span>
                </div>
              </div>
            </MapPlaceholder>
          </GlassCard>
        </div>

        {/* RIGHT: Spot list */}
        <div className="w-[380px] max-h-[520px] overflow-y-auto space-y-3 pr-1">
          {spots.map((spot, i) => (
            <GlassCard
              key={spot.id}
              className={cn(
                'p-4 cursor-pointer transition-all',
                i === selected
                  ? 'border-aurora-cyan/40 bg-aurora-cyan/[0.03]'
                  : 'hover:border-[var(--hairline-strong)]'
              )}
            >
              <div onClick={() => setSelected(i)}>
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-white/30">#{spot.id}</span>
                    <h4 className="text-sm font-medium text-white">{spot.name}</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-aurora-warm fill-aurora-warm" />
                    <span className="text-xs font-mono text-white/70">{spot.rating}</span>
                    <span className="text-[10px] text-white/30">({spot.reviews})</span>
                  </div>
                </div>

                {/* Distance / time */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center gap-1 text-xs text-white/50">
                    <Car className="w-3 h-3" />
                    {spot.distance}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-white/50">
                    <Navigation className="w-3 h-3" />
                    {spot.time}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 mb-3">
                  <Tag variant={getBortleVariant(spot.bortle)}>Bortle {spot.bortle}</Tag>
                  {spot.north ? (
                    <Tag variant="good">North horizon &#10003;</Tag>
                  ) : (
                    <Tag variant="warn">Limited north view</Tag>
                  )}
                </div>

                {/* Amenities */}
                <div className="flex items-center gap-1.5">
                  {spot.amenities.map((a) => (
                    <AmenityBadge key={a} amenity={a} />
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  )
}
