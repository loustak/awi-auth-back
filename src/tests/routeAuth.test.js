const request = require('supertest')
const app = require('../app')
const actionAuth = require('../actionAuth')

jest.mock('../actionAuth')

describe('Test route auth', () => {
  test('The auth get must be an error since it accepts only POST method', async () => {
    const res = await request(app)
      .get('/auth')
    expect(res.statusCode)
      .toBe(404)
  })

  test('The auth post without data requisition must return an error 400', async () => {
    const res = await request(app)
      .post('/auth')
      .expect('Content-Type', /json/)
      .expect(function (res) {
        if (!('error' in res.body)) throw new Error('Missing error key')
        if (!('message' in res.body)) throw new Error('Missing message key')
      })
    expect(res.statusCode).toBe(400)
  })

  test('The auth post requisition must return an error 401 when clientId/username/password does not exists', async () => {
    const data = {
      client_id: 'dummy',
      username: 'dummy',
      password: 'dummy'
    }
    const res = await request(app)
      .post('/auth')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(401)
  })

  test('The auth post requisition must return error 401 when client_id is unknown', async () => {
    const data = {
      client_id: 'unkown_userId',
      username: 'dummy',
      password: 'dummy'
    }
    actionAuth.auth = jest.fn().mockReturnValue('mockAuth')

    const res = await request(app)
      .post('/auth')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(401)
  })

  test('The auth post requisition must return error 401 when client does not have authCode', async () => {
    const data = {
      client_id: 'unkown_userId',
      username: 'dummy',
      password: 'dummy'
    }
    actionAuth.auth = jest.fn().mockReturnValue(null)
    actionAuth.findClientRow = jest.fn().mockReturnValue('mockClient')

    const res = await request(app)
      .post('/auth')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(401)
  })

  test('The auth post requisition must return statusCode 200 when credentials are valid', async () => {
    const data = {
      client_id: 'unkown_userId',
      username: 'dummy',
      password: 'dummy'
    }
    actionAuth.findClientRow = jest.fn().mockReturnValue('mockClient')
    actionAuth.auth = jest.fn().mockReturnValue('mockAuthCode')

    const res = await request(app)
      .post('/auth')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(200)
  })
})
