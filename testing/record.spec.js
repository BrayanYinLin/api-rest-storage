import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { parseCookie } from '../utils/cookie_parser'
import { database } from '../models/local'

describe('Record Operations', async () => {
  const tokens = {
    access_token: null,
    refresh_token: null
  }

  let userId

  beforeAll(async () => {
    try {
      const response = await fetch('http://localhost:3000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          email: 'test@gmail.com',
          password: '12345678'
        })
      })
      const user = await response.json()
      userId = user.id

      tokens.access_token = parseCookie({
        cookiesSet: response.headers.getSetCookie(),
        tokenName: 'access_token'
      })

      tokens.refresh_token = parseCookie({
        cookiesSet: response.headers.getSetCookie(),
        tokenName: 'refresh_token'
      })
    } catch (e) {
      console.error(e.message)
    }
  })

  afterAll(async () => {
    await database.close()
  })

  test('should returno 5 products most consumed', async () => {
    const mostConsumed = await fetch(
      'http://localhost:3000/api/record/outcome/mostconsumed',
      {
        headers: {
          Cookie: `${tokens.access_token}; ${tokens.refresh_token}`
        }
      }
    )

    const parsedNewRecord = await mostConsumed.json()
    expect(parsedNewRecord).not.toHaveProperty('msg')
  })

  test.skip('should add new record', async () => {
    const record = {
      productId: 1,
      userId: userId,
      recordQuantity: 10,
      recordDate: '2024-08-26'
    }
    const response = await fetch('http://localhost:3000/api/record/outcome', {
      method: 'POST',
      headers: {
        Cookie: `${tokens.access_token}; ${tokens.refresh_token}`,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(record)
    })

    expect(response.ok).toBeTruthy()

    const newRecord = await response.json()
    console.log(newRecord)

    expect(newRecord).not.toHaveProperty('msg')
  })

  test.skip('should return all records', async () => {
    const responseRecords = await fetch(
      'http://localhost:3000/api/record/all',
      {
        method: 'GET',
        headers: {
          Cookie: `${tokens.access_token}; ${tokens.refresh_token}`
        }
      }
    )
    expect(responseRecords.ok).toBeTruthy()
  })

  test.skip('should return deleted records', async () => {
    try {
      const responseRecords = await fetch(
        'http://localhost:3000/api/record/10',
        {
          method: 'DELETE',
          headers: {
            Cookie: `${tokens.access_token}; ${tokens.refresh_token}`
          }
        }
      )

      expect(responseRecords.ok).toBeTruthy()
    } catch (e) {
      console.error(e.message)
    }
  })
})
