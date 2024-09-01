import { describe, test, expect } from 'vitest'
import { formatFields } from '../utils/format_field.js'

describe('Utils works', () => {
  test('Formatter fields works', () => {
    const objectTest = {
      id: 1,
      name: 'Hola'
    }

    expect(formatFields(objectTest)).toBe('id = ?, name = ?')
  })
})
