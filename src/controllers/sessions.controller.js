import { host } from "../server.js"
import { CustomError } from "../service/errors/custom.error.js"
import { EError } from "../service/errors/enums.js"
import { generateUserError } from "../service/errors/info.js"
import { usersService } from "../service/index.js"
import { createHash, isValidPassword } from "../utils/bcrypt.js"
import { sendEmail } from "../utils/email.js"
import { generatePasswordToken, generateUserToken, validToken } from "../utils/jsonwebtoken.js"

class SessionsController {
    #userService
    constructor() {
        this.#userService = usersService
    }

    getGitHubCallback = async (req,res) =>{
        res.locals.user = req.user
        const token = generateUserToken({
            _id: req.user._id,
            first_name: req.user.first_name,
            email: req.user.email,
            cart: req.user.cart,
            rol: 'user'
        })
        res.cookie('token', token, { maxAge: 60*60*60*24, httpOnly: true }).redirect('/')
    }

    getRegister = async (req, res) => {
        
        const { first_name, last_name, email, age, password } = req.body
    
        if (!first_name || !last_name || !email || !age || !password) {
            CustomError.createError({
                name: 'Registration Failure',
                cause:  generateUserError( {first_name, last_name, email, age, password}),
                message: 'Error registering the user',
                code: EError.INVALID_TYPE_ERROR
            })
        }
        const exist = await this.#userService.getUserBy({email})
        if(exist) {
            CustomError.createError({
                name: 'Registration Failure',
                cause:  'User already exists',
                message: 'Error registering the user',
                code: EError.USER_ALREADY_EXIST_ERROR
            })
        }
        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password)
        }

        const { result } = await this.#userService.createUser(newUser)
        const token = generateUserToken({
            _id: result._id,
            first_name,
            last_name,
            email,
            age,
            cart: result.cart,
            rol: 'user'
        })
        res.cookie('token', token, { maxAge: 60*60*60*24, httpOnly: true }).redirect('/')
    }

    getLogin = async (req, res) => {
        const { email, password } = req.body
        if(!email || !password) return res.render('errors/error', {error: 'All parameters required', type: 'Login'})
        const valid_user = await this.#userService.getUserBy({email})
    
        if(!valid_user) return res.render('errors/error', {error: 'User not found', type: 'Login'})
        if(!isValidPassword(password, valid_user)) return res.render('errors/error', {error: 'Invalid password', type: 'Login'})
    
        const { _id, first_name, last_name,cart, age, rol } = valid_user
        const token = generateUserToken({
            _id,
            first_name,
            last_name,
            email,
            age,
            cart,
            rol
        })
        
        await this.#userService.updateConnection(_id)
        res.cookie('token', token, { maxAge: 60*60*60*24, httpOnly: true }).redirect('/')
    }

    getLogout = async (req, res) => {
        res.cookie('token', null, { expires: new Date(0) });
        const id = req.user?._id
        if(id) await this.#userService.updateConnection(id)
        res.redirect('/')
    }

    getCurrent = async (req, res) => {
        let result = { }
        if(res.locals.user) {
            result.user = res.locals.user 
            const cart = await this.#userService.getUserPopulate(res.locals.user._id)
            result.cart = cart[0].cart
        }
        res.sendSuccess(result)
    }

    getLostPassword = async (req, res) => {
        const { email } = req.body
        if(!email) return res.render('errors/error', {error: 'All parameters required', type: 'Login'})
        const valid_user = await this.#userService.getUserBy({ email })
        if(!valid_user) return res.render('errors/error', {error: 'User not found', type: 'password lost'})

        const token = generatePasswordToken({ email })

        sendEmail({
            from: 'Equipo de cuentas FruitShop',
            to: email,
            subject: `Tu código de un solo uso`,
            html: `
                <button
                style="font-weight: bold; padding: 10px 20px; border-radius: 5px; border: none; cursor: pointer;" 
                > <a href="https://${host}/resetpassword/?token=${token}"> Click para cambiar contraseña  </a></button>
            `
        })
        res.sendSuccess({success: `${token}`})

    }

    getResetPasswords = async (req, res) => {
        const { new_password, token } = req.body;

        const valid_token = validToken(token)
        if(!valid_token) return res.render('errors/error', {error: 'The token is not valid', type: 'password reset'})

        const email = valid_token.user.email

        const valid_user = await this.#userService.getUserBy({ email })
        if(!valid_user) return res.render('errors/error', {error: 'User not found', type: 'password reset'})
        if(isValidPassword(new_password, valid_user)) return res.render('errors/error', {error: 'cannot be the same password', type: 'password reset'})

        const result = await this.#userService.changeUserPassword(valid_user._id, createHash(new_password))
        res.sendSuccess(result)

    }

}

export default SessionsController