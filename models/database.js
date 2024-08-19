import { createClient } from '@libsql/client'
import { hash, compare } from 'bcrypt'
import 'dotenv/config'

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
})

export class Storage {
  static register = async ({ name, email, password }) => {
    try {
      const salts = Number(process.env.SALTS_ROUNDS)
      const hashedPassword = await hash(password, salts)

      //  Problably throws 'User already exist' error
      await turso.execute({
        sql: `INSERT INTO user (user_email, user_name, user_password) VALUES (:email, :name, :password);`,
        args: { email, name, password: hashedPassword }
      })

      const { rows } = await turso.execute({
        sql: 'SELECT user_email, user_name FROM user WHERE user_email = ?;',
        args: [email]
      })

      return rows[0]
    } catch (err) {
      console.error(err)
      throw new Error('There was a error in database')
    }
  }

  static login = async ({ email, password }) => {
    try {
      //  Problably throws 'User does not exist'
      const { rows } = await turso.execute({
        sql: `SELECT user_email, user_name, user_password FROM user WHERE user_email = ?`,
        args: [email]
      })
      if (rows.length === 0) throw new Error('User does not exist')

      //  Problably throws 'Password wrong' error
      const isOk = await compare(password, rows[0].user_password)
      if (!isOk) throw new Error('Password wrong')

      return {
        email: rows[0].user_email,
        name: rows[0].user_name
      }
    } catch (err) {
      console.error(err)
      throw new Error('There was a error in database')
    }
  }
}
