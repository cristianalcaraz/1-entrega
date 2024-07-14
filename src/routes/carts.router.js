import express from 'express';
import { CartManager } from '../Class/cartManager.js';
import { __dirname } from '../utils.js';

const router = express.Router();
const cartManager = new CartManager(__dirname + '/data/cart.json');

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(400).json({ message: `Error al crear el carrito: ${error.message}` });
    }
});

router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.status(200).json({ resultado: carts });
    } catch (error) {
        res.status(500).json({ message: `Error al obtener los carritos: ${error.message}` });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.id);
        if (!cart) {
            res.status(404).json({ message: 'Carrito no encontrado' });
        } else {
            res.status(200).json(cart);
        }
    } catch (error) {
        res.status(500).json({ message: `Error al obtener el carrito: ${error.message}` });
    }
});

router.put('/:id/product/:productId', async (req, res) => {
    try {
        await cartManager.addProductToCart(req.params.id, req.params.productId);
        res.status(200).json({ message: 'Producto añadido al carrito' });
    } catch (error) {
        res.status(400).json({ message: `Error al añadir el producto al carrito: ${error.message}` });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await cartManager.removeCart(req.params.id);
        res.status(200).json({ message: 'Carrito eliminado' });
    } catch (error) {
        res.status(400).json({ message: `Error al eliminar el carrito: ${error.message}` });
    }
});

export default router;
