const db = require('./db')

exports.clientIdExists = async (clientId) => {
  // Return true if the clientId exists in the database,
  // else return false.
}

exports.findAuthorizeCode = async (authorizeCode) => {
  // Return the line in the database matching this
  // authorizationCode, if noone was found return false.
}

exports.auth = async (username, password) => {
  // Verify user authentication in the LDAP and
  // if valid, create an authorization_code to
  // register in the database along with user's infos.
  // If the user is authentified return the authorization code,
  // else return false.
}

exports.generateToken = async (clientId, authorizationCode) => {
  // Create a JWT access_token containing user infos.
  // Delete the given authorizationCode from the database.

  const row = await this.findAuthorizeCode(authorizationCode)

  if (!row) {
    // authorizationCode not found, errror
    return
  }

  return {
    accessToken: '',
    refreshToken: ''
  }
}

exports.refreshToken = async (clientId, refreshToken) => {
  return {
    accessToken: '',
    refreshToken: ''
  }
}
