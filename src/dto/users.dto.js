export default class UserDto {
    constructor(user) {
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.email = user.email
        this.password = user.password
        this.age = user.age
        this.cart = user.cart
        this.fullname = `${user.first_name} ${user.last_name}`
    }
}