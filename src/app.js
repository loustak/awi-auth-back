const express = require('express')
const app = express()
const authentication = require("./routes/authentication");
const bodyParser = require("body-parser");


// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// Routes
app.use('/oauth2', authentication);


app.get('/', (req, res) => {
  res.status(200).send('Homepage of the AWI auth api.')
})

module.exports = app
