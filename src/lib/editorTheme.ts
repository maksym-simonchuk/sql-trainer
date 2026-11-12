import { EditorView } from '@codemirror/view'
import { oneDark } from '@codemirror/theme-one-dark'

export const editorTheme = [
  oneDark,
  EditorView.theme({
    '&': { fontSize: '15px', backgroundColor: 'var(--surface)' },
    '.cm-content': { fontFamily: 'var(--mono)', padding: '12px 0' },
    '.cm-gutters': { backgroundColor: 'var(--surface)', color: 'var(--muted)', border: 'none' },
    '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: 'rgba(148,163,184,.08)' },
    '&.cm-focused': { outline: 'none' },
  }),
]
