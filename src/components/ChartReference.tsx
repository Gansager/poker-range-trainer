import { useState } from 'react'
import { chartUrl } from '../data/charts'

interface ChartReferenceProps {
  categoryId: string
  categoryName: string
}

/** Кнопка + модальный просмотр эталонного чарта категории (картинка FunFarm). */
export function ChartReference({ categoryId, categoryName }: ChartReferenceProps) {
  const [open, setOpen] = useState(false)
  const url = chartUrl(categoryId)
  if (!url) return null

  return (
    <>
      <button className="chartref-btn" onClick={() => setOpen(true)} title="Show original chart">
        📊 Chart
      </button>

      {open && (
        <div className="lightbox" onClick={() => setOpen(false)}>
          <div className="lightbox__bar">
            <span className="lightbox__title">Reference chart — {categoryName}</span>
            <a
              className="lightbox__open"
              href={url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              Open original ↗
            </a>
            <button className="lightbox__close" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>
          <div className="lightbox__scroll" onClick={(e) => e.stopPropagation()}>
            <img className="lightbox__img" src={url} alt={`Chart: ${categoryName}`} />
          </div>
        </div>
      )}
    </>
  )
}
