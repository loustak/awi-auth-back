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

describe('Test route authorize', () => {
  test('The auth get must be an error since it accepts only GET method', async () => {
    const res = await request(app)
      .post('/authorize')
    expect(res.statusCode)
      .toBe(404)
  })

  test('The auth get without data requisition must return an error 400', async () => {
    const res = await request(app)
      .get('/authorize')
      .expect('Content-Type', /json/)
      .expect(function (res) {
        if (!('error' in res.body)) throw new Error('Missing error key')
        if (!('message' in res.body)) throw new Error('Missing message key')
      })
    expect(res.statusCode).toBe(400)
  })

  test('The auth get requisition must return an error 401 when clientId/redirectUri/state does not exists', async () => {
    const data = {
      client_id: 'dummy',
      redirect_uri: 'dummy',
      state: 'dummy'
    }
    const res = await request(app)
      .get('/authorize')
      .query(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(401)
  })

  test('The auth get requisition must return error 401 when client_id is unknown', async () => {
    const data = {
      client_id: 'unkown_userId',
      redirect_uri: 'dummy',
      state: 'dummy'
    }
    actionAuth.findClientRow = jest.fn().mockReturnValue(null)

    const res = await request(app)
      .get('/authorize')
      .query(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(401)
  })

  test('The auth get requisition must return error 400 when redirectUri is not an URL', async () => {
    const data = {
      client_id: 'o2-g1',
      redirect_uri: 'dummy',
      state: 'dummy'
    }

    actionAuth.findClientRow = jest.fn().mockReturnValue(client)

    const res = await request(app)
      .get('/authorize')
      .query(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(400)
  })

  test('The auth get requisition must return error 400 when not authorized', async () => {
    const data = {
      client_id: 'o2-g1',
      redirect_uri: 'https://google.com',
      state: 'dummy'
    }

    actionAuth.findClientRow = jest.fn().mockReturnValue(client)

    const res = await request(app)
      .get('/authorize')
      .query(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(400)
  })

  test('The auth get requisition must return status code 302 when parameters are correct', async () => {
    const data = {
      client_id: 'o2-g1',
      redirect_uri: 'https://mydash.igpolytech.fr',
      state: 'dummy'
    }

    actionAuth.findClientRow = jest.fn().mockReturnValue(client)

    const res = await request(app)
      .get('/authorize')
      .query(data)

    expect(res.statusCode).toBe(302)
  })
})
