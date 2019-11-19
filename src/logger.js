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
    format.printf(info => {
      return `[${info.level}] ${info.message}`
    })
  ),
  transports: [
    new transports.Console()
  ]
})

const prodLogger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp(),
    format.printf(info => {
      return `${info.timestamp} [${info.level}] ${info.message}`
    })

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
} else {
  logger = devLogger
}

logger.stream = {
  write: (message, encoding) => {
    logger.debug(message.trim())
  }
}

module.exports = logger
