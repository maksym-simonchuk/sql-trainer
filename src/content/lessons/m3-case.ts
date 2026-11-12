import type { Lesson } from '../../model/types'

const module = 'M3 · CASE і DECODE'

export const M3: Lesson[] = [
  {
    id: 'case-searched',
    module,
    title: 'CASE WHEN: умови',
    fixture: 'sodu',
    theory: 'CASE WHEN умова THEN значення … ELSE значення END перевіряє гілки зверху вниз; перша істинна перемагає.',
    task: "Для кожного працівника виведіть full_name і grp: 'н/д' якщо звання порожнє, 'старший' для майор/капітан, інакше 'молодший'. Сортування за id.",
    starter: `select full_name, rank as grp
  from crew_staff
 order by id`,
    solution: `select full_name, case when rank is null then 'н/д' when rank in ('майор', 'капітан') then 'старший' else 'молодший' end as grp from crew_staff order by id`,
    orderSensitive: true,
    hints: ['Спочатку гілка rank IS NULL', "rank in ('майор', 'капітан')"],
  },
  {
    id: 'case-simple',
    module,
    title: 'Простий CASE',
    fixture: 'sodu',
    theory: 'Простий CASE порівнює один вираз зі списком значень: CASE status WHEN \'A\' THEN … END.',
    task: "Виведіть name караулу та status_ua: 'на чергуванні' для ON_DUTY, інакше 'вихідний'. Сортування за id.",
    starter: `select name, status as status_ua
  from crews
 order by id`,
    solution: `select name, case status when 'ON_DUTY' then 'на чергуванні' else 'вихідний' end as status_ua from crews order by id`,
    orderSensitive: true,
    hints: ["case status when 'ON_DUTY' then … else … end"],
  },
  {
    id: 'decode',
    module,
    title: 'DECODE — Oracle-скорочення',
    fixture: 'sodu',
    theory: "DECODE(x, знач1, рез1, знач2, рез2, …, за_замовчуванням) — Oracle-аналог простого CASE. Єдиний випадок, коли NULL = NULL.",
    task: "Виведіть plate і vtype_name: 'АЦ' → 'автоцистерна', 'АЛ' → 'автодрабина', інше — 'інше'. Сортування за id.",
    starter: `select plate, vtype as vtype_name
  from vehicles
 order by id`,
    solution: `select plate, decode(vtype, 'АЦ', 'автоцистерна', 'АЛ', 'автодрабина', 'інше') as vtype_name from vehicles order by id`,
    orderSensitive: true,
    hints: ["decode(vtype, 'АЦ', …, 'АЛ', …, 'інше')"],
    oracleNote: 'DECODE вважає NULL рівним NULL, на відміну від звичайного =. У проєкті зустрічається поряд із CASE.',
  },
  {
    id: 'case-order-by',
    module,
    title: 'CASE в ORDER BY',
    fixture: 'sodu',
    theory: 'CASE можна використати де завгодно, зокрема у сортуванні: так задають власний порядок.',
    task: 'Виведіть name і status караулів: спочатку ON_DUTY, потім решта; всередині — за id.',
    starter: `select name, status
  from crews
 order by id`,
    solution: `select name, status from crews order by case status when 'ON_DUTY' then 0 else 1 end, id`,
    orderSensitive: true,
    hints: ["order by case status when 'ON_DUTY' then 0 else 1 end, id"],
  },
  {
    id: 'case-null-branch',
    module,
    title: 'CASE і NULL-гілка',
    fixture: 'sodu',
    theory: 'NULL < 30 — не TRUE, тож NULL «провалюється» в ELSE. Обробляйте NULL першою гілкою.',
    task: "Виведіть plate і fuel_state: 'невідомо' (NULL), 'критично' (<30), 'норма' (<70), інакше 'повний'. Сортування за id.",
    starter: `select plate,
       case when fuel_pct < 30 then 'критично'
            when fuel_pct < 70 then 'норма'
            else 'повний' end as fuel_state
  from vehicles
 order by id`,
    solution: `select plate, case when fuel_pct is null then 'невідомо' when fuel_pct < 30 then 'критично' when fuel_pct < 70 then 'норма' else 'повний' end as fuel_state from vehicles order by id`,
    orderSensitive: true,
    hints: ['Додайте першою гілку WHEN fuel_pct IS NULL'],
  },
  {
    id: 'case-flag',
    module,
    title: "Прапорець 'Y'/'N' замість BOOLEAN",
    fixture: 'sodu',
    theory: "В Oracle SQL немає типу BOOLEAN. Булеві прапорці зазвичай віддають як 'Y'/'N' через CASE.",
    task: "Виведіть full_name і expired: 'Y' якщо date_till заповнене і вже минуло (<= SYSDATE), інакше 'N'. Сортування за id.",
    starter: `select full_name, date_till as expired
  from crew_staff
 order by id`,
    solution: `select full_name, case when date_till is not null and date_till <= sysdate then 'Y' else 'N' end as expired from crew_staff order by id`,
    orderSensitive: true,
    hints: ["case when date_till is not null and date_till <= sysdate then 'Y' else 'N' end"],
    oracleNote: 'Oracle SQL не має BOOLEAN-колонок (тільки в PL/SQL) — тому Y/N або 1/0.',
  },
]
