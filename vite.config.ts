import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    sourcemap: true,
    chunkSizeWarningLimit: 1200
  },
  server: {
    port: 5173,
    strictPort: false
  }
});
