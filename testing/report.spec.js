import { describe, test, beforeAll, expect, afterAll } from 'vitest'
import { parseCookie } from '../utils/cookie_parser.js'

describe('Report Tests', () => {
  const tokens = {
    access_token: null,
    refresh_token: null
  }

  beforeAll(async () => {
    const loginResponse = await fetch('http://localhost:3000/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        email: 'test@gmail.com',
        password: '12345678'
      })
    })

    tokens.access_token = parseCookie({
      cookiesSet: loginResponse.headers.getSetCookie(),
      tokenName: 'access_token'
    })

    tokens.refresh_token = parseCookie({
      cookiesSet: loginResponse.headers.getSetCookie(),
      tokenName: 'refresh_token'
    })
  })

  afterAll(async () => {
    await fetch('http://localhost:3000/api/user/logout', {
      method: 'POST',
      headers: {
        Cookie: `${tokens.access_token}; ${tokens.refresh_token}`
      }
    })
  })

  test('should return a report', async () => {
    const reportResponse = await fetch(
      'http://localhost:3000/api/report/expenses?month=10&year=2024',
      {
        headers: {
          Cookie: `${tokens.access_token}; ${tokens.refresh_token}`,
          Accept:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      }
    )

    const report = await reportResponse.arrayBuffer()

    expect(reportResponse.ok).toBe(true)
    expect(report).not.toHaveProperty('msg')
  })
})
