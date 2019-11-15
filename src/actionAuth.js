const db = require('./db')

exports.clientIdExists = async (clientId) => {
  // Return true if the clientId exists in the database,
  // else return false.
  const { rows } = await db.pool.query('SELECT * FROM client WHERE "client_id"=$1', [clientId])
  return rows.rowCount===1
}

exports.findAuthorizeCode = async (authorizeCode) => {
  // Return the line in the database matching this
  // authorizationCode, if noone was found return false.
  const { rows } = await db.pool.query('SELECT * FROM authorization_code WHERE "authorization_code"=$1', [authorizeCode])
  if(rows.rowCount==1) 
  {
    return rows[1]
  }
  else return null
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

exports.refreshToken = async (clientId, refreshToken) => {

  return {
    accessToken: '',
    refreshToken: ''
  }
}
exports.updateToken= async (clientId, oldRefresh,newToken) => {

 await db.pool.query('UPDATE authorization_code SET "access_token"=$1 WHERE "client_id"=$2 AND "refresh_token"=$3 ', [newToken,clientId,oldRefresh],(err,res)=>
 {
   if(err) {
console.log(err)
 }
 })
}
 exports.getToken= async (clientId, oldRefresh) => {

  const { rows }= await db.pool.query('SELECT access_token FROM token WHERE "refresh_token"=$1 AND "client_id"=$2', [oldRefresh,clientId])
   return rows[0].access_token
}
