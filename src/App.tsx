import { useState } from 'react'
import { LESSONS } from './content/lessons'
import { groupModules } from './lib/groupModules'
import { useLesson } from './lib/useLesson'
import { Icon } from './ui/Icon'
import { LessonNav } from './ui/LessonNav'
import { LessonView } from './ui/LessonView'

const KEY = 'sql-trainer:done'
const GROUPS = groupModules(LESSONS)

const load = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function App() {
  const [idx, setIdx] = useState(0)
  const [menu, setMenu] = useState(false)
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
  const select = (i: number) => {
    setIdx(i)
    setMenu(false)
    window.scrollTo({ top: 0 })
  }
  return (
    <>
      <header className="topbar">
        <button type="button" className="icon-btn menu" onClick={() => setMenu(true)} aria-label="Меню уроків">
          <Icon name="menu" />
        </button>
        <div className="logo">
          <Icon name="db" size={22} /> SQL Trainer
        </div>
        <span className="spacer" />
        <span className="count">
          {done.length}/{LESSONS.length}
        </span>
      </header>
      <div className="shell">
        <LessonNav
          groups={GROUPS}
          idx={idx}
          done={done}
          total={LESSONS.length}
          open={menu}
          onSelect={select}
          onClose={() => setMenu(false)}
        />
        <LessonView lesson={lesson} {...state} onNext={idx < LESSONS.length - 1 ? () => select(idx + 1) : null} />
      </div>
    </>
  )
}
