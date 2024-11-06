import zod from 'zod'

const recordId = zod
  .number({
    invalid_type_error: 'Record id must be a number',
    required_error: 'Record id is required'
  })
  .int()
  .positive()

const recordSchema = zod.object({
  recordId: recordId,
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
  return recordSchema
    .partial({
      recordId: true,
      recordTypeId: true
    })
    .required({
      record_date: true
    })
    .safeParse(record)
}

export function checkUpdateRecord({ record }) {
  return recordSchema
    .partial({
      recordDate: true,
      recordQuantity: true,
      recordTypeId: true,
      productId: true
    })
    .safeParse(record)
}

export function checkDeleteId({ id }) {
  return recordId.safeParse(id)
}
