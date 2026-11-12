import { PGlite } from '@electric-sql/pglite'
import { translate } from '../oracle/translate'
import type { Lesson, Outcome } from '../model/types'

export async function openDb(fixtureSql: string): Promise<PGlite> {
  const db = new PGlite()
  await db.exec(fixtureSql)
  return db
}

// Course is read-only: SELECT/WITH only, so a lesson DB can never be broken by the learner.
export async function execOracle(db: PGlite, oracle: string): Promise<Outcome> {
  try {
    if (!/^\s*(select|with)\b/i.test(oracle)) throw new Error('У курсі дозволені лише SELECT / WITH')
    const r = await db.query(translate(oracle), [], { rowMode: 'array' })
    return { ok: true, result: { cols: r.fields.map((f) => f.name.toUpperCase()), rows: r.rows as unknown[][] } }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

const norm = (v: unknown) => (v == null ? '\u0000NULL' : v instanceof Date ? v.toISOString() : String(v))

export async function grade(db: PGlite, lesson: Lesson, userSql: string): Promise<boolean> {
  const [u, s] = await Promise.all([execOracle(db, userSql), execOracle(db, lesson.solution)])
  if (!u.ok || !s.ok) return false
  const rows = (r: typeof u.result) => r.rows.map((row) => row.map(norm).join('\u0001'))
  const [a, b] = [rows(u.result), rows(s.result)]
  if (!lesson.orderSensitive) [a, b].forEach((x) => x.sort())
  return u.result.cols.length === s.result.cols.length && a.length === b.length && a.every((x, i) => x === b[i])
}
