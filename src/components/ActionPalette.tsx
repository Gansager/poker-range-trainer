import { useEffect } from 'react'
import type { ActionId } from '../domain/types'
import { ACTION_DEFS } from '../domain/actions'

interface ActionPaletteProps {
  actions: ActionId[]
  active: ActionId
  onChange: (action: ActionId) => void
  freq: number
  onFreqChange: (freq: number) => void
}

const PRESETS = [25, 35, 50, 65, 75, 100]

/**
 * Палитра действий + частота для покраски.
 * Горячие клавиши 1..9 — выбор действия.
 */
export function ActionPalette({ actions, active, onChange, freq, onFreqChange }: ActionPaletteProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement) return
      const n = Number(e.key)
      if (n >= 1 && n <= actions.length) onChange(actions[n - 1])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [actions, onChange])

  return (
    <div className="palette">
      <div className="palette__actions">
        {actions.map((id, i) => {
          const def = ACTION_DEFS[id]
          return (
            <button
              key={id}
              className={`palette__btn ${id === active ? 'palette__btn--active' : ''}`}
              onClick={() => onChange(id)}
              title={`Hotkey: ${i + 1}`}
            >
              <span className="palette__swatch" style={{ background: def.color }} />
              {def.label}
              <span className="palette__key">{i + 1}</span>
            </button>
          )
        })}
      </div>

      <div className="palette__freq">
        <span className="palette__freq-label">Frequency: {freq}%</span>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={freq}
          onChange={(e) => onFreqChange(Number(e.target.value))}
        />
        <div className="palette__presets">
          {PRESETS.map((p) => (
            <button
              key={p}
              className={`chip ${p === freq ? 'chip--active' : ''}`}
              onClick={() => onFreqChange(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
