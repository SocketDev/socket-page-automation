import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      include: ['src/**/*.mts'],
      provider: 'v8',
    },
    environment: 'node',
    include: ['test/**/*.test.mts'],
  },
})
