const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'db',
  password: 'postgres',
  port: 5432
})

module.exports = function existsClient (client_id) {
  pool.query(`SELECT * FROM client WHERE "client_id"=${client_id}`, (err, res) => {
    if (!err) {
      return res.rowCount === 1
    }
  })
}
module.exports = function existRefreshToken (client_id, refreshToken) {
  pool.query(`SELECT * FROM client WHERE "client_id"=${client_id}` + ` AND "refresh_token"=${refreshToken}`, (err, res) => {
    if (!err) {
      return res.rowCount === 1
    }
  })
}

module.exports = function existsCode (code, client_id) {
  pool.query(`SELECT * FROM code WHERE "client_id"=${client_id}` + `AND "value_code"=${code}`, (err, res) => {
    if (!err) {
      return res.rowCount === 1
    }
  })
}

module.exports = function setCode (client_id, code) {
  pool.query(`INSERT INTO code (value_code, client_id)
    VALUES(` + `${code}` + `${client_id})`, (err, res) => {
    if (err) {
      console.log(err)
    }
    pool.end()
  })
}
module.exports = function setToken (client_id, token, refreshToken) {
  pool.query(`INSERT INTO token (value_token , refresh_token,client_id)
    VALUES(` + `${token}` + `${refreshToken}` + `${client_id})`, (err, res) => {
    if (err) {
      console.log(err)
    }
    pool.end()
  })
}

module.exports = function deleteCode (client_id, code) {
  pool.query(`DELETE FROM code WHERE "client_id"=${client_id} AND "value_code"=${code}`, (err, res) => {
    if (err) {
      console.log(err)
    }
    pool.end()
  })
}

module.exports = function deleteToken (client_id, refreshToken) {
  pool.query(`DELETE FROM token WHERE "client_id"=${client_id}` + `AND "refresh_token"=${refreshToken}`, (err, res) => {
    if (err) {
      console.log(err)
    }
    pool.end()
  })
}
