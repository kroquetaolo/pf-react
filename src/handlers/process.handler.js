import { generateProducts } from "../utils/products.js"

process.on('message', message => {
    let products = []
    for (let i = 0; i < 100; i++) {
        products.push(generateProducts())
    }
    process.send(products)
})