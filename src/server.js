import express from 'express';

import cors from 'cors'
import passport from 'passport';
import { Server } from 'socket.io'
import { __dirname } from './path.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import handlebars from 'express-handlebars';
import config, { logger } from './config/config.js'
import appRouters from './routes/index.js'

import { initializePassport } from './config/passport.config.js';
import ChatSocket from './sockets/chat.socket.js'
import { helpers } from './utils/helpers.js';
import SwaggerUtil from './utils/swagger.js';

const app = express()

const { port, mongoUrl, cookiePassword, sessionPasword } = config
export let host;

const httpServer = app.listen(port, error => {
    if(error) logger().error(error.message)
    const { address, port } = httpServer.address();
    host = address === '::' ? 'localhost' : address;
    const server_address = `${host}:${port}`;
    logger().info(`Escuchando en ${server_address}`);
})

new SwaggerUtil(app).init()

const socketServer = new Server(httpServer);
app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+'/public'))

app.use(cookieParser(cookiePassword))
app.use(session({
    store: MongoStore.create({mongoUrl, ttl: 60*23 }),
    secret: sessionPasword,
    resave: true,
    saveUninitialized: true
}))

initializePassport()

new ChatSocket(socketServer).init()

app.use(passport.initialize())
app.use(appRouters)

app.engine('hbs', handlebars.engine({ extname: '.hbs', helpers }))

app.set('views', __dirname+'/views')
app.set('view engine', 'hbs')