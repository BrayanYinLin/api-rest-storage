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
import unitsRoute from './routes/units.js'
//  Dotenv
import 'dotenv/config'

const { TokenExpiredError } = jsonwebtoken
const port = process.env.PORT ?? 3000
const app = express()

app.use(express.json())
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = ['http://localhost:5173', process.env.PRODWEB]

      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error(`Not allowed by CORS ${origin}`))
      }
    },
    credentials: true
  })
)
app.use(cookieParser())
app.use((req, res, next) => {
  req.session = {
    user: null,
    refresh: null
  }
  const AUTH_ROUTES = [
    '/api/user/login',
    '/api/user/register',
    '/api/user/check',
    '/api/user/refresh'
  ]
  try {
    if (AUTH_ROUTES.some((route) => route === req.path)) {
      return next()
    }

    //  Recupera las cookies
    const token = req.cookies.access_token
    const refresh_token = req.cookies.refresh_token

    //  Verifica que existan
    if (!token) throw new MissingToken('Missing Token')
    if (!refresh_token) throw new MissingToken('Refresh token missing')

    //  Las desencripta
    const user = jsonwebtoken.verify(token, process.env.SECRET)
    const refresh = jsonwebtoken.verify(
      refresh_token,
      process.env.REFRESH_SECRET
    )

    //  Las agrega al session
    req.session = {
      user: user,
      refresh: refresh
    }

    // Continua la peticion
    next()
  } catch (e) {
    req.session.user = null

    if (e instanceof TokenExpiredError) {
      res.status(401).json({ msg: 'Token expired' })
    } else if (e instanceof MissingToken) {
      res.status(401).json({ msg: e.message })
    }
  }
})
app.use('/api/user', userRoute)
app.use('/api/product', productRoute)
app.use('/api/record', recordRoute)
app.use('/api/report', reportRoute)
app.use('/api/unit', unitsRoute)
app.disable('x-powered-by')

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
