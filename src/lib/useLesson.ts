import { useEffect, useRef, useState } from 'react'
import type { PGlite } from '@electric-sql/pglite'
import { FIXTURES } from '../content/fixtures'
import type { Lesson, Outcome, Verdict } from '../model/types'
import { execOracle, grade, openDb } from './engine'

export function useLesson(lesson: Lesson, onPass: (id: string) => void) {
  const db = useRef<Promise<PGlite>>(null)
  const sql = useRef(lesson.starter)
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const [verdict, setVerdict] = useState<Verdict>(null)
  const [hintsShown, setHints] = useState(0)
  const [busy, setBusy] = useState(true)

  useEffect(() => {
    sql.current = lesson.starter
    setOutcome(null)
    setVerdict(null)
    setHints(0)
    setBusy(true)
    const p = openDb(FIXTURES[lesson.fixture])
    db.current = p
    p.then(() => db.current === p && setBusy(false))
  }, [lesson])

  const withDb = async (fn: (d: PGlite) => Promise<void>) => {
    setBusy(true)
    await fn(await db.current!)
    setBusy(false)
  }

  return {
    outcome,
    verdict,
    hintsShown,
    busy,
    onChange: (v: string) => (sql.current = v),
    onHint: () => setHints((n) => n + 1),
    onRun: () => withDb(async (d) => setOutcome(await execOracle(d, sql.current))),
    onCheck: () =>
      withDb(async (d) => {
        setOutcome(await execOracle(d, sql.current))
        const ok = await grade(d, lesson, sql.current)
        setVerdict(ok ? 'pass' : 'fail')
        if (ok) onPass(lesson.id)
      }),
  }
}
