import { cartsService } from "../service/index.js";

export default class CartsController {
    #cartService
    constructor() {
        this.#cartService = cartsService
    }

    getCarts = async (req, res) => {
        const result = await this.#cartService.getCarts();
        res.sendSuccess(result)
    }

    getCart = async (req, res) => {
        const { cid } = req.params
        const result = await this.#cartService.getCartById(cid)
        res.sendSuccess(result)
    }

    deleteProduct = async (req, res) => {
        const {cid, pid} = req.params
        const result = await this.#cartService.deleteProduct(cid, pid)
        res.sendSuccess(result)
    }

    deleteCart = async (req, res) => {
        const {cid} = req.params
        const { type } = req.query
        
        const result = await this.#cartService.deleteCart(cid, type)
        res.sendSuccess(result)
    }
    addProduct = async (req, res) => {
        const { cid, pid } = req.params
    
        const result = await this.#cartService.addProduct(cid, pid)
        res.sendSuccess(result)
    }
    updateCart = async (req, res) => {
        const { cid } = req.params
        const result = await this.#cartService.updateCart(req.body, cid)
        res.sendSuccess(result)
    }

    purchaseCart = async (req, res) => {
        const { cid } = req.params
        const result = await this.#cartService.purchaseCart(req.user, cid)
        res.sendSuccess(result)
    }
}