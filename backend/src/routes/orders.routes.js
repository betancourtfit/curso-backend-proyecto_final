import { Router } from "express"
import { passportError, authorization } from "../utils/messagesError.js";
import { orderController } from "../dao/Controllers/order.controller.js";
const orderRouter = Router();

orderRouter.get('/:id', passportError('jwt'), authorization(['user']), orderController.getOrderById);
orderRouter.post('/:cartId', passportError('jwt'), authorization(['user']), orderController.createOrder);
orderRouter.put('/:id', passportError('jwt'), authorization(['user']), orderController.updateOrderStatusById);

export default orderRouter;

