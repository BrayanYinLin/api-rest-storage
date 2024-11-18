import { Storage } from '../models/local.js'
import jsonwebtoken from 'jsonwebtoken'
import { checkSignUpUser, checkSignInUser } from '../schemas/users.js'
import 'dotenv/config'

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
          httpOnly: process.env.ENV === 'DEVELOPMENT',
          sameSite: 'strict',
          secure: false,
          maxAge: 1000 * 60 * 60 * 8
        })
        .cookie('refresh_token', refreshToken, {
          httpOnly: process.env.ENV === 'DEVELOPMENT',
          sameSite: 'strict',
          secure: false,
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
        expiresIn: '8h'
        // expiresIn: 10
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
          httpOnly: process.env.ENV === 'DEVELOPMENT',
          sameSite: process.env.ENV === 'DEVELOPMENT' ? 'lax' : 'strict',
          secure: false, //process.env.ENV === 'DEVELOPMENT'
          maxAge: 1000 * 60 * 60 * 8
          // maxAge: 1000 * 10
        })
        .cookie('refresh_token', refreshToken, {
          httpOnly: process.env.ENV === 'DEVELOPMENT',
          sameSite: process.env.ENV === 'DEVELOPMENT' ? 'lax' : 'strict',
          secure: false, //process.env.ENV === 'DEVELOPMENT'
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
      const refresh = jsonwebtoken.verify(
        req.cookies.refresh_token,
        process.env.REFRESH_SECRET
      )
      const userRefreshed = await Storage.refresh({ id: refresh.id })

      const newAccessToken = jsonwebtoken.sign(
        userRefreshed,
        process.env.SECRET,
        {
          expiresIn: '8h'
        }
      )

      res
        .cookie('access_token', newAccessToken, {
          httpOnly: process.env.ENV === 'DEVELOPMENT',
          sameSite: process.env.ENV === 'DEVELOPMENT' ? 'lax' : 'strict',
          secure: false, //process.env.ENV === 'DEVELOPMENT'
          maxAge: 1000 * 60 * 60 * 8
        })
        .json(userRefreshed)
    } catch (e) {
      console.error(e)
      res.status(403).json({
        msg: 'No se que ha pasao',
        otra: e.name,
        tokenMRD: req.cookies.refresh_token
      })
    }
  }

  static logout = async (req, res) => {
    res
      .clearCookie('access_token')
      .clearCookie('refresh_token')
      .json({ msg: 'Logout successfull' })
  }

  static checkTokens = async (req, res) => {
    try {
      const token = jsonwebtoken.verify(
        req.cookies.access_token,
        process.env.SECRET
      )

      if (token) {
        res.status(200).json({ msg: 'Everything is ok' })
      }
    } catch (e) {
      res.status(403).json(e)
    }
  }
}
