const port = 3000

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'dev'
}

console.log(`Auth server started in ${process.env.NODE_ENV}`)

require('./db').connect()
  .then( () => {
    console.log('Connected to the database')
  })
  .catch( (err) => {
    console.error(`Error when connecting to database: ${err}`)
    process.exit(-1)
  })

const app = require('./app')

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
