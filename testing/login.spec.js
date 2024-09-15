import { expect, test, describe } from 'vitest'
import { parseCookie } from '../utils/cookie_parser.js'

describe('Sign in process', () => {
  let logResponse

  test('should return user info', async () => {
    logResponse = await fetch('http://localhost:3000/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        email: 'byinlinm@gmail.com',
        password: '12345678'
      })
    })

    expect(logResponse.ok).toBeTruthy()
  })

  test('should return a successfull logout message', async () => {
    const logout = await fetch('http://localhost:3000/api/user/logout', {
      method: 'POST',
      headers: {
        Cookie: parseCookie(logResponse)
      }
    })
    const parsedResponse = await logout.json()

    expect(parsedResponse.msg).toBe('Logout successfull')
  })
})
