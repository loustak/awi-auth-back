const port = 3000

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'dev'
}

console.log(`Auth server started in ${process.env.NODE_ENV}`)

const app = require('./app')

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
