import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  worker: {
    format: 'es'
  },
  build: {
    target: 'es2022',
    sourcemap: true,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three'],
          'three-addons': [
            'three/examples/jsm/controls/OrbitControls.js',
            'three/examples/jsm/loaders/GLTFLoader.js',
            'three/examples/jsm/loaders/OBJLoader.js',
            'three/examples/jsm/loaders/FBXLoader.js',
            'three/examples/jsm/loaders/STLLoader.js',
            'three/examples/jsm/exporters/GLTFExporter.js',
            'three/examples/jsm/utils/SkeletonUtils.js'
          ]
        }
      }
    }
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
