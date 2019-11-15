const ldap = require('ldapjs')
var uuid = require('uuid')

const db = require('./db')

const ldapHost = 'ldap://srvdc.polytech.umontpellier.fr'
const ldapPort = 389

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

  return new Promise( (resolve, reject) => {
    if (!username || !password || 
      username === '' || password === '') {
        return resolve(false)
      }

    const client = ldap.createClient({
      url: `${ldapHost}:${ldapPort}`
    })

    client.on('error', (err) => {
      if (err.errno === 'ENOTFOUND' &&
        err.syscall === 'getaddrinfo') {
          console.error('This error may happen when you are not on the same' + 
            ' network as the Polytech LDAP, you can use a VPN to fix this')
      }

      return reject(err)
    })

    client.bind(username + '@isim.intra', password, (err) => {
      if (err) {
        return reject(err)
      }

      const authorizationCode = uuid.v4()
      const sql = `
        INSERT INTO authorization_code (code, first_name)
        VALUES ($1, $2)
      `

      db.query(sql, [authorizationCode, username])
      resolve(authorizationCode)
    })
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
