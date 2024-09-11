import { expect, test, describe } from 'vitest'
import { checkUpdateRecord } from '../schemas/records'

describe('Schemas Tests', () => {
  //  Record schemas
  test('should not return an error for record update', () => {
    const record = {
      user_id: 2,
      record_id: 1,
      record_quantity: 100
    }

    const checkRecord = checkUpdateRecord({ record })
    expect(checkRecord.error).not.toBeTruthy()
  })

  test('should return an error for record update', () => {
    const record = {
      user_id: 2
    }

    const checkRecord = checkUpdateRecord({ record })
    expect(checkRecord.error).toBeTruthy()
  })
})
