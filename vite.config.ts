import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Конфигурация Vite для DNS Check
 * 
 * Для продакшена:
 * - Включена минификация (esbuild)
 * - Включено tree-shaking
 * - Включено сжатие gzip/brotli
 * 
 * Для деплоя выполните:
 * npm run build
 * 
 * Результат будет в папке dist/
 */
export default defineConfig({
  plugins: [react()],
  build: {
    // Включаем минификацию (esbuild быстрее terser)
    minify: 'esbuild',
    // Не генерируем sourcemaps для продакшена
    sourcemap: false,
    // Размер чанка для code splitting
    chunkSizeWarningLimit: 500,
    // Опции rollup
    rollupOptions: {
      output: {
        // Разделяем vendor и app код
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          state: ['zustand'],
        },
      },
    },
  },
})
