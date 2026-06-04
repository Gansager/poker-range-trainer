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
        <span className="summary__acc">Точность: {accuracy}%</span>
        <span className="stat stat--correct">✅ верно {counts.correct}</span>
        <span className="stat stat--wrong">❌ не то {counts.wrong}</span>
        <span className="stat stat--missed">⚠️ пропущено {counts.missed}</span>
        <span className="stat stat--extra">➕ лишнее {counts.extra}</span>
      </div>
      {mistakes.length > 0 && (
        <div className="summary__mistakes">
          Ошибки: {mistakes.join(', ')}
        </div>
      )}
    </div>
  )
}
