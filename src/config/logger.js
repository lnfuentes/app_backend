const winston = require('winston');
const {ENVIROMENT} = require('../config/config.js');

let logger;

const levelOptions = {
    levels:{
        debug: 5,
        http: 4,
        info: 3,
        warning: 2,
        error: 1,
        fatal: 0
    },
    colors:{
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'white'
    }
}

if (ENVIROMENT === 'DEV') {
    console.log('Desarrollo');
    logger = winston.createLogger({
        levels: levelOptions.levels,
        transports: [
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize({colors: levelOptions.colors}),
                    winston.format.simple()
                )
            })
        ]
    })
} else {
    console.log('Produccion');
    logger = winston.createLogger({
        levels: levelOptions.levels,
        transports: [
            new winston.transports.Console({
                level: 'info',
                format: winston.format.combine(
                    winston.format.colorize({colors: levelOptions.colors}),
                    winston.format.simple()
                )
            }),
            new winston.transports.File({
                filename: 'logs/errors.log',
                level: 'error'
            })
        ]
    })
}

const addLogger = (req, res, next) => {
    req.logger = logger;
    next();
}

module.exports = addLogger;