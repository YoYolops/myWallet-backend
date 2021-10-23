import app from '../src/index';
import supertest from 'supertest';
import connection from '../src/database/database';

describe("POST /auth", () => {
    beforeAll(async () => {
        await connection.query('DELETE FROM users;')
        await connection.query('DELETE FROM sessions;')
        await connection.query('INSERT INTO users (name, email, password) VALUES (yoyo, yoyo@gmail.com, 123);')
    })

    it("auth POST /auth with empty username", async () => {
        const body = {
            email: "",
            password: "123"
        }

        const result = await supertest(app).post("/auth").send(body);
        const status = result.statusCode
        expect(status).toEqual(422)
    })

    it("auth POST /auth with empty password", async () => {
        const body = {
            email: "yoyo@gmail.com",
            password: ""
        }

        const result = await supertest(app).post("/auth").send(body);
        const status = result.statusCode
        expect(status).toEqual(422)
    })

    it("auth POST /auth with non exixsting user", async () => {
        const body = {
            email: "joaozin@gmail.com",
            password: "123"
        }

        const result = await supertest(app).post("/auth").send(body);
        const status = result.statusCode
        expect(status).toEqual(404)
    })

    it("auth POST /auth with proper user credentiaks", async () => {
        const body = {
            email: "yoyo@gmail.com",
            password: "123"
        }

        const result = await supertest(app).post("/auth").send(body);
        const status = result.statusCode
        //verify if the response object is correct
        expect(status).toEqual(200)
    })

    it("auth POST /auth with already logged user", async () => {
        const body = {
            email: "yoyo@gmail.com",
            password: "123"
        }

        let result = await supertest(app).post("/auth").send(body);
        let status = result.statusCode
        expect(status).toEqual(200)

        result = await supertest(app).post("/auth").send(body);
        status = result.statusCode
        expect(status).toEqual(400)        
    })

    it("auth POST /auth with wrong password", async () => {
        const body = {
            email: "yoyo@gmail.com",
            password: "yoyo123lopes"
        }

        const result = await supertest(app).post("/auth").send(body);
        const status = result.statusCode
        expect(status).toEqual(403)     
    })
})