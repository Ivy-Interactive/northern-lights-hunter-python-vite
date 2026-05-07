import { useState, useCallback } from 'react'
import { getItem, setItem } from '@/lib/storage'

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (val: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => getItem(key, defaultValue))

  const setValue = useCallback(
    (value: T) => {
      setStoredValue(value)
      setItem(key, value)
    },
    [key]
  )

  return [storedValue, setValue]
}
