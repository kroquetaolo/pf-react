import ProductsController from '../../controllers/products.controller.js';
import CustomRouter from '../router.js';

export default class ProductsRouter extends CustomRouter {

    init() {

        const {
            getProducts,
            getProduct,
            addProduct,
            updateProduct,
            deleteProduct
        } = new ProductsController()

        this.get('/', ['PUBLIC'], getProducts)
        this.get('/:pid', ['PUBLIC'], getProduct)
        this.postStorage('/', ['ADMIN', 'PREMIUM'], addProduct)
        this.put('/:pid', ['ADMIN'], updateProduct)
        this.delete('/:pid', ['ADMIN', 'PREMIUM'], deleteProduct)

    }
}