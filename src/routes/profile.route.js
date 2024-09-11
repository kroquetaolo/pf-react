import CustomRouter from './router.js';
import { productsService } from '../service/index.js'

export default class ProfilesRouter extends CustomRouter {
    init() {

        this.get('/', ['USER', 'PREMIUM', 'ADMIN'], async (req, res) => {
            const isPremium = req.user?.rol.toUpperCase() === 'PREMIUM'
            res.render('profile/user-home', {
                isPremium
            })
        })

        this.get('/newproduct', ['PREMIUM', 'ADMIN'], async (req, res) => {
            res.render('profile/new-product')
        })

        this.get('/products', ['PREMIUM', 'ADMIN'], async (req, res) => {
            const owner = req.user.email
            const products = await productsService.getProductBy({ owner })
            res.render('profile/user-products', { products })
        })
        this.get('/edit', ['USER', 'PREMIUM', 'ADMIN'], async (req, res) => {
            res.render('profile/edit-profile', { user_id: req.user._id })
        })

    }
}