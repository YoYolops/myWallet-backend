import app from '../src/index';
import supertest from 'supertest';
import connection from '../src/database/database';

describe('POST /register', () => {
    beforeAll(async () => {
        await connection.query('DELETE FROM users;')
        await connection.query('DELETE FROM sessions;')
    })

    beforeEach(async () => {
        await connection.query(`INSERT INTO users (name, email, password) VALUES ('yoyo', 'yoyo@gmail.com', 'yoyo');`)
    })

    afterEach(async () => {
        await connection.query('DELETE FROM users;')
        await connection.query('DELETE FROM sessions;')
    })

    afterAll(() => { connection.end() })

    it('register POST /register without username returns 422', async () => {
        const body = {
            name: '',
            email: 'yoyo2@gmail.com',
            password: 'yoyo'
        }

        const result = await supertest(app).post('/register').send(body);
        const status = result.status
        expect(status).toEqual(422)
    })

    it('register POST /register without password returns 422', async () => {
        const body = {
            name: 'yoyo',
            email: 'yoyo2@gmail.com',
            password: ''
        }

        const result = await supertest(app).post('/register').send(body);
        const status = result.status
        expect(status).toEqual(422)
    })

    it('register POST /register without email returns 422', async () => {
        const body = {
            name: 'yoyo',
            email: '',
            password: 'yoyo'
        }

        const result = await supertest(app).post('/register').send(body);
        const status = result.status
        expect(status).toEqual(422)
    })

    it('register POST /register already registered user', async () => {
        const body = {
            name: 'yoyo',
            email: 'yoyo@gmail.com',
            password: 'yoyo'
        }

        const result = await supertest(app).post('/register').send(body);
        const status = result.status
        expect(status).toEqual(409)
    })

    it('register POST /register a proper user', async () => {
        const body = {
            name: 'yoyo',
            email: 'yoyo3@gmail.com',
            password: 'yoyo'
        }

        const result = await supertest(app).post('/register').send(body)
        const status = result.status
        expect(status).toEqual(201)
    })
})