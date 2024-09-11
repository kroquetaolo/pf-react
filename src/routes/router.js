import { Router } from 'express'
import passport from 'passport'
import { http_log_message, logger } from '../config/config.js'
import multer from 'multer'
import storage from '../config/multer.config.js'

export default class CustomRouter {
    constructor() {
        this.router = Router()
        this.init()
        
    }

    getRouter() {
        return this.router
    }

    authenticateUser = (req, res, next) => {
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) return next(err);
            if (user) {
                req.user = user.user;
                res.locals.user = user.user;
            }
            next();
        })(req, res, next);
    };

    setRequestUrls = (req, res, next) => {
        res.locals.url = req.get('host');
        res.locals.current_url = req.originalUrl.split('?')[0];;
        next()
    }

    setLogger = (req, res, next) => {
        req.logger = logger()
        req.logger.http(http_log_message(req))
        next()
    }

    handlePolicies(policies) {
        return (req, res, next) => {
            if(policies[0] === 'PUBLIC') return next();
            if(!req.user) return res.render('errors/error', {type: 'user error', error: 'Not authorized'})
            if(!policies.includes(req.user.rol.toUpperCase())) return res.render('errors/error', {type: 'rol error', error: 'No permission'})
            next()
        }
    }

    setMulter(storage) {
        return multer({storage}).array('uploaded_file', 5)
    }

    applyCallbacks(callbacks) {
        return callbacks.map(callback => async (...params) => {
            try {
                await callback.apply(this, params)
            } catch (error) {
                const error_message = error.cause || error;
                params[1].render('errors/error', { type: 'error', error: error_message });
                
            }
        })
    }

    customResponse(req, res, next) {
        res.sendSuccess = payload => res.send({status: 'success', payload})
        next()
    } 

    get(path, policies, ...callbacks) {
        this.router.get(path, this.setLogger, this.setRequestUrls, this.authenticateUser, this.handlePolicies(policies), this.customResponse, this.applyCallbacks(callbacks))
    }

    postStorage(path, policies, ...callbacks) {
        this.router
            .post(path,
                this.setLogger,
                this.setRequestUrls,
                this.authenticateUser,
                this.handlePolicies(policies),
                this.customResponse,
                this.setMulter(storage),
                this.applyCallbacks(callbacks)
            )
    }

    post(path, policies, ...callbacks) {
        this.router
            .post(path,
                this.setLogger,
                this.setRequestUrls,
                this.authenticateUser,
                this.handlePolicies(policies),
                this.customResponse,
                this.applyCallbacks(callbacks)
            )
    }

    put(path, policies, ...callbacks) {
        this.router.put(path, this.setLogger, this.setRequestUrls, this.authenticateUser, this.handlePolicies(policies), this.customResponse, this.applyCallbacks(callbacks))
    }
    delete(path, policies, ...callbacks) {
        this.router.delete(path, this.setLogger, this.setRequestUrls, this.authenticateUser, this.handlePolicies(policies), this.customResponse, this.applyCallbacks(callbacks))
    }

    init() {}

}