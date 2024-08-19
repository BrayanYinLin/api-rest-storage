import zod from 'zod'

const userNameSchema = zod.string()

const userSchema = zod.object({
  email: zod.string().email(),
  password: zod
    .string({
      invalid_type_error: 'Password must be a string',
      required_error: 'Password is required'
    })
    .length(8)
})

const fullUserSchema = zod.object({
  ...userSchema,
  name: userNameSchema
})

export function checkFullUser(user) {
  return fullUserSchema.safeParse(user)
}

export function checkUser(fields) {
  return userSchema.safeParse(fields)
}
