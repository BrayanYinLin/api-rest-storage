import zod from 'zod'

const volumeId = zod
  .number({
    invalid_type_error: 'Volume id must be a number',
    required_error: 'Volume is required'
  })
  .int({
    message: 'Volume id must be a integer'
  })

const productSchema = zod.object({
  product_name: zod.string({
    invalid_type_error: 'Product name must be string',
    required_error: 'Product name is required'
  }),
  product_stock: zod
    .number({
      invalid_type_error: 'Stock must be a number',
      required_error: 'Stock is required'
    })
    .int({
      message: 'Stock must be a integer'
    }),
  volume_id: volumeId
})

const product_id = zod.number().int().positive()

export const checkProductId = (id) => {
  return product_id.safeParse(id)
}

export const checkProduct = (product) => {
  return productSchema.safeParse(product)
}

export const checkUpdateProduct = (product) => {
  return productSchema.partial().safeParse(product)
}
