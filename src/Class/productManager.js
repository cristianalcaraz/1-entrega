import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';

class ProductManager {
    constructor(path) {
        this.path = path;
        this.productList = [];
    }

    async getProductList() {
        try {
            const list = await fs.readFile(this.path, 'utf-8');
            this.productList = JSON.parse(list).data || [];
        } catch (error) {
            console.error(`Error al leer la lista de productos: ${error}`);
            this.productList = [];
        }
        return [...this.productList];
    }

    validateProduct(product) {
        const { title, price, category } = product;
        if (!title || !price || !category) {
            throw new Error("Todos los campos (título, precio, categoría) son requeridos.");
        }
        if (typeof price !== 'number' || price <= 0) {
            throw new Error("El precio debe ser un número positivo.");
        }
    }

    async addProduct(product) {
        try {
            this.productList = await this.getProductList();
            this.validateProduct(product);

            const newProduct = {
                id: uuidv4(),
                ...product,
            };

            this.productList.push(newProduct);
            await fs.writeFile(this.path, JSON.stringify({ data: this.productList }, null, 2));
        } catch (error) {
            console.error(`Error al añadir el producto: ${error}`);
            throw error;
        }
    }

    async getProductById(productId) {
        try {
            this.productList = await this.getProductList();
            return this.productList.find(product => product.id === productId);
        } catch (error) {
            console.error(`Error al obtener el producto por ID: ${error}`);
            throw error;
        }
    }

    async updateProduct(productId, updatedFields) {
        try {
            this.productList = await this.getProductList();
            const productIndex = this.productList.findIndex(product => product.id === productId);
            if (productIndex === -1) {
                throw new Error('Producto no encontrado');
            }

            this.productList[productIndex] = { ...this.productList[productIndex], ...updatedFields };
            await fs.writeFile(this.path, JSON.stringify({ data: this.productList }, null, 2));
        } catch (error) {
            console.error(`Error al actualizar el producto: ${error}`);
            throw error;
        }
    }

    async deleteProduct(productId) {
        try {
            this.productList = await this.getProductList();
            this.productList = this.productList.filter(product => product.id !== productId);
            await fs.writeFile(this.path, JSON.stringify({ data: this.productList }, null, 2));
        } catch (error) {
            console.error(`Error al eliminar el producto: ${error}`);
            throw error;
        }
    }
}

export default ProductManager;
