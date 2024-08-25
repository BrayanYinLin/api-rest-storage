import { Router } from 'express'
// import { Storage } from '../models/database.js'
import UserController from '../controllers/user.js'

const userRoute = Router()

userRoute.post('/register', UserController.register)

userRoute.post('/login', UserController.login)

userRoute.post('/logout', UserController.logout)

export default userRoute
