// Oracle -> PostgreSQL rewrite. Whitelist subset; anything else throws NotEmulatedError.

export class NotEmulatedError extends Error {
  constructor(what: string) {
    super(`not emulated: ${what}`)
  }
}

const closeIdx = (s: string, open: number): number => {
  let d = 0
  for (let i = open; i < s.length; i++) {
    if (s[i] === '(') d++
    else if (s[i] === ')' && --d === 0) return i
  }
  throw new Error('unbalanced parentheses')
}

const splitArgs = (s: string): string[] => {
  const out: string[] = []
  let d = 0
  let cur = ''
  for (const c of s) {
    if (c === '(') d++
    if (c === ')') d--
    if (c === ',' && d === 0) {
      out.push(cur.trim())
      cur = ''
    } else cur += c
  }
  out.push(cur.trim())
  return out
}

type CallFn = (args: string[], after: string) => { text: string; consumed?: number }

// Rewrites `name(...)` calls, innermost (last) first.
const rewriteCalls = (sql: string, name: string, fn: CallFn): string => {
  const re = new RegExp(`\\b${name}\\s*\\(`, 'gi')
  for (;;) {
    let last: RegExpExecArray | null = null
    let m: RegExpExecArray | null
    re.lastIndex = 0
    while ((m = re.exec(sql))) last = m
    if (!last) return sql
    const open = last.index + last[0].length - 1
    const close = closeIdx(sql, open)
    const after = sql.slice(close + 1)
    const r = fn(splitArgs(sql.slice(open + 1, close)), after)
    sql = sql.slice(0, last.index) + r.text + after.slice(r.consumed ?? 0)
  }
}

const listagg: CallFn = ([expr, sep], after) => {
  const m = /^\s*within\s+group\s*\(/i.exec(after)
  if (!m) throw new NotEmulatedError('LISTAGG without WITHIN GROUP')
  const wclose = closeIdx(after, m[0].length - 1)
  const order = after.slice(m[0].length, wclose).replace(/^\s*order\s+by\s+/i, '')
  return { text: `string_agg((${expr})::text, ${sep ?? "''"} ORDER BY ${order})`, consumed: wclose + 1 }
}

const decode: CallFn = ([x, ...rest]) => {
  const whens: string[] = []
  let i = 0
  for (; i + 1 < rest.length; i += 2) whens.push(`WHEN ${x} IS NOT DISTINCT FROM ${rest[i]} THEN ${rest[i + 1]}`)
  return { text: `(CASE ${whens.join(' ')}${i < rest.length ? ` ELSE ${rest[i]}` : ''} END)` }
}

const nvl2: CallFn = ([a, b, c]) => ({ text: `(CASE WHEN ${a} IS NOT NULL THEN ${b} ELSE ${c} END)` })

const KW = 'where|on|left|right|inner|cross|outer|join|order|group|start|connect|union|minus|fetch|having'

const applyJoins = (sql: string): string => {
  const re = /\b(outer|cross)\s+apply\s*\(/gi
  for (;;) {
    let last: RegExpExecArray | null = null
    let m: RegExpExecArray | null
    re.lastIndex = 0
    while ((m = re.exec(sql))) last = m
    if (!last) return sql
    const open = last.index + last[0].length - 1
    const close = closeIdx(sql, open)
    const inner = sql.slice(open, close + 1)
    const after = sql.slice(close + 1)
    const alias = new RegExp(`^\\s+(?!(?:${KW})\\b)([a-z_]\\w*)`, 'i').exec(after)
    const a = alias ? ` ${alias[1]}` : ''
    const join = last[1].toLowerCase() === 'outer' ? `LEFT JOIN LATERAL ${inner}${a} ON true` : `CROSS JOIN LATERAL ${inner}${a}`
    sql = sql.slice(0, last.index) + join + after.slice(alias ? alias[0].length : 0)
  }
}

const rownum = (s: string): string => {
  const m = /\brownum\s*(<=?)\s*(\d+)/i.exec(s)
  if (!m) return s
  if (/\border\s+by\b/i.test(s))
    throw new NotEmulatedError('ROWNUM with ORDER BY in the same query (Oracle filters BEFORE sorting) — use FETCH FIRST n ROWS ONLY')
  const n = m[1] === '<' ? +m[2] - 1 : +m[2]
  const out = s
    .replace(/\bwhere\s+rownum\s*<=?\s*\d+\s+and\b/i, 'WHERE')
    .replace(/\bwhere\s+rownum\s*<=?\s*\d+/i, '')
    .replace(/\band\s+rownum\s*<=?\s*\d+/i, '')
  return `${out.trimEnd()} LIMIT ${n}`
}

const CONNECT_BY =
  /^(\s*select\s[\s\S]*?\sfrom\s+)([\w$.]+)(?:\s+(?!where\b|start\b|connect\b)([a-z_]\w*))?(\s+where\s[\s\S]*?)?\s+start\s+with\s+([\s\S]+?)\s+connect\s+by\s+(?:nocycle\s+)?([\s\S]+?)(\s+order\s+(siblings\s+)?by\s[\s\S]*)?\s*$/i

const col = (s: string) => s.replace(/^.*\./, '')

const connectBy = (s: string): string => {
  if (!/\bconnect\s+by\b/i.test(s)) return s
  const m = CONNECT_BY.exec(s)
  if (!m) throw new NotEmulatedError('CONNECT BY (only: SELECT … FROM t [a] [WHERE] START WITH … CONNECT BY PRIOR x = y [ORDER BY])')
  const [, head, table, alias, where, start, cond, order, siblings] = m
  if (siblings) throw new NotEmulatedError('ORDER SIBLINGS BY')
  const p =
    /^prior\s+([\w$.]+)\s*=\s*([\w$.]+)$/i.exec(cond.trim()) ??
    (/^([\w$.]+)\s*=\s*prior\s+([\w$.]+)$/i.exec(cond.trim())?.slice(0, 3).reverse().concat() as RegExpExecArray | undefined)
  if (!p) throw new NotEmulatedError('CONNECT BY condition (only PRIOR a = b)')
  const [prior, other] = [col(p[1]), col(p[2])]
  const a = alias ?? table
  return (
    `WITH RECURSIVE _h AS (SELECT ${a}.*, 1 AS level FROM ${table} ${a} WHERE ${start} ` +
    `UNION ALL SELECT ${a}.*, _h.level + 1 FROM ${table} ${a} JOIN _h ON _h.${prior} = ${a}.${other}) ` +
    `${head}_h ${a}${where ?? ''}${order ?? ''}`
  )
}

const selectRewrites = (s: string): string => connectBy(rownum(s.replace(/\bminus\b/gi, 'EXCEPT')))

// Applies per-SELECT rewrites to every (sub)query, inner first.
const perSelect = (sql: string): string => {
  const subs: string[] = []
  let out = ''
  for (let i = 0; i < sql.length; ) {
    if (sql[i] === '(') {
      const close = closeIdx(sql, i)
      const inner = sql.slice(i + 1, close)
      if (/^\s*(select|with)\b/i.test(inner)) {
        subs.push(`(${perSelect(inner)})`)
        out += `\u0002${subs.length - 1}\u0002`
        i = close + 1
        continue
      }
    }
    out += sql[i++]
  }
  return selectRewrites(out).replace(/\u0002(\d+)\u0002/g, (_, n) => subs[+n])
}

const UNSUPPORTED: [RegExp, string][] = [
  [/\b(connect\s+by|start\s+with|prior)\b/i, 'CONNECT BY form'],
  [/\b(sys_connect_by_path|connect_by_root|connect_by_isleaf|siblings)\b/i, 'hierarchical pseudo-columns'],
  [/\brownum\b/i, 'ROWNUM form'],
  [/\(\+\)/, '(+) outer join — use LEFT JOIN'],
  [/\bmerge\s+into\b/i, 'MERGE'],
  [/\b(un)?pivot\b/i, 'PIVOT'],
  [/\b(flashback|versions\s+between|as\s+of\s+(timestamp|scn))\b/i, 'FLASHBACK'],
]

export function translate(oracle: string): string {
  const lits: string[] = []
  let sql = oracle
    .replace(/'(?:[^']|'')*'|"[^"]*"|--[^\n]*|\/\*[\s\S]*?\*\//g, (t) => {
      if (t[0] === '-' || t[0] === '/') return ' '
      lits.push(t)
      return `\u0001${lits.length - 1}\u0001`
    })
    .replace(/;\s*$/, '')
    .replace(/\s+from\s+dual\b/gi, '')
    .replace(/\btrunc\s*\(\s*sysdate\s*\)/gi, "date_trunc('day', now()::timestamp)")
    .replace(/\bsysdate\s*([+-])\s*(\d+(?:\.\d+)?)/gi, "now()::timestamp $1 interval '$2 days'")
    .replace(/\bsysdate\b/gi, 'now()::timestamp')
    .replace(/\bnvl\s*\(/gi, 'COALESCE(')
    .replace(/\bvarchar2\b/gi, 'varchar')
    .replace(/\bas\s+number\b/gi, 'AS numeric')
    .replace(/\bnumber(?=\s+path\b)/gi, 'numeric')
  sql = rewriteCalls(rewriteCalls(rewriteCalls(sql, 'nvl2', nvl2), 'decode', decode), 'listagg', listagg)
  sql = perSelect(applyJoins(sql))
  const bad = UNSUPPORTED.find(([re]) => re.test(sql))
  if (bad) throw new NotEmulatedError(bad[1])
  return sql.replace(/\u0001(\d+)\u0001/g, (_, n) => lits[+n])
}
