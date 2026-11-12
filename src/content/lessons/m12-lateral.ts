import type { Lesson } from '../../model/types'

const module = 'M12 · OUTER APPLY, пагінація'

export const M12: Lesson[] = [
  {
    id: 'outer-apply',
    module,
    title: 'OUTER APPLY: підзапит на кожен рядок',
    fixture: 'sodu',
    theory: 'OUTER APPLY (підзапит) виконує підзапит для кожного рядка зовнішньої таблиці й бачить її колонки. Як LEFT JOIN, але з корельованим підзапитом. У проєкті — 234 рази.',
    task: 'Для кожного караулу виведіть name і last_order — максимальну order_date нарядів його підрозділу (crews.org_id = guard_orders.org_id). Колонки name, last_order. Сортування за name.',
    starter: `select c.name
  from crews c
 order by c.name`,
    solution: `select c.name, g.last_order from crews c outer apply (select max(order_date) as last_order from guard_orders go where go.org_id = c.org_id) g order by c.name`,
    orderSensitive: true,
    hints: ['outer apply (select max(order_date) as last_order from guard_orders go where go.org_id = c.org_id) g'],
  },
  {
    id: 'top-n',
    module,
    title: 'FETCH FIRST n ROWS ONLY',
    fixture: 'sodu',
    theory: 'Oracle 12c+: ORDER BY … FETCH FIRST n ROWS ONLY — топ-N після сортування (безпечніше за ROWNUM).',
    task: 'Виведіть id і persons_number трьох нарядів з найбільшим persons_number (NULL не враховувати). Сортування за persons_number desc.',
    starter: `select id, persons_number
  from guard_orders
 where persons_number is not null
 order by persons_number desc`,
    solution: `select id, persons_number from guard_orders where persons_number is not null order by persons_number desc fetch first 3 rows only`,
    orderSensitive: true,
    hints: ['fetch first 3 rows only — після order by'],
    oracleNote: 'Класичний ROWNUM <= 3 спрацьовує ДО ORDER BY: потрібно обгортати відсортований запит підзапитом.',
  },
  {
    id: 'offset-page',
    module,
    title: 'OFFSET … FETCH: сторінки',
    fixture: 'sodu',
    theory: 'OFFSET n ROWS FETCH NEXT m ROWS ONLY — пропустити n рядків і взяти m. Це пагінація.',
    task: 'Виведіть id нарядів, відсортованих за id, сторінка 2 по 3 рядки (пропустити 3, взяти 3).',
    starter: `select id
  from guard_orders
 order by id`,
    solution: `select id from guard_orders order by id offset 3 rows fetch next 3 rows only`,
    orderSensitive: true,
    hints: ['offset 3 rows fetch next 3 rows only'],
  },
]
