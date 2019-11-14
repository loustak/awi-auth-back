var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var ldap = require('ldapjs');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const ldap_port = 389;
const ldap_host = 'ldap://srvdc.isim.intra';

app.get('/', (req, res) => {
  res.status(200).send('Homepage of LDAP Auth.')
});

app.get('/super', (req, res) => {
  res.status(200).send('Homepage of super.')
});

app.post('/auth', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  var clientLdap = ldap.createClient({
    url: ldap_host + ':' + ldap_port
  });

  clientLdap.bind(username+'@isim.intra', password, function (err) {
    //check if undefined
    if (username == '' || password == '' || !username || !username) {
      res.status(422).send('Champs requis incomplets')
    } else {
      if( err === null) {
        res.status(200).send('Authentification réussie')
  
      } else {
        res.status(401).send('Authentification échouée, erreur \n')
      }
    }
  })
});

app.use((req, res, next) => {
  res.status(404).send('Route not found.')
});

app.listen(port);
console.log('Server started! At http://localhost:' + port);

module.exports = app

/*clientLdap.search('', {}, function (err, res) {
  if (err) {
    console.log('Error occurred while ldap search');
  } else {
    res.on('searchEntry', function (entry) {
        console.log('Entry', JSON.stringify(entry.object));
    });
    res.on('searchReference', function (referral) {
        console.log('Referral', referral);
    });
    res.on('error', function (err) {
        console.log('Error is', err);
    });
    res.on('end', function (result) {
        console.log('Result is', result);
    });
  }
})*/