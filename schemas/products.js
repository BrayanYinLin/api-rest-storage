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
  name: zod.string({
    invalid_type_error: 'Product name must be string',
    required_error: 'Product name is required'
  }),
  stock: zod
    .number({
      invalid_type_error: 'Stock must be a number',
      required_error: 'Stock is required'
    })
    .int({
      message: 'Stock must be a integer'
    }),
  volume: volumeId
})

export const checkFullProduct = (product) => {
  return productSchema.safeParse(product)
}
