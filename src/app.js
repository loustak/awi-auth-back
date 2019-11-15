const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const { inProduction, inTest } = require('./util')
const auth = require('./routeAuth')

// Setup correct logger
if (inProduction()) {
  app.use(morgan('combined'))
} else if (!inTest()) {
  app.use(morgan('dev'))
}

// Allow all request to access this server
app.use(cors())

// Setup form url decoder
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// Setup routes
app.get('/', (req, res) => {
  res.status(200).json({
    success: 'Homepage of the AWI auth api.'
  })
})

const fasync = route =>
  (req, res, next) =>
    Promise.resolve(route(req, res)).catch(next)

app.get('/oauth/authorize', fasync(auth.authorize))
app.post('/oauth/auth', fasync(auth.auth))
app.post('/oauth/token', fasync(auth.token))
app.post('/oauth/refresh', fasync(auth.refresh))

app.use((req, res, next) => {
  res.status(404).json({
    error: 'Route not found.'
  })
})

app.use((err, req, res, next) => {
  console.error(err)

  res.status(500).json({
    error: 'Something broke!'
  })
})

module.exports = app
