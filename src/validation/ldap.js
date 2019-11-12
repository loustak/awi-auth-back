var ldap = require('ldapjs');


  var client = ldap.createClient({
    url: 'ldap://162.38.114.8:389',

});

result="";
client.bind("soufiane.benchraa", "=", function(err) {
  if (err) {
    result += "Reader bind failed " + err;
  }
  result += "Reader bind succeeded\n";
  return result;

})