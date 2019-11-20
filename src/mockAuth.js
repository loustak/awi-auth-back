
const users = [
  {
    username: 'arnaud',
    password: 'arnaud',
    email: 'arnaud@umontpellier.fr',
    firstname: 'Arnaud',
    lastname: 'Castelltort',
    role: 'teacher',
    section: ''
  }, {
    username: 'corinne',
    password: 'corinne',
    email: 'corinne@umontpellier.fr',
    firstname: 'Corinne',
    lastname: 'Seguin',
    role: 'teacher',
    section: ''
  }, {
    username: 'helene',
    password: 'helene',
    email: 'helene@umontpellier.fr',
    firstname: 'Helene',
    lastname: 'Torquelquechose',
    role: 'admin',
    section: ''
  }, {
    username: 'mea',
    password: 'mea',
    email: 'ste@umontpellier.fr',
    firstname: 'MEA',
    lastname: 'MEA',
    role: 'student',
    section: 'mea'
  }, {
    username: 'ste',
    password: 'ste',
    email: 'ste@umontpellier.fr',
    firstname: 'STE',
    lastname: 'STE',
    role: 'student',
    section: 'ste'
  }, {
    username: 'gba',
    password: 'gba',
    email: 'gba@umontpellier.fr',
    firstname: 'GBA',
    lastname: 'GBA',
    role: 'student',
    section: 'gba'
  }
]

module.exports = (username, password) => {
  const user = users.filter((user) => {
    return user.username === username &&
      user.password === password
  })

  if (user) return user[0]
  else return false
}
