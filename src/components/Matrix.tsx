import { useCallback, useEffect, useRef } from 'react'
import { ALL_HANDS } from '../domain/hands'
import type { ActionId, Matrix as MatrixData } from '../domain/types'
import type { GradeResult } from '../domain/grading'
import { Cell } from './Cell'

interface MatrixProps {
  matrix: MatrixData
  activeAction: ActionId
  paintFreq: number
  result: GradeResult | null
  readOnly?: boolean
  onPaint: (handId: string, action: ActionId, weight: number) => void
  onErase: (handId: string, action: ActionId) => void
}

/**
 * Сетка 13×13 с раскраской указателем (мышь + тач).
 * Используем pointer events + elementFromPoint, чтобы drag работал и пальцем.
 */
export function Matrix({
  matrix,
  activeAction,
  paintFreq,
  result,
  readOnly,
  onPaint,
  onErase,
}: MatrixProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const mode = useRef<'paint' | 'erase' | null>(null)
  const lastHand = useRef<string | null>(null)

  useEffect(() => {
    const stop = () => {
      mode.current = null
      lastHand.current = null
    }
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
    return () => {
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }
  }, [])

  const apply = useCallback(
    (handId: string, m: 'paint' | 'erase') => {
      if (m === 'paint') onPaint(handId, activeAction, paintFreq)
      else onErase(handId, activeAction)
    },
    [activeAction, paintFreq, onPaint, onErase],
  )

  function handFromEvent(e: React.PointerEvent): string | null {
    const el = document.elementFromPoint(e.clientX, e.clientY)
    const cell = el?.closest('.cell') as HTMLElement | null
    return cell?.dataset.hand ?? null
  }

  function handleDown(e: React.PointerEvent) {
    if (readOnly) return
    const handId = handFromEvent(e)
    if (!handId) return
    e.preventDefault()
    try {
      gridRef.current?.setPointerCapture?.(e.pointerId)
    } catch {
      /* синтетические/неактивные указатели — игнорируем */
    }
    const current = matrix[handId]?.[activeAction] ?? 0
    const m: 'paint' | 'erase' = current === paintFreq && current > 0 ? 'erase' : 'paint'
    mode.current = m
    lastHand.current = handId
    apply(handId, m)
  }

  function handleMove(e: React.PointerEvent) {
    if (!mode.current) return
    const handId = handFromEvent(e)
    if (!handId || handId === lastHand.current) return
    lastHand.current = handId
    apply(handId, mode.current)
  }

  return (
    <div
      ref={gridRef}
      className="matrix"
      onPointerDown={handleDown}
      onPointerMove={handleMove}
    >
      {ALL_HANDS.map((hand) => (
        <Cell
          key={hand.id}
          handId={hand.id}
          type={hand.type}
          freq={matrix[hand.id] ?? {}}
          status={result?.byHand[hand.id]}
        />
      ))}
    </div>
  )
}
