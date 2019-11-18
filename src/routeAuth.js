const auth = require('./actionAuth')

const INVALID_REQUEST = 'invalid_request'
const UNAUTHORIZED_CLIENT = 'unauthorized_client'

exports.authorize = async (req, res) => {
  const clientId = req.query.client_id
  const redirectUri = req.query.redirect_uri
  const state = req.query.state

  if (!clientId || !redirectUri || !state) {
    return res.status(400).json({
      error: INVALID_REQUEST,
      message: 'client_id, redirect_uri or state' +
        ' was missing from the string query'
    })
  }
  
  const client =
    await auth.findClientRow(clientId)

  if (!client) {
    return res.status(401).json({
      error: UNAUTHORIZED_CLIENT,
      message: 'Unknown client_id'
    })
  }

  const appName =
    client.client_display_name

  // Simply redirect the request to the front
  const url = process.env.LOGIN_URL +
    '?redirect_uri=' + redirectUri +
    '&state=' + state +
    '&app_name=' + appName

  return res.redirect(302, url)
}

exports.auth = async (req, res) => {
  const clientId = req.body.client_id
  const username = req.body.username
  const password = req.body.password

  if (!clientId || !username || !password) {
    return res.status(400).json({
      error: INVALID_REQUEST,
      message: 'client_id, username or password' +
        ' was missing from the request body'
    })
  }

  const client =
    await auth.findClientRow(clientId)

  if (!client) {
    return res.status(401).json({
      error: UNAUTHORIZED_CLIENT,
      message: 'Unknown client_id'
    })
  }

  const restriction = client.client_restriction

  const authorizationCode =
      await auth.auth(restriction, username, password)

  if (!authorizationCode) {
    // Failed to auth, error
    return res.status(401).json({
      error: UNAUTHORIZED_CLIENT,
      message: 'User not found in LDAP'
    })
  }

  // TODO: Check access rights

  return res.status(200).json({
    authorization_code: authorizationCode
  })
}

exports.token = async (req, res) => {
  const clientId = req.body.client_id
  const authorizationCode = req.body.code

  if (!clientId || !authorizationCode) {
    return res.status(400).json({
      error: INVALID_REQUEST,
      message: 'client_id or code' +
        ' was missing from the request body'
    })
  }

  const client =
    await auth.findClientRow(clientId)

  if (!client) {
    return res.status(401).json({
      error: UNAUTHORIZED_CLIENT,
      message: 'Unknown client_id'
    })
  }

  const clientSecret = client.client_secret

  const authorizedRow =
    await auth.findAuthorizedRow(authorizationCode)

  if (!authorizedRow) {
    return res.status(401).json({
      error: UNAUTHORIZED_CLIENT,
      message: 'Invalid authorization_code'
    })
  }

  const { accessToken, refreshToken } =
    await auth.generateToken(clientId, clientSecret, authorizedRow)

  await auth.deleteAuthorizedRow(authorizationCode)

  return res.status(200).json({
    access_token: accessToken,
    refresh_token: refreshToken
  })
}

exports.refresh = async (req, res) => {
  const clientId = req.body.client_id
  const refreshToken = req.body.refresh_token

  if (!clientId || !refreshToken ) {
    return res.status(400).json({
      error: INVALID_REQUEST,
      message: 'client_id  or refresh_token' +
        ' was missing from the request body'
    })
  }

  const client =
    await auth.findClientRow(clientId)

  if (!client) {
    return res.status(401).json({
      error: UNAUTHORIZED_CLIENT,
      message: 'Unknown client_id'
    })
  }

  const clientSecret = client.client_secret
  
  let decoded = null

  try {
    decoded =
      await auth.verifyToken(clientId, clientSecret, refreshToken)
  } catch (ex) {
    return res.status(400).json({
      error: ex.name,
      message: ex.message
    })
  }

  const data = {
    firstname: decoded.firstname,
    lastname: decoded.lastname,
    section: decoded.section,
    role: decoded.role
  }

  const newAccessToken =
    await auth.refreshToken(clientId, clientSecret, data)

  await auth.updateRefreshToken(newAccessToken, refreshToken)

  return res.status(200).json({
    access_token: newAccessToken,
    refresh_token: refreshToken
  })
}
