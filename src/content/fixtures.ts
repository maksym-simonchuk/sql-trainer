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
  `,
}
