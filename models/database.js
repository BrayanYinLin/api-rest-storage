import { createClient } from '@libsql/client'
import { hash, compare } from 'bcrypt'
import 'dotenv/config'
import {
  NoRowsAffected,
  PasswordWrong,
  RecordNotFound,
  RepeatedProduct,
  UnexpectedCreateRecordError,
  UserNotFound
} from '../utils/error_factory.js'

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
      id: rows[0].user_id,
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
   * @returns {Promise<Array<{ unitId: number, unitName: string }>>} A promise that resolves to an array of objects,
   * each containing the `id` (volume_id) and `unit` (volume_name).
   *
   * @example
   * const units = await YourClass.getAllUnits();
   * console.log(units);
   * // Output: [{ unitId: 1, unitName: 'Liters' }, { unitId: 2, unitName: 'Gallons' }, ...]
   */
  static getAllUnits = async () => {
    const { rows } = await turso.execute({
      sql: 'SELECT * FROM view_unit',
      args: []
    })

    return rows
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
    const products = await turso.execute({
      sql: 'SELECT * FROM view_product',
      args: []
    })
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
      const { rowsAffected } = await turso.execute({
        sql: 'INSERT INTO "product"(product_name, product_stock, volume_id) VALUES (?, ?, ?);',
        args: [name, stock, volume]
      })

      if (rowsAffected === 0)
        throw new NoRowsAffected('Error: No se pudo crear el producto')

      const newProduct = await turso.execute({
        sql: 'SELECT * FROM view_product p WHERE productName = ? AND unitId = ?',
        args: [name, volume]
      })

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
  static updateProduct = async ({
    product_id,
    product_name,
    product_stock,
    volume_id
  }) => {
    try {
      const { rowsAffected } = await turso.execute({
        sql: 'UPDATE product SET product_name = COALESCE(:product_name, product_name), product_stock = COALESCE(:product_stock, product_stock), volume_id = COALESCE(:volume_id, volume_id) WHERE product_id = :product_id',
        args: {
          product_name: product_name,
          product_stock: product_stock,
          volume_id: volume_id,
          product_id: product_id
        }
      })

      if (rowsAffected === 0) {
        throw new Error('Product cannot be updated')
      }

      const { rows } = await turso.execute(
        'SELECT * FROM view_product WHERE productId = ?',
        product_id
      )

      return rows
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static getAllRecords = async () => {
    const records = await turso.execute({
      sql: 'SELECT * FROM show_records',
      args: []
    })
    return records.rows
  }

  /**
   * Returns income records
   */
  static getIncomeRecords = async () => {
    const records = await turso.execute({
      sql: 'SELECT * FROM show_incomes',
      args: []
    })
    return records.rows
  }

  /**
   * Returns expenses record
   */
  static getExpensesRecords = async () => {
    const records = await turso.execute({
      sql: 'SELECT * FROM show_expenses',
      args: []
    })
    return records.rows
  }

  static createOutcomeRecord = async ({
    productId,
    userId,
    recordQuantity,
    recordDate
  }) => {
    try {
      await turso.execute({
        sql: 'INSERT INTO "record" (product_id, user_id, record_type_id, record_quantity, record_date) VALUES (?, ?, ?, ?, ?)',
        args: [productId, userId, 2, recordQuantity, recordDate]
      })

      const newRecord = await turso.execute({
        sql: 'SELECT record_id AS recordId, p.product_id AS productId, p.product_name AS productName, v.volume_name AS unitName, user_id AS userId, record_type_id AS recordTypeId, record_quantity AS recordQuantity, record_date AS recordDate FROM record r INNER JOIN product p ON p.product_id = r.product_id INNER JOIN volume v ON p.volume_id = v.volume_id ORDER BY record_strict_date DESC LIMIT 1;',
        args: []
      })

      return newRecord
    } catch (e) {
      throw new UnexpectedCreateRecordError(e.message)
    }
  }

  static createIncomeRecord = async ({
    productId,
    userId,
    recordQuantity,
    recordDate
  }) => {
    try {
      await turso.execute({
        sql: 'INSERT INTO "record" (product_id, user_id, record_type_id, record_quantity, record_date) VALUES (?, ?, ?, ?, ?)',
        args: [productId, userId, 1, recordQuantity, recordDate]
      })

      const { rows } = await turso.execute({
        sql: 'SELECT record_id AS recordId, p.product_id AS productId, p.product_name AS productName, v.volume_name AS unitName, user_id AS userId, record_type_id AS recordTypeId, record_quantity AS recordQuantity, record_date AS recordDate FROM record r INNER JOIN product p ON p.product_id = r.product_id INNER JOIN volume v ON p.volume_id = v.volume_id ORDER BY record_strict_date DESC LIMIT 1;',
        args: []
      })

      return rows
    } catch (e) {
      throw new UnexpectedCreateRecordError(e.message)
    }
  }

  /**
   * Update a record by id
   */
  static updateRecord = async (record) => {
    await turso.execute({
      sql: 'UPDATE record SET user_id = COALESCE(:user_id, user_id), product_id = COALESCE(:product_id, product_id), record_quantity = COALESCE(:record_quantity, record_quantity), record_date = COALESCE(:record_date, record_date) WHERE record_id = :record_id',
      arg: {
        record_id: record.recordId,
        user_id: record.userId,
        product_id: record.productId,
        record_quantity: record.recordQuantity,
        record_date: record.recordDate
      }
    })

    const { rows } = await turso.execute({
      sql: 'SELECT record_id AS recordId, p.product_id AS productId, p.product_name AS productName, v.volume_name AS unitName, user_id AS userId, record_type_id AS recordTypeId, record_quantity AS recordQuantity, record_date AS recordDate FROM record r INNER JOIN product p ON p.product_id = r.product_id INNER JOIN volume v ON p.volume_id = v.volume_id WHERE r.record_id = ?',
      args: [record.recordId]
    })

    return rows
  }

  /**
   * Delete record by id
   */
  static deleteRecord = async ({ id }) => {
    const { rows } = await turso.execute({
      sql: 'SELECT * FROM record WHERE record_id = ?',
      args: [id]
    })

    if (rows) {
      throw new RecordNotFound('Record not found')
    }

    await turso.execute({
      sql: 'DELETE FROM record WHERE record_id = ?',
      arg: [id]
    })
    return rows
  }

  /**
   * Return a resume by month oldness
   */
  static getExpensesResumeByMonth = async ({ month, year }) => {
    if (month < 10) {
      month = `0${month}`
    }
    const { rows } = await turso.execute({
      sql: `SELECT product_name AS [Producto], v.volume_name AS [Unidad de Medida], sum(record_quantity) AS [Cantidad],
        CASE 
          WHEN strftime('%m', r.record_date) = '01' THEN 'Enero'
          WHEN strftime('%m', r.record_date) = '02' THEN 'Febrero'
          WHEN strftime('%m', r.record_date) = '03' THEN 'Marzo'
          WHEN strftime('%m', r.record_date) = '04' THEN 'Abril'
          WHEN strftime('%m', r.record_date) = '05' THEN 'Mayo'
          WHEN strftime('%m', r.record_date) = '06' THEN 'Junio'
          WHEN strftime('%m', r.record_date) = '07' THEN 'Julio'
          WHEN strftime('%m', r.record_date) = '08' THEN 'Agosto'
          WHEN strftime('%m', r.record_date) = '09' THEN 'Septiembre'
          WHEN strftime('%m', r.record_date) = '10' THEN 'Octubre'
          WHEN strftime('%m', r.record_date) = '11' THEN 'Noviembre'
          WHEN strftime('%m', r.record_date) = '12' THEN 'Diciembre'
          ELSE 'Mes desconocido'
        END AS [Mes]
      FROM record r
      INNER JOIN product pr ON pr.product_id = r.product_id 
      INNER JOIN volume v ON pr.volume_id = v.volume_id
      INNER JOIN record_types rt ON r.record_type_id = rt.record_type_id
      WHERE rt.record_type_id = 2 AND strftime('%m', r.record_date) = ? AND strftime('%Y', r.record_date) = ?
      GROUP BY [Producto]`,
      args: [month, year]
    })

    return rows
  }

  /**
   * Return a resume by month oldness
   */
  static getIncomesResumeByMonth = async ({ month, year }) => {
    if (month < 10) {
      month = `0${month}`
    }
    const { rows } = await turso.execute({
      sql: `SELECT product_name AS [Producto], v.volume_name AS [Unidad de Medida], sum(record_quantity) AS [Cantidad],
        CASE 
          WHEN strftime('%m', r.record_date) = '01' THEN 'Enero'
          WHEN strftime('%m', r.record_date) = '02' THEN 'Febrero'
          WHEN strftime('%m', r.record_date) = '03' THEN 'Marzo'
          WHEN strftime('%m', r.record_date) = '04' THEN 'Abril'
          WHEN strftime('%m', r.record_date) = '05' THEN 'Mayo'
          WHEN strftime('%m', r.record_date) = '06' THEN 'Junio'
          WHEN strftime('%m', r.record_date) = '07' THEN 'Julio'
          WHEN strftime('%m', r.record_date) = '08' THEN 'Agosto'
          WHEN strftime('%m', r.record_date) = '09' THEN 'Septiembre'
          WHEN strftime('%m', r.record_date) = '10' THEN 'Octubre'
          WHEN strftime('%m', r.record_date) = '11' THEN 'Noviembre'
          WHEN strftime('%m', r.record_date) = '12' THEN 'Diciembre'
          ELSE 'Mes desconocido'
        END AS [Mes]
      FROM record r
      INNER JOIN product pr ON pr.product_id = r.product_id 
      INNER JOIN volume v ON pr.volume_id = v.volume_id
      INNER JOIN record_types rt ON r.record_type_id = rt.record_type_id
      WHERE rt.record_type_id = 1 AND strftime('%m', r.record_date) = ? AND strftime('%Y', r.record_date) = ?
      GROUP BY [Producto]`,
      args: [month, year]
    })

    return rows
  }

  static getMostConsumedProduct = async () => {
    const { rows } = await turso.execute({
      sql: 'SELECT * FROM most_consumed_products',
      args: []
    })

    return rows
  }

  static getMostEnteredProduct = async () => {
    const { rows } = await turso.execute({
      sql: 'SELECT * FROM most_entered_products',
      args: []
    })

    return rows
  }
}
