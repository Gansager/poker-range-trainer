import { useEffect, useMemo, useRef, useState } from 'react'

interface TocEntry {
  id: string
  level: number
  text: string
}

/** Раздел-«книга»: оглавление + контент из public/book (конвертировано из docx). */
export function Book() {
  const [html, setHtml] = useState<string | null>(null)
  const [toc, setToc] = useState<TocEntry[]>([])
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [tocOpen, setTocOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const base = import.meta.env.BASE_URL
    Promise.all([
      fetch(`${base}book/book.html`).then((r) => {
        if (!r.ok) throw new Error('book.html ' + r.status)
        return r.text()
      }),
      fetch(`${base}book/toc.json`).then((r) => r.json()),
    ])
      .then(([h, t]) => {
        setHtml(h)
        setToc(t as TocEntry[])
      })
      .catch((e) => setError(String(e)))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return toc
    return toc.filter((e) => e.text.toLowerCase().includes(q))
  }, [toc, query])

  function goto(id: string) {
    const el = contentRef.current?.querySelector('#' + CSS.escape(id))
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTocOpen(false)
  }

  if (error) return <div className="book__msg">Не удалось загрузить книгу: {error}</div>
  if (html === null) return <div className="book__msg">Загрузка книги…</div>

  return (
    <div className={`book ${tocOpen ? 'book--toc-open' : ''}`}>
      <button className="book__toc-toggle" onClick={() => setTocOpen((v) => !v)}>
        ☰ Contents
      </button>

      <aside className="book__toc">
        <input
          className="book__search"
          type="text"
          value={query}
          placeholder="Search contents…"
          onChange={(e) => setQuery(e.target.value)}
        />
        <ul className="book__toc-list">
          {filtered.map((e) => (
            <li key={e.id} className={`book__toc-item lvl-${e.level}`}>
              <button onClick={() => goto(e.id)}>{e.text}</button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="book__content" ref={contentRef} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
