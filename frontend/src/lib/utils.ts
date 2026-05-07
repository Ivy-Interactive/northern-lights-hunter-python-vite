import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getKpLabel(kp: number): string {
  if (kp < 2) return 'Quiet'
  if (kp < 3) return 'Unsettled'
  if (kp < 4) return 'Active'
  if (kp < 5) return 'Minor storm'
  if (kp < 6) return 'Moderate storm'
  if (kp < 7) return 'Strong storm'
  if (kp < 8) return 'Severe storm'
  if (kp < 9) return 'Extreme storm'
  return 'Exceptional storm'
}

export function getKpColor(kp: number): string {
  if (kp < 2) return '#5af7c4'
  if (kp < 3) return '#7ad7ff'
  if (kp < 4) return '#7ad7ff'
  if (kp < 5) return '#ffd166'
  if (kp < 6) return '#ffb347'
  if (kp < 7) return '#ff7eb9'
  if (kp < 8) return '#ff5577'
  if (kp < 9) return '#b78dff'
  return '#ff3355'
}

export function getAuroraChance(
  kp: number,
  cloudCover: number,
  moonIllum: number,
  isDark: boolean
): number {
  if (!isDark) return 0

  // Kp contribution (0-60 points)
  const kpScore = Math.min(60, kp * 10)

  // Cloud penalty (0 to -30 points)
  const cloudPenalty = (cloudCover / 100) * 30

  // Moon penalty (0 to -10 points)
  const moonPenalty = (moonIllum / 100) * 10

  const score = Math.max(0, Math.min(100, kpScore - cloudPenalty - moonPenalty))
  return Math.round(score)
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}
