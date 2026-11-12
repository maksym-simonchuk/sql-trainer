import { useEffect, useRef } from 'react'
import { basicSetup, EditorView } from 'codemirror'
import { keymap } from '@codemirror/view'
import { PLSQL, sql } from '@codemirror/lang-sql'
import { SQL_KEYS } from '../model/constants'

type Props = { initial: string; onChange: (v: string) => void; onRun: () => void }

export function Editor({ initial, onChange, onRun }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const view = useRef<EditorView>(null)
  const cb = useRef({ onChange, onRun })
  cb.current = { onChange, onRun }

  useEffect(() => {
    const v = new EditorView({
      parent: host.current!,
      doc: initial,
      extensions: [
        basicSetup,
        sql({ dialect: PLSQL }),
        keymap.of([{ key: 'Mod-Enter', run: () => (cb.current.onRun(), true) }]),
        EditorView.updateListener.of((u) => u.docChanged && cb.current.onChange(u.state.doc.toString())),
      ],
    })
    view.current = v
    return () => v.destroy()
  }, [initial])

  const insert = (s: string) => {
    const v = view.current!
    v.dispatch(v.state.replaceSelection(s))
    v.focus()
  }

  return (
    <div>
      <div ref={host} className="editor" />
      <div className="keys">
        {SQL_KEYS.map((k) => (
          <button key={k} type="button" onClick={() => insert(k)}>
            {k}
          </button>
        ))}
      </div>
    </div>
  )
}
