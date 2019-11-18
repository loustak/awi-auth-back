const uuid = require('uuid')
const {
  getTokens,
  verifyToken
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

exports.saveAuthorization = async (code, data) => {
  const sql = `
    INSERT INTO authorization_code
    VALUES ($1, $2, $3, $4, $5)
  `

  const args = [
    code, data.firstname, data.lastname, data.section, data.role
  ]

  return await db.query(sql, args)
}

exports.deleteAuthorization = async (authorizationCode) => {
  const sql = `
    DELETE
    FROM authorization_code
    WHERE "code"=$1
  `

  return await db.query(sql, [authorizationCode])
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

      const code = uuid.v4()
      const data = {
        firstname: username
      }

      await this.saveAuthorization(code, data)

      return resolve(code)
    })
  })
}
