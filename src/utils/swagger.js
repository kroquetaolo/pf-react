import swaggerJsdoc from 'swagger-jsdoc';
import { __dirname } from '../path.js';
import swaggerUiExpress from 'swagger-ui-express';

export default class SwaggerUtil {
    app
    constructor(app){
        this.app = app;
    }

    init() {
        const spects = swaggerJsdoc(this.options())
        this.app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(spects))
    }

    options() {
        return {
            definition: {
                openapi: '3.0.1',
                info: {
                    title: 'Documentation for ShopFruit',
                    description: 'api designed to work with ecommers shopfruit'
                },
            },
            apis: [`${__dirname}/docs/**/*.yaml`]
        }
    }

}