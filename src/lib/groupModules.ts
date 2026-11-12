import type { Lesson, LessonGroup } from '../model/types'

export function groupModules(lessons: Lesson[]): LessonGroup[] {
  const groups: LessonGroup[] = []
  lessons.forEach((lesson, idx) => {
    let g = groups.find((x) => x.module === lesson.module)
    if (!g) groups.push((g = { module: lesson.module, items: [] }))
    g.items.push({ lesson, idx })
  })
  return groups
}
