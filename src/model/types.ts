export type Lesson = {
  id: string
  module: string
  title: string
  theory: string; example?: string
  task: string
  fixture: string
  starter: string
  solution: string
  orderSensitive?: boolean
  hints: string[]
  oracleNote?: string
}

export type RunResult = { cols: string[]; rows: unknown[][] }

export type Outcome = { ok: true; result: RunResult } | { ok: false; error: string }

export type Verdict = 'pass' | 'fail' | null

export type LessonGroup = { module: string; items: { lesson: Lesson; idx: number }[] }
