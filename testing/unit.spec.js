import { describe, expect, test, beforeAll, afterAll } from 'vitest'
import { parseCookie } from '../utils/cookie_parser.js'

describe('Unit tests', async () => {
  const tokens = {
    access_token: null,
    refresh_token: null
  }

  beforeAll(async () => {
    try {
      const response = await fetch('http://localhost:3000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          email: 'test@gmail.com',
          password: 'Password12345678'
        })
      })

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
    await fetch('http://localhost:3000/api/user/logout', {
      method: 'POST',
      headers: {
        Cookie: `${tokens.access_token}; ${tokens.refresh_token}`
      }
    })
  })

  test('should return all units', async () => {
    const response = await fetch('http://localhost:3000/api/unit/all', {
      method: 'GET',
      credentials: 'include',
      headers: {
        Cookie: `${tokens.access_token}; ${tokens.refresh_token}`
      }
    })

    const parsed = await response.json()
    console.log(parsed)
    expect(response.ok).toBeTruthy()
    expect(parsed).not.toHaveProperty('msg')
  })
})
