import { useState } from 'react'

export function useStored<T>(key: string, init: T) {
  const [v, set] = useState<T>(() => {
    try {
      return JSON.parse(localStorage.getItem(key) ?? 'null') ?? init
    } catch {
      return init
    }
  })
  return [
    v,
    (next: T) => {
      set(next)
      try {
        localStorage.setItem(key, JSON.stringify(next))
      } catch {
        /* storage unavailable */
      }
    },
  ] as const
}
