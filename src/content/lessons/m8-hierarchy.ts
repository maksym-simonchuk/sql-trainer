import type { Lesson } from '../../model/types'

export const M8: Lesson[] = [
  {
    id: 'connect-by',
    module: 'M8 · Ієрархії',
    title: 'CONNECT BY: обхід дерева',
    fixture: 'sodu',
    theory:
      'Дерево підрозділів зберігається як parent_id. Oracle обходить його так:\nSTART WITH <корінь> CONNECT BY PRIOR id = parent_id\nLEVEL — глибина (1 = корінь). Саме так у проєкті шукають «гарнізон» підрозділу.',
    example: `select name, level
  from org_struct
 start with parent_id is null
 connect by prior id = parent_id;
-- обхід дерева згори вниз`,
    task: 'Виведіть name і LEVEL (колонка lvl) для всього дерева від кореня (parent_id IS NULL), сортування за id.',
    starter: `select name, level as lvl
  from org_struct
 order by id`,
    solution: `select name, level as lvl from org_struct start with parent_id is null connect by prior id = parent_id order by id`,
    orderSensitive: true,
    hints: ['START WITH parent_id IS NULL', 'CONNECT BY PRIOR id = parent_id'],
    oracleNote: 'PRIOR стоїть з боку «батька». PRIOR parent_id = id йде вгору по дереву.',
  },
]
