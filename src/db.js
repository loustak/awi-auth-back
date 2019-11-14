const Pool = require('pg').Pool
const { inProd } = require('./util')

let pool = null

if (inProd()) {
  pool = new Pool({
    connectionString: process.env.DATABSE_URL
  })
} else {
  pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    hostname: 'localhost',
    database: 'db',
    port: 5432
  })
}

pool.on('error', (err, client) => {
  console.error(`Unexcepted error on client ${client}: ${err}`)
})

module.exports = pool