import { useRef, useState } from 'react'
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
  const [snapName, setSnapName] = useState('')
  const {
    data,
    snapshots,
    setSpotNotes,
    addSpot,
    renameSpot,
    deleteSpot,
    importData,
    resetToSeed,
    saveSnapshot,
    loadSnapshot,
    deleteSnapshot,
  } = useRangesStore()

  function handleSaveSnapshot() {
    const name = snapName.trim() || new Date().toLocaleString('en-US')
    saveSnapshot(name)
    setSnapName('')
  }

  function handleLoadSnapshot(id: string, name: string) {
    if (window.confirm(`Load snapshot "${name}"? Current unsaved edits will be replaced.`)) {
      loadSnapshot(id)
      onSpotsChanged(null)
    }
  }

  function handleAdd() {
    const name = window.prompt('New spot name:')?.trim()
    if (name) {
      const id = addSpot(categoryId, name)
      onSpotsChanged(id)
    }
  }

  function handleRename() {
    const name = window.prompt('New spot name:', spot.name)?.trim()
    if (name) renameSpot(categoryId, spot.id, name)
  }

  function handleDelete() {
    if (window.confirm(`Delete spot "${spot.name}"?`)) {
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
        if (!parsed.categories) throw new Error('no "categories" field')
        importData(parsed)
        onSpotsChanged(null)
        window.alert('Data imported')
      } catch (err) {
        window.alert('Import error: ' + (err as Error).message)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="editor">
      <div className="editor__row">
        <button className="btn" onClick={handleAdd}>+ Spot</button>
        <button className="btn" onClick={handleRename}>Rename</button>
        <button className="btn btn--danger" onClick={handleDelete}>Delete spot</button>
      </div>

      <label className="editor__notes-label">
        Spot notes
        <textarea
          className="editor__notes"
          value={spot.notes ?? ''}
          placeholder="Recommendations, sizings…"
          onChange={(e) => setSpotNotes(categoryId, spot.id, e.target.value)}
        />
      </label>

      <div className="editor__row">
        <button className="btn" onClick={handleExport}>Export JSON</button>
        <button className="btn" onClick={() => fileRef.current?.click()}>Import JSON</button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
        <button
          className="btn btn--danger"
          onClick={() => window.confirm('Reset all data to defaults?') && resetToSeed()}
        >
          Reset to defaults
        </button>
      </div>

      <div className="snapshots">
        <div className="snapshots__head">
          <span className="snapshots__title">Snapshots (profiles)</span>
          <span className="snapshots__hint">
            Save range versions — stored in this browser between sessions
          </span>
        </div>
        <div className="snapshots__save">
          <input
            className="snapshots__input"
            type="text"
            value={snapName}
            placeholder="Snapshot name…"
            onChange={(e) => setSnapName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveSnapshot()}
          />
          <button className="btn btn--primary" onClick={handleSaveSnapshot}>
            Save snapshot
          </button>
        </div>

        {snapshots.length === 0 ? (
          <p className="snapshots__empty">No saved snapshots yet.</p>
        ) : (
          <ul className="snapshots__list">
            {snapshots
              .slice()
              .reverse()
              .map((s) => (
                <li key={s.id} className="snapshots__item">
                  <span className="snapshots__name">{s.name}</span>
                  <span className="snapshots__date">
                    {new Date(s.savedAt).toLocaleString('en-US')}
                  </span>
                  <button className="chip" onClick={() => handleLoadSnapshot(s.id, s.name)}>
                    Load
                  </button>
                  <button
                    className="chip"
                    onClick={() => window.confirm(`Delete snapshot "${s.name}"?`) && deleteSnapshot(s.id)}
                  >
                    ✕
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  )
}
