import type { Lesson } from '../model/types'

export const LESSONS: Lesson[] = [
  {
    id: 'null-nvl',
    title: '1. NULL і NVL',
    fixture: 'sodu',
    theory:
      'NULL — «невідомо», а не нуль і не порожній рядок. Будь-яке порівняння з NULL дає не TRUE.\nNVL(x, y) повертає y, якщо x IS NULL. У реальних запитах проєкту це найчастіша функція.',
    task: 'Виведіть full_name і rank працівників; якщо звання немає — покажіть \'не вказано\'. Колонка rank_name, сортування за id.',
    starter: 'select full_name,\n       rank as rank_name\n  from crew_staff\n order by id',
    solution: "select full_name, nvl(rank, 'не вказано') as rank_name from crew_staff order by id",
    orderSensitive: true,
    hints: ['NVL(колонка, значення_за_замовчуванням)', "nvl(rank, 'не вказано') as rank_name"],
    oracleNote: "В Oracle '' (порожній рядок) теж NULL — у PostgreSQL ні. Тут це не емулюється, пам'ятайте.",
  },
  {
    id: 'left-join-anti',
    title: '2. LEFT JOIN і пошук «відсутніх»',
    fixture: 'sodu',
    theory:
      'LEFT JOIN зберігає всі рядки лівої таблиці. Якщо пари немає — праві колонки NULL.\nЗвідси anti-join: LEFT JOIN … WHERE права.id IS NULL = «ліві без пари».',
    task: 'Знайдіть назви караулів (crews.name), у яких немає жодного працівника.',
    starter: 'select c.name\n  from crews c',
    solution: 'select c.name from crews c left join crew_staff s on s.crew_id = c.id where s.id is null',
    hints: ['Приєднайте crew_staff через LEFT JOIN по crew_id', 'Відфільтруйте s.id IS NULL'],
  },
  {
    id: 'connect-by',
    title: '3. Ієрархія: CONNECT BY',
    fixture: 'sodu',
    theory:
      'Дерево підрозділів зберігається як parent_id. Oracle обходить його так:\nSTART WITH <корінь> CONNECT BY PRIOR id = parent_id\nLEVEL — глибина (1 = корінь). Саме так у проєкті шукають «гарнізон» підрозділу.',
    task: 'Виведіть name і LEVEL (колонка lvl) для всього дерева від кореня (parent_id IS NULL), сортування за id.',
    starter: 'select name, level as lvl\n  from org_struct\n order by id',
    solution:
      'select name, level as lvl from org_struct start with parent_id is null connect by prior id = parent_id order by id',
    orderSensitive: true,
    hints: ['START WITH parent_id IS NULL', 'CONNECT BY PRIOR id = parent_id'],
    oracleNote: 'PRIOR стоїть з боку «батька». PRIOR parent_id = id йде вгору по дереву.',
  },
]
