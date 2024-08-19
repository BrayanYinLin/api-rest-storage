import { Router } from 'express'
import { checkUser, checkFullUser } from '../schemas/users.js'
import { Storage } from '../models/database.js'

const userRoute = Router()

userRoute.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body

    const { data, error } = checkFullUser({ email, password, name })

    if (error) return res.status(422).json(error)

    const newUser = {
      email: data.email,
      password: data.password,
      name: data.name
    }

    const userCreated = await Storage.register(newUser)

    res.json(userCreated)
  } catch (err) {
    res.status(422).json({ msg: err.message })
  }
})

userRoute.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const { data, error } = checkUser({ email, password })

    if (error) return res.status(403).json(error)

    const userLogged = await Storage.login({
      email: data.email,
      password: data.password
    })

    res.json(userLogged)
  } catch (err) {
    res.status(403).json({ msg: err.message })
  }
})

export default userRoute
