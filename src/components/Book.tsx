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
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [zoom, setZoom] = useState<string | null>(null)
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

  // Какие главы (level 1) имеют вложенные пункты.
  const hasChildren = useMemo(() => {
    const set = new Set<string>()
    for (let i = 0; i < toc.length; i++) {
      if (toc[i].level === 1 && toc[i + 1] && toc[i + 1].level > 1) set.add(toc[i].id)
    }
    return set
  }, [toc])

  const searching = query.trim().length > 0

  function goto(id: string) {
    const el = contentRef.current?.querySelector('#' + CSS.escape(id))
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTocOpen(false)
  }

  function onContentClick(e: React.MouseEvent) {
    const t = e.target as HTMLElement
    if (t.tagName === 'IMG') setZoom((t as HTMLImageElement).src)
  }

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  if (error) return <div className="book__msg">Failed to load the book: {error}</div>
  if (html === null) return <div className="book__msg">Loading book…</div>

  // Построение видимого списка с учётом сворачивания глав.
  const rows: TocEntry[] = []
  let curChapter: string | null = null
  for (const e of filtered) {
    if (e.level === 1) {
      curChapter = e.id
      rows.push(e)
    } else if (searching || (curChapter && expanded.has(curChapter))) {
      rows.push(e)
    }
  }

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
          {rows.map((e) => {
            if (e.level === 1) {
              const open = searching || expanded.has(e.id)
              const kids = hasChildren.has(e.id)
              return (
                <li key={e.id} className="book__toc-item lvl-1">
                  <div className="book__chapter">
                    <button
                      className="book__chevron"
                      aria-label={open ? 'collapse' : 'expand'}
                      disabled={!kids}
                      onClick={() => kids && toggle(e.id)}
                    >
                      {kids ? (open ? '▾' : '▸') : '·'}
                    </button>
                    <button
                      className="book__chapter-title"
                      onClick={() => {
                        goto(e.id)
                        if (kids && !expanded.has(e.id)) toggle(e.id)
                      }}
                    >
                      {e.text}
                    </button>
                  </div>
                </li>
              )
            }
            return (
              <li key={e.id} className={`book__toc-item lvl-${e.level}`}>
                <button onClick={() => goto(e.id)}>{e.text}</button>
              </li>
            )
          })}
        </ul>
      </aside>

      <div
        className="book__content"
        ref={contentRef}
        onClick={onContentClick}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {zoom && (
        <div className="lightbox" onClick={() => setZoom(null)}>
          <div className="lightbox__bar">
            <span className="lightbox__title">Image</span>
            <button className="lightbox__close" onClick={() => setZoom(null)}>
              ✕
            </button>
          </div>
          <div className="lightbox__scroll" onClick={(e) => e.stopPropagation()}>
            <img className="lightbox__fit" src={zoom} alt="" />
          </div>
        </div>
      )}
    </div>
  )
}
