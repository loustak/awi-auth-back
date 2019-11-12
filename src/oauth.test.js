const request = require('supertest')
const app = require('../src/app')

describe('Test oauth2 routes', () => {
  describe('GET /oauth2/authorize', () => {

    const route = '/oauth2/authorize'

    describe('Test arguments', () => {
      test('It should return a 400 code if any of the required arguments are missing', async () => {
        const res = await request(app)
          .get(route)

        expect(res.statusCode).toBe(400)
      })

      test('It should redirect the user if no required argument is missing', async () => {
        const res = await request(app)
          .get(route + '?client_id=myid&redirect_uri=myuri&state=1234')

        expect(res.statusCode).toBe(302)
      })
    })
  })


  describe('POST /oauth2/auth', () => {

    const route = '/oauth2/auth'

    const validAuthRequest = () => {
      return request(app)
        .post(route)
        .set('redirect_uri=valid_uri')
        .set('username=valid_username')
        .set('password=valid_password')
    }

    describe('Test arguments', () => {
      test('It should return a 400 code if all the required arguments are missing', async () => {
        const res = await request(app)
          .post(route)

        expect(res.statusCode).toBe(400)
      })

      test('It should redirect to the redirect_uri page and return a 302 code', async () => {
        const res = await validAuthRequest()

        expect(res.statusCode).toBe(302)
      })
    })
  })

})
