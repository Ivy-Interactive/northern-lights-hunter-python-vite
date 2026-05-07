import { useState, useEffect, useCallback } from 'react'
import { fetchAurora, fetchForecast, fetchWeather, fetchSunMoon } from '@/lib/api'
import { getAuroraChance } from '@/lib/utils'
import { getItem, KEYS } from '@/lib/storage'

interface UserLocation {
  lat: number
  lon: number
  name: string
}

interface AuroraData {
  kp: number | null
  kpHistory: unknown[] | null
  forecast: unknown | null
  weather: unknown | null
  sunMoon: unknown | null
  score: number | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

const DEFAULT_LOCATION: UserLocation = { lat: 69.65, lon: 18.96, name: 'Tromsoe' }

export function useAuroraData(): AuroraData {
  const [kp, setKp] = useState<number | null>(null)
  const [kpHistory, setKpHistory] = useState<unknown[] | null>(null)
  const [forecast, setForecast] = useState<unknown | null>(null)
  const [weather, setWeather] = useState<unknown | null>(null)
  const [sunMoon, setSunMoon] = useState<unknown | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const location = getItem<UserLocation>(KEYS.USER_LOCATION, DEFAULT_LOCATION)
    const today = new Date().toISOString().split('T')[0]

    try {
      const [auroraData, forecastData, weatherData, sunMoonData] = await Promise.all([
        fetchAurora(),
        fetchForecast(),
        fetchWeather(location.lat, location.lon),
        fetchSunMoon(location.lat, location.lon, today),
      ])

      setKp(auroraData?.kp ?? null)
      setKpHistory(auroraData?.history ?? null)
      setForecast(forecastData)
      setWeather(weatherData)
      setSunMoon(sunMoonData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchAll])

  const score =
    kp !== null && weather && sunMoon
      ? getAuroraChance(
          kp,
          (weather as { cloudCover?: number }).cloudCover ?? 50,
          (sunMoon as { moonIllumination?: number }).moonIllumination ?? 50,
          (sunMoon as { isDark?: boolean }).isDark ?? true
        )
      : null

  return { kp, kpHistory, forecast, weather, sunMoon, score, isLoading, error, refetch: fetchAll }
}
