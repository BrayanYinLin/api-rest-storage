import { describe, test, expect } from 'vitest'
import { formatFields } from '../utils/format_field.js'

describe('Utils Tests', () => {
  test('should format fields for update process', () => {
    const objectTest = {
      id: 1,
      name: 'Hola'
    }

    expect(formatFields(objectTest)).toBe('id = ?, name = ?')
  })
})
