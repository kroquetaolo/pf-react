import { Router } from "express";

import ViewsRouter from './views.route.js';
import CartsRouter from './api/carts.route.js';
import ProductsRouter from './api/products.route.js';
import SessionsRouter from './api/sessions.route.js';
import UsersRouter from './api/users.route.js';
import TestsRouter from './api/tests.route.js';
import ProfilesRouter from './profile.route.js';

const router = Router();

const viewsRouter = new ViewsRouter()
const cartsRouter = new CartsRouter()
const productsRouter = new ProductsRouter()
const sessionsRouter = new SessionsRouter()
const usersRouter = new UsersRouter()
const testsRouter = new TestsRouter()
const profilesRouter = new ProfilesRouter()

router.use('/api/carts', cartsRouter.getRouter())
router.use('/api/products', productsRouter.getRouter())
router.use('/api/sessions', sessionsRouter.getRouter())
router.use('/api/users', usersRouter.getRouter())
router.use('/api/test', testsRouter.getRouter())

router.use('/profile', profilesRouter.getRouter())
router.use('/', viewsRouter.getRouter())

export default router