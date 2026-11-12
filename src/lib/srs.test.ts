import { describe, expect, it } from 'vitest'
import { advance, dueIds } from './srs'

const D = 86_400_000
describe('srs', () => {
  it('first pass schedules +1 day, next passes climb boxes', () => {
    let s = advance({}, 'a', true, 0)
    expect(s.a).toEqual({ box: 0, due: D })
    s = advance(s, 'a', true, D)
    expect(s.a).toEqual({ box: 1, due: D + 3 * D })
  })
  it('fail resets box; fail on unseen lesson is ignored', () => {
    let s = advance(advance({}, 'a', true, 0), 'a', true, D)
    s = advance(s, 'a', false, 2 * D)
    expect(s.a.box).toBe(0)
    expect(advance({}, 'x', false, 0)).toEqual({})
  })
  it('dueIds returns only due, oldest first', () => {
    const s = { a: { box: 0, due: 5 }, b: { box: 0, due: 1 }, c: { box: 0, due: 99 } }
    expect(dueIds(s, 10)).toEqual(['b', 'a'])
  })
})
