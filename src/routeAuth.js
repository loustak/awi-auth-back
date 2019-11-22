const URL = require('url').URL

const auth = require('./actionAuth')

const errcode = require('./errcode')
const {
  getAccessToken,
  getTokens,
  verifyToken
} = require('./token')

/*
 * This file expose all the routes related
 * to authentication.
 */

/*
 * Redirect the caller to the login page.
 * This is the start point of the auth process.
 */
exports.authorize = async (req, res) => {
  const clientId = req.query.client_id
  const redirectUri = req.query.redirect_uri
  const state = req.query.state

  if (!clientId || !redirectUri || !state) {
    return res.status(400).json({
      error: errcode.INVALID_REQUEST,
      message: 'client_id, redirect_uri or state' +
        ' was missing from the string query'
    })
  }

  const client =
    await auth.findClientRow(clientId)

  if (!client) {
    return res.status(401).json({
      error: errcode.UNAUTHORIZED_CLIENT,
      message: 'Unknown client_id'
    })
  }

  const appName =
    client.client_display_name

  const authorizedHosts =
    client.client_hosts.split(' ')

  // Check that the redirect_uri match the
  // client_domain inside the database
  const decodedURI = decodeURIComponent(redirectUri)

  let hostname = null
  try {
    hostname = new URL(decodedURI).hostname
  } catch (ex) {
    return res.status(400).json({
      error: errcode.INVALID_REQUEST,
      message: 'invalid URI, don\'t forget to add' +
        ' the http or https in the redirect_uri'
    })
  }

  if (!hostname || hostname === '') {
    return res.status(400).json({
      error: errcode.INVALID_REQUEST,
      message: 'redirect_uri has an invalid uri format'
    })
  }

  // Check that the host is either local or
  // an authorized hostname as defined in the
  // database
  const hostIsValid =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname === '[::1]' ||
    authorizedHosts.includes(hostname)

  if (!hostIsValid) {
    return res.status(400).json({
      error: errcode.UNAUTHORIZED_CLIENT,
      message: 'The hostname of the redirect_uri is' +
        ' not an authorized hostname for this client'
    })
  }

  // Simply redirect the request to the
  // login page in the front end
  const url = process.env.LOGIN_URL +
    '?client_id=' + clientId +
    '&redirect_uri=' + redirectUri +
    '&state=' + state +
    '&app_name=' + appName

  return res.redirect(302, url)
}

/*
 * Check the usernmae and password by
 * using LDAP. If the authentication is successfull
 * the route return an authorization_code else,
 * it returns a 401 code with an error code set
 * to UNAUTHORIZED_CLIENT.
 *
 * It check that the client_id exists, it is
 * to retrieve the client_secret.
 *
 * This route is mostly used by the
 * login page in the front,
 */
exports.auth = async (req, res) => {
  const clientId = req.body.client_id
  const username = req.body.username
  const password = req.body.password

  if (!clientId || !username || !password ||
    username === '' || password === '') {
    return res.status(400).json({
      error: errcode.INVALID_REQUEST,
      message: 'client_id, username or password' +
        ' was missing from the request body'
    })
  }

  const client =
    await auth.findClientRow(clientId)

  if (!client) {
    return res.status(401).json({
      error: errcode.UNAUTHORIZED_CLIENT,
      message: 'Unknown client_id'
    })
  }

  const restriction = client.client_restriction

  const data =
      await auth.auth(restriction, username, password)

  if (!data.success) {
    // There was an error
    switch (data.errcode) {
      case errcode.LDAP_ERROR:
        return res.status(500).json({
          error: data.errcode,
          message: data.message
        })
      case errcode.LDAP_TIMEOUT:
        return res.status(500).json({
          error: data.errcode,
          message: data.message
        })
      case errcode.LDAP_USER_NOT_FOUND:
        return res.status(401).json({
          error: data.errcode,
          message: data.message
        })
      case errcode.AUTH_RESTRICTION:
        return res.status(401).json({
          error: data.errcode,
          message: data.message
        })
      default:
        return res.status(500).json({
          error: data.errcode,
          message: 'Unknown error'
        })
    }
  }

  return res.status(200).json({
    code: data.code
  })
}

/*
 * Generate an access_token and a refresh_token
 * given an code generated by the /auth route.
 *
 * The access_token can be used to authenticate
 * trough the API. The validity of the access_token
 * is short, around 1 hour.
 *
 * The refresh token is used to refresh the
 * acces_token. The validity of the refresh_token
 * is long, around three months.
 *
 * When the refresh_token expires you need to
 * restart the auth process with the
 * /authorize route.
 */
exports.token = async (req, res) => {
  const clientId = req.body.client_id
  const authorizationCode = req.body.code

  if (!clientId || !authorizationCode) {
    return res.status(400).json({
      error: errcode.INVALID_REQUEST,
      message: 'client_id or code' +
        ' was missing from the request body'
    })
  }

  const client =
    await auth.findClientRow(clientId)

  if (!client) {
    return res.status(401).json({
      error: errcode.UNAUTHORIZED_CLIENT,
      message: 'Unknown client_id'
    })
  }

  const clientSecret = client.client_secret

  const authorizedRow =
    await auth.findAuthorizedRow(authorizationCode)

  if (!authorizedRow) {
    return res.status(401).json({
      error: errcode.UNAUTHORIZED_CLIENT,
      message: 'Invalid code'
    })
  }

  const data = {
    ...authorizedRow,
    code: undefined
  }

  const { accessToken, refreshToken } =
    await getTokens(clientId, clientSecret, data)

  await auth.deleteAuthorization(authorizationCode)

  return res.status(200).json({
    access_token: accessToken,
    refresh_token: refreshToken
  })
}

/*
 * Get a new access_token from a refresh_token.
 */
exports.refresh = async (req, res) => {
  const clientId = req.body.client_id
  const refreshToken = req.body.refresh_token

  if (!clientId || !refreshToken) {
    return res.status(400).json({
      error: errcode.INVALID_REQUEST,
      message: 'client_id  or refresh_token' +
        ' was missing from the request body'
    })
  }

  const client =
    await auth.findClientRow(clientId)

  if (!client) {
    return res.status(401).json({
      error: errcode.UNAUTHORIZED_CLIENT,
      message: 'Unknown client_id'
    })
  }

  const clientSecret = client.client_secret

  let decoded = null

  try {
    decoded =
      await verifyToken(clientId, clientSecret, refreshToken)
  } catch (ex) {
    return res.status(400).json({
      error: ex.name,
      message: ex.message
    })
  }

  const data = {
    firstname: decoded.firstname,
    lastname: decoded.lastname,
    email: decoded.email,
    role: decoded.role,
    section: decoded.section
  }

  const newAccessToken =
    await getAccessToken(clientId, clientSecret, data)

  return res.status(200).json({
    access_token: newAccessToken,
    refresh_token: refreshToken
  })
}
