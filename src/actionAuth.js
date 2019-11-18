const uuid = require('uuid')
const {
  getTokens,
  verifyToken,
  getAccessToken
} = require('./token')

const {
  ldap,
  createLDAPClient
} = require('./ldap')
const db = require('./db')

exports.findClientRow = async (clientId) => {
  const sql = `
    SELECT *
    FROM client
    WHERE "client_id"=$1
  `
  const { rows } =
    await db.query(sql, [clientId])

  if (rows.length === 1) {
    return rows[0]
  }

  return null
}

exports.findAuthorizedRow = async (authorizationCode) => {
  const sql = `
    SELECT *
    FROM authorization_code
    WHERE "code"=$1
  `

  const { rows } =
    await db.query(sql, [authorizationCode])
  
  if (rows.length === 1) {
    return rows[0]
  }

  return null
}

exports.deleteAuthorizedRow = async (authorizationCode) => {
  const sql = `
    DELETE
    FROM authorization_code
    WHERE "code"=$1
  `

  return await db.query(sql, [authorizationCode])
}

exports.saveAuthorizationCode = async (code, data) => {
  const sql = `
    INSERT INTO authorization_code
    VALUES ($1, $2, $3, $4, $5)
  `

  const args = [
    code, data.firstname, data.lastname, data.section, data.role
  ]

  return await db.query(sql, args)
}

exports.saveTokens = async(tokens) => {
  const sql = `
    INSERT INTO token
    VALUES ($1, $2)
  `

  return await
    db.query(sql, [tokens.accessToken, tokens.refreshToken])
}

exports.updateRefreshToken =
  async (newAccessToken, refreshToken) => {
  const sql = `
    UPDATE token
    SET access_token=$1
    WHERE refresh_token=$2
  `

  return await
    db.query(sql, [newAccessToken, refreshToken])
}

exports.verifyToken = async (clientId, clientSecret, token) => {
  const decoded =
    await verifyToken(clientId, clientSecret, token)

  return decoded
}

exports.auth = async (restriction, username, password) => {
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
        if (err instanceof ldap.InvalidCredentialsError) {
          return resolve(false)
        }

        return reject(err)
      }

      // TODO: Check restrictions

      const authorizationCode = uuid.v4()
      const data = {
        firstname: username
      }

      await this.saveAuthorizationCode(authorizationCode, data)

      return resolve(authorizationCode)
    })
  })
}

exports.generateToken =
  async (clientId, clientSecret, authorizedRow) => {

  const data = {
    ...authorizedRow,
    code: undefined
  }

  const tokens =
    await getTokens(clientId, clientSecret, data)

  await this.saveTokens(tokens)

  return tokens
}

exports.refreshToken =
  async (clientId, clientSecret, data) => {

  const accessToken = 
    await getAccessToken(clientId, clientSecret, data)

  return accessToken
}
