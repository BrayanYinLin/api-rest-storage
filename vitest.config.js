import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'Api rest testing',
    root: './testing',
    environment: 'node'
  }
})
