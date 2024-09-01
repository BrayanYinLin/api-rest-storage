import { expect, test, describe } from 'vitest'
import { checkUpdateProduct } from '../schemas/products.js'

describe('Product schema', () => {
  test('Product schema for update', () => {
    const productTest = {
      product_id: 2,
      product_name: 'Air freshener',
      product_stock: 200,
      volume_id: 2
    }

    expect(checkUpdateProduct(productTest).error).not.toBeTruthy()
  })
})
