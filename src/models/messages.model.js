import { Schema, model } from 'mongoose'

const messagesSchema = new Schema({
    user: String,
    message: String
})

export const messagesModel = model('chat', messagesSchema)