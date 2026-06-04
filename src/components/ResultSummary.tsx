import type { GradeResult } from '../domain/grading'

interface ResultSummaryProps {
  result: GradeResult
}

/** Сводка после Check: точность и разбивка ошибок. */
export function ResultSummary({ result }: ResultSummaryProps) {
  const { counts, accuracy, mistakes } = result
  return (
    <div className="summary">
      <div className="summary__stats">
        <span className="summary__acc">Accuracy: {accuracy}%</span>
        <span className="stat stat--correct">✅ correct {counts.correct}</span>
        <span className="stat stat--wrong">❌ wrong {counts.wrong}</span>
        <span className="stat stat--missed">⚠️ missed {counts.missed}</span>
        <span className="stat stat--extra">➕ extra {counts.extra}</span>
      </div>
      {mistakes.length > 0 && (
        <div className="summary__mistakes">
          Mistakes: {mistakes.join(', ')}
        </div>
      )}
    </div>
  )
}
