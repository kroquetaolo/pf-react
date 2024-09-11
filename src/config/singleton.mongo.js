import { connect } from "mongoose"
import { logger } from "./config.js"

export default class MongoSingleton {
    static #instance
    constructor(mongoUrl) {
        connect(mongoUrl)
    }
    static getInstance = (mongoUrl) => { 
        if(this.#instance) {
            logger().info('Base de datos ya se conectó')
            return this.#instance
        } 
        this.#instance = new MongoSingleton(mongoUrl)
        logger().info('Se conectó a la base de datos')
        return this.#instance
    }
}