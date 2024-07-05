import fs from 'node:fs'
import { title } from 'node:process';

class ProductManager {
    constructor(path){
        this.path = path;
        this.productList = [];
    }

    async getProductList(){
        const list = await fs.promises.readFile(this.path,'utf-8')
        this.productList = [...JSON.parse(list).data]
        return [...this.productList]
    }

    async addProduct(product){
        this.productList = await this.getProductList(); //recuperar lo que tenga el archivo
        const newProduct={
            title:"interior" || "exterior" ,
        };
        this.productList.push(newProduct)
        await fs.promises.writeFile(this.path, JSON.stringify({ data: this.productList }))
    }

}

export default ProductManager