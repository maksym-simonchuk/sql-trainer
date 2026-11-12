import type { Outcome } from '../model/types'

type Props = { outcome: Outcome | null }

export function ResultTable({ outcome }: Props) {
  if (!outcome) return null
  if (!outcome.ok) return <pre className="error">{outcome.error}</pre>
  const { cols, rows } = outcome.result
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {cols.map((c, i) => (
              <th key={i}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((v, j) => (
                <td key={j} className={v == null ? 'null' : undefined}>
                  {v == null ? 'NULL' : String(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <small>{rows.length} рядків</small>
    </div>
  )
}
