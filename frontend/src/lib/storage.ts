export const KEYS = {
  ALERT_SETTINGS: 'nlh:alert-settings',
  LOGBOOK_ENTRIES: 'nlh:logbook-entries',
  FAVORITE_SPOTS: 'nlh:favorite-spots',
  USER_LOCATION: 'nlh:user-location',
} as const

export function getItem<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key)
    if (stored === null) return defaultValue
    return JSON.parse(stored) as T
  } catch {
    return defaultValue
  }
}

export function setItem(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to write to localStorage:', error)
  }
}
