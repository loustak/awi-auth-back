const auth = require('./actionAuth')

exports.authorize = async (req, res) => {
  const clientId = req.query.client_id
  const redirectUri = req.query.redirect_uri
  const state = req.query.state

  if (!clientId) {
    return res.status(401).json({
      error: 'Missing client_id'
    })
  }
  
  if (!redirectUri) {
    return res.status(401).json({
      error: 'Missing redirect_uri'
    })
  }

  if (!state) {
    return res.status(401).json({
      error: 'Missing state'
    })
  }

  const clientIdExists =
    await auth.clientIdExists(clientId)

  if (!clientIdExists) {
    return res.status(401).json({
      error: 'Unknown client_id'
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

  if (!username || !password || 
    username === '' || password === '') {
      return res.status(403).json({
        error: 'Inccorrect request'
      })
    }

  const valid =
      await auth.auth(username, password)

  if (!valid) {
    // Failed to auth, error
    return res.status(401).json({
      error: 'User not found in LDAP'
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
  const clientIdExists =
    await auth.clientIdExists(clientId)

  if (!clientIdExists) {
    // Error
    return
  }

  return await auth.generateToken(clientId, authorizationCode)
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
