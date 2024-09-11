export default class TestsController {
    constructor() {

    }

    getSimpleTest = (req, res) =>{
        let sum = 0
        for (let i = 0; i < 1e6; i++) {
            sum += i
        }

        res.sendSuccess({restul: 'suma simple ' + sum})
    }

    
    getComplexTest = (req, res) =>{
        let sum = 0
        for (let i = 0; i < 9e9; i++) {
            sum += i
        }

        res.sendSuccess({restul: 'suma compleja ' + sum})
    }

    getLoggerTest = (req, res) => {
        req.logger.fatal('testing')
        req.logger.error('testing')
        req.logger.warning('testing')
        req.logger.info('testing')
        req.logger.http('testing')
        req.logger.debug('testing')

        res.render('errors/error', {type: 'error', error: 'this endpoint is for console development only ;D'})

    }

}