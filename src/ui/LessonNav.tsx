import type { LessonGroup } from '../model/types'
import { Icon } from './Icon'

type Props = {
  groups: LessonGroup[]
  idx: number
  done: string[]
  total: number
  open: boolean
  onSelect: (i: number) => void
  onClose: () => void
}

export function LessonNav({ groups, idx, done, total, open, onSelect, onClose }: Props) {
  return (
    <>
      <div className={`backdrop${open ? ' show' : ''}`} onClick={onClose} />
      <aside className={`sidebar${open ? ' open' : ''}`} aria-label="Уроки">
        <div className="side-head">
          <div className="progress-label">
            <span>Прогрес</span>
            <b>
              {done.length}/{total}
            </b>
          </div>
          <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done.length}>
            <i style={{ width: `${(done.length / total) * 100}%` }} />
          </div>
          <button type="button" className="icon-btn close" onClick={onClose} aria-label="Закрити меню">
            <Icon name="close" />
          </button>
        </div>
        {groups.map((g) => (
          <section key={g.module}>
            <h2>{g.module}</h2>
            <ul>
              {g.items.map(({ lesson, idx: i }) => (
                <li key={lesson.id}>
                  <button
                    type="button"
                    className={`lesson-link${i === idx ? ' active' : ''}${done.includes(lesson.id) ? ' done' : ''}`}
                    aria-current={i === idx ? 'page' : undefined}
                    onClick={() => onSelect(i)}
                  >
                    <span className="dot">{done.includes(lesson.id) && <Icon name="check" size={12} />}</span>
                    {lesson.title}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </aside>
    </>
  )
}
