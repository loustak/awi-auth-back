const {
  createLogger,
  format,
  transports
} = require('winston')

const {
  inProduction,
  inIntegration,
  inLocalDev
} = require('./util')

const devLogger = createLogger({
  level: 'debug',
  format: format.combine(
    format.colorize(),
    format.printf(info => `${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console()
  ]
})

const prodLogger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)

  ),
  transports: [
    new transports.Console()
  ]
})

let logger = null
if (inLocalDev()) {
  logger = devLogger
} else if (inProduction() || inIntegration()) {
  logger = prodLogger
}

logger.stream = {
  write: (message, encoding) => {
    logger.debug(message)
  }
}

module.exports = logger