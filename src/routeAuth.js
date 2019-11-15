const auth = require('./actionAuth')

exports.authorize = async (req, res) => {
  const clientIdExists =
    await auth.clientIdExists(clientId)

  if (!clientIdExists) {
    // Error
  }


  // Simply redirect the request to the front.
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
