import { describe, test, expect, beforeAll } from 'vitest'
import { parseCookie } from '../utils/cookie_parser.js'

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

      console.log(tokens.access_token, tokens.refresh_token)
    } catch (e) {
      console.error(e.message)
    }
  })

  test('should create a new product', async () => {
    const newProductRes = await fetch('http://localhost:3000/api/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Cookie: `${tokens.access_token}; ${tokens.refresh_token}`
      },
      body: JSON.stringify({
        name: 'Bolsas 20*30',
        stock: 500,
        volume: 2
      })
    })

    const parsedProduct = await newProductRes.json()
    expect(parsedProduct).not.toHaveProperty('msg')
  })
})
