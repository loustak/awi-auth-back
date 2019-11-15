const { inProduction, inIntegration } = require('./util')
const port = 3000

if (!process.env.APP_ENV) {
  process.env.APP_ENV = 'dev'
}

console.log(`Auth server started in ${process.env.APP_ENV}`)

// Check that the DB connection works
require('./db').connect()
  .then(() => {
    console.log('Connected to the database')
  })
  .catch((err) => {
    console.error(`Error when connecting to database: ${err}`)

    if (inProduction() || inIntegration()) {
      process.exit(-1)
    }
  })

const client = require('./ldap').createLDAPClient()

client.on('error', (err) => {
  console.error(err)

  if (inProduction() || inIntegration()) {
    process.exit(-2)
  }
})

client.on('connectTimeout', (err) => {
  console.error('Connection timed out, LDAP server cannot be reached')
  console.error('This error may happen when you are not on the same' + 
    ' network as the Polytech LDAP, you can use a VPN to fix this')

  if (inProduction() || inIntegration()) {
    process.exit(-3)
  }
})

client.bind('test@isim.intra', 'test', (err) => {
  if (err) {
    console.error(err)
  } else {
    console.log('Connected to LDAP')
  }
})

const app = require('./app')

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})