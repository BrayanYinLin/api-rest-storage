import { createClient } from '@libsql/client'
import { hash, compare } from 'bcrypt'
import 'dotenv/config'
import {
  NoRowsAffected,
  PasswordWrong,
  RepeatedProduct,
  UserNotFound
} from '../utils/error_factory'
import { formatFields } from '../utils/format_field'

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

  /**
   * Retrieves all units from the "volume" table in the database.
   *
   * This method fetches the `volume_id` and `volume_name` from the "volume" table
   * and maps the results to an array of objects with `id` and `unit` properties.
   *
   * @async
   * @function getAllUnits
   * @returns {Promise<Array<{ id: number, unit: string }>>} A promise that resolves to an array of objects,
   * each containing the `id` (volume_id) and `unit` (volume_name).
   *
   * @example
   * const units = await YourClass.getAllUnits();
   * console.log(units);
   * // Output: [{ id: 1, unit: 'Liters' }, { id: 2, unit: 'Gallons' }, ...]
   */
  static getAllUnits = async () => {
    const { rows } = await turso.execute({
      sql: 'SELECT volume_id, volume_name FROM "volume"'
    })

    return rows.map((volume) => ({
      id: volume.volume_id,
      unit: volume.volume_name
    }))
  }

  /**
   * Retrieves a specific unit of measure by its ID from the "view_unit" table.
   *
   * This method queries the `view_unit` table to fetch the unit corresponding to the given `id`.
   * If no matching unit is found, an error is thrown.
   *
   * @async
   * @function getUnitById
   * @param {Object} params - Parameters for the function.
   * @param {number} params.id - The ID of the unit to retrieve.
   * @returns {Promise<number>} A promise that resolves to the `unitId` of the retrieved unit.
   * @throws {Error} If no unit is found for the given ID.
   *
   * @example
   * try {
   *   const unitId = await YourClass.getUnitById({ id: 1 });
   *   console.log(unitId);
   *   // Output: 1
   * } catch (error) {
   *   console.error(error.message);
   *   // Output: No se hallo la unidad de medida
   * }
   */
  static getUnitById = async ({ id }) => {
    const { rows } = await turso.execute({
      sql: 'SELECT * FROM view_unit WHERE unitId = ?',
      args: [id]
    })

    if (rows.length === 0) throw new Error('No se hallo la unidad de medida')

    return rows[0].unitId
  }

  /**
   * Retrieves a list of products whose names match a given search term.
   *
   * This method queries the `products_by_id` table to find products with names
   * that include the specified substring, using a case-insensitive pattern match.
   * It returns the matching rows with details about each product.
   *
   * @async
   * @function getProductsByName
   * @param {Object} params - Parameters for the function.
   * @param {string} params.name - The substring to search for in product names.
   * @returns {Promise<Array<{
   *   product_id: number,
   *   product_name: string,
   *   product_stock: number,
   *   volume_id: number
   * }>>} A promise that resolves to an array of product objects,
   * each containing `product_id`, `product_name`, `product_stock`, and `volume_id`.
   *
   * @example
   * const products = await YourClass.getProductsByName({ name: 'milk' });
   * console.log(products);
   * // Output: [
   * //   { product_id: 1, product_name: 'Liquid Wash', product_stock: 25, volume_id: 3 },
   * //   { product_id: 2, product_name: 'Soap', product_stock: 30, volume_id: 3 },
   * //   ...
   * // ]
   */
  static getProductsByName = async ({ name }) => {
    const { rows } = await turso.execute({
      sql: 'SELECT product_id, product_name, product_stock, volume_id FROM products_by_id WHERE product_name LIKE ?',
      args: [`%${name}%`]
    })

    return rows
  }

  /**
   * Retrieves all products from the "view_product" view.
   *
   * This method fetches all rows from the `view_product` view in the database
   * and returns the result as-is.
   *
   * @async
   * @function getAllProducts
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of product objects.
   * Each object contains the columns defined in the `view_product` view.
   *
   * @example
   * const products = await YourClass.getAllProducts();
   * console.log(products);
   * // Output: [
   * //   { product_id: 1, product_name: 'Almond Milk', product_stock: 25, volume_id: 3 },
   * //   { product_id: 2, product_name: 'Coconut Milk', product_stock: 30, volume_id: 3 },
   * //   ...
   * // ]
   */
  static getAllProducts = async () => {
    const products = await turso.execute('SELECT * FROM view_product')
    return products
  }

  /**
   * Creates a new product in the "product" table and retrieves its details.
   *
   * This method inserts a new product with the specified name, stock, and volume into the `product` table.
   * After successfully creating the product, it retrieves the product's details from the `view_product` view.
   * If no rows are affected during the insertion, it throws a `NoRowsAffected` error.
   * If an unexpected error occurs (e.g., a duplicate product), it throws a `RepeatedProduct` error.
   *
   * @async
   * @function createProduct
   * @param {Object} params - Parameters for the function.
   * @param {string} params.name - The name of the product to create.
   * @param {number} params.stock - The initial stock quantity of the product.
   * @param {number} params.volume - The volume ID associated with the product.
   * @returns {Promise<{ name: string, stock: number }>} A promise that resolves to an object containing
   * the product's `name` and `stock` after creation.
   * @throws {NoRowsAffected} If the product could not be created.
   * @throws {RepeatedProduct} If a product with the same name and volume already exists.
   *
   * @example
   * try {
   *   const newProduct = await YourClass.createProduct({ name: 'Soy Milk', stock: 50, volume: 3 });
   *   console.log(newProduct);
   *   // Output: { name: 'Soy Milk', stock: 50 }
   * } catch (error) {
   *   if (error instanceof NoRowsAffected) {
   *     console.error('Failed to create product.');
   *   } else if (error instanceof RepeatedProduct) {
   *     console.error('This product already exists.');
   *   }
   * }
   */
  static createProduct = async ({ name, stock, volume }) => {
    try {
      const { rowsAffected } = await turso.execute(
        'INSERT INTO "product"(product_name, product_stock, volume_id) VALUES (?, ?, ?);',
        name,
        stock,
        volume
      )

      if (rowsAffected === 0)
        throw new NoRowsAffected('Error: No se pudo crear el producto')

      const newProduct = await turso.execute(
        'SELECT * FROM view_product p WHERE productName = ? AND unitId = ?',
        name,
        volume
      )

      return {
        name: newProduct.product_name,
        stock: newProduct.product_stock
      }
    } catch (e) {
      if (e instanceof NoRowsAffected) {
        throw e
      } else {
        throw new RepeatedProduct('This product already exists')
      }
    }
  }

  /**
   * Updates a product in the "product" table with the provided data.
   *
   * This method updates the fields of an existing product in the `product` table.
   * The `product_id` is used as the identifier for the update. After updating,
   * it retrieves the updated product details from the `view_product` view.
   *
   * @async
   * @function updateProduct
   * @param {Object} product - The product data to update.
   * @param {number} product.product_id - The ID of the product to update.
   * @param {Object} product.otherFields - Any other fields to update in the product, as key-value pairs.
   * @returns {Promise<Object>} A promise that resolves to the updated product details.
   * @throws {Error} If an error occurs during the update process.
   *
   * @example
   * try {
   *   const updatedProduct = await YourClass.updateProduct({
   *     product_id: 1,
   *     product_name: 'Updated Milk',
   *     product_stock: 40
   *   });
   *   console.log(updatedProduct);
   *   // Output: {
   *   //   product_id: 1,
   *   //   product_name: 'Updated Milk',
   *   //   product_stock: 40,
   *   //   volume_id: 3
   *   // }
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  static updateProduct = async (product) => {
    try {
      const id = product.product_id
      delete product.product_id

      const formatted = formatFields(product)
      await turso.execute(
        `UPDATE product SET ${formatted} WHERE product_id = ?`,
        ...Object.values(product),
        id
      )
      const updatedProduct = await turso.execute(
        'SELECT * FROM view_product WHERE productId = ?',
        id
      )

      return updatedProduct
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
