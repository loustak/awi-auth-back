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
      message: 'client_id, redirect_uri or state was missing from the string query'
    })
  }
  
  const clientIdExists =
    await auth.clientIdExists(clientId)

  if (!clientIdExists) {
    return res.status(401).json({
      error: UNAUTHORIZED_CLIENT,
      message: 'Unknown client_id'
    })
  }

  // Simply redirect the request to the front
  const url = process.env.LOGIN_URL +
    '?redirect_uri=' + redirectUri +
    '&state=' + state

  return res.redirect(302, url)
}

exports.auth = async (req, res, next) => {
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) {
      return res.status(400).json({
        error: INVALID_REQUEST,
        message: 'username or password was missing from the request body'
      })
    }

  const valid =
      await auth.auth(username, password)

  if (!valid) {
    // Failed to auth, error
    return res.status(401).json({
      error: UNAUTHORIZED_CLIENT,
      message: 'User not found in LDAP'
    })
  }

  // Notify the front that the authentication
  // succeeded and return the authorizationCode,
  // see with Alia
  const authorizationCode = valid

  res.status(200).json({
    authorization_code: authorizationCode
  })
}

exports.token = async (req, res) => {
  const clientId = req.body.client_id
  const authorizationCode = req.body.code
  const clientSecret = req.body.client_secret

  if (!clientId || !authorizationCode || !clientSecret) {
    return res.status(400).json({
      error: INVALID_REQUEST,
      message: 'client_id, code or client_secret was missing from the request body'
    })
  }

  const clientIdExists =
    await auth.clientIdExists(clientId)

  if (!clientIdExists) {
    return res.status(401).json({
      error: UNAUTHORIZED_CLIENT,
      message: 'Unknown client_id'
    })
  }

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
  const clientIdExists =
    await auth.clientIdExists(clientId)

  if (!clientIdExists) {
    // Error
    return
  }

  return await auth.refreshToken(clientId, refreshToken)
}
