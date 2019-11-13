const Pool = require('pg').Pool

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db',
    password: 'postgres',
    port: 5432,
  })


  module.exports = function existsClient(client_id){
pool.query(`SELECT * FROM client WHERE "client_id"=${client_id}`,(err,res)=>{
    return res.rowCount==1
})
}

module.exports = function existsCode(code,client_id){
    pool.query(`SELECT * FROM code WHERE "client_id"=${client_id}`+`AND "value_code"=${code}`,(err,res)=>{
        return res.rowCount==1
    })
    }

module.exports = function setCode(client_id,code){
pool.query(`INSERT INTO code (value_code, client_id)
    VALUES(`+`${code}`+`${client_id})`, (err, res) => {
        console.log(err, res.rowCount)
        pool.end()
      })

}
module.exports = function setToken(client_id,token,refreshToken){
    pool.query(`INSERT INTO token (value_token , refresh_token,client_id)
    VALUES(`+`${token}`+`${refreshToken}`+`${client_id})`, (err, res) => {
        console.log(err, res.rowCount)
        pool.end()
      })

  }
 
  