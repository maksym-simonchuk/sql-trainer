import type { Lesson } from '../../model/types'

const module = 'M6 · UNION, MINUS, INTERSECT'

export const M6: Lesson[] = [
  {
    id: 'union-all',
    module,
    title: 'UNION ALL',
    fixture: 'sodu',
    theory: 'UNION ALL склеює результати двох запитів «стовпчиком», нічого не прибираючи. Кількість і типи колонок мають збігатися.',
    example: `select name as label from org_struct
union all
select plate from vehicles;`,
    task: 'Одним списком виведіть plate машин і name караулів у колонці label (спочатку машини, потім караули — порядок не важливий).',
    starter: `select plate as label
  from vehicles`,
    solution: `select plate as label from vehicles union all select name from crews`,
    hints: ['select name from crews — додайте другим запитом через union all'],
  },
  {
    id: 'union-dedup',
    module,
    title: 'UNION прибирає дублі',
    fixture: 'sodu',
    theory: 'UNION = UNION ALL + DISTINCT. Це додаткове сортування/хешування, тому без потреби беріть UNION ALL. У проєкті UNION — 101 раз.',
    example: `select status from crews
union
select status from guard_orders;
-- без дублів`,
    task: 'Виведіть унікальні org_id з crews і з guard_orders разом (колонка org_id).',
    starter: `select org_id
  from crews`,
    solution: `select org_id from crews union select org_id from guard_orders`,
    hints: ['union (без all) прибере дублі'],
  },
  {
    id: 'minus',
    module,
    title: 'MINUS — різниця множин',
    fixture: 'sodu',
    theory: 'MINUS — Oracle-спосіб «є в першому, немає в другому» (в PostgreSQL це EXCEPT). Дублі прибираються.',
    example: `select id from crews
minus
select crew_id from vehicles;
-- караули без машин`,
    task: 'Знайдіть id підрозділів з org_struct, у яких немає жодного наряду (guard_orders.org_id). Колонка id.',
    starter: `select id
  from org_struct`,
    solution: `select id from org_struct minus select org_id from guard_orders`,
    hints: ['select id from org_struct minus select org_id from guard_orders'],
    oracleNote: 'MINUS існує лише в Oracle; у PostgreSQL/стандарті — EXCEPT. У MySQL його немає взагалі.',
  },
  {
    id: 'intersect',
    module,
    title: 'INTERSECT — перетин',
    fixture: 'sodu',
    theory: 'INTERSECT залишає лише рядки, що є в обох результатах.',
    example: `select crew_id from crew_staff
intersect
select crew_id from vehicles;`,
    task: 'Знайдіть org_id, які є і в crews, і в guard_orders. Колонка org_id.',
    starter: `select org_id
  from crews`,
    solution: `select org_id from crews intersect select org_id from guard_orders`,
    hints: ['intersect select org_id from guard_orders'],
  },
]
