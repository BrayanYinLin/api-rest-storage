import zod from 'zod'

const recordSchema = zod.object({
  productId: zod
    .number({
      invalid_type_error: 'Product id must be a number',
      required_error: 'Product id is required'
    })
    .int()
    .positive(),
  userId: zod
    .number({
      invalid_type_error: 'User id must be a number',
      required_error: 'User id is required'
    })
    .int()
    .positive(),
  recordTypeId: zod
    .number({
      invalid_type_error: 'Record type id must be a number',
      required_error: 'Record type id is required'
    })
    .int()
    .positive(),
  recordQuantity: zod
    .number({
      invalid_type_error: 'Quantity must be a number',
      required_error: 'Quantity is required'
    })
    .positive(),
  recordDate: zod
    .string({
      invalid_type_error: 'Date must be a string',
      required_error: 'Date is required'
    })
    .date()
})

export function checkRecord(record) {
  return recordSchema.safeParse(record)
}
