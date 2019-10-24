const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.status(200).send('Homepage of the AWI auth api.')
})

app.use( (req, res, next) => {
  res.status(404).send('Route not found.')
})

module.exports = app