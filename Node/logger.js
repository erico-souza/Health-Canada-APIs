
// Bimal Bhagrath
// MODULE: api request log manger

const winston = require('winston');
const logsConfig = require('./config').LOGS;

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: 'info.log',
      handleExceptions: true,
      json: true
    }),
    new winston.transports.File({
      level: 'error',
      filename: 'err.log',
      handleExceptions: true,
      json: true
    })
  ],
  exitOnError: false
});

module.exports = logger;

exports.infoStream = {
  write: (message, enc) => {
    logger.info(message);
  }
};

exports.errStream = {
  write: (message, enc) => {
    logger.error(message);
  }
};
