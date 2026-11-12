import type { Lesson } from '../../model/types'

const module = 'M11 · JSON'

export const M11: Lesson[] = [
  {
    id: 'json-value',
    module,
    title: 'JSON_VALUE',
    fixture: 'sodu',
    theory: "JSON_VALUE(col, '$.path') дістає скалярне значення з JSON-рядка. Шлях починається з $. У проєкті JSON_* — 1014 разів.",
    task: "Виведіть id і type — значення '$.type' з payload для всіх emergency_events. Сортування за id.",
    starter: `select id, payload
  from emergency_events
 order by id`,
    solution: `select id, json_value(payload, '$.type') as type from emergency_events order by id`,
    orderSensitive: true,
    hints: ["json_value(payload, '$.type') as type"],
  },
  {
    id: 'json-nested',
    module,
    title: 'Вкладені шляхи',
    fixture: 'sodu',
    theory: "Вкладені ключі — через крапку: '$.address.city'.",
    task: "Виведіть id події та city, де city = 'Київ'. Сортування за id.",
    starter: `select id
  from emergency_events`,
    solution: `select id, json_value(payload, '$.address.city') as city from emergency_events where json_value(payload, '$.address.city') = 'Київ' order by id`,
    orderSensitive: true,
    hints: ["where json_value(payload, '$.address.city') = 'Київ'"],
  },
  {
    id: 'json-table',
    module,
    title: 'JSON_TABLE: масив → рядки',
    fixture: 'sodu',
    theory: "JSON_TABLE розгортає JSON-масив у реляційні рядки: JSON_TABLE(col, '$.units[*]' COLUMNS (crew NUMBER PATH '$.crew')).",
    task: 'Виведіть id події, crew і people з масиву units. Події без units не потрібні. Колонки id, crew, people.',
    starter: `select e.id
  from emergency_events e`,
    solution: `select e.id, u.crew, u.people from emergency_events e, json_table(e.payload, '$.units[*]' columns (crew number path '$.crew', people number path '$.people')) u`,
    hints: ["from emergency_events e, json_table(e.payload, '$.units[*]' columns (crew number path '$.crew', people number path '$.people')) u"],
    oracleNote: 'Для Oracle 12.1 JSON_TABLE потребує, щоб колонка була VARCHAR2/CLOB з перевіркою IS JSON.',
  },
]
