interface CheckBarProps {
  checked: boolean
  showAnswer: boolean
  hasReference: boolean
  onCheck: () => void
  onReset: () => void
  onToggleAnswer: () => void
}

/** Панель действий тренировки. */
export function CheckBar({
  checked,
  showAnswer,
  hasReference,
  onCheck,
  onReset,
  onToggleAnswer,
}: CheckBarProps) {
  return (
    <div className="checkbar">
      <button className="btn btn--primary" onClick={onCheck} disabled={!hasReference}>
        Check
      </button>
      <button className="btn" onClick={onReset}>
        Reset
      </button>
      <button className="btn" onClick={onToggleAnswer} disabled={!hasReference}>
        {showAnswer ? 'Hide answer' : 'Show answer'}
      </button>
      {!hasReference && (
        <span className="checkbar__hint">No reference for this spot yet</span>
      )}
      {checked && !showAnswer && (
        <span className="checkbar__hint">Checked — see highlighted mistakes</span>
      )}
    </div>
  )
}
