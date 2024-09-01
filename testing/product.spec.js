import { describe, test, expect } from 'vitest'
import { parseCookie } from '../utils/cookie_parser.js'

describe('Product Operations', async () => {
  const response = await fetch('http://localhost:3000/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({
      email: 'byinlinm@gmail.com',
      password: '12345678'
    })
  })

  test('Update product', async () => {
    expect(response.ok).toBeTruthy()

    const updateRequest = await fetch('http://localhost:3000/api/product/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Cookie: parseCookie(response)
      },
      body: JSON.stringify({
        product_name: 'Ayudin',
        product_stock: 1000
      })
    })

    const parsedResponse = await updateRequest.json()
    expect(parsedResponse).not.toHaveProperty('msg')
  })
})
