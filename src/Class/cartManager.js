import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';

export class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data).data || [];
        } catch (error) {
            console.error(`Error al leer los carritos del archivo: ${error}`);
            this.carts = [];
        }
        return [...this.carts];
    }

    async saveCarts() {
        try {
            await fs.writeFile(this.path, JSON.stringify({ data: this.carts }, null, 2));
        } catch (error) {
            console.error(`Error al escribir los carritos en el archivo: ${error}`);
            throw error;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            this.carts = await this.getCarts();
            const updatedCarts = this.carts.map((cart) => {
                if (cart.id !== cartId) return cart;

                const indexProd = cart.products.findIndex(prod => prod.id === productId);
                if (indexProd === -1) {
                    cart.products.push({ id: productId, quantity: 1 });
                } else {
                    cart.products[indexProd].quantity += 1;
                }
                return cart;
            });

            this.carts = [...updatedCarts];
            await this.saveCarts();
        } catch (error) {
            console.error(`Error al añadir producto al carrito: ${error}`);
            throw error;
        }
    }

    async createCart() {
        try {
            this.carts = await this.getCarts();
            const newCart = {
                id: uuidv4(),
                products: []
            };
            this.carts.push(newCart);
            await this.saveCarts();
            return newCart;
        } catch (error) {
            console.error(`Error al crear un nuevo carrito: ${error}`);
            throw error;
        }
    }

    async removeCart(cartId) {
        try {
            this.carts = await this.getCarts();
            this.carts = this.carts.filter(cart => cart.id !== cartId);
            await this.saveCarts();
        } catch (error) {
            console.error(`Error al eliminar el carrito: ${error}`);
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            this.carts = await this.getCarts();
            return this.carts.find(cart => cart.id === cartId);
        } catch (error) {
            console.error(`Error al obtener el carrito por ID: ${error}`);
            throw error;
        }
    }
}

