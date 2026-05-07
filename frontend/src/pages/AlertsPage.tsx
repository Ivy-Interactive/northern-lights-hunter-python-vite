import { Settings, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GlassCard } from '@/components/glass-card'
import { ToggleSwitch } from '@/components/toggle-switch'
import { ThresholdSlider } from '@/components/threshold-slider'
import { SectionHeader } from '@/components/section-header'
import { useLocalStorage } from '@/hooks/use-local-storage'

type LeadTime = '2h' | '30m' | 'now'

interface LeadTimeOption {
  value: LeadTime
  label: string
  description: string
}

const leadTimeOptions: LeadTimeOption[] = [
  { value: '2h', label: '2 hours before', description: 'So I can drive to a spot' },
  { value: '30m', label: '30 minutes before', description: 'Quick prep time' },
  { value: 'now', label: 'Right now', description: "I'm a spontaneous hunter" },
]

interface ToggleRowProps {
  label: string
  description: string
  value: boolean
  onChange: (val: boolean) => void
  isLast?: boolean
}

function ToggleRow({ label, description, value, onChange, isLast }: ToggleRowProps) {
  return (
    <div className={cn('flex items-center justify-between py-4', !isLast && 'border-b border-[var(--hairline)]')}>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-white">{label}</span>
        <span className="text-xs text-white/40">{description}</span>
      </div>
      <ToggleSwitch value={value} onChange={onChange} />
    </div>
  )
}

interface AlertEntry {
  time: string
  title: string
  color: string
}

const recentAlerts: AlertEntry[] = [
  { time: '2 hours ago', title: "Tonight's chance crossed 70%", color: '#5af7c4' },
  { time: 'Yesterday', title: 'Storm watch: Kp 7 incoming', color: '#ff5577' },
  { time: '3 days ago', title: 'Weekly digest', color: '#b78dff' },
]

export default function AlertsPage() {
  const [threshold, setThreshold] = useLocalStorage('alert-threshold', 60)
  const [leadTime, setLeadTime] = useLocalStorage<LeadTime>('alert-lead-time', '2h')
  const [conditionsGate, setConditionsGate] = useLocalStorage('alert-conditions-gate', true)
  const [stormWatch, setStormWatch] = useLocalStorage('alert-storm-watch', true)
  const [quietHours, setQuietHours] = useLocalStorage('alert-quiet-hours', false)
  const [weeklyDigest, setWeeklyDigest] = useLocalStorage('alert-weekly-digest', true)

  return (
    <div className="animate-fade-up space-y-6">
      <SectionHeader
        title="Don't miss a"
        highlight="display"
        subtitle="Smart alerts only fire when conditions actually align..."
      />

      {/* Grid: Threshold + Lead Time */}
      <div className="grid grid-cols-2 gap-4">
        {/* ALERT THRESHOLD */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-3">
            <Settings className="w-3.5 h-3.5 text-aurora-cyan" />
            <span className="text-[11px] font-medium uppercase tracking-wider text-white/50">Alert Threshold</span>
          </div>
          <h3 className="text-lg font-display font-semibold text-white mb-1">
            Notify above {threshold}%
          </h3>
          <p className="text-xs text-white/40 mb-4">
            Based on the last 30 days, you'd have received <strong className="text-white/70">3 alerts</strong> at this threshold.
          </p>
          <ThresholdSlider value={threshold} onChange={setThreshold} />
        </GlassCard>

        {/* LEAD TIME */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-3.5 h-3.5 text-aurora-cyan" />
            <span className="text-[11px] font-medium uppercase tracking-wider text-white/50">Lead Time</span>
          </div>
          <h3 className="text-lg font-display font-semibold text-white mb-4">
            How early to alert?
          </h3>
          <div className="flex flex-col gap-2">
            {leadTimeOptions.map((option) => {
              const isSelected = leadTime === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => setLeadTime(option.value)}
                  className={cn(
                    'flex items-center gap-3 w-full text-left rounded-lg border px-4 py-3 transition-colors',
                    isSelected
                      ? 'border-aurora-cyan/40 bg-aurora-cyan/[0.06]'
                      : 'border-[var(--hairline)] bg-transparent hover:border-[var(--hairline-strong)]'
                  )}
                >
                  {/* Radio circle */}
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                      isSelected ? 'border-aurora-cyan' : 'border-white/30'
                    )}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-aurora-cyan" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{option.label}</span>
                    <span className="text-xs text-white/40">{option.description}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </GlassCard>
      </div>

      {/* Toggles card */}
      <GlassCard>
        <ToggleRow
          label="Conditions gate"
          description="Only alert when skies are clear at my location"
          value={conditionsGate}
          onChange={setConditionsGate}
        />
        <ToggleRow
          label="Storm watch"
          description="Immediate alert for unexpected Kp spikes (Kp ≥ 6)"
          value={stormWatch}
          onChange={setStormWatch}
        />
        <ToggleRow
          label="Quiet hours"
          description="Don't wake me between 02:00 and 06:00 (override for Kp 7+)"
          value={quietHours}
          onChange={setQuietHours}
        />
        <ToggleRow
          label="Weekly digest"
          description="Sunday evening — what to expect this week"
          value={weeklyDigest}
          onChange={setWeeklyDigest}
          isLast
        />
      </GlassCard>

      {/* Recent alerts card */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-white/50 block mb-1">Recent Alerts</span>
            <h3 className="text-lg font-display font-semibold text-white">Alert history</h3>
          </div>
          <button className="px-4 py-2 rounded-lg bg-aurora-cyan/10 border border-aurora-cyan/30 text-aurora-cyan text-sm font-medium hover:bg-aurora-cyan/20 transition-colors">
            Preview alert
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {recentAlerts.map((alert, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-1 rounded-full shrink-0" style={{ backgroundColor: alert.color }} />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-white">{alert.title}</span>
                <span className="text-xs text-white/40">{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
