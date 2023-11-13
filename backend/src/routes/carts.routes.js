import { Router } from "express"
import { CartManager } from "../dao/models/cartManager.js"
import { cartController } from "../dao/Controllers/cart.controller.js";

const cartRouter = Router()

cartRouter.get('/', cartController.getCarts);
cartRouter.get('/:id', cartController.getCart);
cartRouter.post('/', cartController.createCart);
cartRouter.put('/:cid/products/:pid', cartController.addOrUpdateProductInCart);
cartRouter.delete('/:id', cartController.cleanCart);
cartRouter.delete('/:cid/products/:pid', cartController.removeProductbyId);
cartRouter.put('/:cid', cartController.updateCartWithProducts);

// cartRouter.get('/', async (req, res) => {
//     const {limit} = req.query
//     try {
//         const carts = await CartManager.findAll(limit);
//         res.status(200).send({respuesta: 'ok', mensaje: carts})
//     } catch (error){
//         res.status(400).send({respuesta: 'Error', mensaje: error})
//     }
// })

// cartRouter.get('/:id', async (req, res) => {
//     const {id} = req.params
//     try {
//         const cart = await CartManager.findById(id);
//         if (cart) {
//             const totalQuantity = cart.products.reduce((acc, product) => acc + product.cantidad, 0);
//             res.status(200).send({respuesta: 'ok', payload: {cart, totalQuantity}})
//         } else 
//             res.status(404).send({respuesta: 'Error', err: 'Product not found'})
//     } catch (error){
//         res.status(400).send({respuesta: 'Error getting cart by id', err: error})
//     }
// })

// cartRouter.post('/', async (req, res) => {
//     try {
//         const respuesta = await CartManager.create();
//         res.status(200).send({respuesta: 'OK cart created', mensaje: respuesta})
//     } catch (error){
//         res.status(400).send({respuesta: 'Error at cart creation', mensaje: error})
//     }
// })

// cartRouter.post('/:cid/products/:pid', async (req, res) =>{
//     const {cid, pid} = req.params
//     const {quantity} = req.body
    
//     try {
//         await CartManager.addOrUpdateProductInCart(cid, pid, quantity);
//         res.status(200).send({ respuesta: 'OK', mensaje: 'Cart Updated' });
//     } catch (error) {
//         res.status(error.message.includes("not found") ? 404 : 400).send({ respuesta: 'Error', mensaje: error.message });
//     }

// })

// cartRouter.delete('/:id', async (req, res) => {
//     const {id} = req.params
//     try {
//         await CartManager.cleanCart(id);
//         res.status(200).send({respuesta: 'ok', mensaje: 'Cart Empty'});
//     } catch (error){
//         res.status(400).send({respuesta: 'Error getting cart by id', mensaje: error})
//     }
// })

// cartRouter.put('/:cid/products/:pid', async (req, res) =>{
//     console.log('añadido al carrito')
//     const {cid, pid} = req.params
//     console.log('cid:',cid)
//     console.log('pid:',pid)
//     const {quantity} = req.body
//     console.log('quantity:',quantity)
    
//     try {
//         await CartManager.addOrUpdateProductInCart(cid, pid, quantity);
//         res.status(200).send({ respuesta: 'OK', mensaje: 'Cart Updated' });
//     } catch (error) {
//         res.status(error.message.includes("not found") ? 404 : 400).send({ respuesta: 'Error', mensaje: error.message });
//     }
// })

// cartRouter.delete('/:cid/products/:pid', async (req, res) =>{
//     const {cid, pid} = req.params
    
//     try {
//         await CartManager.removeProductbyId(cid, pid);
//         res.status(200).send({ respuesta: 'OK', mensaje: 'Product removed' });
//     } catch (error) {
//         res.status(error.message.includes("not found") ? 404 : 400).send({ respuesta: 'Error', mensaje: error.message });
//     }
// })

// cartRouter.put('/:cid', async (req, res) => {
//     const { cid } = req.params;
//     const productsArray = req.body.products;

//     if (!Array.isArray(productsArray)) {
//         return res.status(400).send({ respuesta: 'Error', mensaje: 'Products should be an array' });
//     }

//     try {
//         await CartManager.updateCartWithProducts(cid, productsArray);
//         res.status(200).send({ respuesta: 'OK', mensaje: 'Cart updated successfully' });
//     } catch (error) {
//         res.status(error.message.includes("not found") ? 404 : 400).send({ respuesta: 'Error', mensaje: error.message });
//     }
// })



export default cartRouter;