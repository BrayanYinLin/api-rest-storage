import { createClient } from '@libsql/client'
import { hash, compare } from 'bcrypt'
import 'dotenv/config'
import { PasswordWrong, UserNotFound } from '../utils/error_factory'

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
})

export class Storage {
  /**
   * Registers a new user by inserting their information into the database.
   *
   * @async
   * @function
   * @param {Object} params - The user registration data.
   * @param {string} params.name - The name of the user.
   * @param {string} params.email - The email address of the user.
   * @param {string} params.password - The plaintext password of the user.
   * @returns {Promise<Object>} A promise that resolves to the registered user's details, including:
   * - `id` (number): The unique identifier of the user.
   * - `email` (string): The user's email address.
   * - `name` (string): The user's name.
   * @throws {Error} Throws an error if the database operation fails.
   *
   * @example
   * const user = await register({
   *   name: "John Doe",
   *   email: "john.doe@example.com",
   *   password: "securepassword"
   * });
   * console.log(user);
   * // { id: 1, email: "john.doe@example.com", name: "John Doe" }
   */

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

  /**
   * Authenticates a user by validating their email and password.
   *
   * @async
   * @function
   * @param {Object} params - The user login data.
   * @param {string} params.email - The email address of the user.
   * @param {string} params.password - The plaintext password of the user.
   * @returns {Promise<Object>} A promise that resolves to the authenticated user's details, including:
   * - `email` (string): The user's email address.
   * - `name` (string): The user's name.
   * @throws {UserNotFound} Throws if no user with the provided email is found.
   * @throws {PasswordWrong} Throws if the provided password does not match the stored password.
   *
   * @example
   * try {
   *   const user = await login({
   *     email: "john.doe@example.com",
   *     password: "securepassword"
   *   });
   *   console.log(user);
   *   // { email: "john.doe@example.com", name: "John Doe" }
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  static login = async ({ email, password }) => {
    const { rows } = await turso.execute({
      sql: `SELECT user_email, user_name, user_password FROM user WHERE user_email = ?`,
      args: [email]
    })
    if (rows.length === 0) throw new UserNotFound('User does not exists')

    const isOk = await compare(password, rows[0].user_password)
    if (!isOk) throw new PasswordWrong('Password wrong')

    return {
      email: rows[0].user_email,
      name: rows[0].user_name
    }
  }

  /**
   * Refreshes user data by retrieving their information from the database using their unique ID.
   *
   * @async
   * @function
   * @param {Object} params - The data required to refresh the user's information.
   * @param {number} params.id - The unique identifier of the user.
   * @returns {Promise<Object>} A promise that resolves to the user's details, including:
   * - `id` (number): The unique identifier of the user.
   * - `email` (string): The user's email address.
   * - `name` (string): The user's name.
   * @throws {Error} Throws an error if no user with the provided ID is found.
   *
   * @example
   * try {
   *   const user = await refresh({ id: 1 });
   *   console.log(user);
   *   // { id: 1, email: "john.doe@example.com", name: "John Doe" }
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
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

  static getUnitById = async ({ id }) => {
    const { rows } = await turso.execute({
      sql: 'SELECT * FROM view_unit WHERE unitId = ?',
      args: [id]
    })

    if (rows.length === 0) throw new Error('No se hallo la unidad de medida')

    return rows[0].unitId
  }

  static getProductsByName = async ({ name }) => {
    const { rows } = await turso.execute({
      sql: 'SELECT product_id, product_name, product_stock, volume_id FROM products_by_id WHERE product_name LIKE ?',
      args: [`%${name}%`]
    })

    return rows
  }
}
