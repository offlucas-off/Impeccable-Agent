import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./tests/vitest.setup.ts'],
    testTimeout: 45000,
    hookTimeout: 45000,
    fileParallelism: false,
  },
});
