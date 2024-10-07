import { Storage } from '../models/local.js'
import jsonwebtoken from 'jsonwebtoken'
import { checkSignUpUser, checkSignInUser } from '../schemas/users.js'
import { MissingRefreshToken } from '../utils/error_factory.js'
import 'dotenv/config'
import { TokenExpiredError } from 'jsonwebtoken'

export default class UserController {
  static register = async (req, res) => {
    try {
      const { email, password, name } = req.body

      const { data, error } = checkSignUpUser({ name, email, password })

      if (error) return res.status(422).json(error.message)

      const newUser = {
        email: data.email,
        password: data.password,
        name: data.name
      }

      const userCreated = await Storage.register(newUser)
      const token = jsonwebtoken.sign(userCreated, process.env.SECRET, {
        expiresIn: '8h'
      })
      const refreshToken = jsonwebtoken.sign(
        { user_id: userCreated.id },
        process.env.REFRESH_SECRET,
        {
          expiresIn: '20d'
        }
      )

      res
        .cookie('access_token', token, {
          httpOnly: process.env.ENV !== 'DEVELOPMENT',
          sameSite: 'strict',
          secure: process.env.ENV !== 'DEVELOPMENT',
          maxAge: 1000 * 60 * 60 * 8
        })
        .cookie('refresh_token', refreshToken, {
          httpOnly: process.env.ENV !== 'DEVELOPMENT',
          sameSite: 'strict',
          secure: process.env.ENV !== 'DEVELOPMENT',
          maxAge: 1000 * 60 * 60 * 24 * 20
        })
        .json(userCreated)
    } catch (err) {
      res.status(422).json({ msg: err.message })
    }
  }

  static login = async (req, res) => {
    try {
      const { email, password } = req.body
      const { data, error } = checkSignInUser({ email, password })

      if (error) return res.status(403).json(error)

      const userLogged = await Storage.login({
        email: data.email,
        password: data.password
      })

      const token = jsonwebtoken.sign(userLogged, process.env.SECRET, {
        // expiresIn: '8h'
        expiresIn: 10
      })

      const refreshToken = jsonwebtoken.sign(
        { id: userLogged.id },
        process.env.REFRESH_SECRET,
        {
          expiresIn: '20d'
        }
      )

      res
        .cookie('access_token', token, {
          httpOnly: process.env.ENV !== 'DEVELOPMENT',
          sameSite: 'strict',
          secure: process.env.ENV !== 'DEVELOPMENT',
          // maxAge: 1000 * 60 * 60 * 8
          maxAge: 1000 * 10
        })
        .cookie('refresh_token', refreshToken, {
          httpOnly: process.env.ENV !== 'DEVELOPMENT',
          sameSite: 'strict',
          secure: process.env.ENV !== 'DEVELOPMENT',
          maxAge: 1000 * 60 * 60 * 24 * 20
        })
        .json(userLogged)
    } catch (err) {
      console.error(err)
      res.status(403).json({ msg: err.message })
    }
  }

  static refresh = async (req, res) => {
    try {
      if (!req.session.refresh) {
        console.log(req.session.refresh)
        throw new MissingRefreshToken('Refresh token is missing: sign in again')
      }
      jsonwebtoken.verify(req.session.user, process.env.SECRET)
    } catch (e) {
      if (e instanceof MissingRefreshToken) {
        res.status(401).json({ msg: e.message })
      } else if (e instanceof TokenExpiredError) {
        const refreshUser = await Storage.refresh(req.session.refresh)

        const token = jsonwebtoken.sign(refreshUser, process.env.SECRET, {
          // expiresIn: '8h'
          expiresIn: 20
        })

        res
          .cookie('access_token', token, {
            httpOnly: process.env.ENV !== 'DEVELOPMENT',
            sameSite: 'strict',
            secure: process.env.ENV !== 'DEVELOPMENT',
            // maxAge: 1000 * 60 * 60 * 8
            maxAge: 1000 * 20
          })
          .json(refreshUser)
      }
    }
  }

  static logout = async (req, res) => {
    res.clearCookie('access_token').json({ msg: 'Logout successfull' })
  }
}
