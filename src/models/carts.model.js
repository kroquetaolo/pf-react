import { Schema, model } from 'mongoose'

const colection_name = 'carts'
const schema = new Schema({
    products: {
        type: [{
            product_id: {
                type: String,
                ref: 'products'
            },
            quantity: Number,
            _id: false
        }]
    }
})

schema.pre(['findOne'], function(){
    this.populate('products.product_id')
})

export const cartsModel = model(colection_name, schema)