const db = require('./db')
const jwt = require('jsonwwebtoken')

exports.clientIdExists = async (clientId) => {
  // Return true if the clientId exists in the database,
  // else return false.
}

exports.userIdExists = async (userId) => {
  const row = await db.query(
    `SELECT *
   FROM user where 
   userId = $1`,[userId])

  // Return the row in the database matching this
  // authorizationCode, if noone was found return false.
  if(row.length <= 0) false
  else row[0]
}

exports.findAuthorizeCode = async (authorizeCode) => {

  const row = await db.query(
    `SELECT *
   FROM authorization_code where 
   authorization_code = $1`,[authorizeCode])

  // Return the row in the database matching this
  // authorizationCode, if noone was found return false.
  if(row.length <= 0) false
  else row[0]

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

const userIdExists = this.userIdExists(authorizationCode.user_id)
if(!userId){
  //Error
  return 
}
const userInfo = {
  first_name: userIdExists.first_name,
  last_name: userIdExists.last_name,
  section: userIdExists.section,
  role: userIdExists.role
}

//Private and public key
const privateKEY  = fs.readFileSync('./private.key', 'utf8');
const publicKEY  = fs.readFileSync('./public.key', 'utf8');

//Token signing options
var signOptions = {
  issuer: clientId,
  audience: userIdExists.userId,
  algorithm: 'RS256',
  expiresIN: 10 * 60
}
const accessToken = jwt.sign(userInfo, privateKEY, signOptions)


  return {
    accessToken: accessToken,
    refreshToken: ''
  }
}

exports.refreshToken = async (clientId, refreshToken) => {

  return {
    accessToken: '',
    refreshToken: ''
  }
}