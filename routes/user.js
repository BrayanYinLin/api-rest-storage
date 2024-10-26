import { Router } from 'express'
// import { Storage } from '../models/database.js'
import UserController from '../controllers/user.js'

const userRoute = Router()

userRoute.get('/check', UserController.checkTokens)

userRoute.post('/register', UserController.register)

userRoute.post('/refresh', UserController.refresh)

userRoute.post('/login', UserController.login)

userRoute.post('/logout', UserController.logout)

export default userRoute
