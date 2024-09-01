import zod from 'zod'

const recordId = zod
  .number({
    invalid_type_error: 'Product id must be a number',
    required_error: 'Product id is required'
  })
  .int()
  .positive()

const recordSchema = zod.object({
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

export function checkRecord(record) {
  return recordSchema.safeParse(record)
}

export function checkUpdateRecord(record) {
  return recordSchema
    .required({
      user_id: true
    })
    .safeParse(record)
}

export function checkRecordId(id) {
  return recordId.safeParse(id)
}
