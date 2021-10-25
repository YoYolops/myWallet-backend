import app from '../src/index';
import supertest from 'supertest';
import connection from '../src/database/database';
import bcrypt from 'bcrypt';

describe("POST /auth", () => {

    beforeAll(async () => {
        await connection.query('DELETE FROM users;')
        await connection.query('DELETE FROM sessions;')
    })

    beforeEach(async () => {
        const hashPass = bcrypt.hashSync('123', 10)
        await connection.query(
            `INSERT INTO users (name, email, password) VALUES ('yoyo', 'yoyo@gmail.com', '${hashPass}');`
        )
        await connection.query(`INSERT INTO users (name, email, password) VALUES ('yoyo', 'yoyo@gmail.com', 'yoyo');`)
    })

    afterEach(async () => {
        await connection.query('DELETE FROM users;')
        await connection.query('DELETE FROM sessions;')
    })

    afterAll(() => { connection.end() })

    it("auth POST /auth with empty username", async () => {
        const body = {
            email: "",
            password: "123"
        }

        const result = await supertest(app).post("/auth").send(body);
        const status = result.status
        expect(status).toEqual(422)
    })

    it("auth POST /auth with empty password", async () => {
        const body = {
            email: "yoyo@gmail.com",
            password: ""
        }

        const result = await supertest(app).post("/auth").send(body);
        const status = result.status
        expect(status).toEqual(422)
    })

    it("auth POST /auth with non exixsting user", async () => {
        const body = {
            email: "joaozin@gmail.com",
            password: "123"
        }

        const result = await supertest(app).post("/auth").send(body);
        const status = result.status
        expect(status).toEqual(404)
    })

    it("auth POST /auth with proper user credentials", async () => {
        const body = {
            email: "yoyo@gmail.com",
            password: "123"
        }

        const result = await supertest(app).post("/auth").send(body);
        const status = result.status
        const responseBody = result.body
        expect(status).toEqual(200)
        expect(responseBody).toEqual({
            token: expect.any(String),
            name: "yoyo"
        })
    })

    it("auth POST /auth with already logged user", async () => {
        const body = {
            email: "yoyo@gmail.com",
            password: "123"
        }

        let result = await supertest(app).post("/auth").send(body);
        let status = result.status
        expect(status).toEqual(200)

        result = await supertest(app).post("/auth").send(body);
        status = result.status
        expect(status).toEqual(200)        
    })

    it("auth POST /auth with wrong password", async () => {
        const body = {
            email: "yoyo@gmail.com",
            password: "yoyo123lopes"
        }

        const result = await supertest(app).post("/auth").send(body);
        const status = result.status
        expect(status).toEqual(403)     
    })
})