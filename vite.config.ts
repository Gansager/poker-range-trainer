import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Относительный base — корректные пути к ассетам на GitHub Pages (подпуть /poker-range-trainer/).
  base: './',
  plugins: [react()],
})
