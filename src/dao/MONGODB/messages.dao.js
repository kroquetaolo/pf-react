import { messagesModel } from '../../models/messages.model.js';

export default class MessagesDao {

    constructor() {
        this.model = messagesModel;
    }

    async getAll() {
        const result = await this.model.find({})
        return result
    }

    async update(data) {
        try {
            await this.model.create({user: data.user, message: data.message});
        } catch (error) {
            console.error(error.message)
        }
    }

}