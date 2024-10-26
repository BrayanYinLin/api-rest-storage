import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
//  Errors
import jsonwebtoken from 'jsonwebtoken'
import { MissingToken } from './utils/error_factory.js'
//  Routes
import userRoute from './routes/user.js'
import productRoute from './routes/product.js'
import recordRoute from './routes/record.js'
import reportRoute from './routes/report.js'
//  Dotenv
import 'dotenv/config'

const { TokenExpiredError } = jsonwebtoken
const port = process.env.PORT ?? 3000
const app = express()

app.use(express.json())
app.use(
  cors({
    origin: 'http://localhost:5173', // Cambia esto a la URL de tu cliente
    credentials: true // Permitir el envío de credenciales (cookies)
  })
)
app.use(cookieParser())
app.use((req, res, next) => {
  req.session = { user: null }
  try {
    const token = req.cookies.access_token
    const refresh_token = req.cookies.refresh_token
    if (req.path === '/api/user/login' || req.path === '/api/user/register') {
      return next()
    }

    if (!token) throw new MissingToken('Missing Token')

    if (req.path === '/api/user/refresh') {
      const refresh = jsonwebtoken.verify(
        refresh_token,
        process.env.REFRESH_SECRET
      )
      req.session = {
        user: token,
        refresh: refresh
      }
      return next()
    }

    const user = jsonwebtoken.verify(token, process.env.SECRET)
    const refresh = jsonwebtoken.verify(
      refresh_token,
      process.env.REFRESH_SECRET
    )

    req.session = {
      user: user,
      refresh: refresh
    }
    next()
  } catch (e) {
    req.session.user = null

    if (e instanceof TokenExpiredError) {
      res.status(401).json({ msg: 'Token expired' })
    } else if (e instanceof MissingToken) {
      res.status(401).json({ msg: 'Missing Token' })
    }
  }
})
app.use('/api/user', userRoute)
app.use('/api/product', productRoute)
app.use('/api/record', recordRoute)
app.use('/api/report', reportRoute)
app.disable('x-powered-by')

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
