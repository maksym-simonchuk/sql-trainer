export const FIXTURES: Record<string, string> = {
  sodu: `
    create table org_struct (id int primary key, parent_id int, name text, subdiv_type text);
    insert into org_struct values
      (1, null, 'Головне управління', 'DEPT'),
      (2, 1, 'Центр А', 'CENTER'),
      (3, 1, 'Центр Б', 'CENTER'),
      (4, 2, 'Частина 1', 'UNIT'),
      (5, 2, 'Частина 2', 'UNIT'),
      (6, 3, 'Частина 3', 'UNIT');
    create table crews (id int primary key, org_id int, name text, status text);
    insert into crews values
      (1, 4, 'Караул 1', 'ON_DUTY'), (2, 4, 'Караул 2', 'OFF'),
      (3, 5, 'Караул 3', 'ON_DUTY'), (4, 6, 'Караул 4', 'ON_DUTY'),
      (5, 6, 'Караул 5', 'OFF');
    create table crew_staff (id int primary key, crew_id int, full_name text, rank text, date_till date);
    insert into crew_staff values
      (1, 1, 'Іваненко І.', 'майор', null),
      (2, 1, 'Петренко П.', null, null),
      (3, 2, 'Сидоренко С.', 'капітан', '2026-01-01'),
      (4, 3, 'Коваль К.', null, null),
      (5, 4, 'Мельник М.', 'лейтенант', null);
    insert into crew_staff values
      (6, 1, 'Бондар Б.', 'сержант', '2099-12-31'),
      (7, 3, 'Гнатюк Г.', 'майор', null),
      (8, 4, 'Шевчук Ш.', null, '2020-06-30'),
      (9, 2, 'Ткачук Т.', 'лейтенант', null);
    create table vehicles (id int primary key, crew_id int, plate text, vtype text, fuel_pct int);
    insert into vehicles values
      (1, 1, 'AA1001BB', 'АЦ', 80), (2, 1, 'AA1002BB', 'АЛ', null),
      (3, 2, 'AA1003BB', 'АЦ', 35), (4, 3, 'AA1004BB', 'АЦ', 100),
      (5, 4, 'AA1005BB', 'АЛ', 10), (6, null, 'AA1006BB', 'АЦ', 60);
    create table guard_orders (id int primary key, org_id int, order_date date, persons_number int, status text);
    insert into guard_orders values
      (1, 4, '2026-03-01', 12, 'ACTIVE'), (2, 4, '2026-03-02', 10, 'ACTIVE'),
      (3, 5, '2026-03-01', 8, 'CLOSED'), (4, 5, '2026-03-05', null, 'ACTIVE'),
      (5, 6, '2026-04-01', 15, 'CLOSED'), (6, 6, '2026-04-02', 14, 'ACTIVE'),
      (7, 4, '2026-04-03', 11, 'CLOSED');
    create table emergency_events (id int primary key, org_id int, payload text);
    insert into emergency_events values
      (1, 4, '{"type":"FIRE","priority":2,"address":{"city":"Київ"},"units":[{"crew":1,"people":4},{"crew":2,"people":3}]}'),
      (2, 5, '{"type":"RESCUE","priority":1,"address":{"city":"Львів"},"units":[{"crew":3,"people":5}]}'),
      (3, 6, '{"type":"FIRE","priority":null,"address":{"city":"Одеса"},"units":[]}'),
      (4, 4, '{"type":"FLOOD","priority":3,"address":{"city":"Київ"},"units":[{"crew":1,"people":2},{"crew":4,"people":6},{"crew":3,"people":2}]}');
  `,
}
