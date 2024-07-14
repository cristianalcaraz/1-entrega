import express from 'express';
import ProductManager from '../Class/productManager.js';
import { __dirname } from '../utils.js';

const router = express.Router();

console.log(__dirname)
const productManager = new ProductManager(__dirname + '/data/product.json');

// Función de validación de productos
function validateProduct(product) {
    const { title, price, category } = product;
    if (!title || !price || !category) {
        throw new Error("Todos los campos (título, precio, categoría) son requeridos.");
    }
    if (typeof price !== 'number' || price <= 0) {
        throw new Error("El precio debe ser un número positivo.");
    }
}

router.post('/', async (req, res) => {
    try {
        const newProduct = req.body;
        validateProduct(newProduct); // Validar el producto
        await productManager.addProduct(newProduct);
        res.status(201).json({ message: '¡Producto añadido!' });
    } catch (error) {
        res.status(400).json({ message: `Error al añadir el producto: ${error.message}` });
    }
});

router.get('/', async (req, res) => {
    try {
        const productList = await productManager.getProductList();
        res.status(200).json({ resultado: productList });
    } catch (error) {
        res.status(500).json({ message: `Error al obtener la lista de productos: ${error.message}` });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.id);
        if (!product) {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.status(200).json(product);
        }
    } catch (error) {
        res.status(500).json({ message: `Error al obtener el producto: ${error.message}` });
    }
});

router.put('/:id', async (req, res) => {
    try {
        await productManager.updateProduct(req.params.id, req.body);
        res.status(200).json({ message: 'Producto actualizado' });
    } catch (error) {
        res.status(400).json({ message: `Error al actualizar el producto: ${error.message}` });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await productManager.deleteProduct(req.params.id);
        res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(400).json({ message: `Error al eliminar el producto: ${error.message}` });
    }
});

export default router;
