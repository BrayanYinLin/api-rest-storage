import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { parseCookie } from '../utils/cookie_parser.js'
import { CREDENTIALS } from './credentials.js'

describe('Product Tests', async () => {
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

  test('should create a new product', async () => {
    const response = await fetch('http://localhost:3000/api/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Cookie: `${tokens.access_token}; ${tokens.refresh_token}`
      },
      body: JSON.stringify({
        name: 'Cera Amarilla',
        stock: 500,
        unitId: 1
      })
    })

    const parsedProduct = await response.json()
    expect(response.ok).toBeFalsy()
    expect(parsedProduct).toHaveProperty('msg')
  })

  test.skip('should update a product', async () => {
    const response = await fetch('http://localhost:3000/api/product/23', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Cookie: `${tokens.access_token}; ${tokens.refresh_token}`
      },
      body: JSON.stringify({
        name: 'Cera Amarilla',
        stock: 50,
        unitId: 1
      })
    })

    expect(response.ok).toBeTruthy()
  })

  test('should return a product by name', async () => {
    const response = await fetch(
      'http://localhost:3000/api/product/Cera Amarilla',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Cookie: `${tokens.access_token}; ${tokens.refresh_token}`
        }
      }
    )

    expect(response.ok).toBeTruthy()
    const parsed = await response.json()
    expect(parsed).not.toHaveProperty('msg')
  })
})
