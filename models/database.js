import { createClient } from '@libsql/client'
import { hash, compare } from 'bcrypt'
import 'dotenv/config'
import { PasswordWrong, UserNotFound } from '../utils/error_factory'

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
})

export class Storage {
  static register = async ({ name, email, password }) => {
    const salts = Number(process.env.SALTS_ROUNDS)
    const hashedPassword = await hash(password, salts)

    await turso.execute({
      sql: `INSERT INTO user (user_email, user_name, user_password) VALUES (:email, :name, :password);`,
      args: { email, name, password: hashedPassword }
    })

    const { rows } = await turso.execute({
      sql: 'SELECT user_id, user_email, user_name FROM user WHERE user_email = ?;',
      args: [email]
    })

    return {
      id: rows[0].user_id,
      email: rows[0].user_email,
      name: rows[0].user_name
    }
  }

  static login = async ({ email, password }) => {
    const { rows } = await turso.execute({
      sql: `SELECT user_email, user_name, user_password FROM user WHERE user_email = ?`,
      args: [email]
    })
    if (rows.length === 0) throw new UserNotFound('User does not exists')

    //  Problably throws 'Password wrong' error
    const isOk = await compare(password, rows[0].user_password)
    if (!isOk) throw new PasswordWrong('Password wrong')

    return {
      email: rows[0].user_email,
      name: rows[0].user_name
    }
  }

  static refresh = async ({ id }) => {
    const { rows } = await turso.execute({
      sql: 'SELECT user_id, user_email, user_name FROM "user" WHERE user_id = ?',
      args: [id]
    })

    if (rows.length === 0) throw new Error('User does not exist')

    return {
      id: rows[0].user_id,
      email: rows[0].user_email,
      name: rows[0].user_name
    }
  }

  static getAllUnits = async () => {
    const { rows } = await turso.execute({
      sql: 'SELECT volume_id, volume_name FROM "volume"'
    })

    return rows.map((volume) => ({
      id: volume.volume_id,
      unit: volume.volume_name
    }))
  }
}
