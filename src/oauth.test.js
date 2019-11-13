const request = require('supertest')
const app = require('../src/app')

describe('Test oauth2 routes', () => {
  describe('GET /oauth2/authorize', () => {

    const route = '/oauth2/authorize'

    describe('Test arguments', () => {
      test('It should return a 400 code if any of the required arguments are missing', async () => {
        const res = await request(app)
          .get(route)
          .expect(400)
      })

      test('It should redirect the user if no required argument is missing', async () => {
        const res = await request(app)
          .get(route)
          .query({
            client_id: 'myid',
            redirect_uri: 'myuri',
            state: '1234'
          })
          .expect(302)
      })
    })
  })


  describe('POST /oauth2/auth', () => {

    const route = '/oauth2/auth'

    const validRedirectUri = 'validUri'
    const validUsername = 'validUsername'
    const validPassword = 'validPassword'

    const validAuthRequest = () => {
      return request(app)
        .post(route)
        .field('redirect_uri', validRedirectUri)
        .field('username', validUsername)
        .field('password', validPassword)
    }

    describe('Test arguments', () => {
      test('It should return a 400 code if all the required arguments are missing', async () => {
        const res = await request(app)
          .post(route)
          .expect(400)
      })

      test('It should redirect to the redirect_uri page and return a 302 code', async () => {
        const res = await validAuthRequest()
          .expect(302)
          .expect('Location', new RegExp(validRedirectUri, 'g'))
      })
    })
  })

})
