export type Srs = Record<string, { box: number; due: number }>

const DAY = 86_400_000
export const INTERVALS_DAYS = [1, 3, 7, 21, 60]

export function advance(srs: Srs, id: string, ok: boolean, now: number): Srs {
  const prev = srs[id]
  if (!ok && !prev) return srs
  const box = ok ? Math.min((prev ? prev.box + 1 : 0), INTERVALS_DAYS.length - 1) : 0
  return { ...srs, [id]: { box, due: now + INTERVALS_DAYS[box] * DAY } }
}

export const dueIds = (srs: Srs, now: number): string[] =>
  Object.entries(srs)
    .filter(([, v]) => v.due <= now)
    .sort((a, b) => a[1].due - b[1].due)
    .map(([id]) => id)
