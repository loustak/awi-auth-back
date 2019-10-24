const request = require('supertest')
const app = require('../src/app')

describe('Test the routes', () => {

    test('The homepage should be available', async () => {
        const res = await request(app)
          .get('/')
        expect(res.statusCode)
          .toBe(200)
    })

    test('It should handle 404 errors', async () => {
      const res = await request(app)
        .get('/route/that/doesnt/exists')
      expect(res.statusCode)
        .toBe(404)
    })
})