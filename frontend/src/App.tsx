import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Sparkles,
  Cloud,
  MapPin,
  Bell,
  Users,
  Calendar,
  BookOpen,
  FileText,
  Settings,
} from '@/components/icon'
import ForecastPage from '@/pages/ForecastPage'
import ConditionsPage from '@/pages/ConditionsPage'
import SpotsPage from '@/pages/SpotsPage'
import AlertsPage from '@/pages/AlertsPage'
import ActivityPage from '@/pages/ActivityPage'
import PlanningPage from '@/pages/PlanningPage'
import LearnPage from '@/pages/LearnPage'
import LogbookPage from '@/pages/LogbookPage'

const tabs = [
  { id: 'forecast', label: 'Forecast', icon: Sparkles },
  { id: 'conditions', label: 'Conditions', icon: Cloud },
  { id: 'spots', label: 'Spots', icon: MapPin },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'activity', label: 'Activity', icon: Users },
  { id: 'planning', label: 'Planning', icon: Calendar },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'logbook', label: 'Logbook', icon: FileText },
] as const

type TabId = (typeof tabs)[number]['id']

const pages: Record<TabId, React.ComponentType> = {
  forecast: ForecastPage,
  conditions: ConditionsPage,
  spots: SpotsPage,
  alerts: AlertsPage,
  activity: ActivityPage,
  planning: PlanningPage,
  learn: LearnPage,
  logbook: LogbookPage,
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('forecast')
  const ActivePage = pages[activeTab]

  return (
    <>
      <div className="starfield" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-8 py-6 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[image:var(--aurora-gradient)]" />
            <h1 className="font-display italic text-lg font-medium tracking-tight text-white">
              Northern Lights Hunter
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--hairline)] bg-ink-2/60 backdrop-blur-sm text-sm text-white/80 hover:border-[var(--hairline-strong)] transition-colors">
              <MapPin className="w-3.5 h-3.5 text-aurora-cyan" />
              <span>Tromsoe, Norway</span>
            </button>
            <button className="p-2 rounded-lg border border-[var(--hairline)] bg-ink-2/60 backdrop-blur-sm text-white/60 hover:text-white/90 hover:border-[var(--hairline-strong)] transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Navigation */}
        <nav className="flex items-center gap-1 mb-8 p-1 rounded-xl border border-[var(--hairline)] bg-ink/80 backdrop-blur-sm w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-ink-3 text-white shadow-sm'
                    : 'text-white/50 hover:text-white/80 hover:bg-ink-2/50'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Main content */}
        <main className="flex-1">
          <ActivePage />
        </main>
      </div>
    </>
  )
}
