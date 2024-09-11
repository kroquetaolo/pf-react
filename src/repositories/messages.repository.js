export default class MessagesRepository {
    constructor(messagesDao) {
        this.messagesDao = messagesDao;
    }

    getMessages    = async () => await this.messagesDao.getAll();
    updateMessages = async (data) => await this.messagesDao.update(data)

}