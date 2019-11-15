const auth = require('./actionAuth')


exports.authorize = async (req, res) => {
  const clientIdExists =
    await auth.clientIdExists(clientId)

  if (!clientIdExists) {
    // Error
    return
  }

  // Simply redirect the request to the front.
}

exports.auth = async (req, res) => {
  const valid = await auth.auth(username, password)
  if (!valid) {
    // Failed to auth, error
    return
  }

  // Notify the front that the authentication
  // succeeded and return the authorizationCode,
  // see with Alia
  const authorizationCode = valid
}

exports.token = async (req, res) => {

  clientId = req.params.client_id
  authorizationCode = req.params.code
  if(!clientId || !authorizationCode){
    return res.status(400).json({ error: 'invalid_request' })
  }
  const clientIdExists = 
    await auth.clientIdExists(clientId)

  if (!clientIdExists) {
    // Error
    return res.status(401).json({ error: 'unauthorized_client' })
  }

  const authorizationCodeExists =
    await auth.findAuthorizeCode(authorizationCode)

  if(!authorizationCodeExists){
    // Error
    return res.status(403).json({ error: 'invalid_grant'})
  }

  return await auth.generateToken(clientId, authorizationCodeExists)
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
