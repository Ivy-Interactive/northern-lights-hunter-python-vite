import { GlassCard } from '@/components/glass-card'
import { SectionHeader } from '@/components/section-header'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

const articles = [
  {
    category: 'Basics',
    title: 'What is the Kp Index?',
    description: 'A 0-9 scale measuring geomagnetic disturbance. Higher means aurora visible further south.',
    readingTime: '3 min',
  },
  {
    category: 'Photography',
    title: 'Capturing aurora on a phone',
    description: 'Night mode, manual exposure, tripods, and editing tips for modern smartphones.',
    readingTime: '5 min',
  },
  {
    category: 'Photography',
    title: 'DSLR camera settings',
    description: 'Wide aperture, ISO 1600-3200, 10-15s exposure. Shoot RAW for best results.',
    readingTime: '6 min',
  },
  {
    category: 'Field guide',
    title: 'What to bring on a hunt',
    description: "Layers (it's cold), red headlamp, thermos, patience, and a good weather app.",
    readingTime: '4 min',
  },
  {
    category: 'Reading the sky',
    title: 'Color guide: green vs red vs purple',
    description: 'Green = oxygen at 100km, red = oxygen at 200km+, purple = nitrogen at lower altitudes.',
    readingTime: '4 min',
  },
  {
    category: 'Basics',
    title: 'Bz, solar wind, and CMEs explained',
    description: 'Why southward Bz matters, what solar wind speed tells you, and how CMEs create storms.',
    readingTime: '7 min',
  },
]

export default function LearnPage() {
  return (
    <div className="animate-fade-up space-y-6">
      <SectionHeader
        title="Learn the"
        highlight="sky"
        subtitle="Plain-language explainers on aurora science, photography, and field techniques."
      />

      {/* Featured card */}
      <GlassCard variant="aurora" className="overflow-hidden">
        <div className="grid grid-cols-2 gap-6 items-center">
          {/* Left: text */}
          <div className="space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-aurora-green">
              Start here
            </span>
            <h3 className="font-display text-4xl text-white leading-tight">
              The 5-minute guide to your first sighting.
            </h3>
            <p className="text-[13.5px] text-white/50 leading-relaxed">
              Everything you need to know before heading out: when to go, where to look, and what to expect when the sky lights up.
            </p>
            <button className="h-[42px] px-5 rounded-[10px] bg-[image:var(--aurora-gradient)] text-ink font-semibold text-sm hover:opacity-90 transition-opacity">
              Read the guide
            </button>
          </div>

          {/* Right: aurora illustration */}
          <div className="relative w-[220px] h-[180px] justify-self-center rounded-xl overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 80% 60% at 50% 80%, rgba(90,247,196,0.4) 0%, transparent 50%), radial-gradient(ellipse 60% 50% at 30% 60%, rgba(122,215,255,0.3) 0%, transparent 40%), radial-gradient(ellipse 60% 50% at 70% 60%, rgba(183,141,255,0.3) 0%, transparent 40%), linear-gradient(to top, #070a16 0%, transparent 60%)',
              }}
            />
            {/* Star dots */}
            <div className="absolute w-1 h-1 rounded-full bg-white/60 top-[15%] left-[20%]" />
            <div className="absolute w-0.5 h-0.5 rounded-full bg-white/40 top-[25%] left-[55%]" />
            <div className="absolute w-1 h-1 rounded-full bg-white/50 top-[10%] left-[75%]" />
            <div className="absolute w-0.5 h-0.5 rounded-full bg-white/30 top-[35%] left-[40%]" />
            <div className="absolute w-0.5 h-0.5 rounded-full bg-white/40 top-[20%] left-[85%]" />
            <div className="absolute w-1 h-1 rounded-full bg-white/50 top-[8%] left-[45%]" />
          </div>
        </div>
      </GlassCard>

      {/* Articles grid */}
      <div className="grid grid-cols-3 gap-4">
        {articles.map((article, idx) => (
          <GlassCard
            key={idx}
            className={cn(
              'cursor-pointer transition-all duration-200',
              'hover:border-[var(--hairline-strong)] hover:bg-ink-3/60 hover:translate-y-[-2px]'
            )}
          >
            <div className="flex flex-col h-full">
              <span className="text-[10px] font-mono uppercase tracking-wider text-aurora-cyan mb-3">
                {article.category}
              </span>
              <h4 className="font-display text-[22px] text-white mb-2 leading-tight">
                {article.title}
              </h4>
              <p className="text-[13.5px] text-white/40 leading-relaxed flex-1">
                {article.description}
              </p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--hairline)]">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/30">
                  {article.readingTime}
                </span>
                <ArrowRight className="w-4 h-4 text-white/30" />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
