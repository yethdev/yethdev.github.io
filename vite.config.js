import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync } from 'fs'

const spaRoutes = ['about', 'projects', 'donate']

function ghPagesSpa() {
  return {
    name: 'gh-pages-spa',
    closeBundle() {
      const index = resolve('dist', 'index.html')
      for (const route of spaRoutes) {
        const dir = resolve('dist', route)
        mkdirSync(dir, { recursive: true })
        copyFileSync(index, resolve(dir, 'index.html'))
      }
    }
  }
}

export default defineConfig({
  plugins: [react(), ghPagesSpa()],
})
