import zod from 'zod'

const UserSignUp = zod.object({
  name: zod.string({
    invalid_type_error: 'Name must a string',
    required_error: 'Name is required'
  }),
  email: zod
    .string({
      required_error: 'Email is required'
    })
    .email(),
  password: zod
    .string({
      invalid_type_error: 'Password must be a string',
      required_error: 'Password is required'
    })
    .min(8)
})

const UserSignIn = zod.object({
  email: zod
    .string({
      required_error: 'Email is required'
    })
    .email(),
  password: zod
    .string({
      invalid_type_error: 'Password must be a string',
      required_error: 'Password is required'
    })
    .min(8)
})

export function checkSignUpUser({ name, email, password }) {
  return UserSignUp.safeParse({ name, email, password })
}

export function checkSignInUser({ email, password }) {
  return UserSignIn.safeParse({ email, password })
}
