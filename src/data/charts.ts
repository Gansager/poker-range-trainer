/**
 * Эталонные чарты (картинки FunFarm) по id категории.
 * Статическая карта вне персистируемых данных — картинки всегда из кода,
 * не зависят от сохранённого в localStorage состояния.
 * Файлы лежат в public/charts/.
 */
export const CATEGORY_CHARTS: Record<string, string> = {
  open: 'open.png',
  vpip_vs_1r: 'vpip_vs_1r.png',
  bb_def: 'bb_def.png',
  bvb: 'bvb.png',
  iso_vs_fish: 'iso_vs_fish.png',
}

/** Полный путь к картинке чарта (учитывает base на GitHub Pages). */
export function chartUrl(categoryId: string): string | null {
  const file = CATEGORY_CHARTS[categoryId]
  return file ? `${import.meta.env.BASE_URL}charts/${file}` : null
}
