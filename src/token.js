const jwt = require('jsonwebtoken')

const issuer = 'cd355bb5-00ff-4f1b-8f43-3ad69f6f6dea'

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

exports.getAccessToken = async (clientId, clientSecret, data) => {

  const signOption = {
    issuer: issuer,
    audience: clientId,
    expiresIn: '1h'
  }

  return await sign(data, clientSecret, signOption)
}

exports.getRefreshToken = async (clientId, clientSecret, data) => {

  const signOption = {
    issuer: issuer,
    audience: clientId,
    expiresIn: '30d'
  }

  return await
    sign(data, clientSecret, signOption)
}

exports.getTokens = async (clientId, clientSecret, data) => {
  return {
    accessToken: await
      this.getAccessToken(clientId, clientSecret, data),
    refreshToken: await
      this.getRefreshToken(clientId, clientSecret, data)
  }
}