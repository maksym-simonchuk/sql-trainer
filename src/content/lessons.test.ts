import { describe, expect, it } from 'vitest'
import { FIXTURES } from './fixtures'
import { LESSONS } from './lessons'
import { execOracle, grade, openDb } from '../lib/engine'

describe.each(LESSONS)('lesson $id', (lesson) => {
  it('solution passes its own check and starter does not', async () => {
    const db = await openDb(FIXTURES[lesson.fixture])
    expect((await execOracle(db, lesson.solution)).ok).toBe(true)
    expect(await grade(db, lesson, lesson.solution)).toBe(true)
    expect(await grade(db, lesson, lesson.starter)).toBe(false)
  })
})
