import type { Lesson } from '../../model/types'

const module = 'M2 · JOIN'

export const M2: Lesson[] = [
  {
    id: 'left-join-anti',
    module,
    title: 'LEFT JOIN і пошук «відсутніх»',
    fixture: 'sodu',
    theory:
      'LEFT JOIN зберігає всі рядки лівої таблиці. Якщо пари немає — праві колонки NULL.\nЗвідси anti-join: LEFT JOIN … WHERE права.id IS NULL = «ліві без пари».',
    example: `select c.name
  from crews c
  left join vehicles v on v.crew_id = c.id
 where v.id is null;
-- караули БЕЗ машин`,
    task: 'Знайдіть назви караулів (crews.name), у яких немає жодного працівника.',
    starter: `select c.name
  from crews c`,
    solution: `select c.name from crews c left join crew_staff s on s.crew_id = c.id where s.id is null`,
    hints: ['Приєднайте crew_staff через LEFT JOIN по crew_id', 'Відфільтруйте s.id IS NULL'],
  },
  {
    id: 'inner-join',
    module,
    title: 'JOIN: зв’язуємо таблиці',
    fixture: 'sodu',
    theory: 'JOIN ... ON з’єднує рядки за умовою. Без пари рядок зникає. Псевдоніми (s, c) скорочують запис.',
    example: `select c.name, v.plate
  from crews c
  join vehicles v on v.crew_id = c.id;
-- лише пари, що збіглися`,
    task: 'Виведіть full_name і назву караулу як crew_name. Сортування за s.id.',
    starter: `select s.full_name, s.crew_id as crew_name
  from crew_staff s
 order by s.id`,
    solution: `select s.full_name, c.name as crew_name from crew_staff s join crews c on c.id = s.crew_id order by s.id`,
    orderSensitive: true,
    hints: ['join crews c on c.id = s.crew_id', 'Беріть c.name'],
  },
  {
    id: 'left-join-all',
    module,
    title: 'LEFT JOIN: нічого не губимо',
    fixture: 'sodu',
    theory: 'Коли потрібні ВСІ ліві рядки (навіть без пари) — LEFT JOIN. INNER JOIN мовчки вилучає «порожні».',
    example: `select c.name, v.plate
  from crews c
  left join vehicles v on v.crew_id = c.id;
-- усі караули, plate може бути NULL`,
    task: 'Виведіть name кожного караулу і full_name його працівників (NULL, якщо немає). Сортування за c.id, s.id.',
    starter: `select c.name, s.full_name
  from crews c
  join crew_staff s on s.crew_id = c.id
 order by c.id, s.id`,
    solution: `select c.name, s.full_name from crews c left join crew_staff s on s.crew_id = c.id order by c.id, s.id`,
    orderSensitive: true,
    hints: ['Замініть join на left join'],
    oracleNote: 'Старий Oracle-синтаксис (+) у курсі не виконується — пишіть ANSI LEFT JOIN, як і в проєкті.',
  },
  {
    id: 'on-vs-where',
    module,
    title: 'Умова в ON чи в WHERE',
    fixture: 'sodu',
    theory:
      'У LEFT JOIN умова по правій таблиці у WHERE перетворює його на INNER JOIN (NULL-рядки відсіюються).\nХочете зберегти всі ліві — кладіть умову в ON.',
    example: `select c.name, v.plate
  from crews c
  left join vehicles v
    on v.crew_id = c.id and v.vtype = 'АЦ';
-- умова в ON не губить караули`,
    task: "Виведіть name усіх караулів та full_name їхніх майорів (rank = 'майор'); у караулів без майора — NULL. Сортування за c.id.",
    starter: `select c.name, s.full_name
  from crews c
  left join crew_staff s on s.crew_id = c.id
 where s.rank = 'майор'
 order by c.id`,
    solution: `select c.name, s.full_name from crews c left join crew_staff s on s.crew_id = c.id and s.rank = 'майор' order by c.id`,
    orderSensitive: true,
    hints: ['Перенесіть s.rank = ... з WHERE в ON (через AND)'],
  },
  {
    id: 'join-chain',
    module,
    title: 'Ланцюжок JOIN',
    fixture: 'sodu',
    theory: 'Можна з’єднувати скільки завгодно таблиць підряд: працівник → караул → підрозділ.',
    example: `select o.name, c.name, v.plate
  from org_struct o
  join crews c on c.org_id = o.id
  join vehicles v on v.crew_id = c.id;`,
    task: 'Виведіть full_name працівника і назву підрозділу (org_struct.name) як unit. Сортування за s.id.',
    starter: `select s.full_name, c.name as unit
  from crew_staff s
  join crews c on c.id = s.crew_id
 order by s.id`,
    solution: `select s.full_name, o.name as unit from crew_staff s join crews c on c.id = s.crew_id join org_struct o on o.id = c.org_id order by s.id`,
    orderSensitive: true,
    hints: ['Додайте join org_struct o on o.id = c.org_id', 'Беріть o.name'],
  },
  {
    id: 'self-join',
    module,
    title: 'Self-join: батько і дитина',
    fixture: 'sodu',
    theory: 'Таблицю можна з’єднати саму з собою: org_struct u (дитина) + org_struct p (батько) через p.id = u.parent_id.',
    example: `select ch.name as child, p.name as parent
  from org_struct ch
  join org_struct p on p.id = ch.parent_id;`,
    task: 'Виведіть name підрозділу і name його батька як parent_name (у кореня NULL). Сортування за u.id.',
    starter: `select u.name, u.parent_id as parent_name
  from org_struct u
 order by u.id`,
    solution: `select u.name, p.name as parent_name from org_struct u left join org_struct p on p.id = u.parent_id order by u.id`,
    orderSensitive: true,
    hints: ['left join org_struct p on p.id = u.parent_id'],
  },
]
