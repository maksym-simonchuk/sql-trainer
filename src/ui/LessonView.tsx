import type { Lesson, Outcome, Verdict } from '../model/types'
import { Editor } from './Editor'
import { Icon } from './Icon'
import { ResultTable } from './ResultTable'

type Props = {
  lesson: Lesson
  outcome: Outcome | null
  verdict: Verdict
  hintsShown: number
  busy: boolean
  onNext: (() => void) | null
  onChange: (v: string) => void
  onRun: () => void
  onCheck: () => void
  onHint: () => void
}

export function LessonView({ lesson, outcome, verdict, hintsShown, busy, onNext, onChange, onRun, onCheck, onHint }: Props) {
  return (
    <main className="lesson">
      <p className="eyebrow">{lesson.module}</p>
      <h1>{lesson.title}</h1>
      <p className="theory">{lesson.theory}</p>
      {lesson.example && (
        <figure className="example">
          <figcaption>Приклад</figcaption>
          <pre>{lesson.example}</pre>
        </figure>
      )}
      <div className="task">
        <span className="label">Завдання</span>
        <p>{lesson.task}</p>
      </div>
      <Editor key={lesson.id} initial={lesson.starter} onChange={onChange} onRun={onRun} />
      <div className="actions">
        <button type="button" className="primary" disabled={busy} onClick={onRun}>
          <Icon name="play" size={16} /> Запуск <kbd>⌘↵</kbd>
        </button>
        <button type="button" className="success" disabled={busy} onClick={onCheck}>
          <Icon name="check" /> Перевірити
        </button>
        <button type="button" className="ghost" disabled={hintsShown >= lesson.hints.length} onClick={onHint}>
          <Icon name="bulb" /> Підказка {lesson.hints.length - hintsShown > 0 && <small>({lesson.hints.length - hintsShown})</small>}
        </button>
      </div>
      {verdict === 'pass' && (
        <div className="banner pass" role="status">
          <Icon name="check" size={20} />
          <b>Вірно!</b>
          {onNext && (
            <button type="button" className="next" onClick={onNext}>
              Далі <Icon name="arrow" />
            </button>
          )}
        </div>
      )}
      {verdict === 'fail' && (
        <div className="banner fail" role="status">
          Результат не збігається з еталоном. Порівняйте колонки, рядки та порядок.
        </div>
      )}
      {lesson.hints.slice(0, hintsShown).map((h, i) => (
        <div key={i} className="note hint">
          <Icon name="bulb" size={16} />
          <span>{h}</span>
        </div>
      ))}
      <ResultTable outcome={outcome} />
      {verdict === 'pass' && lesson.oracleNote && (
        <div className="note oracle">
          <Icon name="oracle" size={16} />
          <span>
            <b>Oracle:</b> {lesson.oracleNote}
          </span>
        </div>
      )}
    </main>
  )
}
