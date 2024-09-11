import UsersRepository from "../repositories/users.repository.js";
import ProductsRepository from "../repositories/products.repository.js";
import MessagesRepository from "../repositories/messages.repository.js";
import CartsRepository from "../repositories/carts.repository.js";
import TicketsRepository from "../repositories/tickets.repository.js";

import { services } from "../dao/factory.js";
const { CartsDao, MessagesDao, ProductsDao, UsersDao, TicketsDao } = await services()

export const productsService = new ProductsRepository(new ProductsDao())
export const messagesService = new MessagesRepository(new MessagesDao())
export const ticketsService = new TicketsRepository(new TicketsDao())
export const cartsService = new CartsRepository(new CartsDao(productsService, ticketsService, productsService))
export const usersService = new UsersRepository(new UsersDao(cartsService))