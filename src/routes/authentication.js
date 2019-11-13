const express = require('express')
const router = express.Router()
const uid = require('./utils/utilities')
const databaseHandler = require('../database/databaseHandler')

router.post('/token', (req, res) => {
  // get query
  const client_id = req.query.client_id
  const code = req.query.code

  if (!client_id || !code) {
    res.status(400).json({ error: 'Bad request' })
  } else if (!databaseHandler.existsCode(code, client_id)) {
    res.status.json({ error: 'Parameter not found' })
  } else {
    const token = uid(40)
    const refreshToken = uid(40)
    databaseHandler.setToken(client_id, token, refreshToken)
    databaseHandler.deleteCode(client_id, code)
    res.json({
      access_token: token,
      refresh_token: refreshToken
    })
  }
})

router.get('/authorize', (req, res) => {
  const client_id = req.query.client_id
  const redirect_uri = req.query.redirect_uri
  const state = req.query.state
  if (!client_id || !redirect_uri || !state) {
    res.status(400).json({ error: 'Missing Parameters' })
  } else if (!databaseHandler.existsClient(client_id)) {
    res.json({ error: 'Client not found' })
  } else {
    const codeAuth = uid(20)
    databaseHandler.setCode(client_id, codeAuth)
    const redirectUri = redirect_uri + `/?authorization_code=${codeAuth}` + `state=${state}`
    res.res.json({ code: codeAuth, state: state })
    res.redirect(redirectUri)
  }
})

router.post('/refresh', (req, res) => {
  const client_id = req.query.client_id
  const refreshToken = req.query.token
  if (!client_id || !refreshToken) {
    res.status(400).json({ error: 'Bad request' })
  }// check in database
  else if (!databaseHandler.existsRefreshToken(client_id, refreshToken)) {
    res.json({ error: 'Parameter not found' })
  } else {
    const refToken = uid(40)
    const token = uid(40)
    databaseHandler.setToken(client_id, token, refToken)
    databaseHandler.deleteToken(client_id, refreshToken)
    res.json({
      access_token: token,
      refresh_token: refToken
    })
  }
})

module.exports = router
