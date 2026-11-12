import { useState } from 'react'
import { LESSONS } from './content/lessons'
import { useLesson } from './lib/useLesson'
import { LessonView } from './ui/LessonView'

const KEY = 'sql-trainer:done'
const load = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function App() {
  const [idx, setIdx] = useState(0)
  const [done, setDone] = useState(load)
  const lesson = LESSONS[idx]
  const state = useLesson(lesson, (id) =>
    setDone((d) => {
      if (d.includes(id)) return d
      const next = [...d, id]
      try {
        localStorage.setItem(KEY, JSON.stringify(next))
      } catch {
        /* storage unavailable */
      }
      return next
    }),
  )
  return (
    <>
      <nav className="nav">
        <select value={idx} onChange={(e) => setIdx(+e.target.value)} aria-label="Урок">
          {LESSONS.map((l, i) => (
            <option key={l.id} value={i}>
              {done.includes(l.id) ? '✓ ' : ''}
              {l.title}
            </option>
          ))}
        </select>
      </nav>
      <LessonView lesson={lesson} {...state} />
    </>
  )
}
