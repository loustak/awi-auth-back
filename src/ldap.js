const ldap = require('ldapjs')

// This URL allow us to connect to LDAP
// on a non Polytech network
const ldapHost = 'ldap://162.38.114.8'
const ldapPort = 389
const url = `${ldapHost}:${ldapPort}`

exports.createLDAPClient = () => {
  return ldap.createClient({
    url: url,
    timeout: 5000,
    connectTimeout: 5000
  })
}

exports.ldap = ldap
