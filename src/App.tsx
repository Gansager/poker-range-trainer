import { useEffect, useMemo, useState } from 'react'
import type { ActionId, Frequency, Matrix as MatrixData } from './domain/types'
import { grade, type GradeMode, type GradeResult } from './domain/grading'
import { setCellAction, removeAction, hasAction } from './domain/frequency'
import { useRangesStore } from './store/useRangesStore'
import { Tabs } from './components/Tabs'
import { SpotSelector } from './components/SpotSelector'
import { Matrix } from './components/Matrix'
import { ActionPalette } from './components/ActionPalette'
import { CheckBar } from './components/CheckBar'
import { ResultSummary } from './components/ResultSummary'
import { EditorPanel } from './components/EditorPanel'
import { ChartReference } from './components/ChartReference'
import { RangeStats } from './components/RangeStats'

type Mode = 'train' | 'edit'

function hasReferenceData(matrix: MatrixData): boolean {
  return Object.values(matrix).some(hasAction)
}

export default function App() {
  const data = useRangesStore((s) => s.data)
  const updateCell = useRangesStore((s) => s.updateCell)
  const categories = data.categories

  const [categoryId, setCategoryId] = useState(categories[0].id)
  const [spotId, setSpotId] = useState(categories[0].spots[0].id)
  const [mode, setMode] = useState<Mode>('train')

  // Тренировка
  const [answer, setAnswer] = useState<MatrixData>({})
  const [activeAction, setActiveAction] = useState<ActionId>('open')
  const [paintFreq, setPaintFreq] = useState(100)
  const [result, setResult] = useState<GradeResult | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [gradeMode, setGradeMode] = useState<GradeMode>('A')
  const [tolerance, setTolerance] = useState(10)

  const category = useMemo(
    () => categories.find((c) => c.id === categoryId) ?? categories[0],
    [categories, categoryId],
  )
  const spot = useMemo(
    () => category.spots.find((s) => s.id === spotId) ?? category.spots[0],
    [category, spotId],
  )
  const hasReference = useMemo(() => hasReferenceData(spot.matrix), [spot])

  const firstAction = useMemo<ActionId>(
    () => category.actions.find((a) => a !== 'fold') ?? category.actions[0],
    [category],
  )

  // Сброс тренировки при смене спота/категории/режима.
  useEffect(() => {
    setAnswer({})
    setResult(null)
    setShowAnswer(false)
    setActiveAction(firstAction)
  }, [categoryId, spotId, mode, firstAction])

  function selectCategory(id: string) {
    setCategoryId(id)
    const next = categories.find((c) => c.id === id)!
    setSpotId(next.spots[0]?.id ?? '')
  }

  // Целевая матрица для покраски: эталон (редактор) или ответ (тренировка).
  const sourceMatrix = mode === 'edit' ? spot.matrix : answer

  function writeTraining(handId: string, freq: Frequency) {
    setResult(null)
    setAnswer((prev) => {
      const m = { ...prev }
      if (Object.keys(freq).length === 0) delete m[handId]
      else m[handId] = freq
      return m
    })
  }

  function handlePaint(handId: string, action: ActionId, weight: number) {
    const cur = sourceMatrix[handId] ?? {}
    const next = setCellAction(cur, action, weight)
    if (mode === 'edit') updateCell(categoryId, spot.id, handId, next)
    else writeTraining(handId, next)
  }

  function handleErase(handId: string, action: ActionId) {
    const cur = sourceMatrix[handId] ?? {}
    const next = removeAction(cur, action)
    if (mode === 'edit') updateCell(categoryId, spot.id, handId, next)
    else writeTraining(handId, next)
  }

  function check() {
    setShowAnswer(false)
    setResult(grade(answer, spot.matrix, gradeMode, tolerance))
  }

  function reset() {
    setAnswer({})
    setResult(null)
    setShowAnswer(false)
  }

  function onSpotsChanged(nextSpotId: string | null) {
    const cat = useRangesStore.getState().data.categories.find((c) => c.id === categoryId)!
    setSpotId(nextSpotId ?? cat.spots[0]?.id ?? '')
  }

  const displayedMatrix = mode === 'edit' ? spot.matrix : showAnswer ? spot.matrix : answer
  const readOnly = mode === 'train' && showAnswer

  return (
    <div className="app">
      <header className="app__header">
        <h1>Poker Range Trainer</h1>
        <span className="app__save" title="Все правки автоматически сохраняются в этом браузере (localStorage)">
          💾 Автосохранение
        </span>
        <div className="modes">
          <button
            className={`mode ${mode === 'train' ? 'mode--active' : ''}`}
            onClick={() => setMode('train')}
          >
            Тренировка
          </button>
          <button
            className={`mode ${mode === 'edit' ? 'mode--active' : ''}`}
            onClick={() => setMode('edit')}
          >
            Редактор
          </button>
        </div>
      </header>

      <Tabs categories={categories} activeId={category.id} onSelect={selectCategory} />
      <SpotSelector spots={category.spots} activeId={spot.id} onSelect={setSpotId} />

      <main className="app__main">
        <h2 className="spot-title">
          {category.name} — {spot.name}
          {mode === 'edit' && <span className="spot-title__badge">редактирование</span>}
          {mode === 'train' && showAnswer && <span className="spot-title__badge">эталон</span>}
          <ChartReference categoryId={category.id} categoryName={category.name} />
        </h2>

        <ActionPalette
          actions={category.actions}
          active={activeAction}
          onChange={setActiveAction}
          freq={paintFreq}
          onFreqChange={setPaintFreq}
        />

        <Matrix
          matrix={displayedMatrix}
          activeAction={activeAction}
          paintFreq={paintFreq}
          result={mode === 'train' && !showAnswer ? result : null}
          readOnly={readOnly}
          onPaint={handlePaint}
          onErase={handleErase}
        />

        <RangeStats matrix={displayedMatrix} />

        {mode === 'train' ? (
          <>
            <div className="grademode">
              <span>Режим:</span>
              <button
                className={`chip ${gradeMode === 'A' ? 'chip--active' : ''}`}
                onClick={() => setGradeMode('A')}
              >
                Действие
              </button>
              <button
                className={`chip ${gradeMode === 'B' ? 'chip--active' : ''}`}
                onClick={() => setGradeMode('B')}
              >
                Частоты
              </button>
              {gradeMode === 'B' && (
                <label className="grademode__tol">
                  допуск ±{tolerance}%
                  <input
                    type="range"
                    min={0}
                    max={30}
                    step={5}
                    value={tolerance}
                    onChange={(e) => setTolerance(Number(e.target.value))}
                  />
                </label>
              )}
            </div>

            <CheckBar
              checked={result !== null}
              showAnswer={showAnswer}
              hasReference={hasReference}
              onCheck={check}
              onReset={reset}
              onToggleAnswer={() => setShowAnswer((v) => !v)}
            />

            {result && !showAnswer && <ResultSummary result={result} />}

            {spot.notes && <p className="spot-notes">{spot.notes}</p>}
          </>
        ) : (
          <EditorPanel categoryId={category.id} spot={spot} onSpotsChanged={onSpotsChanged} />
        )}
      </main>
    </div>
  )
}
