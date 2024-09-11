import { usersService } from "../service/index.js";

class UsersController {
    #usersService
    constructor() {
        this.#usersService = usersService
    }

    getUsers = async (req, res) => {
        const result = await this.#usersService.getAll()
        res.sendSuccess(result)
    }

    getAllUsersFiltered = async (req, res) => {
        const result = await this.#usersService.getAllUsersFiltered()
        res.sendSuccess(result)
    }

    deleteUsers = async (req, res) => {
        const thirty_mins = new Date(Date.now() - 30 * 60 * 1000);
        const result = await this.#usersService.deleteUsers({
            last_connection: { $lt: thirty_mins },
            rol: 'user'
        })
        res.sendSuccess(result)
    }

    switchUserRol = async (req, res) => {
        const { uid } = req.params
        const result = await this.#usersService.switchUserRol(uid)
        res.sendSuccess(result)
    }

    updateDocuments = async (req, res) => {

        const { type, document_type } = req.body
        const filter = { type, document_type } 
        const file = req.files && req.files.length > 0 ? req.files[0] : null
        const result = await this.#usersService.updateDocuments(filter, file, req.user, req.params.uid)

        res.sendSuccess(result)
        
    }

    checkDocument = async (req, res) => {
        const user_id = req.params.uid
        const result = await this.#usersService.checkDocument(user_id)
        res.sendSuccess(result)
    }
}

export default UsersController