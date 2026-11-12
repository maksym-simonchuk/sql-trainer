import { PGlite } from '@electric-sql/pglite'
import { beforeAll, describe, expect, it } from 'vitest'
import { translate } from './translate'

let db: PGlite
const run = async (oracle: string) => (await db.query<Record<string, unknown>>(translate(oracle))).rows

beforeAll(async () => {
  db = new PGlite()
  await db.exec(`
    create table org (id int, parent_id int, name text);
    insert into org values (1,null,'root'),(2,1,'a'),(3,1,'b'),(4,2,'c');
  `)
})

describe('translate', () => {
  it('NVL, DUAL', async () => {
    expect(await run('select nvl(null, 5) as v from dual')).toEqual([{ v: 5 }])
  })
  it('NVL2', async () => {
    expect(await run('select nvl2(null, 1, 2) as v from dual')).toEqual([{ v: 2 }])
  })
  it('DECODE with default and NULL match', async () => {
    expect(await run("select decode(2, 1, 'one', 2, 'two', 'other') as v from dual")).toEqual([{ v: 'two' }])
    expect(await run("select decode(null, null, 'n', 'x') as v from dual")).toEqual([{ v: 'n' }])
  })
  it('LISTAGG WITHIN GROUP', async () => {
    expect(await run("select listagg(name, ',') within group (order by id) as v from org")).toEqual([{ v: 'root,a,b,c' }])
  })
  it('MINUS', async () => {
    expect(await run('select id from org minus select id from org where id > 2 order by 1')).toEqual([{ id: 1 }, { id: 2 }])
  })
  it('SYSDATE arithmetic', async () => {
    expect(await run('select (sysdate - 1) < sysdate as ok from dual')).toEqual([{ ok: true }])
  })
  it('CONNECT BY down with LEVEL', async () => {
    const r = await run('select id, level lvl from org start with parent_id is null connect by prior id = parent_id order by id')
    expect(r.map((x) => x.lvl)).toEqual([1, 2, 2, 3])
  })
  it('CONNECT BY up', async () => {
    const r = await run('select id from org o start with id = 4 connect by prior parent_id = id order by id')
    expect(r.map((x) => x.id)).toEqual([1, 2, 4])
  })
  it('CONNECT BY inside subquery', async () => {
    const r = await run(
      'select count(*) c from (select id from org start with id = 1 connect by prior id = parent_id) t',
    )
    expect(Number(r[0].c)).toBe(4)
  })
  it('ROWNUM', async () => {
    expect(await run('select id from org where rownum <= 2')).toHaveLength(2)
    expect(await run('select * from (select id from org order by id desc) where rownum <= 1')).toEqual([{ id: 4 }])
  })
  it('OUTER APPLY', async () => {
    const r = await run('select o.id, x.c from org o outer apply (select count(*) c from org k where k.parent_id = o.id) x order by o.id')
    expect(r.map((x) => Number(x.c))).toEqual([2, 1, 0, 0])
  })
  it('JSON_VALUE', async () => {
    expect(await run(`select json_value('{"a":{"b":7}}', '$.a.b') as v from dual`)).toEqual([{ v: '7' }])
  })
  it('keeps string literals and comments intact', async () => {
    expect(await run("select 'nvl(x) from dual -- hi' as s from dual -- tail")).toEqual([{ s: 'nvl(x) from dual -- hi' }])
  })
  it.each([
    ['select id from org where rownum <= 2 order by id', /not emulated/],
    ['merge into org o using org p on (o.id = p.id) when matched then update set o.name = 1', /not emulated: MERGE/],
    ['select id from org start with id = 1 connect by prior id = parent_id order siblings by id', /not emulated/],
    ['select a.id from org a, org b where a.id = b.id(+)', /not emulated/],
  ])('rejects %s', (sql, re) => {
    expect(() => translate(sql)).toThrow(re)
  })
})
