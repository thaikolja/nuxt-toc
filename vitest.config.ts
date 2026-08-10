import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['test/**/*.{test,spec}.ts'],
    // Unit tests run in node; e2e uses @nuxt/test-utils environment per file.
    environment: 'node',
    testTimeout: 60_000,
    hookTimeout: 120_000,
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/runtime/server/**'],
      reporter: ['text', 'html'],
    },
  },
})
