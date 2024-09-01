import { UnauthorizedAction } from '../utils/error_factory.js'
import { Storage } from '../models/local.js'
import {
  checkProduct,
  checkProductId,
  checkUpdateProduct
} from '../schemas/products.js'

export default class ProductController {
  static getProducts = async (req, res) => {
    try {
      if (!req.session.user) {
        throw new UnauthorizedAction('Forbidden Action: Get products')
      }
      const products = await Storage.getAllProducts()

      res.json(products)
    } catch (e) {
      if (e.message === 'Forbidden Action: Get products') {
        return res.status(403).json({ msg: e.message })
      } else {
        console.error(e.message)
      }
    }
  }

  static createProduct = async (req, res) => {
    try {
      if (!req.session.user)
        throw new UnauthorizedAction('Forbidden Action: Create new product')
      const { name, stock, volume } = req.body
      const id = await Storage.getVolume({ volumeId: id })
      const { data, error } = checkProduct({
        product_name: name,
        product_stock: stock,
        volume_id: volume
      })
      if (error) return res.status(422).json(error)

      const newProduct = await Storage.createProduct({
        name: data.product_name,
        stock: data.product_stock,
        volume: id
      })

      res.json({
        name: newProduct.product_name,
        stock: newProduct.prduct_stock,
        volume: volume
      })
    } catch (e) {
      if (e.message === 'Forbidden Action')
        res.status(403).json({ msg: e.message })
    }
  }

  static updateProduct = async (req, res) => {
    if (!req.session.user) {
      throw new UnauthorizedAction('Forbidden Action: Update product')
    }
    const { data: productId, error: idError } = checkProductId(
      Number(req.params.id)
    )
    const { data: productFields, error: fieldsError } = checkUpdateProduct(
      req.body
    )

    if (fieldsError) return res.status(422).json({ msg: fieldsError })
    if (idError) return res.status(404).json({ msg: productId })

    const updatedProduct = await Storage.updateProduct({
      product_id: productId,
      ...productFields
    })
    return res.json(updatedProduct)
  }
}
