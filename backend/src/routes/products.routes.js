import { Router } from "express"
import { passportError, authorization } from "../utils/messagesError.js";
import { productController } from "../dao/Controllers/product.controller.js";
const productRouter = Router();

productRouter.get('/', passportError('jwt'), authorization(['user','admin']), productController.getProducts)
productRouter.get('/:id', passportError('jwt'), authorization(['user','admin']), productController.getProduct)
productRouter.put('/:code', passportError('jwt'), authorization(['user','admin']), productController.updateProduct)
productRouter.delete('/:id', passportError('jwt'), 
authorization(['user','admin']), productController.deleteProduct)
productRouter.post('/', passportError('jwt'), authorization(['user','admin']), productController.createProduct)
productRouter.post('/mockingproducts', passportError('jwt'), authorization(['admin']), productController.createMockProduct);
productRouter.post('/mockingproducts/:number', passportError('jwt'), authorization(['admin']), productController.createMockProducts);

export default productRouter