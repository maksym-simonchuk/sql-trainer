import type { Lesson } from '../../model/types'
import { M1 } from './m1-null'
import { M2 } from './m2-join'
import { M3 } from './m3-case'
import { M4 } from './m4-group'
import { M5 } from './m5-subquery'
import { M8 } from './m8-hierarchy'

export const LESSONS: Lesson[] = [...M1, ...M2, ...M3, ...M4, ...M5, ...M8]
