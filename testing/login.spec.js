import { expect, test, describe } from 'vitest'
import { parseCookie } from '../utils/cookie_parser.js'
import { CREDENTIALS } from './credentials.js'

describe('Sign in process', () => {
  const tokens = {
    access_token: null,
    refresh_token: null
  }

  test.skip('should create user info', async () => {
    const response = await fetch('http://localhost:3000/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        name: 'User Test',
        email: CREDENTIALS.EMAIL,
        password: CREDENTIALS.PASSWORD
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
  })

  test('should return user info', async () => {
    const response = await fetch('http://localhost:3000/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        email: CREDENTIALS.EMAIL,
        password: CREDENTIALS.PASSWORD
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
  })

  test('should return a successfull logout message', async () => {
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
