import type { Lesson, Outcome, Verdict } from '../model/types'
import { Editor } from './Editor'
import { ResultTable } from './ResultTable'

type Props = {
  lesson: Lesson
  outcome: Outcome | null
  verdict: Verdict
  hintsShown: number
  busy: boolean
  onChange: (v: string) => void
  onRun: () => void
  onCheck: () => void
  onHint: () => void
}

export function LessonView({ lesson, outcome, verdict, hintsShown, busy, onChange, onRun, onCheck, onHint }: Props) {
  return (
    <main>
      <h1>{lesson.title}</h1>
      <p className="theory">{lesson.theory}</p>
      <p className="task">
        <b>Задача:</b> {lesson.task}
      </p>
      <Editor key={lesson.id} initial={lesson.starter} onChange={onChange} onRun={onRun} />
      <div className="actions">
        <button type="button" disabled={busy} onClick={onRun}>
          ▶ Запуск
        </button>
        <button type="button" disabled={busy} onClick={onCheck}>
          ✓ Перевірити
        </button>
        <button type="button" disabled={hintsShown >= lesson.hints.length} onClick={onHint}>
          💡 Підказка
        </button>
      </div>
      {verdict === 'pass' && <p className="pass">Вірно!</p>}
      {verdict === 'fail' && <p className="fail">Результат не збігається з еталоном.</p>}
      {lesson.hints.slice(0, hintsShown).map((h, i) => (
        <p key={i} className="hint">
          💡 {h}
        </p>
      ))}
      <ResultTable outcome={outcome} />
      {verdict === 'pass' && lesson.oracleNote && <p className="oracle">🔶 Oracle: {lesson.oracleNote}</p>}
    </main>
  )
}
