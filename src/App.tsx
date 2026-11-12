import { useEffect, useState } from 'react'
import { PGlite } from '@electric-sql/pglite'

export function App() {
  const [out, setOut] = useState('loading…')
  useEffect(() => {
    new PGlite().query('select 1 as one').then((r) => setOut(JSON.stringify(r.rows)))
  }, [])
  return <pre>{out}</pre>
}
