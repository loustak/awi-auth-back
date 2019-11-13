const express = require('express')
const router = express.Router()
const uid = require('./utils/utilities')
const databaseHandler =require('../database/databaseHandler')

router.post('/token', (req, res) => {
  // get query 
  const client_id=req.query.client_id
  const code=req.query.code
  const contentType= req.query.content-Type
  if (!client_id || !code || !contentType ||contentType!= "application/x-www-form-urlencoded"){
    res.status(400).json({error:"Bad request"})
  }
  else if(!databaseHandler.existsCode(code,client_id)){

  res.status.json({error:"Parameter not found"})

  }
  else {
    const token = uid(40)
    const refreshToken= uid(40)
    databaseHandler.setToken(client_id,token,refreshToken)
    res.json({
      "token":token,
      "refreshToken":refreshToken,
    })
  }
})

router.get('/authorize', (req, res) => {
  const client_id = req.query.client_id
  const redirect_uri = req.query.redirect_uri
  const state = req.query.state
  if (!client_id || !redirect_uri || !state) {
    res.status(400).json({ error: 'Missing Parameters' })
  }
   else if (!databaseHandler.existsClient(client_id)){
    res.json({error:'Client not found'})
  }
  {
    const codeAuth = uid(20)
    databaseHandler.setCode(client_id,code)
    const redirectUri = redirect_uri + `/?authorization_code=${codeAuth}` + `state=${state}`
    res.res.json({ code: codeAuth, state: state })
    res.redirect(redirectUri)
  }
})

router.post('/refresh', (req, res) => {
  const client_id=req.query.client_id
  const refreshToken=req.query.token
  if(!client_id || !refreshToken){
    res.status(400).json({error: "Bad request"})

  }//check in database
  else if (!databaseHandler.existsToken(client_id,token)){
    res.json({error:"Parameter not found"})
  }
  else {
    const refToken = uid(40)
    const token = uid(40)
    databaseHandler.setToken(client_id,token,refToken)
    res.json({
      "Token":token,
      "RefreshToken":refToken
    })

  }
})


module.exports = router
