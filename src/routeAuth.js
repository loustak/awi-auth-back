const auth = require('./actionAuth')
const jwt = require('jsonwebtoken');

exports.authorize = async (req, res) => {
  const clientId = req.query.client_id
  const redirectUri = req.query.redirect_uri
  const state = req.query.state
  const clientIdExists =
    await auth.clientIdExists(clientId)

  if (!clientIdExists) {
    // Error
    res.status(401).json({err:"Unauthorized authentication"})
  }

res.redirect(302,`http://mydash.igpolytech.fr/login?redirect_uri=${redirectUri}&state=${state}`)
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
  const clientIdExists =
    await auth.clientIdExists(clientId)

  if (!clientIdExists) {
    // Error
    return
  }

  return await auth.generateToken(clientId, authorizationCode)
}

exports.refresh = async (req, res) => {
  const clientId=req.query.client_id
  const oldRefresh=req.query.refresh_token
  const clientIdExists =
    await auth.clientIdExists(clientId)
    const refreshTokenExists =
    await auth.refreshTokenExists(oldRefresh)

  if (!clientIdExists) {
    res.status(401).json({err:"Unauthorized request"})
  }
  if(!refreshTokenExists){
    res.status(400).json({err:"Bad request"})
  }
  else {
    const token= auth.getToken(clientId,oldRefresh)
    const decoded = jwt.verify(token, 'secret');
    const userInfo = {
      first_name: decoded.first_name,
      last_name: decoded.last_name,
      section: decoded.section,
      role: decoded.role
    }
    const newToken = jwt.sign(userInfo,'secret');
    return await auth.updateToken(clientId, oldRefresh,newToken)
  }
}
