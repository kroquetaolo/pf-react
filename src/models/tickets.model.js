import { Schema, model } from "mongoose";

const colection_name = "tickets";
const schema = new Schema({
    code: {
        type: String,
        unique: true
    },
    purchase_datetime: Date,
    amount: Number,
    purchaser: String

})

export const ticketsModel = model(colection_name, schema )