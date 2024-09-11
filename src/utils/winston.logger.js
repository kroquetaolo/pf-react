import winston from 'winston';

export default class WinstonLogger {
    #logger
    constructor(mode) {
        this.mode = mode;
    }

    getHTTPLogMessage(req)  {
        const date = new Date();
        const formatted_time = date.toLocaleTimeString('es-ES', { hour12: false });        
        return `[${formatted_time}] ${req.method} en ${req.originalUrl}`;
    }

    getLogger() {
        if(this.#logger) {
            return this.#logger
        } else {
            const custom_levels_options = {
                levels: { fatal: 0    , error: 1,        warning: 2,        info: 3,      http: 4,       debug: 5 },
                colors: { fatal: "bold red", error: "red", warning: "yellow", info: "blue", http: "white", debug: "gray" }
            }
            this.#logger = winston.createLogger({
                levels: custom_levels_options.levels,
                transports: [
                    new winston.transports.Console({
                        level: this.mode === 'development' ? 'debug' : 'info',
                        format: winston.format.combine(
                            winston.format.colorize({ colors: custom_levels_options.colors}),
                            winston.format.simple()
                        )
                    }),
                    new winston.transports.File({
                        filename: './logs/errors.log',
                        level: 'error',
                        format: winston.format.simple()
                    })
                
                ]
            })
            return this.#logger
        }
    }

}