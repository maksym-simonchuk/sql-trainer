import type { Lesson } from '../../model/types'

const module = 'M4 · Агрегати'

export const M4: Lesson[] = [
  {
    id: 'group-count',
    module,
    title: 'GROUP BY і COUNT',
    fixture: 'sodu',
    theory: 'GROUP BY зводить рядки в групи. Усі не агреговані колонки SELECT мусять бути в GROUP BY — інакше ORA-00937.',
    example: `select status, count(*) as cnt
  from crews
 group by status;`,
    task: 'Скільки караулів у кожному підрозділі? Виведіть org_id і cnt.',
    starter: `select org_id, count(*) as cnt
  from crews`,
    solution: `select org_id, count(*) as cnt from crews group by org_id`,
    hints: ['group by org_id'],
    oracleNote: 'Помилка Oracle для такого запиту: ORA-00937: not a single-group group function.',
  },
  {
    id: 'count-star-vs-col',
    module,
    title: 'COUNT(*) проти COUNT(col)',
    fixture: 'sodu',
    theory: 'COUNT(*) рахує рядки, COUNT(col) — лише непорожні значення col. Різниця = кількість NULL.',
    example: `select count(*) as all_rows, count(fuel_pct) as with_fuel
  from vehicles;
-- count(col) не рахує NULL`,
    task: 'Одним рядком: total — усіх працівників, with_rank — скільки мають звання.',
    starter: `select count(*) as total, count(*) as with_rank
  from crew_staff`,
    solution: `select count(*) as total, count(rank) as with_rank from crew_staff`,
    hints: ['count(rank)'],
  },
  {
    id: 'sum-avg',
    module,
    title: 'SUM і AVG',
    fixture: 'sodu',
    theory: 'SUM, AVG, MIN, MAX ігнорують NULL. AVG рахується лише по непорожніх значеннях.',
    example: `select vtype, sum(fuel_pct) as s, round(avg(fuel_pct), 1) as a
  from vehicles
 group by vtype;`,
    task: 'За status наряду виведіть total (SUM persons_number) і avg_p (AVG, округлене до 1 знаку).',
    starter: `select status, sum(persons_number) as total
  from guard_orders
 group by status`,
    solution: `select status, sum(persons_number) as total, round(avg(persons_number), 1) as avg_p from guard_orders group by status`,
    hints: ['round(avg(persons_number), 1) as avg_p'],
  },
  {
    id: 'having',
    module,
    title: 'HAVING: фільтр груп',
    fixture: 'sodu',
    theory: 'WHERE фільтрує рядки ДО групування, HAVING — групи ПІСЛЯ. Агрегати у WHERE заборонені.',
    example: `select crew_id, count(*) as cnt
  from vehicles
 group by crew_id
having count(*) > 1;
-- having фільтрує групи, where — рядки`,
    task: 'Знайдіть org_id, у яких не менше 2 нарядів: org_id і cnt.',
    starter: `select org_id, count(*) as cnt
  from guard_orders
 where count(*) >= 2
 group by org_id`,
    solution: `select org_id, count(*) as cnt from guard_orders group by org_id having count(*) >= 2`,
    hints: ['Замініть where на having і перенесіть після group by'],
  },
  {
    id: 'group-left-join',
    module,
    title: 'Групування по LEFT JOIN',
    fixture: 'sodu',
    theory: 'Щоб порожні групи дали 0, рахуйте COUNT(права_таблиця.id), а не COUNT(*).',
    example: `select c.name, count(v.id) as veh
  from crews c
  left join vehicles v on v.crew_id = c.id
 group by c.name;
-- count(v.id), не count(*): 0 для порожніх`,
    task: 'Для кожного караулу виведіть name і staff_cnt (кількість працівників, 0 якщо немає). Сортування за c.id.',
    starter: `select c.name, count(*) as staff_cnt
  from crews c
  left join crew_staff s on s.crew_id = c.id
 group by c.id, c.name
 order by c.id`,
    solution: `select c.name, count(s.id) as staff_cnt from crews c left join crew_staff s on s.crew_id = c.id group by c.id, c.name order by c.id`,
    orderSensitive: true,
    hints: ['count(s.id) замість count(*)'],
  },
  {
    id: 'group-by-month',
    module,
    title: 'Групування за частиною дати',
    fixture: 'sodu',
    theory: "TO_CHAR(дата, 'YYYY-MM') дає ключ «рік-місяць». У GROUP BY повторюйте той самий вираз.",
    example: `select to_char(order_date, 'YYYY-MM') as ym, sum(persons_number) as p
  from guard_orders
 group by to_char(order_date, 'YYYY-MM');`,
    task: 'Скільки нарядів у кожному місяці? Колонки ym (YYYY-MM) і cnt, сортування за ym.',
    starter: `select to_char(order_date, 'YYYY-MM') as ym, count(*) as cnt
  from guard_orders
 group by order_date
 order by ym`,
    solution: `select to_char(order_date, 'YYYY-MM') as ym, count(*) as cnt from guard_orders group by to_char(order_date, 'YYYY-MM') order by ym`,
    orderSensitive: true,
    hints: ["group by to_char(order_date, 'YYYY-MM')"],
  },
]
