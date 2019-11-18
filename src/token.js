const jwt = require('jsonwebtoken')

/*
 * This file handle all tokens operations.
 * The idea was to wrap jwt functions inside
 * promises to make async calls.
 */

/*
 * This is our issuer id, clients must validate this
 * when checking their tokens.
 *
 * TODO: Maybe we should put this in an environnement
 * variable and have it different in the dev & prod ?
 */
const issuer = 'cd355bb5-00ff-4f1b-8f43-3ad69f6f6dea'

/*
 * Sign a token, use the jwt.sign function but using
 * promises to make async calls.
 */
function sign(data, clientSecret, signOption) {
  return new Promise( (resolve, reject) => {
    jwt.sign(data, clientSecret, signOption, (err, token) => {
      if (err) {
        return reject(err)
      }

      return resolve(token)
    })
  })
}


/*
 * Verify a token asynchroniously.
 * This must be used for any given token from client.
 */
exports.verifyToken = async (clientId, clientSecret, token) => {
  return new Promise( (resolve, reject) => {
    jwt.verify(token, clientSecret, {
      issuer: issuer,
      audience: clientId
    }, (err, decoded) => {
      if (err) {
        return reject(err)
      }

      return resolve(decoded)
    })
  })
}

/*
 * Generate an access token asynchorniously.
 */
exports.getAccessToken = async (clientId, clientSecret, data) => {
  const signOption = {
    issuer: issuer,
    audience: clientId,
    expiresIn: '1h'
  }

  return await sign(data, clientSecret, signOption)
}

/*
 * Generate a refresh token asynchorniously.
 */
exports.getRefreshToken = async (clientId, clientSecret, data) => {
  const signOption = {
    issuer: issuer,
    audience: clientId,
    expiresIn: '30d'
  }

  return await
    sign(data, clientSecret, signOption)
}

/*
 * Generate an access token and a refresh token asynchorniously.
 */
exports.getTokens = async (clientId, clientSecret, data) => {
  return {
    accessToken: await
      this.getAccessToken(clientId, clientSecret, data),
    refreshToken: await
      this.getRefreshToken(clientId, clientSecret, data)
  }
}
