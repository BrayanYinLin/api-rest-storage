import { describe, test, expect } from 'vitest'
import { parseCookie } from '../utils/cookie_parser'

describe('Record Operations', () => {
  const user = {
    email: 'byinlinm@gmail.com',
    password: '12345678'
  }

  test('Add new record', async () => {
    const log = await fetch('http://localhost:3000/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(user)
    })

    expect(log.ok).toBe(true)
    const newUser = await log.json()
    const cookie = parseCookie(log)

    const record = {
      productId: 1,
      userId: newUser.id,
      recordTypeId: 1,
      recordQuantity: 100,
      recordDate: '2024-08-26'
    }

    const addRecord = await fetch('http://localhost:3000/api/record', {
      method: 'POST',
      headers: {
        Cookie: cookie,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(record)
    })

    const parsedNewRecord = await addRecord.json()
    expect(parsedNewRecord).not.toHaveProperty('msg')
  })
})
