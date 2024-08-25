import { expect, test, describe } from 'vitest'
import { checkFullProduct } from '../schemas/products'

describe('Product schema', () => {
  test('Product schema works', () => {
    const productTest = {
      name: 'Air freshener',
      stock: 200,
      volume: 2
    }

    expect(checkFullProduct(productTest).error).not.toBeTruthy()
  })

  test('Product name is a number', () => {
    const productTest = {
      name: 2,
      stock: 200,
      volume: 2
    }

    const checked = checkFullProduct(productTest)
    expect(checked.error.issues[0]).toHaveProperty('message')
  })
})
