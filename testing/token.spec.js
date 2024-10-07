import { describe, beforeAll, test, expect } from 'vitest'
import { parseCookie } from '../utils/cookie_parser.js'
import 'dotenv/config'

describe('Tokens Tests', () => {
  const user = {
    data: null,
    token: null,
    refresh: null
  }

  beforeAll(async () => {
    const signin = await fetch('http://localhost:3000/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        email: 'test@gmail.com',
        password: '12345678'
      })
    })

    const jsonSignin = await signin.json()

    user.data = jsonSignin
    user.token = parseCookie({
      cookiesSet: signin.headers.getSetCookie(),
      tokenName: 'access_token'
    })
    user.refresh = parseCookie({
      cookiesSet: signin.headers.getSetCookie(),
      tokenName: 'refresh_token'
    })
  })

  // test('should throws an error', async () => {
  //   await new Promise((resolve) => setTimeout(resolve, 11000))
  //   const getProduct = await fetch('http://localhost:3000/api/product', {
  //     headers: {
  //       Cookie: user.token
  //     }
  //   })

  //   expect(getProduct.ok).not.toBeTruthy()
  // }, 15000)

  test('should refresh the token', async () => {
    await new Promise((resolve) => setTimeout(resolve, 11000))
    const getProduct = await fetch('http://localhost:3000/api/product', {
      headers: {
        Cookie: `${user.token}; ${user.refresh}`
      }
    })

    expect(getProduct.ok).not.toBeTruthy()

    const refreshSignIn = await fetch(
      'http://localhost:3000/api/user/refresh',
      {
        method: 'POST',
        headers: {
          Cookie: `${user.token}; ${user.refresh}`
        }
      }
    )

    console.log(
      refreshSignIn.ok,
      '<-- Aqui checo si la peticion refresh fue bien'
    )
    console.log(refreshSignIn.headers.get('set-cookie'))
    user.token = parseCookie({
      cookiesSet: refreshSignIn.headers.getSetCookie(),
      tokenName: 'access_token'
    })

    const newProductRes = await fetch('http://localhost:3000/api/product', {
      method: 'GET',
      headers: {
        Cookie: `${user.token}; ${user.refresh}`
      }
    })

    const parsedProduct = await newProductRes.json()
    expect(parsedProduct).not.toHaveProperty('msg')
    expect(parsedProduct).toBeTypeOf('object')
  }, 15000)
})
