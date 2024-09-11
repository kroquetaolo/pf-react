import CustomRouter from "../router.js"
import UserController from "../../controllers/users.controller.js"

export default class UsersRouter extends CustomRouter {

    init() {
        
        const {
            getAllUsersFiltered,
            switchUserRol,
            updateDocuments,
            deleteUsers
            // checkDocument
        } = new UserController()

        this.get('/', ['ADMIN'], getAllUsersFiltered)
        this.delete('/', ['ADMIN'], deleteUsers)
        this.post('/premium/:uid', ['ADMIN'], switchUserRol)
        this.postStorage('/:uid/documents', ['PREMIUM', 'ADMIN'], updateDocuments)
        // this.get('/test/:uid', ['PUBLIC'], checkDocument)

    }
}