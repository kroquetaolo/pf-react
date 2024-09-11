import CustomRouter from './router.js';

import { productsService, cartsService, usersService } from '../service/index.js'
import compression from 'express-compression';

import { fork } from 'child_process'
import { validToken } from '../utils/jsonwebtoken.js';

export default class viewsRouter extends CustomRouter {
    init() {

        this.getRouter().use(compression())

        this.get('/', ['PUBLIC'], (req, res) => {
            const home_items = [{
                    title: 'welcome',
                    description: "Explore our selection of high-quality products. If you need assistance, we're here to help.",
                    items: [ {title: 'products', description: 'una descrip', url: 'products'}],
                }
            ]
            if(!req.user) {
                home_items.push({
                    title: 'auth',
                    description: "Don't have an account yet? Already have an account?",
                    items: [
                        { title: 'register',  description: 'una descrip', url: 'register'},
                        { title: 'login',     description: 'una descrip', url: 'login'}
                    ]
                })
            } else {
                home_items.push({
                    title: 'Account',
                    description: "Check your profile here, become premium or update you profile picture",
                    items: [
                        { title: 'Profile',  description: 'una descrip', url: 'profile'},
                    ]
                })
            }
            if(req.user?.rol?.toUpperCase() === 'ADMIN') {
                home_items.push({
                    title: 'Admin',
                    description: 'you can... blablabla',
                    items: [
                        { title: 'users',       description: 'una descrip', url: 'users'},
                        { title: 'mock',        description: 'una descrip', url: 'mockingproducts'},
                        // { title: 'simple',          description: 'una descrip', url: 'api/test/'},
                        { title: 'logger',      description: 'una descrip', url: 'api/test/loggerTest'}
                    ]
                })
            }
            res.render('home', { home_items })

            
        })
    
        this.get('/products', ['PUBLIC'], async (req, res) => {
            
            const { docs: products , ...data } = await productsService.getProducts(req)

            res.render('products', {
                title: 'Products', products, ...data
            })
            
        })
        
        this.get('/products/:product_id', ['USER', 'PREMIUM', 'ADMIN'], async (req, res) => {
            const {product_id} = req.params;
            const { title, price, description, category, _id } = await productsService.getProductById(product_id)
            if(!_id){
                res.render('errors/notfound') 
            } else {
                res.render('products-detail', {
                    title, price, description, category, _id
                })
            }
        })
        
        this.get('/carts/:cid', ['USER', 'PREMIUM', 'ADMIN'], async (req, res) => {
            const { cid } = req.params;
            const cart = await cartsService.getCartPopulate(cid);
            cart.products.forEach(product => product.cart_id = cid)
            res.render('carts', {
                carts: cart.products,
                cart_id: cid
            })
            
        })
        
        this.get('/chat', ['USER', 'PREMIUM', 'ADMIN'], (req, res) => {
            res.render('chat')
        })
        
        this.get('/register', ['PUBLIC'], (req, res) => {
            if(req.user) {
                res.redirect('/')
            } else {
                res.render('auth/register')
            }
        })
        
        this.get('/login', ['PUBLIC'], (req, res) => {
            if(req.user) {
                res.redirect('/')
            } else {
                res.render('auth/login')
            }
        })
        
        this.get('/users', ['ADMIN'], async (req, res) => {
            const users = await usersService.getUsers()
            res.render('users', {
                users
            })
        })

        this.get('/mockingproducts', ['ADMIN'], (req, res) => {

            const child = fork('./src/handlers/process.handler.js')
            child.send('generating product mocking')
            child.on('message', products => {
                res.render('products', {
                    title: 'products from mocking product',
                    products,
                    isMockProduct: true
                })
            })
        })

        this.get('/lostpassword', ['PUBLIC'], (req, res) => res.render('auth/lostpassword'))

        this.get('/resetpassword', ['PUBLIC'], (req, res) => {
            const { token } = req.query
            if(validToken(token)) {
                res.render('auth/resetpassword', { token })
            } else {
                res.redirect('/lostpassword')
            }
        })

        this.get('*', ['PUBLIC'], (req, res) => res.render('errors/notfound'))

    }
}