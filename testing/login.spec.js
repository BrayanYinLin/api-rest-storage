import { expect, test, describe } from 'vitest'
import { parseCookie } from '../utils/cookie_parser.js'

describe('Sign in process', () => {
  const tokens = {
    access_token: null,
    refresh_token: null
  }

  test('should return user info', async () => {
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

      tokens.access_token = parseCookie({
        cookiesSet: response.headers.getSetCookie(),
        tokenName: 'access_token'
      })

      tokens.refresh_token = parseCookie({
        cookiesSet: response.headers.getSetCookie(),
        tokenName: 'refresh_token'
      })

      expect(response.ok).toBeTruthy()
    } catch (e) {
      console.error(e.message)
    }
  })

  test.skip('should return a successfull logout message', async () => {
    const logout = await fetch('http://localhost:3000/api/user/logout', {
      method: 'POST',
      headers: {
        Cookie: `${tokens.access_token}; ${tokens.refresh_token}`
      }
    })
    const parsedResponse = await logout.json()

    expect(parsedResponse.msg).toBe('Logout successfull')
  })
})
