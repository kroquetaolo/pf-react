import config, { connectDB, logger } from '../config/config.js'

export async function services() {

    let CartsDao, MessagesDao, ProductsDao, UsersDao, TicketsDao

    switch(config.persistance) {
        // case 'MEMORY':
        //     break;
        // case 'FS':
        //     break;
        default: //MONGODB
            logger().info('default connection');
            connectDB()

            const { default: CartsDaoMongo } = await import("./MONGODB/carts.dao.js");
            const { default: MessagesDaoMongo } = await import("./MONGODB/messages.dao.js");
            const { default: UsersDaoMongo } = await import("./MONGODB/users.dao.js");
            const { default: ProductsDaoMongo } = await import("./MONGODB/products.dao.js");
            const { default: TicketsDaoMongo } = await import("./MONGODB/tickets.dao.js");

            MessagesDao = MessagesDaoMongo
            ProductsDao = ProductsDaoMongo
            UsersDao = UsersDaoMongo
            CartsDao = CartsDaoMongo
            TicketsDao = TicketsDaoMongo

            break;
    }

    return { CartsDao, MessagesDao, ProductsDao, UsersDao, TicketsDao}
}