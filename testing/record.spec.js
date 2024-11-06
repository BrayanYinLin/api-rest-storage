import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { parseCookie } from '../utils/cookie_parser'
import { database } from '../models/local'

describe('Record Operations', async () => {
  const tokens = {
    access_token: null,
    refresh_token: null
  }

  let userId

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
      const user = await response.json()
      console.log(user)
      userId = user.id

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
    await database.close()
  })
  test('should add new record', async () => {
    const record = {
      productId: 1,
      userId: userId,
      recordQuantity: 10,
      recordDate: '2024-08-26'
    }

    console.log(tokens.access_token, tokens.refresh_token)
    const addRecord = await fetch('http://localhost:3000/api/record/outcome', {
      method: 'POST',
      headers: {
        Cookie: tokens.access_token,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(record)
    })

    console.log(addRecord.ok)

    const parsedNewRecord = await addRecord.json()
    console.log(parsedNewRecord)
    expect(parsedNewRecord).not.toHaveProperty('msg')
  }, 20000)

  test.skip('should return all records', async () => {
    const responseRecords = await fetch(
      'http://localhost:3000/api/record/all',
      {
        method: 'GET',
        headers: {
          Cookie: `${tokens.access_token}; ${tokens.refresh_token}`
        }
      }
    )
    expect(responseRecords.ok).toBeTruthy()
  })

  // test.skip('should return deleted records', async () => {
  //   try {
  //     const responseRecords = await fetch(
  //       'http://localhost:3000/api/record/10',
  //       {
  //         method: 'DELETE',
  //         headers: {
  //           Cookie: tokens.access_token
  //         }
  //       }
  //     )

  //     expect(responseRecords.ok).toBeTruthy()
  //   } catch (e) {
  //     console.error(e.message)
  //   }
  // })
})
