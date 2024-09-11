import zod from 'zod'

const recordSchema = zod.object({
  record_id: zod
    .number({
      invalid_type_error: 'Product id must be a number',
      required_error: 'Product id is required'
    })
    .int()
    .positive(),
  product_id: zod
    .number({
      invalid_type_error: 'Product id must be a number',
      required_error: 'Product id is required'
    })
    .int()
    .positive(),
  user_id: zod
    .number({
      invalid_type_error: 'User id must be a number',
      required_error: 'User id is required'
    })
    .int()
    .positive(),
  record_type_id: zod
    .number({
      invalid_type_error: 'Record type id must be a number',
      required_error: 'Record type id is required'
    })
    .int()
    .positive(),
  record_quantity: zod
    .number({
      invalid_type_error: 'Quantity must be a number',
      required_error: 'Quantity is required'
    })
    .positive(),
  record_date: zod
    .string({
      invalid_type_error: 'Date must be a string',
      required_error: 'Date is required'
    })
    .date()
})

export function checkRecord({ record }) {
  return recordSchema
    .partial({
      record_id: true
    })
    .safeParse(record)
}

export function checkUpdateRecord({ record }) {
  return recordSchema
    .partial({
      record_date: true,
      record_quantity: true,
      record_type_id: true,
      product_id: true
    })
    .safeParse(record)
}
