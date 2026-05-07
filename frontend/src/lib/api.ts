const API_BASE = '/api'

async function fetchWithTimeout(url: string, timeoutMs = 10000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return await response.json()
  } finally {
    clearTimeout(timeout)
  }
}

export async function fetchAurora() {
  try {
    return await fetchWithTimeout(`${API_BASE}/aurora`)
  } catch (error) {
    console.error('Failed to fetch aurora data:', error)
    throw error
  }
}

export async function fetchForecast() {
  try {
    return await fetchWithTimeout(`${API_BASE}/forecast`)
  } catch (error) {
    console.error('Failed to fetch forecast:', error)
    throw error
  }
}

export async function fetchWeather(lat: number, lon: number) {
  try {
    return await fetchWithTimeout(`${API_BASE}/weather?lat=${lat}&lon=${lon}`)
  } catch (error) {
    console.error('Failed to fetch weather:', error)
    throw error
  }
}

export async function fetchSunMoon(lat: number, lon: number, date: string) {
  try {
    return await fetchWithTimeout(`${API_BASE}/sun-moon?lat=${lat}&lon=${lon}&date=${date}`)
  } catch (error) {
    console.error('Failed to fetch sun/moon data:', error)
    throw error
  }
}
