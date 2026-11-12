import { useState } from 'react'
import { LESSONS } from './content/lessons'
import { groupModules } from './lib/groupModules'
import { advance, dueIds, type Srs } from './lib/srs'
import { useLesson } from './lib/useLesson'
import { useStored } from './lib/useStored'
import { Icon } from './ui/Icon'
import { LessonNav } from './ui/LessonNav'
import { LessonView } from './ui/LessonView'

const GROUPS = groupModules(LESSONS)
const indexOf = (id: string) => LESSONS.findIndex((l) => l.id === id)

export function App() {
  const [idx, setIdx] = useState(0)
  const [menu, setMenu] = useState(false)
  const [reviewing, setReviewing] = useState(false)
  const [done, setDone] = useStored<string[]>('sql-trainer:done', [])
  const [srs, setSrs] = useStored<Srs>('sql-trainer:srs', {})
  const due = dueIds(srs, Date.now()).filter((id) => indexOf(id) >= 0)
  const state = useLesson(LESSONS[idx], (id, ok) => {
    if (ok && !done.includes(id)) setDone([...done, id])
    setSrs(advance(srs, id, ok, Date.now()))
  })
  const select = (i: number, review = false) => {
    setIdx(i)
    setReviewing(review)
    setMenu(false)
    window.scrollTo({ top: 0 })
  }
  const nextDue = due.find((id) => indexOf(id) !== idx)
  const next = reviewing
    ? nextDue ? () => select(indexOf(nextDue), true) : null
    : idx < LESSONS.length - 1 ? () => select(idx + 1) : null
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
        <button type="button" className="review-btn" disabled={!due.length} onClick={() => select(indexOf(due[0]), true)}>
          Повторення <b>{due.length}</b>
        </button>
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
          onSelect={(i) => select(i)}
          onClose={() => setMenu(false)}
        />
        <LessonView lesson={LESSONS[idx]} {...state} onNext={next} />
      </div>
    </>
  )
}
