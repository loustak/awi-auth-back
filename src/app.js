const express = require('express')
const app = express()
const morgan = require('morgan')
var bodyParser = require('body-parser');

const auth = require('./routeAuth')

// Setup correct logger
if (process.env.NODE_ENV === 'prod') {
  app.use(morgan('combined'))
} else if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'))
}

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup routes
app.get('/', (req, res) => {
  res.status(200).send('Homepage of the AWI auth api.')
})

app.get('/oauth/authorize', auth.authorize)
app.post('/oauth/auth', auth.auth)
app.post('/oauth/token', auth.token)
app.post('/oauth/refresh', auth.refresh)

app.use((req, res, next) => {
  res.status(404).send('Route not found.')
})

module.exports = app
