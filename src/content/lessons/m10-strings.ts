import type { Lesson } from '../../model/types'

const module = 'M10 · LISTAGG, рядки, дати'

export const M10: Lesson[] = [
  {
    id: 'listagg',
    module,
    title: 'LISTAGG',
    fixture: 'sodu',
    theory: 'LISTAGG(x, \', \') WITHIN GROUP (ORDER BY …) склеює значення групи в один рядок. У проєкті — 59 разів.',
    task: 'Для кожного crew_id виведіть names — full_name через ", " за алфавітом. Сортування за crew_id.',
    starter: `select crew_id
  from crew_staff
 group by crew_id`,
    solution: `select crew_id, listagg(full_name, ', ') within group (order by full_name) as names from crew_staff group by crew_id order by crew_id`,
    orderSensitive: true,
    hints: ["listagg(full_name, ', ') within group (order by full_name) as names"],
    oracleNote: 'В Oracle LISTAGG падає з ORA-01489, якщо результат довший за 4000 байт (до 12.2 без ON OVERFLOW).',
  },
  {
    id: 'string-fns',
    module,
    title: 'UPPER, SUBSTR, LENGTH, ||',
    fixture: 'sodu',
    theory: 'Конкатенація — ||. SUBSTR(s, start, len) рахує з 1. UPPER/LOWER змінюють регістр.',
    task: 'Виведіть id і code = перші 2 символи plate + "-" + id (наприклад AA-1) для всіх машин. Сортування за id.',
    starter: `select id, plate
  from vehicles
 order by id`,
    solution: `select id, substr(plate, 1, 2) || '-' || id as code from vehicles order by id`,
    orderSensitive: true,
    hints: ["substr(plate, 1, 2) || '-' || id as code"],
  },
  {
    id: 'to-char',
    module,
    title: 'TO_CHAR для дат',
    fixture: 'sodu',
    theory: "TO_CHAR(дата, 'YYYY-MM') перетворює дату на рядок за маскою. Зручно для групування по місяцях.",
    task: 'Порахуйте наряди по місяцях: колонки ym (YYYY-MM) і cnt. Сортування за ym.',
    starter: `select order_date
  from guard_orders`,
    solution: `select to_char(order_date, 'YYYY-MM') as ym, count(*) as cnt from guard_orders group by to_char(order_date, 'YYYY-MM') order by ym`,
    orderSensitive: true,
    hints: ["group by to_char(order_date, 'YYYY-MM')"],
  },
  {
    id: 'date-arith',
    module,
    title: 'Арифметика дат',
    fixture: 'sodu',
    theory: 'В Oracle дата + число = дата + N днів; різниця двох дат — кількість днів.',
    task: 'Виведіть id і due = order_date + 7 для нарядів org_id = 5. Сортування за id.',
    starter: `select id, order_date
  from guard_orders
 where org_id = 5
 order by id`,
    solution: `select id, order_date + 7 as due from guard_orders where org_id = 5 order by id`,
    orderSensitive: true,
    hints: ['order_date + 7 as due'],
    oracleNote: 'В Oracle DATE містить і час (до секунди); при порівнянні «по дню» використовуйте TRUNC(date).',
  },
]
