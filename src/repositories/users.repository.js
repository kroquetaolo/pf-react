export default class UsersRepository {
    constructor(usersDao) {
        this.usersDao = usersDao;
    }

    getUsers            = async () => await this.usersDao.getAll()
    getAllUsersFiltered = async () => await this.usersDao.getAllFiltered()
    deleteUsers         = async (filter) => await this.usersDao.delete(filter)
    createUser          = async (user) => await this.usersDao.create(user)
    getUserPopulate     = async (_id) => await this.usersDao.getPopulated(_id)
    getUserBy           = async (filter) => await this.usersDao.getBy(filter)
    changeUserPassword  = async (user, password) => await this.usersDao.changePassword(user, password)
    switchUserRol       = async (uid) => await this.usersDao.switchRol(uid)
    updateConnection    = async (uid) => await this.usersDao.updateConnection(uid)
    updateDocuments     = async (filter, file, req_user, param_user_id) => await this.usersDao.updateDocuments(filter, file, req_user, param_user_id)
    checkDocument       = async (uid) => await this.usersDao.checkDocument(uid)
}