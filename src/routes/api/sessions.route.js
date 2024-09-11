import passport from "passport";
import CustomRouter from "../router.js";
import SessionsController from "../../controllers/sessions.controller.js";

export default class ProductsRouter extends CustomRouter {

    init() {

        const {
            getGitHubCallback,
            getRegister,
            getLogin,
            getLogout,
            getCurrent,
            getLostPassword,
            getResetPasswords,
        } = new SessionsController()

        this.get('/github', ['PUBLIC'], passport.authenticate('github', {scope: 'user:email'}), async (req, res)=>{})
        this.get('/githubcallback', ['PUBLIC'], passport.authenticate('github', {failureRedirect: '/failed'}), getGitHubCallback)

        this.post('/register', ['PUBLIC'], getRegister)
        this.post('/login', ['PUBLIC'], getLogin)
        this.get('/logout', ['PUBLIC'], getLogout)
        this.get('/current', ['USER', 'PREMIUM', 'ADMIN'], getCurrent)
        this.post('/lostpassword', ['PUBLIC'], getLostPassword)
        this.post('/resetpassword', ['PUBLIC'], getResetPasswords)
    }

}