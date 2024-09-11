import dotenv from "dotenv"
import MongoSingleton from "./singleton.mongo.js"
import WinstonLogger from "../utils/winston.logger.js"
import { commander } from "../utils/commander.js"

const { mode } = commander.opts()

dotenv.config({
    path: mode === 'development' ? './.env.development' : './.env.production' 
})

export default {
    port: process.env.PORT || 3000,
    mode: process.env.MODE,
    mongoUrl: process.env.MONGODB_URL,
    cookiePassword: process.env.COOKIE_PASSWORD,
    sessionPasword: process.env.SESSION_PASSWORD,
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
    passportClientID: process.env.PASSPORT_CLIENT_ID,
    passportClientSecret: process.env.PASSPORT_CLIENT_SECRET,
    persistance: process.env.PERSISTANCE,
    gmailPassword: process.env.GMAIL_PASSWORD,
    gmailUser: process.env.GMAIL_USER,
    adminUsername: process.env.ADMIN_USERNAME,
    adminPassword: process.env.ADMIN_PASSWORD
}

const loggerInstance = new WinstonLogger(process.env.MODE)

export const logger = () => loggerInstance.getLogger()
export const http_log_message = req => loggerInstance.getHTTPLogMessage(req)
export const connectDB = ()  =>  MongoSingleton.getInstance(process.env.MONGODB_URL)