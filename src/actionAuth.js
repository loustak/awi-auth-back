const uuid = require('uuid')

const errcode = require('./errcode')
const {
  ldap,
  createLDAPClient
} = require('./ldap')
const mockedAuth = require('./mockAuth')
const db = require('./db')

/*
 * Select the client row in the database
 * from a given clientId
 */
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

/*
 * Find an authorization row in the
 * database given an authorization code
 */
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

/*
 * Save and authorization access
 * in the database
 */
exports.saveAuthorization = (code, data) => {
  const sql = `
    INSERT INTO authorization_code
    VALUES ($1, $2, $3, $4, $5, $6)
  `

  const args = [
    code,
    data.firstname,
    data.lastname,
    data.section,
    data.role,
    data.email
  ]

  return db.query(sql, args)
}

/*
 * Remove an authorization access
 * from the database
 */
exports.deleteAuthorization = (authorizationCode) => {
  const sql = `
    DELETE
    FROM authorization_code
    WHERE "code"=$1
  `

  return db.query(sql, [authorizationCode])
}

/*
 * Check that the given username and password
 * match an account in the LDAP then
 * validate the given restrictions.
 *
 * restriction = 0 means everyone can connect.
 * restriction = 1 means only students can connect.
 * restriction = 2 means only teachers and admin can connect.
 */
exports.auth = async (restriction, username, password) => {
  username = username.toLowerCase()

  const userMocked =
    mockedAuth(username, password)

  if (userMocked) {
    if ((restriction == 0) ||
        (restriction == 1 && userMocked.role == 'student') ||
        (restriction == 2 && userMocked.role == 'teacher') ||
        (restriction == 2 && userMocked.role == 'admin')) {
      const code = uuid.v4()
      await this.saveAuthorization(code, userMocked)
      return resolve({
        success: true,
        code: code
      })
    }
  }

  return new Promise((resolve, reject) => {
    const client = createLDAPClient()

    client.on('error', () => {
      return resolve({
        success: false,
        errcode: errcode.LDAP_ERROR,
        message: 'An error happened while reaching the LDAP'
      })
    })

    client.on('connectTimeout', () => {
      return resolve({
        success: false,
        errcode: errcode.LDAP_TIMEOUT,
        message: 'The connection to the LDAP timed out'
      })
    })

    // TODO: Use real LDAP data
    // TODO: Check restrictions

    client.bind(username + '@isim.intra', password, async (err) => {
      if (err) {
        if (err instanceof ldap.InvalidCredentialsError) {
          return resolve({
            success: false,
            errcode: errcode.LDAP_USER_NOT_FOUND,
            message: 'User not found in the LDAP'
          })
        }

        return resolve({
          success: false,
          errcode: errcode.LDAP_ERROR,
          message: 'An error happened while reaching the LDAP'
        })
      }

      if (restriction !== 0 && restriction !== 1) {
        return resolve({
          success: false,
          errcode: errcode.AUTH_RESTRICTION,
          message: 'This user is not allowed to log in this app'
        })
      }

      const code = uuid.v4()
      const data = {
        firstname: username.split('.')[0],
        lastname: username.split('.')[1],
        email: username + '@etu.umontpellier.fr',
        role: 'student',
        section: 'ig5'
      }

      await this.saveAuthorization(code, data)

      return resolve({
        success: true,
        code: code
      })
    })
  })
}
