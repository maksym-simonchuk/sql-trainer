import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,wasm,data,woff,woff2}'],
        maximumFileSizeToCacheInBytes: 20 * 1024 * 1024,
      },
      manifest: {
        name: 'SQL Trainer',
        short_name: 'SQL Trainer',
        description: 'Інтерактивне навчання Oracle SQL',
        lang: 'uk',
        theme_color: '#0b1220',
        background_color: '#0b1220',
        display: 'standalone',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
    }),
  ],
  optimizeDeps: { exclude: ['@electric-sql/pglite'] },
})
