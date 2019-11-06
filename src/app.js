const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.status(200).send('Homepage of the AWI auth api.')
})
app.post('/oAuth2/token', (req, res) => {
  //  post the token
})

app.post('/oauth2/authorization', (req, res) => {
  // post the authorization code
})
app.get('/oauth2/authorize', (req, res) => {
  //  get client authorization request
})

app.get('/oauth2/tokenRequest', (req, res) => {
  //  get token request
})

app.get('/oauth2/authentication', (req, res) => {
  //  get authentication request
})

app.use((req, res, next) => {
  res.status(404).send('Route not found.')
})

module.exports = app
