import { describe, test, expect } from 'vitest'

describe('Users tests', () => {
  test('should sign up a user', async () => {
    const response = await fetch('http://localhost:3000/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@gmail.com',
        password: 'Password12345678'
      })
    })

    console.log(response.status)
    const parsed = await response.json()
    console.log(parsed)
    expect(response.ok).toBeTruthy()
    expect(parsed).not.toHaveProperty('msg')
  })
})
