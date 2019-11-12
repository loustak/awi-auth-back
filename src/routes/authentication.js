const express = require("express");
const router = express.Router();
const uid=require('./utils/utilities')
const validateLoginInput=require("../validation/login")

router.post('/token', (req, res) => {
    //Check both in database
  })

router.get('/authorize', (req, res) => {
    const client_id= req.query.client_id
    const redirect_uri= req.query.redirect_uri
    const state= req.query.state
    if(!client_id || !redirect_uri || !state)
    {
      res.status(400).json({err:"Missing Parameters"})
    }
    else {
      ///checkclient in database 
      //insert in database
      const redirectUri="token?"+`authorization_code=${codeAuth}`+`state=${state}`
      res.redirect(redirectUri)
      res.render.json({ code:codeAuth,state:state
      })
    }

  })



  router.post('/refresh', (req, res) => {
     
    //  get token request
  })

  router.post('/auth', (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);

     // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

    if(!username || !password) {

    }
    else {
      const codeAuth=uid(20)
      //send 
    }
  })

  module.exports = router;

  