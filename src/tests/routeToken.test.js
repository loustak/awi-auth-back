const request = require('supertest')
const app = require('../app')
const actionAuth = require('../actionAuth')

jest.mock('../actionAuth')

const client = {
  client_id: 'o2-g1',
  client_name: 'o2-g1 (recrutement)',
  client_display_name: '02 - G1 Recrutement',
  client_restriction: 2,
  client_secret: 'secret-o2-g1',
  client_hosts:
    '0.0.0.0 127.0.0.1 localhost mydash.igpolytech.fr mydash-dev.igpolytech.fr'
}

describe('Test route token', () => {
  test('The token get must be an error since it accepts only POST method', async () => {
    const res = await request(app)
      .get('/token')
    expect(res.statusCode)
      .toBe(404)
  })

  test('The token post without data requisition must return an error 400', async () => {
    const res = await request(app)
      .post('/token')
      .expect('Content-Type', /json/)
      .expect(function (res) {
        if (!('error' in res.body)) throw new Error('Missing error key')
        if (!('message' in res.body)) throw new Error('Missing message key')
      })
    expect(res.statusCode).toBe(400)
  })

  test('The token post requisition must return an error 401 when clientId or code does not exists', async () => {
    const data = {
      client_id: 'dummy',
      code: 'dummy'
    }
    const res = await request(app)
      .post('/token')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(401)
  })

  test('The token post requisition must return error 401 when client doesnt not exists', async () => {
    const data = {
      client_id: 'dummy',
      code: 'dummy'
    }
    actionAuth.findClientRow = jest.fn().mockReturnValue(null)

    const res = await request(app)
      .post('/token')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(401)
  })

  test('The token post requisition must return error 400 when code is not authorized', async () => {
    const data = {
      client_id: 'dummy',
      code: 'dummy'
    }

    actionAuth.findClientRow = jest.fn().mockReturnValue(client)

    const res = await request(app)
      .post('/token')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(401)
  })

  test('The token post requisition must return status code 200 when parameters are correct', async () => {
    const data = {
      client_id: 'dummy',
      code: 'dummy'
    }

    actionAuth.findClientRow = jest.fn().mockReturnValue(client)
    actionAuth.findAuthorizedRow = jest.fn().mockReturnValue('valueKey')

    actionAuth.deleteAuthorization = jest.fn().mockReturnValue(data.code)

    const res = await request(app)
      .post('/token')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(200)
  })
})
