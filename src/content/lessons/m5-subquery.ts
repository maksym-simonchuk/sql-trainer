import type { Lesson } from '../../model/types'

const module = 'M5 · Підзапити'

export const M5: Lesson[] = [
  {
    id: 'scalar-subquery',
    module,
    title: 'Скалярний підзапит',
    fixture: 'sodu',
    theory: 'Підзапит, що повертає одне значення, можна використати як число у WHERE.',
    example: `select plate, fuel_pct
  from vehicles
 where fuel_pct < (select avg(fuel_pct) from vehicles);`,
    task: 'Виведіть id і persons_number нарядів, де persons_number більше середнього. Сортування за id.',
    starter: `select id, persons_number
  from guard_orders
 where persons_number > 0
 order by id`,
    solution: `select id, persons_number from guard_orders where persons_number > (select avg(persons_number) from guard_orders) order by id`,
    orderSensitive: true,
    hints: ['(select avg(persons_number) from guard_orders)'],
  },
  {
    id: 'in-subquery',
    module,
    title: 'IN (підзапит)',
    fixture: 'sodu',
    theory: 'x IN (select …) — «x є серед результатів підзапиту».',
    example: `select plate from vehicles
 where crew_id in (select id from crews where org_id = 4);`,
    task: 'Виведіть full_name працівників караулів зі status = ON_DUTY.',
    starter: `select full_name
  from crew_staff`,
    solution: `select full_name from crew_staff where crew_id in (select id from crews where status = 'ON_DUTY')`,
    hints: ["where crew_id in (select id from crews where status = 'ON_DUTY')"],
  },
  {
    id: 'exists',
    module,
    title: 'EXISTS',
    fixture: 'sodu',
    theory: 'EXISTS (підзапит) — TRUE, якщо підзапит повернув хоч один рядок. Корельований: бачить зовнішні колонки. У проєкті — 139 разів.',
    example: `select o.name from org_struct o
 where exists (select 1 from crews c where c.org_id = o.id);
-- підрозділи, що мають караули`,
    task: 'Виведіть name караулів, до яких прив’язана хоча б одна машина (vehicles).',
    starter: `select name
  from crews c`,
    solution: `select name from crews c where exists (select 1 from vehicles v where v.crew_id = c.id)`,
    hints: ['where exists (select 1 from vehicles v where v.crew_id = c.id)'],
  },
  {
    id: 'not-exists',
    module,
    title: 'NOT EXISTS',
    fixture: 'sodu',
    theory: 'NOT EXISTS — «немає жодного пов’язаного рядка». Безпечна альтернатива anti-join.',
    example: `select o.name from org_struct o
 where not exists (select 1 from crews c where c.org_id = o.id);`,
    task: 'Виведіть name караулів без жодної машини.',
    starter: `select name
  from crews c
 where exists (select 1 from vehicles v where v.crew_id = c.id)`,
    solution: `select name from crews c where not exists (select 1 from vehicles v where v.crew_id = c.id)`,
    hints: ['Додайте NOT перед EXISTS'],
  },
  {
    id: 'not-in-null',
    module,
    title: 'Пастка NOT IN і NULL',
    fixture: 'sodu',
    theory:
      'Якщо підзапит NOT IN повертає хоч один NULL, весь вираз стає UNKNOWN — і запит порожній! Відфільтруйте NULL або беріть NOT EXISTS.',
    example: `select id from crews
 where id not in (select crew_id from vehicles);
-- у vehicles є NULL → порожній результат!
-- безпечно: not exists або where crew_id is not null`,
    task: 'Виведіть name караулів, чий id не зустрічається в vehicles.crew_id (серед машин є така без караулу).',
    starter: `select name
  from crews
 where id not in (select crew_id from vehicles)`,
    solution: `select name from crews where id not in (select crew_id from vehicles where crew_id is not null)`,
    hints: ['Додайте where crew_id is not null у підзапит'],
    oracleNote: 'Класична пастка і в Oracle: NOT IN з NULL у підзапиті поверне 0 рядків.',
  },
  {
    id: 'top-n-rownum',
    module,
    title: 'Top-N: ROWNUM над сортуванням',
    fixture: 'sodu',
    theory:
      'ROWNUM нумерує рядки ДО ORDER BY, тому «топ-1» роблять через інлайн-вʼю: сортування всередині, ROWNUM зовні. Сучасна альтернатива — FETCH FIRST.',
    example: `select * from (
  select plate, fuel_pct from vehicles order by fuel_pct desc
) where rownum <= 2;
-- спочатку order by у підзапиті, потім rownum`,
    task: 'Знайдіть підрозділ з найбільшою кількістю караулів: org_id і cnt (при рівності — менший org_id). Використайте інлайн-вʼю і ROWNUM.',
    starter: `select org_id, count(*) as cnt
  from crews
 group by org_id`,
    solution: `select * from (select org_id, count(*) as cnt from crews group by org_id order by cnt desc, org_id) where rownum <= 1`,
    hints: ['Обгорніть групування в (select … order by cnt desc, org_id)', 'Зовні: where rownum <= 1'],
    oracleNote: 'where rownum <= 1 разом з order by в одному запиті дасть не те, що очікуєте — ROWNUM рахується до сортування.',
  },
]
