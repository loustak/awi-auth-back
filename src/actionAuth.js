const uuid = require('uuid')

const { createLDAPClient } = require('./ldap')
const db = require('./db')

exports.clientIdExists = async (clientId) => {
  // Return true if the clientId exists in the database,
  // else return false.
  const sql = `
    SELECT *
    FROM client
    WHERE "client_id"=$1
  `
  const { rows } =
    await db.query(sql, [clientId])
  return rows.length === 1
}

exports.findAuthorizeCode = async (authorizeCode) => {
  // Return the line in the database matching this
  // authorizationCode, if noone was found return false.
  const sql = `
    SELECT *
    FROM authorization_code
    WHERE "code"=$1
  `
  const { rows } = await
    db.query(sql, [authorizeCode])
  
  if (rows.rowCount === 1) {
    return rows[1]
  }

  return null
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

    const client = createLDAPClient()

    client.on('error', (err) => {
      return reject(err)
    })

    client.on('connectTimeout', (err) => {
      return reject(err)
    })

    client.bind(username + '@isim.intra', password, async (err) => {
      if (err) {
        return reject(err)
      }

      const authorizationCode = uuid.v4()
      const sql = `
        INSERT INTO authorization_code (code, first_name)
        VALUES ($1, $2)
      `

      await db.query(sql, [authorizationCode, username])
        .catch(ex => reject(ex))

      return resolve(authorizationCode)
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
