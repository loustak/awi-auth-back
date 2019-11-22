const request = require('supertest')
const app = require('../app')
const actionAuth = require('../actionAuth')
const errcode = require('../errcode')

jest.mock('../actionAuth')

const dataField = {
  success: false,
  code: 'code',
  errcode: ''
}

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

  test('The auth post requisition must return statusCode 500 when LDAP ERROR', async () => {
    const data = {
      client_id: 'unkown_userId',
      username: 'dummy',
      password: 'dummy'
    }

    dataField.errcode = errcode.LDAP_ERROR
    actionAuth.findClientRow = jest.fn().mockReturnValue('mockClient')
    actionAuth.auth = jest.fn().mockReturnValue(dataField)

    const res = await request(app)
      .post('/auth')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(500)
  })

  test('The auth post requisition must return statusCode 500 when unknown error', async () => {
    const data = {
      client_id: 'unkown_userId',
      username: 'dummy',
      password: 'dummy'
    }

    dataField.errcode = 'unknown'
    actionAuth.findClientRow = jest.fn().mockReturnValue('mockClient')
    actionAuth.auth = jest.fn().mockReturnValue(dataField)

    const res = await request(app)
      .post('/auth')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(500)
  })

  test('The auth post requisition must return statusCode 500 when LDAP_TIMEOUT', async () => {
    const data = {
      client_id: 'unkown_userId',
      username: 'dummy',
      password: 'dummy'
    }

    dataField.errcode = errcode.LDAP_TIMEOUT

    actionAuth.findClientRow = jest.fn().mockReturnValue('mockClient')
    actionAuth.auth = jest.fn().mockReturnValue(dataField)

    const res = await request(app)
      .post('/auth')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(500)
  })

  test('The auth post requisition must return statusCode 401 when LDAP_USER_NOT_FOUND', async () => {
    const data = {
      client_id: 'unkown_userId',
      username: 'dummy',
      password: 'dummy'
    }

    dataField.errcode = errcode.LDAP_USER_NOT_FOUND

    actionAuth.findClientRow = jest.fn().mockReturnValue('mockClient')
    actionAuth.auth = jest.fn().mockReturnValue(dataField)

    const res = await request(app)
      .post('/auth')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(401)
  })

  test('The auth post requisition must return statusCode 401 when AUTH_RESTRICTION', async () => {
    const data = {
      client_id: 'unkown_userId',
      username: 'dummy',
      password: 'dummy'
    }

    dataField.errcode = errcode.AUTH_RESTRICTION

    actionAuth.findClientRow = jest.fn().mockReturnValue('mockClient')
    actionAuth.auth = jest.fn().mockReturnValue(dataField)

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

    dataField.success = true

    actionAuth.findClientRow = jest.fn().mockReturnValue('mockClient')
    actionAuth.auth = jest.fn().mockReturnValue(dataField)

    const res = await request(app)
      .post('/auth')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(200)
  })
})
