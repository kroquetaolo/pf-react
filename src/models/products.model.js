import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const colection_name = 'products'
const schema = new Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: Array,
    stock: Number,
    status: Boolean,
    category: String,
    owner: String
})

schema.plugin(mongoosePaginate)

export const productsModel = model(colection_name, schema)