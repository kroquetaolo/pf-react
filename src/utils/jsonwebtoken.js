import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const generateUserToken = user => jwt.sign({ user }, config.jwtPrivateKey, { expiresIn: '24h' })

export const generatePasswordToken = user => jwt.sign({ user }, config.jwtPrivateKey, { expiresIn: '1h' })

export const validToken = token => {
    let decoded;
    try {
        decoded = jwt.verify(token, config.jwtPrivateKey)
    } catch (error) {
        decoded = false
    }
    return decoded
}