import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base: './' makes all asset paths relative, so the built dist/ folder
// can be served from any sub-path (GitHub Pages project site, file://, etc.)
// without a router — this is safe because the app uses no client-side routing.
export default defineConfig({
  plugins: [react()],
  base: './',
})
