import { Router } from 'express'
import { UnauthorizedAction } from '../utils/error_factory.js'
import { checkFullProduct } from '../schemas/products.js'
import { Storage } from '../models/local.js'

const productRoute = Router()

productRoute.get('/', async (req, res) => {
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
})

productRoute.post('/', async (req, res) => {
  try {
    if (!req.session.user)
      throw new UnauthorizedAction('Forbidden Action: Create new product')
    const { name, stock, volume } = req.body
    const id = await Storage.getVolume({ volumeId: id })
    const { data, error } = checkFullProduct({ name, stock, volume })
    if (error) return res.status(422).json(error)

    console.log(id)
    const newProduct = await Storage.createProduct({
      name: data.name,
      stock: data.stock,
      volume: id
    })

    console.log(newProduct)

    res.json({
      name: newProduct.product_name,
      stock: newProduct.prduct_stock,
      volume: volume
    })
  } catch (e) {
    if (e.message === 'Forbidden Action')
      res.status(403).json({ msg: e.message })
  }
})

export default productRoute
