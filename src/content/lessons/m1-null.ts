import type { Lesson } from '../../model/types'

const module = 'M1 · NULL і вибірка'

export const M1: Lesson[] = [
  {
    id: 'null-nvl',
    module,
    title: 'NVL: заміна NULL',
    fixture: 'sodu',
    theory:
      "NULL — «невідомо», а не нуль і не порожній рядок. Будь-яке порівняння з NULL дає не TRUE.\nNVL(x, y) повертає y, якщо x IS NULL. У реальних запитах проєкту це найчастіша функція.",
    task: "Виведіть full_name і rank працівників; якщо звання немає — покажіть 'не вказано'. Колонка rank_name, сортування за id.",
    starter: `select full_name,
       rank as rank_name
  from crew_staff
 order by id`,
    solution: `select full_name, nvl(rank, 'не вказано') as rank_name from crew_staff order by id`,
    orderSensitive: true,
    hints: ['NVL(колонка, значення_за_замовчуванням)', "nvl(rank, 'не вказано') as rank_name"],
    oracleNote: "В Oracle '' (порожній рядок) теж NULL — у PostgreSQL ні. Тут це не емулюється, пам'ятайте.",
  },
  {
    id: 'is-null',
    module,
    title: 'IS NULL, а не = NULL',
    fixture: 'sodu',
    theory: 'x = NULL ніколи не TRUE (результат UNKNOWN), тому рядки відсіюються.\nДля перевірки є лише IS NULL / IS NOT NULL.',
    task: 'Знайдіть full_name працівників без звання (rank).',
    starter: `select full_name
  from crew_staff
 where rank = null`,
    solution: `select full_name from crew_staff where rank is null`,
    hints: ['Замініть = NULL на IS NULL'],
  },
  {
    id: 'null-arithmetic',
    module,
    title: 'NULL в арифметиці',
    fixture: 'sodu',
    theory: 'NULL + 1 = NULL. Один NULL «заражає» весь вираз.\nЯкщо відсутнє значення логічно дорівнює 0 — загорніть у NVL.',
    task: 'Для кожного наряду (guard_orders) виведіть id і persons_number + 1 як p, де відсутнє persons_number рахується за 0. Сортування за id.',
    starter: `select id, persons_number + 1 as p
  from guard_orders
 order by id`,
    solution: `select id, nvl(persons_number, 0) + 1 as p from guard_orders order by id`,
    orderSensitive: true,
    hints: ['nvl(persons_number, 0) + 1'],
  },
  {
    id: 'nvl2',
    module,
    title: 'NVL2: два варіанти',
    fixture: 'sodu',
    theory: 'NVL2(x, якщо_не_NULL, якщо_NULL) — компактний аналог CASE WHEN x IS NOT NULL.',
    task: "Виведіть full_name і колонку has_rank: 'так' якщо звання є, інакше 'ні'. Сортування за id.",
    starter: `select full_name, rank as has_rank
  from crew_staff
 order by id`,
    solution: `select full_name, nvl2(rank, 'так', 'ні') as has_rank from crew_staff order by id`,
    orderSensitive: true,
    hints: ["nvl2(rank, 'так', 'ні')"],
  },
  {
    id: 'active-filter',
    module,
    title: 'Діючі записи: date_till',
    fixture: 'sodu',
    theory:
      "Класичний патерн проєкту: запис «діє», якщо date_till IS NULL або date_till > SYSDATE.\nАле date_till > SYSDATE сам по собі відкидає NULL — потрібна явна гілка.",
    task: 'Виведіть full_name працівників, у яких є звання і які діючі (date_till порожнє або в майбутньому).',
    starter: `select full_name
  from crew_staff
 where rank is not null
   and date_till > sysdate`,
    solution: `select full_name from crew_staff where rank is not null and (date_till is null or date_till > sysdate)`,
    hints: ['Додайте гілку date_till IS NULL', 'Не забудьте дужки навколо OR'],
  },
  {
    id: 'nulls-last',
    module,
    title: 'Сортування і NULL',
    fixture: 'sodu',
    theory:
      'FETCH FIRST n ROWS ONLY — сучасна пагінація Oracle 12c+.\nУ Oracle NULL при сортуванні вважається найбільшим: ASC — в кінці, DESC — на початку. Керуйте через NULLS LAST / NULLS FIRST.',
    task: 'Виведіть plate трьох машин з найбільшим fuel_pct (за спаданням); машини без даних про паливо не повинні потрапити першими.',
    starter: `select plate
  from vehicles
 order by fuel_pct desc
 fetch first 3 rows only`,
    solution: `select plate from vehicles order by fuel_pct desc nulls last fetch first 3 rows only`,
    orderSensitive: true,
    hints: ['Додайте NULLS LAST після desc'],
    oracleNote: 'Без NULLS LAST у DESC-сортуванні NULL опиняються першими — типова пастка в Oracle.',
  },
]
