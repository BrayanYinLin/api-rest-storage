import { expect, test, describe } from 'vitest'

describe('Login process', () => {
  test('login', async () => {
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

    expect(response.ok).toBeTruthy()
  })
})
