import { describe, test, expect } from 'vitest'
import { parseCookie } from '../utils/cookie_parser'

describe('Record Operations', async () => {
  const login = await fetch('http://localhost:3000/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({
      email: 'byinlinm@gmail.com',
      password: '12345678'
    })
  })

  test('should add new record', async () => {
    expect(login.ok).toBeTruthy()
    const newUser = await login.json()
    const cookie = parseCookie(login)

    const record = {
      product_id: 1,
      user_id: newUser.id,
      record_type_id: 1,
      record_quantity: 100,
      record_date: '2024-08-26'
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

  test('should return all records', async () => {
    expect(login.ok).toBeTruthy()
    const cookie = parseCookie(login)
    const responseRecords = await fetch(
      'http://localhost:3000/api/record/all',
      {
        method: 'GET',
        headers: {
          Cookie: cookie
        }
      }
    )
    expect(responseRecords.ok).toBe(true)
  })
})
