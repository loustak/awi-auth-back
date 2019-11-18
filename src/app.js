const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const { inProduction, inTest } = require('./util')
const logger = require('./logger')
const auth = require('./routeAuth')

// Disable the X-Powered-By header info
app.disable('x-powered-by')

// Setup correct logger depending
// on environnement
if (inProduction()) {
  app.use(morgan('combined', {
    "stream": logger.stream 
  }))
} else if (!inTest()) {
  app.use(morgan('dev', {
    "stream": logger.stream
  }))
}

// Allow all request to access this server
app.use(cors())
app.options('*', cors())

// Setup form url decoder
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// Setup routes
app.get('/', (req, res) => {
  res.status(200).json({
    success: 'working',
    message: 'The authentication API is working'
  })
})

const fasync = route =>
  (req, res, next) =>
    Promise.resolve(route(req, res)).catch(next)

app.get('/authorize', fasync(auth.authorize))
app.post('/auth', fasync(auth.auth))
app.post('/token', fasync(auth.token))
app.post('/refresh', fasync(auth.refresh))

app.use((req, res, next) => {
  res.status(404).json({
    error: 'route_not_found',
    message: 'Route was not found'
  })
})

app.use((err, req, res, next) => {
  logger.error(err.stack)

  res.status(500).json({
    error: 'server_error'
    message: 'Something broke!'
  })
})

module.exports = app
