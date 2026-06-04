import { useEffect, useRef } from 'react'

/**
 * Прокрутка горизонтальной полосы вертикальным колесом мыши (десктоп).
 * Возвращает ref для контейнера с overflow-x.
 */
export function useHorizontalWheel<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      // Горизонтальный тачпад-свайп оставляем как есть.
      if (e.deltaY === 0 || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      if (el.scrollWidth <= el.clientWidth) return
      e.preventDefault()
      el.scrollLeft += e.deltaY
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])
  return ref
}
