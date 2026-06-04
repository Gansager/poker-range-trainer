import { useRef } from 'react'
import type { RangesData, Spot } from '../domain/types'
import { useRangesStore } from '../store/useRangesStore'

interface EditorPanelProps {
  categoryId: string
  spot: Spot
  onSpotsChanged: (nextSpotId: string | null) => void
}

/** Панель редактора: заметки, управление спотами, импорт/экспорт, сброс. */
export function EditorPanel({ categoryId, spot, onSpotsChanged }: EditorPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const {
    data,
    setSpotNotes,
    addSpot,
    renameSpot,
    deleteSpot,
    importData,
    resetToSeed,
  } = useRangesStore()

  function handleAdd() {
    const name = window.prompt('Название нового спота:')?.trim()
    if (name) {
      const id = addSpot(categoryId, name)
      onSpotsChanged(id)
    }
  }

  function handleRename() {
    const name = window.prompt('Новое название спота:', spot.name)?.trim()
    if (name) renameSpot(categoryId, spot.id, name)
  }

  function handleDelete() {
    if (window.confirm(`Удалить спот «${spot.name}»?`)) {
      deleteSpot(categoryId, spot.id)
      onSpotsChanged(null)
    }
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'poker-ranges.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as RangesData
        if (!parsed.categories) throw new Error('нет поля categories')
        importData(parsed)
        onSpotsChanged(null)
        window.alert('Данные импортированы')
      } catch (err) {
        window.alert('Ошибка импорта: ' + (err as Error).message)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="editor">
      <div className="editor__row">
        <button className="btn" onClick={handleAdd}>+ Спот</button>
        <button className="btn" onClick={handleRename}>Переименовать</button>
        <button className="btn btn--danger" onClick={handleDelete}>Удалить спот</button>
      </div>

      <label className="editor__notes-label">
        Заметки к споту
        <textarea
          className="editor__notes"
          value={spot.notes ?? ''}
          placeholder="Рекомендации, сайзинги…"
          onChange={(e) => setSpotNotes(categoryId, spot.id, e.target.value)}
        />
      </label>

      <div className="editor__row">
        <button className="btn" onClick={handleExport}>Экспорт JSON</button>
        <button className="btn" onClick={() => fileRef.current?.click()}>Импорт JSON</button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
        <button
          className="btn btn--danger"
          onClick={() => window.confirm('Сбросить все данные к образцам?') && resetToSeed()}
        >
          Сброс к образцам
        </button>
      </div>
    </div>
  )
}
