export default class CartsRepository {
    constructor(cartsDao) {
        this.cartsDao = cartsDao
    }

    getCarts        = async () => await this.cartsDao.getAll()
    newCart         = async () => await this.cartsDao.new()
    updateCart      = async (cart, cart_id) => await this.cartsDao.update(cart, cart_id)
    addProduct      = async (cart_id, product_id) => await this.cartsDao.add(cart_id, product_id)
    getCartById     = async (cart_id) => await this.cartsDao.getById(cart_id)
    getCartPopulate = async (cart_id) => await this.cartsDao.getPopulate(cart_id)
    deleteCart      = async (cart_id, type) => await this.cartsDao.delete(cart_id, type)
    deleteProduct   = async (cart_id, product_id) => await this.cartsDao.remove(cart_id, product_id)
    purchaseCart    = async (user, cart_id) => await this.cartsDao.purchase(user, cart_id) 

}