import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    sourcemap: true,
    chunkSizeWarningLimit: 1200
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: false
  }
});
