import type { Lesson } from '../../model/types'

const module = 'M9 · Віконні функції'

export const M9: Lesson[] = [
  {
    id: 'row-number',
    module,
    title: 'ROW_NUMBER() OVER',
    fixture: 'sodu',
    theory: 'Віконна функція рахує «по вікну» рядків, не склеюючи їх (на відміну від GROUP BY). ROW_NUMBER() OVER (ORDER BY …) нумерує рядки.',
    task: 'Пронумеруйте наряди за order_date, потім id: колонки id, rn. Сортування за rn.',
    starter: `select id
  from guard_orders
 order by id`,
    solution: `select id, row_number() over (order by order_date, id) as rn from guard_orders order by rn`,
    orderSensitive: true,
    hints: ['row_number() over (order by order_date, id) as rn'],
  },
  {
    id: 'partition-by',
    module,
    title: 'PARTITION BY: нумерація в групах',
    fixture: 'sodu',
    theory: 'PARTITION BY ділить вікно на групи: нумерація/суми починаються заново в кожній групі.',
    task: 'Для кожного org_id пронумеруйте наряди від найновішого (order_date desc, id desc): колонки org_id, id, rn. Сортування за org_id, rn.',
    starter: `select org_id, id
  from guard_orders`,
    solution: `select org_id, id, row_number() over (partition by org_id order by order_date desc, id desc) as rn from guard_orders order by org_id, rn`,
    orderSensitive: true,
    hints: ['row_number() over (partition by org_id order by order_date desc, id desc)'],
  },
  {
    id: 'rank-ties',
    module,
    title: 'RANK vs DENSE_RANK',
    fixture: 'sodu',
    theory: 'RANK залишає «дірки» після рівних значень (1,1,3), DENSE_RANK — ні (1,1,2).',
    task: 'Виведіть id і dense_rank за fuel_pct по спаданню (колонка rnk) для машин, де fuel_pct не NULL. Сортування за rnk, id.',
    starter: `select id, fuel_pct
  from vehicles
 where fuel_pct is not null`,
    solution: `select id, dense_rank() over (order by fuel_pct desc) as rnk from vehicles where fuel_pct is not null order by rnk, id`,
    orderSensitive: true,
    hints: ['dense_rank() over (order by fuel_pct desc) as rnk'],
  },
  {
    id: 'running-sum',
    module,
    title: 'Наростаючий підсумок',
    fixture: 'sodu',
    theory: 'sum() over (order by …) дає наростаючу суму. У проєкті OVER() — 23 рази.',
    task: 'Виведіть id і наростаючу суму persons_number (колонка total) за order_date, id для нарядів зі status ACTIVE і persons_number не NULL. Сортування за id по зростанню.',
    starter: `select id, persons_number
  from guard_orders
 where status = 'ACTIVE'
   and persons_number is not null`,
    solution: `select id, sum(persons_number) over (order by order_date, id) as total from guard_orders where status = 'ACTIVE' and persons_number is not null order by id`,
    orderSensitive: true,
    hints: ['sum(persons_number) over (order by order_date, id) as total'],
  },
  {
    id: 'lag',
    module,
    title: 'LAG: попередній рядок',
    fixture: 'sodu',
    theory: 'LAG(x) повертає x з попереднього рядка вікна (перший рядок → NULL).',
    task: 'Для нарядів org_id = 4 виведіть id, persons_number і prev — persons_number попереднього наряду за order_date. Сортування за order_date.',
    starter: `select id, persons_number
  from guard_orders
 where org_id = 4
 order by order_date`,
    solution: `select id, persons_number, lag(persons_number) over (order by order_date) as prev from guard_orders where org_id = 4 order by order_date`,
    orderSensitive: true,
    hints: ['lag(persons_number) over (order by order_date) as prev'],
  },
]
