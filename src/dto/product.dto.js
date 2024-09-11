export default class ProductDTO {
    constructor(product) {
        this.title       = product.title
        this.description = product.description
        this.price       = product.price
        this.stock       = product.stock
        this.thumbnail   = product.thumbnail || ['default_thumbnail.jpg'],
        this.owner       = product.owner,
        this.status      = true
    }
}