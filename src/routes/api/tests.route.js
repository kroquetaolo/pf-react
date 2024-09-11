import CustomRouter from "../router.js"
import TestsController from "../../controllers/test.controller.js"
import compression from "express-compression";

export default class TestsRouter extends CustomRouter {
    init() {

        this.getRouter().use(compression())

        const {
            getSimpleTest,
            getComplexTest,
            getLoggerTest,

        } = new TestsController();

        this.get('/simple', ['ADMIN'], getSimpleTest)
        this.get('/complex', ['ADMIN'], getComplexTest)
        this.get('/loggerTest', ['ADMIN'], getLoggerTest)
    }

}