import express from 'express'
import cookieParser from 'cookie-parser'
//  Errors
import jsonwebtoken from 'jsonwebtoken'
import { MissingToken } from './utils/error_factory.js'
//  Routes
import userRoute from './routes/user.js'
import productRoute from './routes/product.js'
import recordRoute from './routes/record.js'
//  Dotenv
import 'dotenv/config'

const { TokenExpiredError } = jsonwebtoken
const port = process.env.PORT ?? 3000
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
  req.session = { user: null }
  try {
    const token = req.cookies.access_token
    if (!token && req.path !== '/api/user/login') {
      throw new MissingToken('Token is missing')
    }
    if (
      !token &&
      (req.path === '/api/user/login' || req.path === '/api/user/register')
    ) {
      return next()
    }

    const user = jsonwebtoken.verify(token, process.env.SECRET)

    req.session.user = user
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      res.status(401).json({ msg: 'Token expired' })
    } else if (e instanceof MissingToken) {
      req.session.user = null
      next()
    }
  }
})
app.use('/api/user', userRoute)
app.use('/api/product', productRoute)
app.use('/api/record', recordRoute)
app.disable('x-powered-by')

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
