const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  database: 'db',
  port: 5432
})

pool.on('error', (err, client) => {
  console.error(`Unexcepted error on client ${client}: ${err}`)
})

module.exports = pool