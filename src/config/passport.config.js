import passport from 'passport';
import GithubStrategy from 'passport-github2'
import { ExtractJwt, Strategy } from 'passport-jwt';
import config, { logger } from './config.js';
import { usersService } from '../service/index.js';
import { host } from '../server.js';

const JWTStrategy = Strategy;
const JWTExtract = ExtractJwt;

const { jwtPrivateKey, passportClientID, passportClientSecret } = config

const cookieExtractor = req => {
    let token = null;
    if(req && req.cookies) token = req.cookies['token']
    return token
}

export const initializePassport = () => {

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: JWTExtract.fromExtractors([cookieExtractor]),
        secretOrKey: jwtPrivateKey
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload) 
        } catch (error) {
            return done(error)
        }
    }))

    passport.use('github', new GithubStrategy({
        clientID: passportClientID,
        clientSecret: passportClientSecret,
        callbackURL: `https://${host}/api/sessions/githubcallback`
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await usersService.getUserBy({email: profile._json.email});
            if(!user) {
                const newUser = {
                    first_name: profile._json.login,
                    email: profile._json.email
                }
                const result = await usersService.createUser(newUser);
                done(null, result.result);
            } else {
                done(null, user);
            }
        } catch (error) {
            logger().error('error: ' + error.message);
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await usersService.getUserBy({_id: id});
            done(null, user)
        } catch (error) {
            done(error)
        }
    })

}