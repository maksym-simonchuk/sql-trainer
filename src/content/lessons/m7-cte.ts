import type { Lesson } from '../../model/types'

const module = 'M7 · WITH (CTE)'

export const M7: Lesson[] = [
  {
    id: 'cte-basic',
    module,
    title: 'WITH: іменований підзапит',
    fixture: 'sodu',
    theory: 'WITH x AS (select …) дає підзапиту ім’я, яке можна використати нижче як таблицю. Читабельніше за вкладені підзапити. У проєкті — 26 разів.',
    task: 'Через WITH пораховайте людей у кожному караулі (cnt), потім виведіть crew_id і cnt лише для караулів, де cnt > 2.',
    starter: `with c as (
  select crew_id, count(*) as cnt
    from crew_staff
   group by crew_id
)
select * from c`,
    solution: `with c as (select crew_id, count(*) as cnt from crew_staff group by crew_id) select crew_id, cnt from c where cnt > 2`,
    hints: ['where cnt > 2 у фінальному select'],
  },
  {
    id: 'cte-two',
    module,
    title: 'Два CTE поспіль',
    fixture: 'sodu',
    theory: 'Кілька CTE перелічуються через кому, наступний бачить попередні.',
    task: 'Побудуйте CTE staff_cnt (crew_id, cnt людей) і veh_cnt (crew_id, cnt машин). Виведіть crews.name, staff_cnt.cnt як staff, veh_cnt.cnt як veh для караулів, що є в обох CTE.',
    starter: `with staff_cnt as (
  select crew_id, count(*) as cnt from crew_staff group by crew_id
)
select * from staff_cnt`,
    solution: `with staff_cnt as (select crew_id, count(*) as cnt from crew_staff group by crew_id), veh_cnt as (select crew_id, count(*) as cnt from vehicles group by crew_id) select c.name, s.cnt as staff, v.cnt as veh from crews c join staff_cnt s on s.crew_id = c.id join veh_cnt v on v.crew_id = c.id`,
    hints: ['with a as (…), b as (…) select … from crews c join a … join b …'],
  },
]
