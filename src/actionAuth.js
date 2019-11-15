var ldap = require('ldapjs');
var uuid = require('uuid');

const ldap_port = 389;
const ldap_host = 'ldap://srvdc.isim.intra';

exports.clientIdExists = async (clientId) => {
  // Return true if the clientId exists in the database,
  // else return false.
}

exports.findAuthorizeCode = async (authorizeCode) => {
  // Return the line in the database matching this
  // authorizationCode, if noone was found return false.
}

/*exports.auth = async (username, password) => {
  // Verify user authentication in the LDAP and
  // if valid, create an authorization_code to
  // register in the database along with user's infos.
  // If the user is authentified return the authorization code,
  // else return false.
}*/

exports.auth = function (username, password) {
  return new Promise((resolve) => {
    connectAuth().then((response) => {
      response.bind(username + '@isim.intra', password, (err) => {
        if (!username || username === '' || typeof username === 'undefined' ||
          !password || password === '' || typeof password === 'undefined') {
          resolve(false)
        }
        else {
          if (err === null) {
            const auth_code = uuid.v4()
            pool.query('INSERT INTO "user" VALUES ('+userid+','+firstname+','+lastname+','+section+','+role+')')
            pool.query('INSERT INTO authorization_code VALUES ('+auth_code+','+clientid+','+userid+')')
            resolve(auth_code)
          }
          else {
            resolve(false)
          }
        }
      })
    })
  })
}

exports.connectAuth = function () {
  return new Promise((resolve) => {
    resolve(ldap.createClient({
      url: ldap_host + ':' + ldap_port
    }))
  })
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