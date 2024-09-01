import { Router } from 'express'
import ProductController from '../controllers/product.js'

const productRoute = Router()

productRoute.get('/', ProductController.getProducts)

productRoute.post('/', ProductController.createProduct)

productRoute.put('/:id', ProductController.updateProduct)

export default productRoute
