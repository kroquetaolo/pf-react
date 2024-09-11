import { productsService } from "../service/index.js"
import path from "path"

class ProductsController {
    #productService
    constructor() {
        this.#productService = productsService
    }

    getProducts = async (req, res) => {
    
        const { docs: payload, ...data} = await this.#productService.getProducts(req)
        const result = { status: 'success', payload, ...data}
        res.sendSuccess(result)
    }

    getProduct = async (req, res) => {
        const { pid } = req.params
        const product = await this.#productService.getProductById(pid)
        
        res.sendSuccess(product)
    }

    addProduct = async (req, res) => {
        const { body, files, user} = req
        const newProduct = await this.#productService.addProduct(body, files, user)
        res.sendSuccess(newProduct)
    }

    updateProduct = async (req, res) => {
        const { pid } = req.params
        const {key, newValue} = req.body
        const result = await this.#productService.updateProduct(pid, key, newValue)
        res.sendSuccess(result)
    }

    deleteProduct = async (req, res) => {
        const { pid } = req.params
        const owner = req.user
        const result = await this.#productService.deleteProduct(pid, owner)
        res.sendSuccess(result)
    }

}

export default ProductsController